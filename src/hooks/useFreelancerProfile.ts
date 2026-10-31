"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { freelancerApi } from "../lib/api/services/freelancrerprofile";

import type {
  FreelancerProfile,
  UpdateFreelancerProfile,
} from "../types/freelancerprofile";

/* =========================================================
   CACHE CONFIG
========================================================= */

const CACHE_PREFIX = "freelancer_profile";
const CACHE_TIME = 5 * 60 * 1000;

type CachedProfile = {
  data: FreelancerProfile;
  timestamp: number;
};

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

   IMPORTANT:
   This function NEVER calls API.
========================================================= */

function getCachedProfile(
  userId: number
): FreelancerProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const key = getCacheKey(userId);
    const raw = localStorage.getItem(key);

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
      localStorage.removeItem(key);
      return null;
    }

    const age =
      Date.now() - cached.timestamp;

    if (age >= CACHE_TIME) {
      localStorage.removeItem(key);
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

  const userId = Number(
    profile.user_id
  );

  if (!Number.isFinite(userId) || userId <= 0) {
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
    // Ignore localStorage errors.
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

  /*
   * One API request at a time.
   */
  const requestRef =
    useRef<Promise<FreelancerProfile | null> | null>(
      null
    );

  /*
   * Initial load only once.
   */
  const initializedRef =
    useRef(false);

  /* =======================================================
     FETCH PROFILE

     NORMAL:
       cache -> UI
       NO API

     FORCE:
       API -> UI -> cache
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
        setError(
          "User ID token mein nahi mila."
        );
        return null;
      }

      /*
       * ====================================================
       * CACHE FIRST
       *
       * IMPORTANT:
       * force=false hone par yahin return ho jayega.
       *
       * Iske baad API code execute HI nahi hoga.
       * ====================================================
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

        console.log(
          "❌ FREELANCER PROFILE: CACHE MISS"
        );
      }

      /*
       * ====================================================
       * DUPLICATE API REQUEST PROTECTION
       * ====================================================
       */

      if (requestRef.current) {
        return requestRef.current;
      }

      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * ====================================================
       * API REQUEST
       *
       * ONLY REACHED WHEN:
       *
       * 1. cache missing
       * OR
       * 2. force=true
       * ====================================================
       */

      const request =
        (async (): Promise<FreelancerProfile | null> => {
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
              normalizeProfile(
                rawProfile
              );

            /*
             * UI
             */
            setProfile(
              freshProfile
            );

            /*
             * CACHE
             */
            setCachedProfile(
              freshProfile
            );

            console.log(
              "💾 FREELANCER PROFILE: SAVED TO CACHE"
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

            setError(
              errorMessage
            );

            return null;
          }
        })();

      requestRef.current = request;

      try {
        return await request;
      } finally {
        requestRef.current = null;
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =======================================================
     REFRESH

     ONLY THIS FUNCTION BYPASSES CACHE.
  ======================================================= */

  const refreshProfile =
    useCallback(async () => {
      return fetchProfile({
        force: true,
        background: true,
      });
    }, [fetchProfile]);

  /* =======================================================
     UPDATE PROFILE
  ======================================================= */

  const updateProfile =
    useCallback(
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

          const formData =
            new FormData();

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
            String(
              payload.experience ?? 0
            )
          );

          if (
            payload.hourly_rate !== null &&
            payload.hourly_rate !== undefined
          ) {
            formData.append(
              "hourly_rate",
              String(
                payload.hourly_rate
              )
            );
          }

          formData.append(
            "location",
            payload.location ?? ""
          );

          if (
            payload.profile_image
          ) {
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
            normalizeProfile(
              rawProfile
            );

          /*
           * UI immediately update.
           */
          setProfile(
            updatedProfile
          );

          /*
           * CACHE immediately update.
           */
          setCachedProfile(
            updatedProfile
          );

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

          setError(
            errorMessage
          );

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

  const deleteProfile =
    useCallback(async () => {
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

        setError(
          errorMessage
        );

        throw err;
      }
    }, [profile]);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError =
    useCallback(() => {
      setError("");
    }, []);

  /* =======================================================
     CLEAR MESSAGE
  ======================================================= */

  const clearMessage =
    useCallback(() => {
      setMessage("");
    }, []);

  /* =======================================================
     CLEAR CACHE
  ======================================================= */

  const clearCache =
    useCallback(() => {
      if (!profile?.user_id) {
        return;
      }

      removeCachedProfile(
        Number(profile.user_id)
      );
    }, [profile]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

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
