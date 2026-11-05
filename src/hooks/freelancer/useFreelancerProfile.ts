"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { freelancerApi } from "../../lib/api/services/freelancer/freelancrerprofile";

import type {
  FreelancerProfile,
  UpdateFreelancerProfile,
} from "../../types/freelamcers/profile";

/* =========================================================
   CACHE CONFIG
========================================================= */

const CACHE_PREFIX = "freelancer_profile";

/*
 * Cache valid for 24 hours.
 */
const CACHE_TIME = 24 * 60 * 60 * 1000;

type CachedProfile = {
  data: FreelancerProfile;
  timestamp: number;
};

/*
 * Global request protection.
 * Shared across all hook instances.
 */
const profileRequests = new Map<
  number,
  Promise<FreelancerProfile | null>
>();

/* =========================================================
   CACHE KEY
========================================================= */

function getCacheKey(userId: number): string {
  return `${CACHE_PREFIX}_${userId}`;
}

/* =========================================================
   TOKEN
========================================================= */

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken")
  );
}

/* =========================================================
   JWT USER ID
========================================================= */

function getUserIdFromToken(
  token: string
): number | null {
  try {
    const parts = token.split(".");

    if (parts.length < 2) {
      return null;
    }

    let base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const payload = JSON.parse(
      atob(base64)
    ) as {
      user_id?: number | string;
      id?: number | string;
      sub?: number | string;
    };

    const rawId =
      payload.user_id ??
      payload.id ??
      payload.sub;

    if (
      rawId === undefined ||
      rawId === null ||
      rawId === ""
    ) {
      return null;
    }

    const id = Number(rawId);

    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }

    return id;
  } catch {
    return null;
  }
}

/* =========================================================
   IMAGE URL
========================================================= */

function normalizeImageUrl(
  value: string | null | undefined
): string {
  if (!value) {
    return "";
  }

  const url = value.trim();

  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://127.0.0.1:8000";

  const cleanBase = apiBase.replace(/\/+$/, "");
  const cleanPath = url.replace(/^\/+/, "");

  return `${cleanBase}/${cleanPath}`;
}

/* =========================================================
   NORMALIZE PROFILE
========================================================= */

function normalizeProfile(
  profile: FreelancerProfile
): FreelancerProfile {
  return {
    ...profile,
    profile_image: normalizeImageUrl(
      profile.profile_image
    ),
  };
}

/* =========================================================
   EXTRACT PROFILE
========================================================= */

function extractProfile(
  response: unknown
): FreelancerProfile {
  if (Array.isArray(response)) {
    if (response.length === 0) {
      throw new Error(
        "Freelancer profile not found."
      );
    }

    return response[0] as FreelancerProfile;
  }

  if (
    response !== null &&
    typeof response === "object"
  ) {
    const value = response as {
      data?: unknown;
      profile?: unknown;
    };

    if (Array.isArray(value.data)) {
      if (value.data.length === 0) {
        throw new Error(
          "Freelancer profile not found."
        );
      }

      return value.data[0] as FreelancerProfile;
    }

    if (
      value.data !== undefined &&
      value.data !== null
    ) {
      return value.data as FreelancerProfile;
    }

    if (
      value.profile !== undefined &&
      value.profile !== null
    ) {
      return value.profile as FreelancerProfile;
    }
  }

  return response as FreelancerProfile;
}

/* =========================================================
   GET CACHE
========================================================= */

function getCachedProfile(
  userId: number
): FreelancerProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(
      getCacheKey(userId)
    );

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(
      raw
    ) as CachedProfile;

    if (
      !cached ||
      !cached.data ||
      typeof cached.timestamp !== "number"
    ) {
      localStorage.removeItem(
        getCacheKey(userId)
      );

      return null;
    }

    const age =
      Date.now() - cached.timestamp;

    if (
      age < 0 ||
      age >= CACHE_TIME
    ) {
      localStorage.removeItem(
        getCacheKey(userId)
      );

      return null;
    }

    return normalizeProfile(
      cached.data
    );
  } catch {
    return null;
  }
}

/* =========================================================
   SET CACHE
========================================================= */

function setCachedProfile(
  profile: FreelancerProfile
): void {
  if (typeof window === "undefined") {
    return;
  }

  const userId = Number(profile.user_id);

  if (
    !Number.isFinite(userId) ||
    userId <= 0
  ) {
    return;
  }

  try {
    const cached: CachedProfile = {
      data: normalizeProfile(profile),
      timestamp: Date.now(),
    };

    localStorage.setItem(
      getCacheKey(userId),
      JSON.stringify(cached)
    );
  } catch {
    // Ignore storage errors.
  }
}

/* =========================================================
   REMOVE CACHE
========================================================= */

function removeCachedProfile(
  userId: number
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(
      getCacheKey(userId)
    );
  } catch {
    // Ignore.
  }
}

/* =========================================================
   HOOK
========================================================= */

