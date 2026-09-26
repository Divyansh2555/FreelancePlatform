"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientProfile } from "../../../../lib/api/services/clientProfile";

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

export default function CreateClientProfilePage() {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      const payload = {
        company_name: form.company_name.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
        industry: form.industry.trim(),
        company_size: form.company_size,
        founded_year: form.founded_year.trim()
          ? Number(form.founded_year)
          : null,
        phone: form.phone.trim(),
        country: form.country.trim(),
        timezone: form.timezone,
        profile_image: form.profile_image,
        cover_image: form.cover_image,
      };

      const data = await createClientProfile(payload);

      localStorage.setItem("role", "client");

      const oldUser = localStorage.getItem("user");

      let user: Record<string, unknown> = {};

      try {
        user = oldUser ? JSON.parse(oldUser) : {};
      } catch {
        user = {};
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role: "client",
          client_profile_id: data.id,
          profile_completed: true,
        })
      );

      router.replace("/client/client-profile");
    } catch (err) {
      console.error("CLIENT PROFILE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const companyInitial =
    form.company_name.trim().charAt(0).toUpperCase() || "C";

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-7">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Client Account
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            Create your client profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Add your company information and create a professional profile
            that freelancers can trust.
          </p>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* =====================================================
              COVER + PROFILE PHOTO
          ====================================================== */}
          <div className="relative">
            {/* Cover */}
            <div className="relative h-52 overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 sm:h-60">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Company cover"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
                  <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-white/10" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/10" />

              {/* Cover upload */}
              <label
                htmlFor="cover_image"
                className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/95 px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:bg-white"
              >
                <span>📷</span>
                {coverPreview ? "Change cover" : "Add cover"}
              </label>

              <input
                id="cover_image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </div>

            {/* Profile information */}
            <div className="relative border-b border-gray-200 px-5 pb-6 sm:px-8">
              <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                {/* Profile image */}
                <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                  <label
                    htmlFor="profile_image"
                    className="group flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-4xl font-bold text-blue-700 shadow-lg"
                  >
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Company profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      companyInitial
                    )}

                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      Change photo
                    </span>
                  </label>

                  <div className="pointer-events-none absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-sm text-white shadow">
                    📷
                  </div>

                  <input
                    id="profile_image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>

                {/* Company name */}
                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-2xl font-bold text-gray-900">
                    {form.company_name || "Your Company Name"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {form.location || "Your location"}
                  </p>

                  {form.profile_image && (
                    <p className="mt-2 max-w-xs truncate text-xs text-green-600">
                      ✓ {form.profile_image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              FORM
          ====================================================== */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            {/* Basic information */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Basic information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell freelancers about your company.
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
                    value={form.company_name}
                    onChange={handleChange}
                    required
                    placeholder="Acme Technologies"
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
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="Agra, India"
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
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Tell freelancers about your company..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </section>

            {/* Business */}
            <section className="mt-9 border-t border-gray-200 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Business information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add some details about your business.
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
                    <option value="">Select company size</option>
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

            {/* Contact */}
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
                    <option value="">Select timezone</option>
                    <option value="Asia/Kolkata">
                      Asia/Kolkata (IST)
                    </option>
                    <option value="UTC">UTC</option>
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

            {/* Error */}
            {error && (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                    ⚠️
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Profile creation failed
                    </p>

                    <p className="mt-1 break-words text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
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
