"use client";

import { useEffect, useRef, useState } from "react";
import { useFreelancerProfile } from "../../hooks/useFreelancerProfile";

export default function FreelancerProfile() {
  const {
    profile,
    loading,
    saving,
    error,
    message,
    updateProfile,
    deleteProfile,
    refreshProfile,
  } = useFreelancerProfile();

  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: "",
    bio: "",
    skills: "",
    experience: 0,
    hourly_rate: 0,
    location: "",
  });

  /*
   * IMPORTANT:
   * This component does NOT call the API directly.
   * API fetching is handled by useFreelancerProfile().
   */

  function startEdit() {
    if (!profile) return;

    setForm({
      title: profile.title ?? "",
      bio: profile.bio ?? "",
      skills: profile.skills ?? "",
      experience: Number(profile.experience ?? 0),
      hourly_rate: Number(profile.hourly_rate ?? 0),
      location: profile.location ?? "",
    });

    setSelectedImage(null);
    setPreview(null);
    setEditMode(true);
  }

  function closeEdit() {
    setEditMode(false);
    setSelectedImage(null);
    setPreview(null);

    if (preview) {
      URL.revokeObjectURL(preview);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "experience" || name === "hourly_rate"
          ? Number(value)
          : value,
    }));
  }

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setPreview(imageUrl);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!profile) return;

    try {
      await updateProfile({
        title: form.title,
        bio: form.bio,
        skills: form.skills,
        experience: form.experience,
        hourly_rate: form.hourly_rate,
        location: form.location,
        profile_image: selectedImage,
      });

      closeEdit();
    } catch {
      // Hook handles the error.
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );

    if (!confirmed) return;

    try {
      await deleteProfile();
    } catch {
      // Hook handles the error.
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-52 rounded-3xl bg-slate-200" />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="h-72 rounded-3xl bg-slate-200 lg:col-span-2" />
            <div className="h-72 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-bold text-white">
            F
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Freelancer Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            No freelancer profile found.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => void refreshProfile()}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </main>
    );
  }

  const imageUrl =
    preview || profile.profile_image || "";

  const skills = profile.skills
    ? profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (editMode) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
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
              onClick={closeEdit}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-8 flex items-center gap-5">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 text-4xl font-bold text-white">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.title?.charAt(0)?.toUpperCase() || "F"
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Profile Picture
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  JPG, PNG or WebP. Maximum 5MB.
                </p>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Choose Image
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {selectedImage && (
                  <p className="mt-2 text-xs text-green-600">
                    {selectedImage.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Professional Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Full Stack Developer"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell clients about yourself..."
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
                  Separate skills with commas.
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
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={closeEdit}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
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
            onClick={startEdit}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-700 text-4xl font-bold text-white shadow-lg">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={profile.title || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.title?.charAt(0)?.toUpperCase() || "F"
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

              <div className="flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Available for work
              </div>
            </div>

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

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  About Me
                </h3>

                <button
                  type="button"
                  onClick={startEdit}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {profile.bio || "No bio added yet."}
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                Skills & Expertise
              </h3>

              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  No skills added yet.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                Experience
              </h3>

              <div className="mt-5 flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  💼
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Professional Experience
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.experience}{" "}
                    {profile.experience === 1 ? "year" : "years"}{" "}
                    of professional experience
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Hourly Rate
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {profile.hourly_rate !== null &&
                profile.hourly_rate !== undefined
                  ? `₹${profile.hourly_rate}`
                  : "Not set"}
              </p>

              {profile.hourly_rate !== null &&
                profile.hourly_rate !== undefined && (
                  <p className="mt-1 text-sm text-slate-500">
                    per hour
                  </p>
                )}

              <div className="my-5 h-px bg-slate-100" />

              <div className="space-y-4">
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
                    {profile.location || "Not set"}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Profile Details
              </h3>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Profile ID
                  </p>

                  <p className="text-sm font-semibold">
                    #{profile.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Location
                  </p>

                  <p className="text-sm font-semibold">
                    {profile.location || "Not specified"}
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

            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Danger Zone
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Delete your freelancer profile permanently.
              </p>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={saving}
                className="mt-5 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete Profile
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