export function useFreelancerProfile() {
  const [profile, setProfile] =
    useState<FreelancerProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* =======================================================
     FETCH PROFILE
  ======================================================= */

  const fetchProfile = useCallback(
    async (
      options: {
        force?: boolean;
        background?: boolean;
      } = {}
    ): Promise<FreelancerProfile | null> => {
      const {
        force = false,
        background = false,
      } = options;

      const token = getAccessToken();

      if (!token) {
        setProfile(null);
        setLoading(false);
        setRefreshing(false);

        setError(
          "Authentication required."
        );

        return null;
      }

      const userId =
        getUserIdFromToken(token);

      if (!userId) {
        setProfile(null);
        setLoading(false);
        setRefreshing(false);

        setError(
          "User ID token mein nahi mila."
        );

        return null;
      }

      /*
       * CACHE FIRST
       */

      if (!force) {
        const cached =
          getCachedProfile(userId);

        if (cached) {
          console.log(
            "✅ FREELANCER PROFILE: CACHE HIT"
          );

          setProfile(cached);
          setLoading(false);
          setRefreshing(false);
          setError("");

          return cached;
        }
      }

      /*
       * GLOBAL DUPLICATE REQUEST PROTECTION
       */

      const existingRequest =
        profileRequests.get(userId);

      if (existingRequest) {
        return existingRequest;
      }

      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * API REQUEST
       */

      const request = (async () => {
        try {
          console.log(
            "🌐 FREELANCER PROFILE: API GET"
          );

          const response =
            await freelancerApi.getProfiles();

          const rawProfile =
            extractProfile(response);

          if (
            !rawProfile ||
            !rawProfile.id
          ) {
            throw new Error(
              "Invalid freelancer profile response."
            );
          }

          const freshProfile =
            normalizeProfile(rawProfile);

          /*
           * SAVE CACHE
           */

          setCachedProfile(freshProfile);

          /*
           * UPDATE UI
           */

          setProfile(freshProfile);

          console.log(
            "💾 FREELANCER PROFILE: CACHE SAVED"
          );

          return freshProfile;
        } catch (err) {
          console.error(
            "GET freelancer profile error:",
            err
          );

          const errorMessage =
            err instanceof Error
              ? err.message
              : "Profile load nahi ho saki.";

          setError(errorMessage);

          return null;
        }
      })();

      profileRequests.set(userId, request);

      try {
        return await request;
      } finally {
        if (
          profileRequests.get(userId) === request
        ) {
          profileRequests.delete(userId);
        }

        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =======================================================
     MANUAL REFRESH
  ======================================================= */

  const refreshProfile = useCallback(
    async () => {
      return fetchProfile({
        force: true,
        background: true,
      });
    },
    [fetchProfile]
  );

  /* =======================================================
     UPDATE PROFILE
  ======================================================= */

  const updateProfile = useCallback(
    async (
      payload: UpdateFreelancerProfile
    ): Promise<FreelancerProfile> => {
      if (!profile) {
        throw new Error(
          "Profile available nahi hai."
        );
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const formData = new FormData();

        formData.append(
          "title",
          payload.title ?? ""
        );

        formData.append(
          "bio",
          payload.bio ?? ""
        );

        formData.append(
          "skills",
          payload.skills ?? ""
        );

        formData.append(
          "experience",
          String(payload.experience ?? 0)
        );

        if (
          payload.hourly_rate !== null &&
          payload.hourly_rate !== undefined
        ) {
          formData.append(
            "hourly_rate",
            String(payload.hourly_rate)
          );
        }

        formData.append(
          "location",
          payload.location ?? ""
        );

        if (payload.profile_image) {
          formData.append(
            "profile_image",
            payload.profile_image,
            payload.profile_image.name
          );
        }

        const response =
          await freelancerApi.updateProfile(
            profile.id,
            formData
          );

        const rawProfile =
          extractProfile(response);

        const updatedProfile =
          normalizeProfile(rawProfile);

        setProfile(updatedProfile);

        setCachedProfile(updatedProfile);

        setMessage(
          "Profile updated successfully."
        );

        return updatedProfile;
      } catch (err) {
        console.error(
          "UPDATE freelancer profile error:",
          err
        );

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Profile update nahi ho saki.";

        setError(errorMessage);

        throw err;
      } finally {
        setSaving(false);
      }
    },
    [profile]
  );

  /* =======================================================
     DELETE PROFILE
  ======================================================= */

  const deleteProfile = useCallback(
    async () => {
      if (!profile) {
        throw new Error(
          "Profile available nahi hai."
        );
      }

      try {
        setError("");
        setMessage("");

        await freelancerApi.deleteProfile(
          profile.id
        );

        if (profile.user_id) {
          removeCachedProfile(
            Number(profile.user_id)
          );
        }

        setProfile(null);

        setMessage(
          "Profile deleted successfully."
        );

        return true;
      } catch (err) {
        console.error(
          "DELETE freelancer profile error:",
          err
        );

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Profile delete nahi ho saki.";

        setError(errorMessage);

        throw err;
      }
    },
    [profile]
  );

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback(() => {
    setError("");
  }, []);

  /* =======================================================
     CLEAR MESSAGE
  ======================================================= */

  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  /* =======================================================
     CLEAR CACHE
  ======================================================= */

  const clearCache = useCallback(() => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    const userId =
      getUserIdFromToken(token);

    if (userId) {
      removeCachedProfile(userId);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    profile,
    loading,
    refreshing,
    saving,
    error,
    message,

    fetchProfile,
    refreshProfile,

    updateProfile,
    deleteProfile,

    clearError,
    clearMessage,
    clearCache,
  };
}