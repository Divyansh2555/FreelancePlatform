"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Profile = {
  id: number;
  user_id: number;
  title: string;
  bio: string | null;
  skills: string | null;
  experience: number;
  hourly_rate: number | null;
  location: string | null;
};

export default function FreelancerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    bio: "",
    skills: "",
    experience: 0,
    hourly_rate: 0,
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/freelancer/profile/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to load profile"
        );
      }

      if (!Array.isArray(data) || data.length === 0) {
        setProfile(null);
        return;
      }

      // Backend currently returns list
      const currentProfile = data[0];

      setProfile(currentProfile);

      setForm({
        title: currentProfile.title ?? "",
        bio: currentProfile.bio ?? "",
        skills: currentProfile.skills ?? "",
        experience: currentProfile.experience ?? 0,
        hourly_rate: currentProfile.hourly_rate ?? 0,
        location: currentProfile.location ?? "",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "experience" || name === "hourly_rate"
          ? Number(value)
          : value,
    }));
  }

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!profile) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/freelancer/profile/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            bio: form.bio,
            skills: form.skills,
            experience: form.experience,
            hourly_rate: form.hourly_rate,
            location: form.location,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Profile update failed"
        );
      }

      setProfile(data);
      setEditMode(false);
      setSuccess("Profile updated successfully.");

      setForm({
        title: data.title ?? "",
        bio: data.bio ?? "",
        skills: data.skills ?? "",
        experience: data.experience ?? 0,
        hourly_rate: data.hourly_rate ?? 0,
        location: data.location ?? "",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!profile) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your freelancer profile?"
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/freelancer/profile/${profile.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Profile deletion failed"
        );
      }

      setProfile(null);
      setSuccess("Profile deleted successfully.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setDeleting(false);
    }
  }

  // Loading
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

  // No profile
  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-bold text-white">
            F
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Create Your Freelancer Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create your professional profile and showcase your
            skills to potential clients.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={() =>
              router.push("/freelancer/profile/create")
            }
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700"
          >
            Create Profile
          </button>
        </div>
      </main>
    );
  }

  const skills = profile.skills
    ? profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  // Edit mode
  if (editMode) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Freelancer Profile
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Edit Profile
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleUpdate}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate skills using commas.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Years of Experience
                  </label>

                  <input
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                  placeholder="e.g. Delhi, India"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6">

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

            </div>
          </form>
        </div>
      </main>
    );
  }

  // Profile view
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Top navigation */}
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
            onClick={() => setEditMode(true)}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-52" />

          <div className="px-6 pb-7 sm:px-8">

            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

              {/* Avatar + Basic info */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-700 text-4xl font-bold text-white shadow-lg">
                  {profile.title?.charAt(0)?.toUpperCase() || "F"}
                </div>

                <div className="pb-1">

                  <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {profile.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Freelancer
                  </p>

                  {profile.location && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <span>📍</span>
                      <span>{profile.location}</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Available for work
              </div>

            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 sm:grid-cols-4">

              <div className="p-5 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {profile.experience}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Years Experience
                </p>
              </div>

              <div className="p-5 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {profile.hourly_rate !== null
                    ? `₹${profile.hourly_rate}`
                    : "—"}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Hourly Rate
                </p>
              </div>

              <div className="p-5 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {skills.length}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Skills
                </p>
              </div>

              <div className="p-5 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ✓
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Profile Verified
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Left */}
          <div className="space-y-6 lg:col-span-2">

            {/* About */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  About Me
                </h3>

                <button
                  onClick={() => setEditMode(true)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {profile.bio || "No bio added yet."}
              </p>

            </section>

            {/* Skills */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h3 className="text-xl font-bold text-slate-900">
                Skills & Expertise
              </h3>

              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2.5">
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

            {/* Experience */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h3 className="text-xl font-bold text-slate-900">
                Experience
              </h3>

              <div className="mt-5 flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
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

          {/* Right */}
          <aside className="space-y-6">

            {/* Rate card */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm font-medium text-slate-500">
                Hourly Rate
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {profile.hourly_rate !== null
                    ? `₹${profile.hourly_rate}`
                    : "Not set"}
                </span>

                {profile.hourly_rate !== null && (
                  <span className="pb-1 text-sm text-slate-500">
                    / hour
                  </span>
                )}
              </div>

              <div className="mt-5 h-px bg-slate-100" />

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Experience
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {profile.experience} years
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Location
                  </span>

                  <span className="max-w-[150px] text-right text-sm font-semibold text-slate-900">
                    {profile.location || "Not set"}
                  </span>
                </div>

              </div>

            </section>

            {/* Profile details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="font-bold text-slate-900">
                Profile Details
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    👤
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Profile ID
                    </p>

                    <p className="text-sm font-semibold text-slate-700">
                      #{profile.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    📍
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Location
                    </p>

                    <p className="text-sm font-semibold text-slate-700">
                      {profile.location || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                    ⚡
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

              </div>

            </section>

            {/* Danger zone */}
            <section className="rounded-3xl border border-red-100 bg-red-50/50 p-6">

              <h3 className="font-bold text-red-700">
                Danger Zone
              </h3>

              <p className="mt-2 text-xs leading-5 text-red-500">
                Deleting your profile will remove your freelancer
                profile from the platform.
              </p>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Profile"}
              </button>

            </section>

          </aside>

        </div>

      </div>
    </main>
  );
}
