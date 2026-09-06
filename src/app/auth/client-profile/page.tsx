"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ClientProfileForm = {
  company_name: string;
  bio: string;
  location: string;

  profile_image: File | null;
  cover_image: File | null;

  website: string;
  industry: string;
  company_size: string;
  founded_year: string;

  phone: string;
  country: string;
  timezone: string;
};

function getImageUrl(path: string | null | undefined) {
  if (!path) return "";

  const value = String(path).trim();

  if (!value) return "";

  // Already complete URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  // Backend sometimes returns "uploads/..."
  if (value.startsWith("uploads/")) {
    return `${API_URL}/${value}`;
  }

  // Backend sometimes returns "/uploads/..."
  if (value.startsWith("/uploads/")) {
    return `${API_URL}${value}`;
  }

  // If backend only returns filename
  if (!value.includes("/")) {
    return `${API_URL}/uploads/client/profile/${value}`;
  }

  return `${API_URL}/${value.replace(/^\/+/, "")}`;
}

export default function ClientProfile() {
  const router = useRouter();

  const [form, setForm] = useState<ClientProfileForm>({
    company_name: "",
    bio: "",
    location: "",

    profile_image: null,
    cover_image: null,

    website: "",
    industry: "",
    company_size: "",
    founded_year: "",

    phone: "",
    country: "",
    timezone: "",
  });

  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (profilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreview);
      }

      if (coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [profilePreview, coverPreview]);

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const handleProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid profile image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");

    if (profilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }

    setForm((previous) => ({
      ...previous,
      profile_image: file,
    }));

    setProfilePreview(URL.createObjectURL(file));
  };

  // =========================================================
  // COVER IMAGE
  // =========================================================

  const handleCoverImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid cover image.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Cover image must be smaller than 10 MB.");
      e.target.value = "";
      return;
    }

    setError("");

    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setForm((previous) => ({
      ...previous,
      cover_image: file,
    }));

    setCoverPreview(URL.createObjectURL(file));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const formData = new FormData();

      // -----------------------------------------------------
      // BASIC
      // -----------------------------------------------------

      formData.append(
        "company_name",
        form.company_name.trim()
      );

      formData.append(
        "bio",
        form.bio.trim()
      );

      formData.append(
        "location",
        form.location.trim()
      );

      // -----------------------------------------------------
      // BUSINESS
      // -----------------------------------------------------

      formData.append(
        "website",
        form.website.trim()
      );

      formData.append(
        "industry",
        form.industry.trim()
      );

      formData.append(
        "company_size",
        form.company_size
      );

      if (form.founded_year.trim()) {
        formData.append(
          "founded_year",
          form.founded_year.trim()
        );
      }

      // -----------------------------------------------------
      // CONTACT
      // -----------------------------------------------------

      formData.append(
        "phone",
        form.phone.trim()
      );

      formData.append(
        "country",
        form.country.trim()
      );

      formData.append(
        "timezone",
        form.timezone
      );

      // -----------------------------------------------------
      // IMAGES
      // -----------------------------------------------------

      if (form.profile_image) {
        formData.append(
          "profile_image",
          form.profile_image,
          form.profile_image.name
        );
      }

      if (form.cover_image) {
        formData.append(
          "cover_image",
          form.cover_image,
          form.cover_image.name
        );
      }

      // -----------------------------------------------------
      // REQUEST
      // -----------------------------------------------------

      const response = await fetch(
        `${API_URL}/client/profile/`,
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          // DO NOT SET Content-Type HERE
          body: formData,
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes(
        "application/json"
      )
        ? await response.json()
        : await response.text();

      console.log(
        "CLIENT PROFILE STATUS:",
        response.status
      );

      console.log(
        "CLIENT PROFILE RESPONSE:",
        data
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");

          router.replace("/auth/login");
          return;
        }

        const errorMessage =
          typeof data === "object"
            ? data?.detail ||
              data?.message ||
              "Profile creation failed."
            : data ||
              "Profile creation failed.";

        throw new Error(errorMessage);
      }

      // =====================================================
      // PROFILE CREATED SUCCESSFULLY
      // =====================================================

      console.log(
        "PROFILE IMAGE FROM BACKEND:",
        data?.profile_image
      );

      console.log(
        "COVER IMAGE FROM BACKEND:",
        data?.cover_image
      );

      // -----------------------------------------------------
      // IMPORTANT:
      // ROLE SET KARO
      // -----------------------------------------------------

      localStorage.setItem("role", "client");

      // -----------------------------------------------------
      // USER DATA UPDATE
      // -----------------------------------------------------

      const oldUser =
        localStorage.getItem("user");

      let user: Record<string, unknown> = {};

      try {
        user = oldUser
          ? JSON.parse(oldUser)
          : {};
      } catch {
        user = {};
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role: "client",
          client_profile_id: data?.id ?? null,
          profile_completed: true,
        })
      );

      // -----------------------------------------------------
      // REDIRECT
      // -----------------------------------------------------

      router.replace("/client/client-profile");

    } catch (err) {
      console.error(
        "CLIENT PROFILE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI DATA
  // =========================================================

  const companyInitial =
    form.company_name
      .trim()
      .charAt(0)
      .toUpperCase() || "C";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mb-7">

          <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Client Account
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create your client profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Add your company information and images so freelancers
            can understand your business and work with you confidently.
          </p>

        </div>

        {/* ===================================================
            CARD
        =================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* =================================================
              COVER
          ================================================= */}

          <div className="relative h-40 overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 sm:h-48">

            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-600" />
            )}

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-4 right-4">

              <label
                htmlFor="cover_image"
                className="cursor-pointer rounded-lg bg-white/95 px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:bg-white"
              >
                {coverPreview
                  ? "Change cover"
                  : "Add cover"}
              </label>

            </div>

          </div>

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="border-b border-gray-200 px-5 pb-6 sm:px-8">

            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">

              <label
                htmlFor="profile_image"
                className="group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-3xl font-bold text-blue-700 shadow-md sm:h-28 sm:w-28"
              >

                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{companyInitial}</span>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  Change
                </div>

              </label>

              <div className="min-w-0 pb-1">

                <h2 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                  {form.company_name ||
                    "Your Company Name"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {form.location ||
                    "Your location"}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-8"
          >

            {/* =================================================
                BASIC
            ================================================= */}

            <section>

              <div className="mb-5">

                <h2 className="text-lg font-bold text-gray-900">
                  Basic information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell freelancers about yourself and your company.
                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <label
                    htmlFor="company_name"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Company / Client Name
                  </label>

                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={form.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Acme Technologies"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Delhi, India"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div className="sm:col-span-2">

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="bio"
                      className="text-sm font-semibold text-gray-800"
                    >
                      About your company
                    </label>

                    <span className="text-xs text-gray-400">
                      {form.bio.length}/500
                    </span>

                  </div>

                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell freelancers about your company..."
                    rows={6}
                    maxLength={500}
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                BUSINESS
            ================================================= */}

            <section className="mt-9 border-t border-gray-200 pt-8">

              <div className="mb-5">

                <h2 className="text-lg font-bold text-gray-900">
                  Business information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add information about your business.
                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="industry"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Industry
                  </label>

                  <input
                    id="industry"
                    name="industry"
                    type="text"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="Technology"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label
                    htmlFor="company_size"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Company Size
                  </label>

                  <select
                    id="company_size"
                    name="company_size"
                    value={form.company_size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >

                    <option value="">
                      Select company size
                    </option>

                    <option value="1-10 employees">
                      1-10 employees
                    </option>

                    <option value="11-50 employees">
                      11-50 employees
                    </option>

                    <option value="51-200 employees">
                      51-200 employees
                    </option>

                    <option value="201-500 employees">
                      201-500 employees
                    </option>

                    <option value="500+ employees">
                      500+ employees
                    </option>

                  </select>

                </div>

                <div>

                  <label
                    htmlFor="founded_year"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Founded Year
                  </label>

                  <input
                    id="founded_year"
                    name="founded_year"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={form.founded_year}
                    onChange={handleChange}
                    placeholder="2020"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label
                    htmlFor="website"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Website
                  </label>

                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                CONTACT
            ================================================= */}

            <section className="mt-9 border-t border-gray-200 pt-8">

              <div className="mb-5">

                <h2 className="text-lg font-bold text-gray-900">
                  Contact & timezone
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                <div>

                  <label
                    htmlFor="timezone"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Timezone
                  </label>

                  <select
                    id="timezone"
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >

                    <option value="">
                      Select timezone
                    </option>

                    <option value="Asia/Kolkata">
                      Asia/Kolkata (IST)
                    </option>

                    <option value="UTC">
                      UTC
                    </option>

                    <option value="America/New_York">
                      America/New_York
                    </option>

                    <option value="America/Los_Angeles">
                      America/Los_Angeles
                    </option>

                    <option value="Europe/London">
                      Europe/London
                    </option>

                    <option value="Europe/Berlin">
                      Europe/Berlin
                    </option>

                    <option value="Asia/Dubai">
                      Asia/Dubai
                    </option>

                    <option value="Asia/Singapore">
                      Asia/Singapore
                    </option>

                  </select>

                </div>

              </div>

            </section>

            {/* =================================================
                IMAGES
            ================================================= */}

            <section className="mt-9 border-t border-gray-200 pt-8">

              <div className="mb-5">

                <h2 className="text-lg font-bold text-gray-900">
                  Profile images
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Use a professional profile picture and cover image.
                </p>

              </div>

              <div className="grid gap-6 sm:grid-cols-2">

                {/* PROFILE */}

                <div>

                  <label
                    htmlFor="profile_image"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Profile Image
                  </label>

                  <label
                    htmlFor="profile_image"
                    className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50"
                  >

                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Selected profile"
                        className="h-28 w-28 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                          📷
                        </div>

                        <p className="mt-4 text-sm font-semibold text-gray-800">
                          Select profile image
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          JPG, PNG or WEBP · Max 5 MB
                        </p>
                      </>
                    )}

                    <span className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm">
                      {profilePreview
                        ? "Change image"
                        : "Choose image"}
                    </span>

                  </label>

                  <input
                    id="profile_image"
                    name="profile_image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />

                  {form.profile_image && (
                    <p className="mt-2 truncate text-xs text-green-600">
                      ✓ {form.profile_image.name}
                    </p>
                  )}

                </div>

                {/* COVER */}

                <div>

                  <label
                    htmlFor="cover_image"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Cover Image
                  </label>

                  <label
                    htmlFor="cover_image"
                    className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50"
                  >

                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Selected cover"
                        className="h-28 w-full rounded-xl object-cover shadow-md"
                      />
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                          🖼️
                        </div>

                        <p className="mt-4 text-sm font-semibold text-gray-800">
                          Select cover image
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          JPG, PNG or WEBP · Max 10 MB
                        </p>
                      </>
                    )}

                    <span className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm">
                      {coverPreview
                        ? "Change image"
                        : "Choose image"}
                    </span>

                  </label>

                  <input
                    id="cover_image"
                    name="cover_image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />

                  {form.cover_image && (
                    <p className="mt-2 truncate text-xs text-green-600">
                      ✓ {form.cover_image.name}
                    </p>
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                    ⚠️
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-red-800">
                      Profile creation failed
                    </p>

                    <p className="mt-1 break-words text-sm leading-5 text-red-600">
                      {error}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Creating profile...

                  </span>
                ) : (
                  "Create Client Profile"
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}
