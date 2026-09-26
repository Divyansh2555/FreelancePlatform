"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getClientProfile,
  updateClientProfile,
} from "../lib/api/services/clientProfile";

import type {
  ClientProfile,
  UpdateClientProfileData,
} from "../types/clientprofile";

/* =========================================================
   CACHE
========================================================= */

const CACHE_PREFIX = "client_profile";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

type CachedProfile = {
  data: ClientProfile;
  timestamp: number;
};

function getCacheKey(userId: number) {
  return `${CACHE_PREFIX}_${userId}`;
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

  // Already absolute / data URL
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
    "";

  if (!apiBase) {
    console.warn(
      "Relative image URL but API base URL is missing:",
      url
    );

    return url;
  }

  const cleanBase = apiBase.replace(/\/+$/, "");
  const cleanPath = url.replace(/^\/+/, "");

  return `${cleanBase}/${cleanPath}`;
}

/* =========================================================
   NORMALIZE PROFILE
========================================================= */

function normalizeProfile(
  profile: ClientProfile
): ClientProfile {
  return {
    ...profile,

    profile_image_url: normalizeImageUrl(
      profile.profile_image_url
    ),

    cover_image_url: normalizeImageUrl(
      profile.cover_image_url
    ),
  };
}

/* =========================================================
   API RESPONSE NORMALIZER
========================================================= */

function extractProfile(
  response: unknown
): ClientProfile {
  /*
   * Supports both:
   *
   * 1. API returns profile directly
   * 2. API returns { data: profile }
   * 3. API returns { profile: profile }
   */

  const value = response as {
    data?: ClientProfile;
    profile?: ClientProfile;
  };

  if (value?.data) {
    return value.data;
  }

  if (value?.profile) {
    return value.profile;
  }

  return response as ClientProfile;
}

/* =========================================================
   CACHE GET
========================================================= */

function getCachedProfile(
  userId: number
): ClientProfile | null {
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
      !cached.timestamp
    ) {
      localStorage.removeItem(key);
      return null;
    }

    const age =
      Date.now() - cached.timestamp;

    if (age > CACHE_TIME) {
      localStorage.removeItem(key);
      return null;
    }

    return normalizeProfile(
      cached.data
    );
  } catch (error) {
    console.warn(
      "Client profile cache read failed:",
      error
    );

    return null;
  }
}

/* =========================================================
   CACHE SET
========================================================= */

function setCachedProfile(
  profile: ClientProfile
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const normalized =
      normalizeProfile(profile);

    const cached: CachedProfile = {
      data: normalized,
      timestamp: Date.now(),
    };

    localStorage.setItem(
      getCacheKey(normalized.user_id),
      JSON.stringify(cached)
    );
  } catch (error) {
    console.warn(
      "Client profile cache write failed:",
      error
    );
  }
}

/* =========================================================
   CACHE REMOVE
========================================================= */

function removeCachedProfile(
  userId: number
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(
      getCacheKey(userId)
    );
  } catch {
    // Ignore cache errors.
  }
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

    /*
     * JWT uses base64url.
     * atob() needs normal base64.
     */
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
  } catch (error) {
    console.warn(
      "Could not extract user ID from JWT:",
      error
    );

    return null;
  }
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
   HOOK
========================================================= */

export function useClientProfile() {
  const [profile, setProfile] =
    useState<ClientProfile | null>(null);

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
   * Prevent duplicate GET requests.
   */
  const requestRef =
    useRef<Promise<ClientProfile> | null>(
      null
    );

  /*
   * Prevent initial request more than once.
   */
  const initializedRef =
    useRef(false);

  /* =======================================================
     GET PROFILE
  ======================================================= */

  const fetchProfile = useCallback(
    async (
      options: {
        force?: boolean;
        background?: boolean;
      } = {}
    ): Promise<ClientProfile | null> => {
      const {
        force = false,
        background = false,
      } = options;

      try {
        setError("");

        const token =
          getAccessToken();

        if (!token) {
          setProfile(null);
          setLoading(false);
          setError(
            "Authentication required."
          );

          return null;
        }

        /*
         * Get user ID only for cache.
         */
        const userId =
          getUserIdFromToken(token);

        /* =================================================
           CACHE FIRST
        ================================================= */

        if (!force && userId) {
          const cached =
            getCachedProfile(userId);

          if (cached) {
            /*
             * IMPORTANT:
             * Cached profile immediately screen par.
             */
            setProfile(cached);
            setLoading(false);

            return cached;
          }
        }

        /* =================================================
           DUPLICATE REQUEST CHECK
        ================================================= */

        if (requestRef.current) {
          return await requestRef.current;
        }

        /* =================================================
           LOADING STATE
        ================================================= */

        if (background) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        /* =================================================
           API REQUEST
        ================================================= */

        const request = (async () => {
          const response =
            await getClientProfile();

          const rawProfile =
            extractProfile(response);

          const freshProfile =
            normalizeProfile(
              rawProfile
            );

          return freshProfile;
        })();

        requestRef.current = request;

        const freshProfile =
          await request;

        /* =================================================
           UPDATE STATE
        ================================================= */

        setProfile(
          freshProfile
        );

        /* =================================================
           UPDATE CACHE
        ================================================= */

        setCachedProfile(
          freshProfile
        );

        return freshProfile;
      } catch (err) {
        console.error(
          "GET client profile error:",
          err
        );

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Profile load nahi ho saki.";

        /*
         * Existing profile ko destroy nahi karna.
         *
         * Agar cache/profile already screen par hai,
         * API error ke baad bhi profile visible rahegi.
         */
        setError(errorMessage);

        return null;
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
  ======================================================= */

  const refreshProfile =
    useCallback(async () => {
      /*
       * Refresh always API GET karega.
       *
       * Cache ignore hoga.
       */
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
        payload: UpdateClientProfileData
      ) => {
        if (!profile) {
          throw new Error(
            "Profile available nahi hai."
          );
        }

        try {
          setSaving(true);
          setError("");
          setMessage("");

          const response =
            await updateClientProfile(
              payload
            );

          const rawProfile =
            extractProfile(response);

          const updatedProfile =
            normalizeProfile(
              rawProfile
            );

          /*
           * Immediately update UI.
           */
          setProfile(
            updatedProfile
          );

          /*
           * Update cache.
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
            "UPDATE client profile error:",
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
        profile.user_id
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

    clearError,
    clearMessage,
    clearCache,
  };
}
