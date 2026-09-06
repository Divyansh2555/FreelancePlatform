"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getStorage,
  setStorage,
  removeStorage,
} from "../../../lib/storage";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const PROFILE_CACHE_KEY = "client_profile";

type ClientProfile = {
  id: number;
  user_id: number;
  company_name: string | null;
  bio: string | null;
  location: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  founded_year: number | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  jobs_posted: number;
  hires: number;
  active_jobs: number;
  reviews_count: number;
  rating: number;
  is_verified: boolean;
  created_at: string | null;
  updated_at: string | null;
};

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

function getImageUrl(
  path: string | null | undefined
): string {
  if (!path) return "";

  const trimmedPath = path.trim();

  if (!trimmedPath) return "";

  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://") ||
    trimmedPath.startsWith("blob:")
  ) {
    return trimmedPath;
  }

  return `${API_URL}/${trimmedPath.replace(/^\/+/, "")}`;
}

function getApiErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const errorData = data as ApiErrorResponse;

    if (
      typeof errorData.detail === "string" &&
      errorData.detail.trim()
    ) {
      return errorData.detail;
    }

    if (
      typeof errorData.message === "string" &&
      errorData.message.trim()
    ) {
      return errorData.message;
    }

    if (
      typeof errorData.error === "string" &&
      errorData.error.trim()
    ) {
      return errorData.error;
    }

    const firstError = Object.values(errorData).find(
      (value) =>
        typeof value === "string" &&
        value.trim().length > 0
    );

    if (typeof firstError === "string") {
      return firstError;
    }

    const firstArrayError = Object.values(errorData).find(
      (value) =>
        Array.isArray(value) &&
        value.some((item) => typeof item === "string")
    );

    if (Array.isArray(firstArrayError)) {
      const firstMessage = firstArrayError.find(
        (item) => typeof item === "string"
      );

      if (typeof firstMessage === "string") {
        return firstMessage;
      }
    }
  }

  return fallback;
}

