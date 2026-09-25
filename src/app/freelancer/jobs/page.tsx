"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Project {
  id: number;
  client_id: number;
  title: string;
  description: string;
  category: string | null;
  budget_type: string;
  budget_min: string | number | null;
  budget_max: string | number | null;
  experience_level: string | null;
  deadline: string | null;
  location: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function formatBudget(project: Project) {
  const min = project.budget_min;
  const max = project.budget_max;

  if (min == null && max == null) {
    return "Budget not specified";
  }

  if (min != null && max != null) {
    return `$${Number(min).toLocaleString()} - $${Number(
      max
    ).toLocaleString()}`;
  }

  if (min != null) {
    return `From $${Number(min).toLocaleString()}`;
  }

  return `Up to $${Number(max).toLocaleString()}`;
}

function formatDate(date: string | null) {
  if (!date) return "No deadline";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Invalid date";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getApiError(data: any) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item: any) => {
        if (typeof item === "string") return item;

        return (
          item?.msg ||
          item?.message ||
          "Validation error"
        );
      })
      .join(", ");
  }

  return "Failed to load jobs.";
}

export default function FreelancerJobsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/api/v1/projects/`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(data));
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid jobs response.");
      }

      // Sirf open projects dikhao
      const openProjects = data.filter(
        (project: Project) =>
          project.status?.toLowerCase() === "open"
      );

      setProjects(openProjects);
    } catch (err) {
      console.error("Get jobs error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Freelancer Workspace
          </span>

          <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Find Jobs
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Browse projects posted by clients and find
                work that matches your skills.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-6 w-24 rounded-full bg-slate-200" />

                <div className="mt-5 h-7 w-4/5 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />

                <div className="mt-6 h-12 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-900">
              Unable to load jobs
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProjects}
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                💼
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No jobs available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                There are currently no open projects.
              </p>
            </div>
          )}

        {/* Jobs */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  {/* Category */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                      {project.category || "General"}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                      {project.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 line-clamp-2 text-xl font-bold text-slate-900 group-hover:text-blue-600">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  {/* Details */}
                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        Budget
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {formatBudget(project)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Experience
                      </span>

                      <span className="text-sm font-medium capitalize text-slate-700">
                        {project.experience_level ||
                          "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Deadline
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {formatDate(project.deadline)}
                      </span>
                    </div>

                    {project.location && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">
                          Location
                        </span>

                        <span className="truncate text-sm font-medium text-slate-700">
                          {project.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Job */}
                  <div className="mt-6">
                    <Link
                      href={`/freelancer/jobs/${project.id}`}
                      className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      View Job & Apply
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}
