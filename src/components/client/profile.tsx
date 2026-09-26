"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useClientProfile } from "../../hooks/useClientProfile";

export default function ClientProfilePage() {
  const {
    profile,
    loading,
    refreshing,
    saving,
    error,
    message,
    updateProfile,
    refreshProfile,
  } = useClientProfile();

  const [editing, setEditing] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");

  const [profileImage, setProfileImage] =
    useState<File | null>(null);

  const [coverImage, setCoverImage] =
    useState<File | null>(null);

  const [profilePreview, setProfilePreview] =
    useState("");

  const [coverPreview, setCoverPreview] =
    useState("");

  /*
   * =========================================================
   * PROFILE -> FORM
   * =========================================================
   */

  useEffect(() => {
    if (!profile) {
      return;
    }

    setCompanyName(profile.company_name ?? "");
    setBio(profile.bio ?? "");
    setLocation(profile.location ?? "");
    setWebsite(profile.website ?? "");
    setIndustry(profile.industry ?? "");
    setCompanySize(profile.company_size ?? "");
    setFoundedYear(
      profile.founded_year
        ? String(profile.founded_year)
        : ""
    );
    setPhone(profile.phone ?? "");
    setCountry(profile.country ?? "");
    setTimezone(profile.timezone ?? "");

    setProfilePreview(
      profile.profile_image_url ?? ""
    );

    setCoverPreview(
      profile.cover_image_url ?? ""
    );

    setProfileImage(null);
    setCoverImage(null);
  }, [profile]);

  /*
   * =========================================================
   * CLEANUP BLOB URLS
   * =========================================================
   */

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

  /*
   * =========================================================
   * PROFILE IMAGE
   * =========================================================
   */

  const handleProfileImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (profilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profilePreview);
    }

    const preview = URL.createObjectURL(file);

    setProfileImage(file);
    setProfilePreview(preview);
  };

  /*
   * =========================================================
   * COVER IMAGE
   * =========================================================
   */

  const handleCoverImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    const preview = URL.createObjectURL(file);

    setCoverImage(file);
    setCoverPreview(preview);
  };

  /*
   * =========================================================
   * UPDATE PROFILE
   * =========================================================
   */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await updateProfile({
        company_name: companyName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        industry: industry.trim(),
        company_size: companySize,
        founded_year: foundedYear
          ? Number(foundedYear)
          : null,
        phone: phone.trim(),
        country: country.trim(),
        timezone,
        profile_image: profileImage,
        cover_image: coverImage,
      });

      setEditing(false);
      setProfileImage(null);
      setCoverImage(null);
    } catch {
      // Hook already handles error state.
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * PROFILE NOT FOUND
   * =========================================================
   */

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Profile Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "Client profile nahi mila."}
          </p>

          <button
            type="button"
            onClick={() =>
              void refreshProfile()
            }
            disabled={refreshing}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {refreshing
              ? "Loading..."
              : "Try Again"}
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * VIEW
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.company_name ||
                "Client"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your client profile.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                void refreshProfile()
              }
              disabled={refreshing}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            {!editing && (
              <button
                type="button"
                onClick={() =>
                  setEditing(true)
                }
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* =====================================================
            COVER
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="relative h-48 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">

            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Company cover"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : null}

            <div className="absolute inset-0 bg-black/10" />

            {editing && (
              <label
                htmlFor="cover-image"
                className="absolute bottom-4 right-4 cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow"
              >
                Change Cover
              </label>
            )}

            {editing && (
              <input
                id="cover-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={
                  handleCoverImageChange
                }
              />
            )}
          </div>

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="border-b border-gray-200 px-5 pb-6 sm:px-8">

            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">

              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-md">

                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Company profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-blue-700">
                    {(
                      profile.company_name ||
                      "C"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {editing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-xs font-semibold text-white"
                  >
                    Change
                  </label>
                )}

                {editing && (
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={
                      handleProfileImageChange
                    }
                  />
                )}
              </div>

              <div className="pb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.company_name ||
                    "Company"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.location ||
                    "Location not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          {!editing ? (
            <div className="p-6 sm:p-8">

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  About the company
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {profile.bio ||
                    "No description available."}
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <Info
                  label="Industry"
                  value={
                    profile.industry ||
                    "Not specified"
                  }
                />

                <Info
                  label="Company Size"
                  value={
                    profile.company_size ||
                    "Not specified"
                  }
                />

                <Info
                  label="Founded"
                  value={
                    profile.founded_year
                      ? String(
                          profile.founded_year
                        )
                      : "Not specified"
                  }
                />

                <Info
                  label="Location"
                  value={
                    profile.location ||
                    "Not specified"
                  }
                />

                <Info
                  label="Country"
                  value={
                    profile.country ||
                    "Not specified"
                  }
                />

                <Info
                  label="Timezone"
                  value={
                    profile.timezone ||
                    "Not specified"
                  }
                />

                <Info
                  label="Phone"
                  value={
                    profile.phone ||
                    "Not specified"
                  }
                />

                <Info
                  label="Website"
                  value={
                    profile.website ||
                    "Not specified"
                  }
                />

                <Info
                  label="Verification"
                  value={
                    profile.is_verified
                      ? "Verified"
                      : "Not verified"
                  }
                />
              </div>

              {/* Stats */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <Stat
                  label="Jobs Posted"
                  value={profile.jobs_posted}
                />

                <Stat
                  label="Total Hires"
                  value={profile.hires}
                />

                <Stat
                  label="Active Jobs"
                  value={profile.active_jobs}
                />

                <Stat
                  label="Reviews"
                  value={profile.reviews_count}
                />
              </div>
            </div>
          ) : (
            /*
             * =================================================
             * EDIT FORM
             * =================================================
             */

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Company Name"
                  value={companyName}
                  onChange={setCompanyName}
                  required
                />

                <Field
                  label="Location"
                  value={location}
                  onChange={setLocation}
                />

                <Field
                  label="Country"
                  value={country}
                  onChange={setCountry}
                />

                <Field
                  label="Industry"
                  value={industry}
                  onChange={setIndustry}
                />

                <Field
                  label="Company Size"
                  value={companySize}
                  onChange={setCompanySize}
                />

                <Field
                  label="Founded Year"
                  value={foundedYear}
                  onChange={setFoundedYear}
                  type="number"
                />

                <Field
                  label="Website"
                  value={website}
                  onChange={setWebsite}
                  type="url"
                />

                <Field
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                />

                <Field
                  label="Timezone"
                  value={timezone}
                  onChange={setTimezone}
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    About Company
                  </label>

                  <textarea
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    rows={6}
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {bio.length}/500
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setEditing(false)
                  }
                  disabled={saving}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

/*
 * =========================================================
 * INFO COMPONENT
 * =========================================================
 */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/*
 * =========================================================
 * STAT COMPONENT
 * =========================================================
 */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/*
 * =========================================================
 * FIELD COMPONENT
 * =========================================================
 */

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}
