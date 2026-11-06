"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Project = {
  id: number;
  client_id: number;
  title: string;
  description: string;
  category: string | null;
  budget_type: "fixed" | "hourly";
  budget_min: string | number | null;
  budget_max: string | number | null;
  experience_level: "entry" | "intermediate" | "expert" | null;
  deadline: string | null;
  location: string | null;
  status:
    | "draft"
    | "open"
    | "in_progress"
    | "completed"
    | "cancelled";
  created_at: string;
  updated_at: string;
};

type ProjectForm = {
  title: string;
  description: string;
  category: string;
  budget_type: "fixed" | "hourly";
  budget_min: string;
  budget_max: string;
  experience_level: "entry" | "intermediate" | "expert";
  deadline: string;
  location: string;
};

const initialForm: ProjectForm = {
  title: "",
  description: "",
  category: "",
  budget_type: "fixed",
  budget_min: "",
  budget_max: "",
  experience_level: "entry",
  deadline: "",
  location: "",
};

function getApiError(data: any): string {
  if (!data) return "Something went wrong.";

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item: any) => item?.msg || String(item))
      .join("\n");
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return "Something went wrong.";
}

async function readResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return { detail: text || "Unexpected server response." };
}

function formatDate(date: string | null) {
  if (!date) return "No deadline";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Invalid date";
  }

  return parsed.toLocaleDateString();
}

function formatBudget(
  min: string | number | null,
  max: string | number | null,
  type: "fixed" | "hourly"
) {
  const minimum = min !== null ? Number(min) : null;
  const maximum = max !== null ? Number(max) : null;

  const suffix = type === "hourly" ? "/hr" : "";

  if (minimum !== null && maximum !== null) {
    return `₹${minimum.toLocaleString()} - ₹${maximum.toLocaleString()}${suffix}`;
  }

  if (minimum !== null) {
    return `From ₹${minimum.toLocaleString()}${suffix}`;
  }

  if (maximum !== null) {
    return `Up to ₹${maximum.toLocaleString()}${suffix}`;
  }

  return "Budget not specified";
}

function getStatusClasses(status: Project["status"]) {
  switch (status) {
    case "open":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "in_progress":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "completed":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: Project["status"]) {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatExperience(
  experience: Project["experience_level"]
) {
  if (!experience) return "Not specified";

  return experience.charAt(0).toUpperCase() + experience.slice(1);
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<ProjectForm>(initialForm);

  // =========================
  // GET MY PROJECTS
  // =========================

  const fetchMyProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${API_URL}/api/v1/projects/my`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(getApiError(data));
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid projects response.");
      }

      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects."
      );

      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  // =========================
  // HANDLE FORM INPUT
  // =========================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================
  // POST NEW PROJECT
  // =========================

  async function handlePostProject(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const min = form.budget_min
      ? Number(form.budget_min)
      : null;

    const max = form.budget_max
      ? Number(form.budget_max)
      : null;

    if (
      (min !== null && (!Number.isFinite(min) || min < 0)) ||
      (max !== null && (!Number.isFinite(max) || max < 0))
    ) {
      setError("Please enter valid budget amounts.");
      return;
    }

    if (min !== null && max !== null && min > max) {
      setError("Minimum budget cannot exceed maximum budget.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || null,
        budget_type: form.budget_type,
        budget_min: min,
        budget_max: max,
        experience_level: form.experience_level,
        deadline: form.deadline || null,
        location: form.location.trim() || null,
      };

      const response = await fetch(
        `${API_URL}/api/v1/projects/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(getApiError(data));
      }

      setSuccess("Your project has been posted successfully!");

      setForm(initialForm);
      setShowForm(false);

      await fetchMyProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to post project."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // PAGE UI
  // =========================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Client Workspace
          </span>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Projects
              </h1>

              <p className="mt-2 text-slate-600">
                Manage and post your projects.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(!showForm);
                  setError("");
                  setSuccess("");
                }}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {showForm ? "Close Form" : "+ Post New Project"}
              </button>

              <button
                type="button"
                onClick={fetchMyProjects}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* POST PROJECT FORM */}

        {showForm && (
          <form
            onSubmit={handlePostProject}
            className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                Post a New Project
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fill in the details to find the right freelancer.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* TITLE */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Title *
                </label>

                <input
                  name="title"
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Build a professional website"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Description *
                </label>

                <textarea
                  name="description"
                  required
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain your project requirements..."
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Web Development"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* BUDGET TYPE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Budget Type *
                </label>

                <select
                  name="budget_type"
                  value={form.budget_type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              {/* MIN BUDGET */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Minimum Budget (₹)
                </label>

                <input
                  name="budget_min"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget_min}
                  onChange={handleChange}
                  placeholder="Minimum budget"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* MAX BUDGET */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Maximum Budget (₹)
                </label>

                <input
                  name="budget_max"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget_max}
                  onChange={handleChange}
                  placeholder="Maximum budget"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* EXPERIENCE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Experience Level *
                </label>

                <select
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* DEADLINE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Deadline
                </label>

                <input
                  name="deadline"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* LOCATION */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Remote / India / Delhi"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* FORM BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Posting Project..." : "Post Project"}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
                className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* LOADING */}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Loading your projects...
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading && projects.length === 0 && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-5xl">📁</div>

            <h2 className="text-xl font-bold text-slate-900">
              No Projects Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You have not posted any projects yet.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Post Your First Project
            </button>
          </div>
        )}

        {/* PROJECT LIST */}

        {!loading && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* HEADER */}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-900">
                      {project.title}
                    </h2>

                    {project.category && (
                      <p className="mt-1 text-sm text-slate-500">
                        {project.category}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      project.status
                    )}`}
                  >
                    {formatStatus(project.status)}
                  </span>
                </div>

                {/* DESCRIPTION */}

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                  {project.description}
                </p>

                {/* DETAILS */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Budget
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatBudget(
                        project.budget_min,
                        project.budget_max,
                        project.budget_type
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatExperience(project.experience_level)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Deadline
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatDate(project.deadline)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-900">
                      {project.location || "Remote"}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <p className="text-xs text-slate-400">
                    Project #{project.id}
                  </p>

                  <p className="text-xs text-slate-400">
                    Created {formatDate(project.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
