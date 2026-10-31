"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { freelancerApi } from "../../../lib/api/services/freelancrerprofile";
import type { FreelancerProfile } from "../../../types/freelancerprofile";

type ProfileForm = {
  title: string;
  bio: string;
  skills: string;
  experience: number;
  hourly_rate: number;
  location: string;
};

type ApiResponse<T> = {
  data?: T;
  results?: T;
  detail?: string;
  message?: string;
};

const initialForm: ProfileForm = {
  title: "",
  bio: "",
  skills: "",
  experience: 0,
  hourly_rate: 0,
  location: "",
};

export default function FreelancerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<FreelancerProfile | null>(null);

  const [form, setForm] =
    useState<ProfileForm>(initialForm);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * React StrictMode development mein useEffect
   * ko dobara run kar sakta hai.
   *
   * Is ref se duplicate initial GET prevent hoga.
   */
  const profileFetchedRef = useRef(false);

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
      return err.message;
    }

    if (typeof err === "string") {
      return err;
    }

    if (
      typeof err === "object" &&
      err !== null
    ) {
      const value = err as {
        message?: unknown;
        response?: {
          data?: {
            detail?: unknown;
            message?: unknown;
          };
        };
      };

      const apiMessage =
        value.response?.data?.detail ??
        value.response?.data?.message ??
        value.message;

      if (typeof apiMessage === "string") {
        return apiMessage;
      }
    }

    return "Something went wrong.";
  }

  // =========================================================
  // IMAGE URL
  // =========================================================

  function getImageUrl(
    imagePath: string | null | undefined
  ): string | null {
    if (!imagePath) {
      return null;
    }

    const image = imagePath.trim();

    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:8000";

    const cleanBase = baseUrl.replace(/\/+$/, "");
    const cleanPath = image.replace(/^\/+/, "");

    return `${cleanBase}/${cleanPath}`;
  }

  // =========================================================
  // SET FORM FROM PROFILE
  // =========================================================

  function setProfileForm(
    data: FreelancerProfile
  ) {
    setForm({
      title: data.title ?? "",
      bio: data.bio ?? "",
      skills: data.skills ?? "",
      experience: Number(data.experience ?? 0),
      hourly_rate: Number(data.hourly_rate ?? 0),
      location: data.location ?? "",
    });
  }

  // =========================================================
  // EXTRACT PROFILES
  // =========================================================

  function extractProfiles(
    raw: unknown
  ): FreelancerProfile[] {
    let value: unknown = raw;

    /*
     * Axios-style response:
     *
     * {
     *   data: [...]
     * }
     */
    if (
      value &&
      typeof value === "object" &&
      "data" in value
    ) {
      value = (
        value as { data?: unknown }
      ).data;
    }

    // Direct array
    if (Array.isArray(value)) {
      return value as FreelancerProfile[];
    }

    if (
      value &&
      typeof value === "object"
    ) {
      const response =
        value as ApiResponse<
          FreelancerProfile |
          FreelancerProfile[]
        >;

      // { data: [...] }
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // { data: {...} }
      if (
        response.data &&
        typeof response.data === "object"
      ) {
        return [
          response.data as FreelancerProfile,
        ];
      }

      // { results: [...] }
      if (Array.isArray(response.results)) {
        return response.results;
      }

      // { results: {...} }
      if (
        response.results &&
        typeof response.results === "object"
      ) {
        return [
          response.results as FreelancerProfile,
        ];
      }

      // Direct single object
      if ("id" in value) {
        return [
          value as FreelancerProfile,
        ];
      }
    }

    return [];
  }

  // =========================================================
  // SINGLE PROFILE
  // =========================================================

  function extractSingleProfile(
    raw: unknown
  ): FreelancerProfile | null {
    const profiles =
      extractProfiles(raw);

    return profiles.length > 0
      ? profiles[0]
      : null;
  }

  // =========================================================
  // GET PROFILE
  // =========================================================

  async function fetchProfile() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log(
        "Fetching freelancer profile..."
      );

      const rawResponse =
        await freelancerApi.getProfiles();

      console.log(
        "GET /freelancer/profile/ response:",
        rawResponse
      );

      const profiles =
        extractProfiles(rawResponse);

      if (profiles.length === 0) {
        setProfile(null);
        return;
      }

      const currentProfile =
        profiles[0];

      setProfile(currentProfile);
      setProfileForm(currentProfile);

      setSelectedImage(null);
      setImagePreview(null);
    } catch (err: unknown) {
      console.error(
        "GET freelancer profile error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);

      const lowerMessage =
        message.toLowerCase();

      if (
        lowerMessage.includes("401") ||
        lowerMessage.includes("unauthorized") ||
        lowerMessage.includes("authentication") ||
        lowerMessage.includes("token") ||
        lowerMessage.includes("session")
      ) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // INITIAL GET — ONLY ONCE
  // =========================================================

  useEffect(() => {
    if (profileFetchedRef.current) {
      return;
    }

    profileFetchedRef.current = true;

    void fetchProfile();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        name === "experience" ||
        name === "hourly_rate"
          ? Number(value)
          : value,
    }));
  }

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    setError("");

    setSelectedImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  }

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!profile) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "bio",
        form.bio
      );

      formData.append(
        "skills",
        form.skills
      );

      formData.append(
        "experience",
        String(form.experience)
      );

      formData.append(
        "hourly_rate",
        String(form.hourly_rate)
      );

      formData.append(
        "location",
        form.location
      );

      if (selectedImage) {
        formData.append(
          "profile_image",
          selectedImage,
          selectedImage.name
        );
      }

      const rawResponse =
        await freelancerApi.updateProfile(
          profile.id,
          formData
        );

      console.log(
        "UPDATE freelancer profile response:",
        rawResponse
      );

      const updatedProfile =
        extractSingleProfile(
          rawResponse
        );

      if (!updatedProfile) {
        /*
         * Agar PUT response mein profile nahi aata,
         * tab hi fresh GET karo.
         *
         * Isse normal update ke baad unnecessary GET nahi hoga.
         */
        await fetchProfile();

        setEditMode(false);
        setSuccess(
          "Profile updated successfully."
        );

        return;
      }

      setProfile(
        updatedProfile
      );

      setProfileForm(
        updatedProfile
      );

      setSelectedImage(null);
      setImagePreview(null);

      setEditMode(false);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err: unknown) {
      console.error(
        "UPDATE freelancer profile error:",
        err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  function handleCancel() {
    if (profile) {
      setProfileForm(profile);
    }

    setSelectedImage(null);
    setImagePreview(null);

    setError("");
    setEditMode(false);
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-64 rounded-3xl bg-slate-200" />

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="h-48 rounded-2xl bg-slate-200 md:col-span-2" />

            <div className="h-48 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // NO PROFILE
  // =========================================================

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-bold text-white">
            F
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Freelancer Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Freelancer profile abhi available nahi hai.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/freelancer/profile/create"
              )
            }
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700"
          >
            Create Profile
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // SKILLS
  // =========================================================

  const skills: string[] =
    profile.skills
      ? profile.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean)
      : [];

  const currentImageUrl =
    getImageUrl(
      profile.profile_image
    );

  const displayImageUrl =
    imagePreview ||
    currentImageUrl;

  // =========================================================
  // EDIT UI
  // =========================================================

  if (editMode) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Freelancer Profile
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Edit Profile
              </h1>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleUpdate}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            {/* IMAGE */}

            <div className="mb-8 flex items-center gap-5">

              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 text-4xl font-bold text-white">

                {displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.title
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  "F"
                )}

              </div>

              <div>

                <p className="font-semibold text-slate-900">
                  Profile Picture
                </p>

                <label className="mt-3 inline-flex cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Choose Image

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />
                </label>

                {selectedImage && (
                  <p className="mt-2 text-xs text-green-600">
                    {selectedImage.name}
                  </p>
                )}

              </div>
            </div>

            {/* FORM */}

            <div className="grid gap-6">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Professional Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  About You
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Skills
                </label>

                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Next.js, Python, FastAPI"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate skills using commas.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Experience
                  </label>

                  <input
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Hourly Rate
                  </label>

                  <input
                    name="hourly_rate"
                    type="number"
                    min="0"
                    value={form.hourly_rate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Delhi, India"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6">

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </main>
    );
  }

  // =========================================================
  // PROFILE VIEW
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-slate-500">
              Freelancer
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              My Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setProfileForm(profile);
              setEditMode(true);
            }}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit Profile
          </button>

        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* PROFILE HEADER */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-52" />

          <div className="px-6 pb-7 sm:px-8">

            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-700 text-4xl font-bold text-white shadow-lg">

                  {currentImageUrl ? (
                    <img
                      src={currentImageUrl}
                      alt={`${profile.title} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.title
                      ?.charAt(0)
                      ?.toUpperCase() ||
                    "F"
                  )}

                </div>

                <div className="pb-1">

                  <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {profile.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Freelancer
                  </p>

                  {profile.location && (
                    <p className="mt-2 text-sm text-slate-500">
                      📍 {profile.location}
                    </p>
                  )}

                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">

                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                Available for work

              </div>

            </div>

            {/* STATS */}

            <div className="mt-8 grid grid-cols-2 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 sm:grid-cols-4">

              <div className="p-5 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {profile.experience}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Years Experience
                </p>
              </div>

              <div className="p-5 text-center">

                <p className="text-2xl font-bold text-slate-900">

                  {profile.hourly_rate !== null &&
                  profile.hourly_rate !== undefined
                    ? `₹${profile.hourly_rate}`
                    : "—"}

                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Hourly Rate
                </p>

              </div>

              <div className="p-5 text-center">

                <p className="text-2xl font-bold text-slate-900">
                  {skills.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Skills
                </p>

              </div>

              <div className="p-5 text-center">

                <p className="text-2xl font-bold text-blue-600">
                  ✓
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Profile
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CONTENT */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          <div className="space-y-6 lg:col-span-2">

            {/* ABOUT */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold text-slate-900">
                  About Me
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setProfileForm(profile);
                    setEditMode(true);
                  }}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>

              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {profile.bio ||
                  "No bio added yet."}
              </p>

            </section>

            {/* SKILLS */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h3 className="text-xl font-bold text-slate-900">
                Skills & Expertise
              </h3>

              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2.5">

                  {skills.map(
                    (skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  No skills added yet.
                </p>
              )}

            </section>

            {/* EXPERIENCE */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h3 className="text-xl font-bold text-slate-900">
                Experience
              </h3>

              <div className="mt-5 flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  💼
                </div>

                <div>

                  <h4 className="font-bold text-slate-900">
                    Professional Experience
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.experience}{" "}
                    {profile.experience === 1
                      ? "year"
                      : "years"}{" "}
                    of professional experience
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* SIDEBAR */}

          <aside className="space-y-6">

            {/* RATE */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Hourly Rate
              </p>

              <div className="mt-2 flex items-end gap-2">

                <span className="text-3xl font-extrabold text-slate-900">

                  {profile.hourly_rate !== null &&
                  profile.hourly_rate !== undefined
                    ? `₹${profile.hourly_rate}`
                    : "Not set"}

                </span>

                {profile.hourly_rate !== null &&
                  profile.hourly_rate !== undefined && (
                    <span className="pb-1 text-sm text-slate-500">
                      / hour
                    </span>
                  )}

              </div>

              <div className="mt-5 h-px bg-slate-100" />

              <div className="mt-5 space-y-4">

                <div className="flex justify-between">

                  <span className="text-sm text-slate-500">
                    Experience
                  </span>

                  <span className="text-sm font-semibold">
                    {profile.experience} years
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-slate-500">
                    Location
                  </span>

                  <span className="text-right text-sm font-semibold">
                    {profile.location ||
                      "Not set"}
                  </span>

                </div>

              </div>

            </section>

            {/* PROFILE DETAILS */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="font-bold text-slate-900">
                Profile Details
              </h3>

              <div className="mt-5 space-y-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Profile ID
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    #{profile.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Location
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    {profile.location ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <p className="text-sm font-semibold text-green-600">
                    Available
                  </p>
                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}