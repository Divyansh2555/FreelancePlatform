"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function FreelancerProfileCreate() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    bio: "",
    skills: "",
    experience: 0,
    hourly_rate: 0,
    location: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setProfileImage(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      /*
       * IMPORTANT:
       * Do NOT set Content-Type manually.
       *
       * Browser automatically sets:
       * multipart/form-data; boundary=...
       */
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("bio", form.bio);
      formData.append("skills", form.skills);
      formData.append(
        "experience",
        String(form.experience)
      );
      formData.append(
        "hourly_rate",
        String(form.hourly_rate)
      );
      formData.append("location", form.location);

      // Add image
      if (profileImage) {
        formData.append(
          "profile_image",
          profileImage
        );
      }

      const response = await fetch(
        `${API_URL}/freelancer/profile/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
            : "Profile creation failed"
        );
      }

      router.push("/freelancer");
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl text-white shadow-lg shadow-blue-200">
            ✦
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Create Your Freelancer Profile
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Showcase your skills, experience and expertise to
            potential clients.
          </p>

        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

          {/* Card Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 sm:px-8">

            <h2 className="text-lg font-bold text-white">
              Professional Information
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              Complete your profile to start finding projects.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >

            {/* Profile Image */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Profile Picture
              </label>

              <div className="flex flex-col items-center gap-5 sm:flex-row">

                {/* Preview */}
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-700 text-4xl font-bold text-white shadow-lg">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {form.title
                        ?.charAt(0)
                        ?.toUpperCase() || "F"}
                    </span>
                  )}

                </div>

                {/* Upload */}
                <div className="w-full">

                  <label
                    htmlFor="profile_image"
                    className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Choose Profile Image
                  </label>

                  <input
                    id="profile_image"
                    name="profile_image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, PNG or WEBP. Maximum size: 5MB.
                  </p>

                  {profileImage && (
                    <p className="mt-2 truncate text-xs font-medium text-green-600">
                      Selected: {profileImage.name}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Title */}
            <div>

              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Professional Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* Bio */}
            <div>

              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                About You
              </label>

              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell clients about yourself, your expertise and what you can offer..."
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Write a short and professional introduction.
              </p>

            </div>

            {/* Skills */}
            <div>

              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Next.js, Python, FastAPI"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate multiple skills with commas.
              </p>

            </div>

            {/* Experience + Rate */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Experience */}
              <div>

                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Experience
                </label>

                <div className="relative">

                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-16 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    Years
                  </span>

                </div>

              </div>

              {/* Hourly Rate */}
              <div>

                <label
                  htmlFor="hourly_rate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Hourly Rate
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    id="hourly_rate"
                    name="hourly_rate"
                    type="number"
                    min="0"
                    value={form.hourly_rate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-16 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    / hour
                  </span>

                </div>

              </div>

            </div>

            {/* Location */}
            <div>

              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Agra, Uttar Pradesh"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">

                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </div>

                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>

              </div>
            )}

            {/* Submit */}
            <div className="border-t border-slate-100 pt-6">

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Freelancer Profile"
                )}

              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                You can update your profile later.
              </p>

            </div>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 FreelanceHub. Build your career, one project at a time.
        </p>

      </div>
    </main>
  );
}