async function parseResponse(
  response: Response
): Promise<unknown> {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

function clearAuthAndRedirect(
  router: ReturnType<typeof useRouter>
) {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  // IMPORTANT:
  // Old client's cached profile remove karo.
  removeStorage(PROFILE_CACHE_KEY);

  router.replace("/auth/login");
}

export default function ClientProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<ClientProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [profileImageFile, setProfileImageFile] =
    useState<File | null>(null);

  const [coverImageFile, setCoverImageFile] =
    useState<File | null>(null);

  const [profileImagePreview, setProfileImagePreview] =
    useState("");

  const [coverImagePreview, setCoverImagePreview] =
    useState("");

  const [profileImageBroken, setProfileImageBroken] =
    useState(false);

  const [coverImageBroken, setCoverImageBroken] =
    useState(false);

  // =========================================================
  // GET PROFILE
  // =========================================================
  const getProfile = useCallback(async () => {
    try {
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      /*
       * IMPORTANT FIX
       *
       * Pehle code localStorage ka old client_profile
       * sabse pehle load kar raha tha.
       *
       * Ab current access_token ke according backend se
       * fresh profile load hogi.
       *
       * Isse new client ko old client ka profile nahi milega.
       */

      removeStorage(PROFILE_CACHE_KEY);

      setLoading(true);

      const response = await fetch(
        `${API_URL}/client/profile/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data =
        await parseResponse(response);

      // =====================================================
      // API ERROR
      // =====================================================

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthAndRedirect(router);
          return;
        }

        if (response.status === 404) {
          setProfile(null);
          setError(
            "Client profile nahi mila. Pehle apna profile create karein."
          );
          return;
        }

        throw new Error(
          getApiErrorMessage(
            data,
            "Profile load nahi ho saki."
          )
        );
      }

      // =====================================================
      // INVALID RESPONSE
      // =====================================================

      if (
        !data ||
        typeof data !== "object"
      ) {
        throw new Error(
          "Backend ne invalid profile response diya."
        );
      }

      const profileData =
        data as ClientProfile;

      // =====================================================
      // STATE UPDATE
      // =====================================================

      setProfile(profileData);

      setProfileImageBroken(false);
      setCoverImageBroken(false);

      setProfileImagePreview(
        getImageUrl(
          profileData.profile_image_url
        )
      );

      setCoverImagePreview(
        getImageUrl(
          profileData.cover_image_url
        )
      );

      /*
       * Cache optional hai.
       *
       * Hum current user's fresh API response save kar rahe hain.
       * Next page render ke beginning mein cache clear karke
       * API se fresh data li jayegi.
       */
      setStorage(
        PROFILE_CACHE_KEY,
        profileData
      );
    } catch (err) {
      console.error(
        "GET profile error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Backend se connect nahi ho pa raha."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    void getProfile();
  }, [getProfile]);

  // =========================================================
  // CLEANUP BLOB URLS
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        profileImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          profileImagePreview
        );
      }
    };
  }, [profileImagePreview]);

  useEffect(() => {
    return () => {
      if (
        coverImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          coverImagePreview
        );
      }
    };
  }, [coverImagePreview]);

  // =========================================================
  // IMAGE VALIDATION
  // =========================================================

  const validateImage = (
    file: File,
    maxSize: number,
    imageName: string
  ): boolean => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        `${imageName} sirf JPG, PNG ya WEBP format mein honi chahiye.`
      );
      return false;
    }

    if (file.size > maxSize) {
      setError(
        `${imageName} ${
          maxSize / (1024 * 1024)
        } MB se chhoti honi chahiye.`
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // PROFILE IMAGE CHANGE
  // =========================================================

  const handleProfileImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      !validateImage(
        file,
        5 * 1024 * 1024,
        "Profile image"
      )
    ) {
      e.target.value = "";
      return;
    }

    setError("");
    setMessage("");

    setProfileImageFile(file);
    setProfileImageBroken(false);

    const previewUrl =
      URL.createObjectURL(file);

    setProfileImagePreview(previewUrl);

    e.target.value = "";
  };

  // =========================================================
  // COVER IMAGE CHANGE
  // =========================================================

  const handleCoverImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      !validateImage(
        file,
        10 * 1024 * 1024,
        "Cover image"
      )
    ) {
      e.target.value = "";
      return;
    }

    setError("");
    setMessage("");

    setCoverImageFile(file);
    setCoverImageBroken(false);

    const previewUrl =
      URL.createObjectURL(file);

    setCoverImagePreview(previewUrl);

    e.target.value = "";
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const updateProfile = async () => {
    if (!profile || saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        clearAuthAndRedirect(router);
        return;
      }

      const formData = new FormData();

      formData.append(
        "company_name",
        profile.company_name?.trim() || ""
      );

      formData.append(
        "bio",
        profile.bio?.trim() || ""
      );

      formData.append(
        "location",
        profile.location?.trim() || ""
      );

      formData.append(
        "website",
        profile.website?.trim() || ""
      );

      formData.append(
        "industry",
        profile.industry?.trim() || ""
      );

      formData.append(
        "company_size",
        profile.company_size?.trim() || ""
      );

      if (
        profile.founded_year !== null &&
        profile.founded_year !== undefined
      ) {
        formData.append(
          "founded_year",
          String(profile.founded_year)
        );
      } else {
        formData.append(
          "founded_year",
          ""
        );
      }

      formData.append(
        "phone",
        profile.phone?.trim() || ""
      );

      formData.append(
        "country",
        profile.country?.trim() || ""
      );

      formData.append(
        "timezone",
        profile.timezone?.trim() || ""
      );

      if (profileImageFile) {
        formData.append(
          "profile_image",
          profileImageFile
        );
      }

      if (coverImageFile) {
        formData.append(
          "cover_image",
          coverImageFile
        );
      }

      const response = await fetch(
        `${API_URL}/client/profile/`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data =
        await parseResponse(response);

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthAndRedirect(router);
          return;
        }

        throw new Error(
          getApiErrorMessage(
            data,
            "Profile update nahi ho saki."
          )
        );
      }

      if (
        !data ||
        typeof data !== "object"
      ) {
        throw new Error(
          "Backend ne invalid update response diya."
        );
      }

      const updatedProfile =
        data as ClientProfile;

      // =====================================================
      // UPDATE STATE
      // =====================================================

      setProfile(updatedProfile);

      /*
       * Current user's updated profile hi cache mein save karo.
       */
      setStorage(
        PROFILE_CACHE_KEY,
        updatedProfile
      );

      setProfileImageFile(null);
      setCoverImageFile(null);

      setProfileImageBroken(false);
      setCoverImageBroken(false);

      setProfileImagePreview(
        getImageUrl(
          updatedProfile.profile_image_url
        )
      );

      setCoverImagePreview(
        getImageUrl(
          updatedProfile.cover_image_url
        )
      );

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );

      window.setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "UPDATE profile error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setProfile((previous) => {
      if (!previous) {
        return previous;
      }

      if (name === "founded_year") {
        return {
          ...previous,
          founded_year: value
            ? Number(value)
            : null,
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEdit = () => {
    if (!profile) return;

    setError("");
    setMessage("");

    setProfileImageFile(null);
    setCoverImageFile(null);

    setProfileImageBroken(false);
    setCoverImageBroken(false);

    setProfileImagePreview(
      getImageUrl(
        profile.profile_image_url
      )
    );

    setCoverImagePreview(
      getImageUrl(
        profile.cover_image_url
      )
    );

    setEditing(true);
  };

  // =========================================================
  // CLOSE EDIT
  // =========================================================

  const closeEdit = () => {
    if (saving) return;

    if (profile) {
      setProfileImageFile(null);
      setCoverImageFile(null);

      setProfileImageBroken(false);
      setCoverImageBroken(false);

      setProfileImagePreview(
        getImageUrl(
          profile.profile_image_url
        )
      );

      setCoverImagePreview(
        getImageUrl(
          profile.cover_image_url
        )
      );
    }

    setError("");
    setEditing(false);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fa]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PROFILE NOT FOUND
  // =========================================================

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl">
            👤
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Profile Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error ||
              "Aapka client profile abhi create nahi hua hai."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/auth/client-profile"
              )
            }
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Create Client Profile
          </button>

          <button
            type="button"
            onClick={() =>
              void getProfile()
            }
            className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // PROFILE DATA
  // =========================================================

  const companyName =
    profile.company_name?.trim() ||
    "Client";

  const avatarLetter =
    companyName.charAt(0).toUpperCase();

  const joinedDate =
    profile.created_at
      ? new Date(
          profile.created_at
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            year: "numeric",
          }
        )
      : "Recently";

  const profileFields = [
    profile.company_name,
    profile.bio,
    profile.location,
    profile.profile_image_url,
    profile.cover_image_url,
    profile.website,
    profile.industry,
    profile.company_size,
    profile.founded_year,
    profile.country,
    profile.timezone,
  ];

  const completedFields =
    profileFields.filter((field) => {
      if (
        field === null ||
        field === undefined
      ) {
        return false;
      }

      return String(field).trim() !== "";
    }).length;

  const profileStrength =
    Math.min(
      100,
      Math.round(
        (completedFields /
          profileFields.length) *
          100
      )
    );

  const profileImageUrl =
    getImageUrl(
      profile.profile_image_url
    );

  const coverImageUrl =
    getImageUrl(
      profile.cover_image_url
    );

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Client Profile
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your public profile and business information.
            </p>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span className="text-base">
              ✎
            </span>

            Edit Profile
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <span className="mt-0.5">
              ⚠️
            </span>

            <p className="text-sm font-medium leading-6 text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="ml-auto text-red-400 hover:text-red-700"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {/* PROFILE CARD */}

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* COVER */}

          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 sm:h-64">
            {coverImageUrl &&
            !coverImageBroken ? (
              <img
                src={coverImageUrl}
                alt={`${companyName} cover`}
                className="absolute inset-0 h-full w-full object-cover"
                onError={() =>
                  setCoverImageBroken(true)
                }
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

                <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

            <button
              type="button"
              onClick={openEdit}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/30 px-3 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-black/50"
            >
              <span>
                📷
              </span>

              Edit cover
            </button>
          </div>

          {/* PROFILE INFO */}

          <div className="px-5 pb-0 sm:px-8">
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end">

                {/* AVATAR */}

                <div className="-mt-16 h-32 w-32 shrink-0 rounded-full border-[5px] border-white bg-white p-0.5 shadow-lg sm:-mt-20 sm:h-36 sm:w-36">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-blue-50 text-4xl font-extrabold text-blue-700">
                    {profileImageUrl &&
                    !profileImageBroken ? (
                      <img
                        src={profileImageUrl}
                        alt={companyName}
                        className="h-full w-full object-cover"
                        onError={() =>
                          setProfileImageBroken(
                            true
                          )
                        }
                      />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                </div>

                {/* NAME */}

                <div className="pb-5 pt-4 sm:ml-5 sm:pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                      {companyName}
                    </h2>

                    {profile.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white">
                          ✓
                        </span>

                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                    {profile.industry && (
                      <span className="font-medium">
                        {profile.industry}
                      </span>
                    )}

                    {profile.location && (
                      <span>
                        📍 {profile.location}
                      </span>
                    )}

                    <span>
                      Joined {joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="grid border-t border-gray-200 sm:grid-cols-5">
              <StatItem
                value={profile.jobs_posted}
                label="Jobs Posted"
              />

              <StatItem
                value={profile.hires}
                label="Total Hires"
              />

              <StatItem
                value={profile.active_jobs}
                label="Active Jobs"
              />

              <StatItem
                value={profile.reviews_count}
                label="Reviews"
              />

              <StatItem
                value={
                  profile.rating > 0
                    ? `${profile.rating} ★`
                    : "—"
                }
                label="Rating"
                last
              />
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* ABOUT */}

            <ProfileCard
              title="About the client"
              subtitle="Company overview"
            >
              {profile.bio ? (
                <p className="whitespace-pre-wrap p-5 text-sm leading-7 text-gray-600 sm:p-6">
                  {profile.bio}
                </p>
              ) : (
                <EmptyState
                  icon="📝"
                  text="No company description added yet."
                  button="Add description"
                  onClick={openEdit}
                />
              )}
            </ProfileCard>

            {/* BUSINESS */}

            <ProfileCard
              title="Business information"
              subtitle="Company details"
            >
              <div className="grid sm:grid-cols-2">
                <InfoItem
                  icon="💼"
                  label="Industry"
                  value={profile.industry}
                />

                <InfoItem
                  icon="👥"
                  label="Company Size"
                  value={profile.company_size}
                />

                <InfoItem
                  icon="📅"
                  label="Founded"
                  value={
                    profile.founded_year
                      ? String(
                          profile.founded_year
                        )
                      : null
                  }
                />

                <InfoItem
                  icon="🌎"
                  label="Country"
                  value={profile.country}
                />
              </div>
            </ProfileCard>

            {/* CONTACT */}

            <ProfileCard
              title="Contact & availability"
              subtitle="How freelancers can reach you"
            >
              <div className="grid sm:grid-cols-2">
                <InfoItem
                  icon="📞"
                  label="Phone"
                  value={profile.phone}
                />

                <InfoItem
                  icon="🌐"
                  label="Website"
                  value={profile.website}
                  isLink
                />

                <InfoItem
                  icon="🕐"
                  label="Timezone"
                  value={profile.timezone}
                />

                <InfoItem
                  icon="📍"
                  label="Location"
                  value={profile.location}
                />
              </div>
            </ProfileCard>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-6">

            {/* PROFILE STRENGTH */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-950">
                    Profile strength
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Make your profile stand out
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">
                  {profileStrength}%
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
                  style={{
                    width: `${profileStrength}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Complete your profile to build more trust with freelancers.
              </p>

              {profileStrength < 100 && (
                <button
                  type="button"
                  onClick={openEdit}
                  className="mt-4 w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Complete Profile
                </button>
              )}
            </section>

            {/* HIRING ACTIVITY */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-950">
                    Hiring activity
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Your marketplace activity
                  </p>
                </div>

                <span className="text-xl">
                  📊
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <ActivityRow
                  label="Jobs posted"
                  value={profile.jobs_posted}
                />

                <ActivityRow
                  label="Total hires"
                  value={profile.hires}
                />

                <ActivityRow
                  label="Active jobs"
                  value={profile.active_jobs}
                />

                <ActivityRow
                  label="Reviews"
                  value={profile.reviews_count}
                />
              </div>
            </section>

            {/* ACCOUNT */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-extrabold text-gray-950">
                Account details
              </h3>

              <div className="mt-5 space-y-4">
                <AccountRow
                  label="Account type"
                  value="Client"
                />

                <AccountRow
                  label="User ID"
                  value={`#${profile.user_id}`}
                  mono
                />

                <AccountRow
                  label="Profile ID"
                  value={`#${profile.id}`}
                  mono
                />

                <AccountRow
                  label="Member since"
                  value={joinedDate}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-sm sm:px-5"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              closeEdit();
            }
          }}
        >
          <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-extrabold text-gray-950">
                  Edit profile
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Update your public client profile.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* BODY */}

            <div className="overflow-y-auto">
              <div className="space-y-7 p-5 sm:p-7">

                {/* IMAGE */}

                <section>
                  <div className="mb-4">
                    <h3 className="font-extrabold text-gray-950">
                      Profile appearance
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Your profile photo appears over the cover image.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200">

                    {/* COVER PREVIEW */}

                    <div className="relative h-36 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700">
                      {coverImagePreview &&
                      !coverImageBroken ? (
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={() =>
                            setCoverImageBroken(
                              true
                            )
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700" />
                      )}

                      <div className="absolute inset-0 bg-black/15" />

                      <label
                        htmlFor="cover_image"
                        className="absolute right-3 top-3 cursor-pointer rounded-lg bg-black/40 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-black/60"
                      >
                        📷 Change cover
                      </label>
                    </div>

                    {/* PROFILE PREVIEW */}

                    <div className="relative bg-white px-5 pb-5">
                      <label
                        htmlFor="profile_image"
                        className="-mt-12 block h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-lg"
                      >
                        {profileImagePreview &&
                        !profileImageBroken ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                            onError={() =>
                              setProfileImageBroken(
                                true
                              )
                            }
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-blue-700">
                            {avatarLetter}
                          </div>
                        )}
                      </label>

                      <p className="mt-3 text-xs font-medium text-gray-500">
                        Click the profile photo to change it.
                      </p>
                    </div>
                  </div>

                  <input
                    id="profile_image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleProfileImageChange
                    }
                    className="hidden"
                  />

                  <input
                    id="cover_image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleCoverImageChange
                    }
                    className="hidden"
                  />

                  <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                    <p>
                      Profile image: JPG, PNG, WEBP • Max 5 MB
                    </p>

                    <p>
                      Cover image: JPG, PNG, WEBP • Max 10 MB
                    </p>
                  </div>
                </section>

                {/* BASIC */}

                <EditSection title="Basic information">
                  <div className="space-y-4">
                    <Field
                      label="Company / Client Name"
                      name="company_name"
                      value={
                        profile.company_name ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Your company name"
                    />

                    <div>
                      <label
                        htmlFor="bio"
                        className="mb-2 block text-sm font-bold text-gray-700"
                      >
                        About your company
                      </label>

                      <textarea
                        id="bio"
                        name="bio"
                        rows={5}
                        maxLength={1000}
                        value={
                          profile.bio ?? ""
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Tell freelancers about your company..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      <p className="mt-1 text-right text-xs text-gray-400">
                        {
                          (
                            profile.bio ??
                            ""
                          ).length
                        }
                        /1000
                      </p>
                    </div>

                    <Field
                      label="Location"
                      name="location"
                      value={
                        profile.location ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Delhi, India"
                    />
                  </div>
                </EditSection>

                {/* BUSINESS */}

                <EditSection title="Business information">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Industry"
                      name="industry"
                      value={
                        profile.industry ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Technology"
                    />

                    <SelectField
                      label="Company Size"
                      name="company_size"
                      value={
                        profile.company_size ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      options={[
                        "",
                        "1-10 employees",
                        "11-50 employees",
                        "51-200 employees",
                        "201-500 employees",
                        "500+ employees",
                      ]}
                    />

                    <Field
                      label="Founded Year"
                      name="founded_year"
                      type="number"
                      min="1800"
                      max={
                        new Date().getFullYear()
                      }
                      value={
                        profile.founded_year ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="2020"
                    />

                    <Field
                      label="Country"
                      name="country"
                      value={
                        profile.country ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="India"
                    />

                    <div className="sm:col-span-2">
                      <Field
                        label="Website"
                        name="website"
                        type="url"
                        value={
                          profile.website ??
                          ""
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </EditSection>

                {/* CONTACT */}

                <EditSection title="Contact & timezone">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={
                        profile.phone ?? ""
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="+91 98765 43210"
                    />

                    <SelectField
                      label="Timezone"
                      name="timezone"
                      value={
                        profile.timezone ??
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                      options={[
                        "",
                        "Asia/Kolkata",
                        "UTC",
                        "Asia/Dubai",
                        "Asia/Singapore",
                        "Europe/London",
                        "Europe/Berlin",
                        "America/New_York",
                        "America/Los_Angeles",
                      ]}
                    />
                  </div>
                </EditSection>

                {/* IDS */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        User ID
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-gray-900">
                        #{profile.user_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Profile ID
                      </p>

                      <p className="mt-1 font-mono text-sm font-bold text-gray-900">
                        #{profile.id}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    These IDs are managed by the system and cannot be changed.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex shrink-0 gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void updateProfile()
                }
                disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}

      {message && (
        <div
          role="status"
          className="fixed bottom-5 right-4 z-[60] flex items-center gap-3 rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl sm:right-6"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
            ✓
          </span>

          {message}
        </div>
      )}
    </main>
  );
}

// =========================================================
// STAT ITEM
// =========================================================

function StatItem({
  value,
  label,
  last = false,
}: {
  value: string | number;
  label: string;
  last?: boolean;
}) {
  return (
    <div
      className={`px-4 py-5 text-center sm:text-left ${
        !last
          ? "border-b border-gray-200 sm:border-b-0 sm:border-r"
          : ""
      }`}
    >
      <p className="text-xl font-extrabold text-gray-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-gray-500">
        {label}
      </p>
    </div>
  );
}

// =========================================================
// PROFILE CARD
// =========================================================

function ProfileCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
        <h2 className="font-extrabold text-gray-950">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-gray-400">
          {subtitle}
        </p>
      </div>

      <div>
        {children}
      </div>
    </section>
  );
}

// =========================================================
// INFO ITEM
// =========================================================

function InfoItem({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: string;
  label: string;
  value: string | null;
  isLink?: boolean;
}) {
  const normalizedWebsite =
    value?.trim() || "";

  const websiteHref =
    normalizedWebsite &&
    (
      normalizedWebsite.startsWith(
        "http://"
      ) ||
      normalizedWebsite.startsWith(
        "https://"
      )
    )
      ? normalizedWebsite
      : normalizedWebsite
        ? `https://${normalizedWebsite}`
        : "";

  return (
    <div className="flex items-start gap-4 border-b border-gray-100 p-5 last:border-b-0 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-base">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        {value ? (
          isLink ? (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all text-sm font-bold text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 break-words text-sm font-semibold text-gray-900">
              {value}
            </p>
          )
        ) : (
          <p className="mt-1 text-sm text-gray-400">
            Not specified
          </p>
        )}
      </div>
    </div>
  );
}

// =========================================================
// ACTIVITY ROW
// =========================================================

function ActivityRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-extrabold text-gray-950">
        {value}
      </span>
    </div>
  );
}

// =========================================================
// ACCOUNT ROW
// =========================================================

function AccountRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold text-gray-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({
  icon,
  text,
  button,
  onClick,
}: {
  icon: string;
  text: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="m-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-7 text-center">
      <div className="text-2xl">
        {icon}
      </div>

      <p className="mt-2 text-sm font-medium text-gray-600">
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700"
      >
        {button}
      </button>
    </div>
  );
}

// =========================================================
// EDIT SECTION
// =========================================================

function EditSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-sm font-extrabold text-gray-950">
        {title}
      </h3>

      {children}
    </section>
  );
}

// =========================================================
// FIELD
// =========================================================

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
  min?: string | number;
  max?: string | number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

// =========================================================
// SELECT FIELD
// =========================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLSelectElement>
  ) => void;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      >
        {options.map((option) => (
          <option
            key={`${name}-${option || "empty"}`}
            value={option}
          >
            {option ||
              `Select ${label.toLowerCase()}`}
          </option>
        ))}
      </select>
    </div>
  );
}
