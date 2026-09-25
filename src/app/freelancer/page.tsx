"use client";

import { useCallback, useEffect, useState } from "react";

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
  if (!date) {
    return "No deadline";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: string | null) {
  if (!date) {
    return "Unknown";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyProjectsPage() {
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
        let message = "Failed to fetch projects.";

        if (typeof data?.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data?.detail)) {
          message = data.detail
            .map((item: any) => {
              if (typeof item === "string") {
                return item;
              }

              return (
                item?.msg ||
                item?.message ||
                "Validation error"
              );
            })
            .join(", ");
        }

        throw new Error(message);
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid projects response from server."
        );
      }

      setProjects(data);
    } catch (err) {
      console.error("Get projects error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading projects."
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
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
                Client Workspace
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Projects
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                View and manage the projects you have posted.
              </p>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projects.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Open Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {
                  projects.filter(
                    (project) =>
                      project.status.toLowerCase() === "open"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Closed Projects
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-600">
                {
                  projects.filter(
                    (project) =>
                      project.status.toLowerCase() !== "open"
                  ).length
                }
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-24 rounded-full bg-slate-200" />
                  <div className="h-6 w-16 rounded-full bg-slate-200" />
                </div>

                <div className="mt-6 h-7 w-3/4 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />

                <div className="mt-7 grid grid-cols-2 gap-4">
                  <div className="h-12 rounded-xl bg-slate-200" />
                  <div className="h-12 rounded-xl bg-slate-200" />
                  <div className="h-12 rounded-xl bg-slate-200" />
                  <div className="h-12 rounded-xl bg-slate-200" />
                </div>

                <div className="mt-6 h-11 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-900">
              Unable to load projects
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProjects}
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
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
                📁
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No projects yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You have not posted any projects yet.
                Create your first project to get started.
              </p>

              <a
                href="/client/projects/create"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                + Post a Project
              </a>
            </div>
          )}

        {/* Projects */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => {
                const status =
                  project.status?.toLowerCase() || "open";

                return (
                  <article
                    key={project.id}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                        {project.category || "General"}
                      </span>

                      <span
                        className={`
                          rounded-full px-3 py-1 text-xs font-semibold capitalize
                          ${
                            status === "open"
                              ? "bg-emerald-50 text-emerald-700"
                              : status === "completed"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }
                        `}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-5 line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                      {project.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {project.description}
                    </p>

                    {/* Details */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {/* Budget */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          Budget
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatBudget(project)}
                        </p>
                      </div>

                      {/* Type */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          Type
                        </p>

                        <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                          {project.budget_type}
                        </p>
                      </div>

                      {/* Experience */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          Experience
                        </p>

                        <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                          {project.experience_level ||
                            "Not specified"}
                        </p>
                      </div>

                      {/* Deadline */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          Deadline
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatDate(project.deadline)}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    {project.location && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <span>📍</span>
                        <span>{project.location}</span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs text-slate-400">
                          Posted
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-600">
                          {formatDateTime(project.created_at)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          console.log(
                            "Selected project:",
                            project.id
                          )
                        }
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        View Project
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}
