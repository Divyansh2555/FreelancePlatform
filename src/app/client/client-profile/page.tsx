"use client";

import {
  ChangeEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useClientProfile } from "../../../hooks/useClientProfile";
import type { UpdateClientProfileData } from "../../../types/clientprofile";

export default function ClientProfilePage() {
  const router = useRouter();

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
  const [form, setForm] = useState<UpdateClientProfileData>({});
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");

  useEffect(() => {
    if (!loading && !profile) {
      router.replace("/client/client-profile/create-profile");
    }
  }, [loading, profile, router]);

  const openEdit = () => {
    if (!profile) return;

    setForm({
      company_name: profile.company_name || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      industry: profile.industry || "",
      company_size: profile.company_size || "",
      founded_year: profile.founded_year,
      phone: profile.phone || "",
      country: profile.country || "",
      timezone: profile.timezone || "",
    });

    setProfileImagePreview(profile.profile_image_url || "");
    setCoverImagePreview(profile.cover_image_url || "");
    setEditing(true);
  };

  const closeEdit = () => {
    if (saving) return;

    setEditing(false);
    setProfileImagePreview("");
    setCoverImagePreview("");
  };

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "founded_year"
          ? value
            ? Number(value)
            : null
          : value,
    }));
  };

  const handleProfileImage = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) return;

    if (profileImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setForm((previous) => ({
      ...previous,
      profile_image: file,
    }));

    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleCoverImage = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 10 * 1024 * 1024) return;

    if (coverImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverImagePreview);
    }

    setForm((previous) => ({
      ...previous,
      cover_image: file,
    }));

    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      setEditing(false);
    } catch {
      // Hook handles error state.
    }
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Opening your profile...
          </p>
        </div>
      </main>
    );
  }

  const companyName =
    profile.company_name?.trim() || "Client";

  const avatarLetter =
    companyName.charAt(0).toUpperCase();

  const joinedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      )
    : "Recently";

  const fields = [
    profile.company_name,
    profile.bio,
    profile.location,
    profile.website,
    profile.industry,
    profile.company_size,
    profile.founded_year,
    profile.phone,
    profile.country,
    profile.timezone,
    profile.profile_image_url,
    profile.cover_image_url,
  ];

  const completedFields = fields.filter(
    (field) =>
      field !== null &&
      field !== undefined &&
      String(field).trim() !== ""
  ).length;

  const profileStrength = Math.round(
    (completedFields / fields.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">

        {/* TOP BAR */}

        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              CLIENT ACCOUNT
            </div>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Company Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your public business profile seen by freelancers.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void refreshProfile()}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshIcon />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>

            <button
              type="button"
              onClick={openEdit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <EditIcon />
              Edit profile
            </button>
          </div>
        </header>

        {/* ALERTS */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="mt-0.5 font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span className="font-bold">✓</span>
            <span>{message}</span>
          </div>
        )}

        {/* PROFILE HEADER */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">

          {/* COVER */}

          <div className="relative h-[190px] overflow-hidden sm:h-[235px]">
            {profile.cover_image_url ? (
              <img
                src={profile.cover_image_url}
                alt={`${companyName} cover`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="relative h-full overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-700">
                <div className="absolute -right-20 -top-40 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute -bottom-48 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="absolute inset-0 opacity-20">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

            <button
              type="button"
              onClick={openEdit}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/40"
            >
              <CameraIcon />
              Edit cover
            </button>
          </div>

          {/* COMPANY */}

          <div className="relative px-5 pb-0 sm:px-8">

            <div className="flex flex-col sm:flex-row sm:items-end">

              {/* AVATAR */}

              <div className="-mt-14 shrink-0 sm:-mt-16">
                <div className="h-28 w-28 rounded-full border-[5px] border-white bg-white shadow-lg sm:h-32 sm:w-32">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    {profile.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-slate-500">
                        {avatarLetter}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* NAME */}

              <div className="flex-1 py-5 sm:ml-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]">
                    {companyName}
                  </h2>

                  {profile.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white">
                        ✓
                      </span>
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  {profile.industry && (
                    <span>{profile.industry}</span>
                  )}

                  {profile.location && (
                    <>
                      <span className="hidden text-slate-300 sm:block">
                        •
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <PinIcon />
                        {profile.location}
                      </span>
                    </>
                  )}

                  <span className="hidden text-slate-300 sm:block">
                    •
                  </span>

                  <span>Member since {joinedDate}</span>
                </div>
              </div>

              <div className="pb-5 sm:pb-6">
                <button
                  type="button"
                  onClick={openEdit}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
                >
                  Edit profile
                </button>
              </div>
            </div>

            {/* STATS */}

            <div className="grid border-t border-slate-100 sm:grid-cols-5">
              <Stat
                value={profile.jobs_posted}
                label="Jobs posted"
              />

              <Stat
                value={profile.hires}
                label="Total hires"
              />

              <Stat
                value={profile.active_jobs}
                label="Active jobs"
              />

              <Stat
                value={profile.reviews_count}
                label="Reviews"
              />

              <Stat
                value={
                  profile.rating > 0
                    ? `${profile.rating.toFixed(1)}`
                    : "—"
                }
                label="Rating"
                rating
                last
              />
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* LEFT */}

          <div className="min-w-0 space-y-6">

            {/* ABOUT */}

            <Card
              title="About"
              subtitle="Company overview"
            >
              {profile.bio ? (
                <div className="px-6 py-5">
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-600">
                    {profile.bio}
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="Tell freelancers about your company"
                  text="Add a short introduction to help freelancers understand your business."
                  button="Add company description"
                  onClick={openEdit}
                />
              )}
            </Card>

            {/* BUSINESS */}

            <Card
              title="Company information"
              subtitle="Business details"
            >
              <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <Info
                  icon={<BriefcaseIcon />}
                  label="Industry"
                  value={profile.industry}
                />

                <Info
                  icon={<UsersIcon />}
                  label="Company size"
                  value={profile.company_size}
                />

                <Info
                  icon={<CalendarIcon />}
                  label="Founded"
                  value={
                    profile.founded_year
                      ? String(profile.founded_year)
                      : null
                  }
                />

                <Info
                  icon={<GlobeIcon />}
                  label="Country"
                  value={profile.country}
                />
              </div>
            </Card>

            {/* CONTACT */}

            <Card
              title="Contact information"
              subtitle="Business contact details"
            >
              <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <Info
                  icon={<PhoneIcon />}
                  label="Phone"
                  value={profile.phone}
                />

                <Info
                  icon={<GlobeIcon />}
                  label="Website"
                  value={profile.website}
                  link
                />

                <Info
                  icon={<ClockIcon />}
                  label="Timezone"
                  value={profile.timezone}
                />

                <Info
                  icon={<PinIcon />}
                  label="Location"
                  value={profile.location}
                />
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-6">

            {/* PROFILE COMPLETION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Profile completion
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Complete your profile to make your business easier to trust.
                  </p>
                </div>

                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <svg
                    viewBox="0 0 42 42"
                    className="absolute h-12 w-12 -rotate-90"
                  >
                    <circle
                      cx="21"
                      cy="21"
                      r="17"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="4"
                    />

                    <circle
                      cx="21"
                      cy="21"
                      r="17"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${profileStrength} 100`}
                      pathLength="100"
                    />
                  </svg>

                  <span className="text-xs font-bold text-slate-900">
                    {profileStrength}%
                  </span>
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${profileStrength}%`,
                  }}
                />
              </div>

              {profileStrength < 100 && (
                <button
                  type="button"
                  onClick={openEdit}
                  className="mt-4 w-full rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Complete profile
                </button>
              )}
            </section>

            {/* ACTIVITY */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Hiring activity
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Marketplace activity
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ChartIcon />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <Activity
                  label="Jobs posted"
                  value={profile.jobs_posted}
                />

                <Activity
                  label="Total hires"
                  value={profile.hires}
                />

                <Activity
                  label="Active jobs"
                  value={profile.active_jobs}
                />

                <Activity
                  label="Reviews received"
                  value={profile.reviews_count}
                />
              </div>
            </section>

            {/* ACCOUNT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <h3 className="text-sm font-bold text-slate-950">
                Account details
              </h3>

              <div className="mt-5 space-y-4">
                <Account
                  label="Account type"
                  value="Client"
                />

                <Account
                  label="User ID"
                  value={`#${profile.user_id}`}
                  mono
                />

                <Account
                  label="Profile ID"
                  value={`#${profile.id}`}
                  mono
                />

                <Account
                  label="Member since"
                  value={joinedDate}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* EDIT MODAL */}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Edit profile
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update information shown on your public profile.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="overflow-y-auto">
              <div className="space-y-8 p-5 sm:p-6">

                {/* IMAGES */}

                <section>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-950">
                      Profile appearance
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Use a clear company image and a professional cover.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-200">

                    {/* COVER */}

                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-700">
                      {coverImagePreview && (
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      )}

                      <label
                        htmlFor="cover_image"
                        className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/60"
                      >
                        <CameraIcon />
                        Change cover
                      </label>

                      <input
                        id="cover_image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverImage}
                        className="hidden"
                      />
                    </div>

                    {/* AVATAR */}

                    <div className="px-5 pb-5">
                      <label
                        htmlFor="profile_image"
                        className="-mt-10 block h-20 w-20 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg"
                      >
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-500">
                            {avatarLetter}
                          </div>
                        )}
                      </label>

                      <input
                        id="profile_image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleProfileImage}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("profile_image")
                            ?.click()
                        }
                        className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        Change profile photo
                      </button>
                    </div>
                  </div>
                </section>

                {/* BASIC */}

                <EditSection
                  title="Basic information"
                  description="Introduce your company to freelancers."
                >
                  <div className="space-y-4">
                    <Field
                      label="Company / Client Name"
                      name="company_name"
                      value={form.company_name || ""}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        About your company
                      </label>

                      <textarea
                        name="bio"
                        rows={5}
                        maxLength={1000}
                        value={form.bio || ""}
                        onChange={handleInputChange}
                        placeholder="Tell freelancers about your company..."
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      <p className="mt-1.5 text-right text-[11px] text-slate-400">
                        {(form.bio || "").length}/1000
                      </p>
                    </div>

                    <Field
                      label="Location"
                      name="location"
                      value={form.location || ""}
                      onChange={handleInputChange}
                      placeholder="Agra, India"
                    />
                  </div>
                </EditSection>

                {/* BUSINESS */}

                <EditSection
                  title="Business information"
                  description="Tell freelancers about your company."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Industry"
                      name="industry"
                      value={form.industry || ""}
                      onChange={handleInputChange}
                      placeholder="Technology"
                    />

                    <SelectField
                      label="Company Size"
                      name="company_size"
                      value={form.company_size || ""}
                      onChange={handleInputChange}
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
                      value={form.founded_year || ""}
                      onChange={handleInputChange}
                      placeholder="2020"
                    />

                    <Field
                      label="Country"
                      name="country"
                      value={form.country || ""}
                      onChange={handleInputChange}
                      placeholder="India"
                    />

                    <div className="sm:col-span-2">
                      <Field
                        label="Website"
                        name="website"
                        type="url"
                        value={form.website || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </EditSection>

                {/* CONTACT */}

                <EditSection
                  title="Contact & timezone"
                  description="Help freelancers understand how to reach you."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={form.phone || ""}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />

                    <SelectField
                      label="Timezone"
                      name="timezone"
                      value={form.timezone || ""}
                      onChange={handleInputChange}
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
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({
  value,
  label,
  rating = false,
  last = false,
}: {
  value: string | number;
  label: string;
  rating?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`px-4 py-4 sm:py-5 ${
        !last ? "border-b border-slate-100 sm:border-b-0 sm:border-r" : ""
      }`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-lg font-bold text-slate-950 sm:text-xl">
          {value}
        </span>

        {rating && value !== "—" && (
          <span className="text-sm text-amber-500">★</span>
        )}
      </div>

      <p className="mt-1 text-center text-[11px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   CARD
========================================================= */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-sm font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   INFO
========================================================= */

function Info({
  icon,
  label,
  value,
  link = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | null;
  link?: boolean;
}) {
  const href =
    value &&
    (value.startsWith("http://") ||
      value.startsWith("https://"))
      ? value
      : value
        ? `https://${value}`
        : "";

  return (
    <div className="flex gap-3.5 p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        {value ? (
          link ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all text-sm font-semibold text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
              {value}
            </p>
          )
        ) : (
          <p className="mt-1 text-sm text-slate-400">
            Not specified
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function Activity({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   ACCOUNT
========================================================= */

function Account({
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
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold text-slate-800 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  title,
  text,
  button,
  onClick,
}: {
  title: string;
  text: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <FileIcon />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700"
      >
        {button}
      </button>
    </div>
  );
}

/* =========================================================
   EDIT SECTION
========================================================= */

function EditSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-slate-100 pt-7 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
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
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

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
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      >
        {options.map((option) => (
          <option
            key={`${name}-${option}`}
            value={option}
          >
            {option || `Select ${label.toLowerCase()}`}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 animate-pulse">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="mt-3 h-7 w-48 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 rounded bg-slate-200" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-[220px] animate-pulse bg-slate-200" />

          <div className="p-6">
            <div className="-mt-16 h-32 w-32 animate-pulse rounded-full border-4 border-white bg-slate-300" />

            <div className="mt-5 h-6 w-52 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </main>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-5 h-4 w-full rounded bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-3/5 rounded bg-slate-100" />
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function Icon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      {children}
    </svg>
  );
}

function EditIcon() {
  return (
    <Icon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </Icon>
  );
}

function RefreshIcon() {
  return (
    <Icon>
      <path d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10" />
      <path d="M3 4v6h6" />
      <path d="M4 13a8.1 8.1 0 0 0 14.9 4L21 14" />
      <path d="M21 20v-6h-6" />
    </Icon>
  );
}

function CameraIcon() {
  return (
    <Icon>
      <path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3Z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </Icon>
  );
}

function PinIcon() {
  return (
    <Icon>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

function BriefcaseIcon() {
  return (
    <Icon>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </Icon>
  );
}

function UsersIcon() {
  return (
    <Icon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

function CalendarIcon() {
  return (
    <Icon>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Icon>
  );
}

function GlobeIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  );
}

function PhoneIcon() {
  return (
    <Icon>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </Icon>
  );
}

function ClockIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

function ChartIcon() {
  return (
    <Icon>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
    </Icon>
  );
}

function FileIcon() {
  return (
    <Icon>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </Icon>
  );
}
