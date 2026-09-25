"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Project {
  id: number;
  client_id: number;
  title: string;
  description: string;
  category: string | null;
  budget_type: string;
  budget_min: number | string | null;
  budget_max: number | string | null;
  experience_level: string | null;
  deadline: string | null;
  location: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function HireWebDesigners() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/v1/projects/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        setProjects(data);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load projects. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatBudget = (project: Project) => {
    if (
      project.budget_min == null &&
      project.budget_max == null
    ) {
      return "Budget not specified";
    }

    if (
      project.budget_min != null &&
      project.budget_max != null
    ) {
      return `$${project.budget_min} - $${project.budget_max}`;
    }

    if (project.budget_min != null) {
      return `From $${project.budget_min}`;
    }

    return `Up to $${project.budget_max}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "No deadline";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Find your next project
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Hire Web Designers
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Discover web design projects posted by clients
              and find opportunities that match your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Available Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {projects.length} projects available
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-24 rounded bg-slate-200" />

                <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />

                <div className="mt-6 h-10 w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-xl text-red-600">
                !
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-red-900">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-7 w-7 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 13h6m-3-3v6m8-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No projects available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                There are currently no open projects.
              </p>
            </div>
          )}

        {/* Projects */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  {/* Category + Status */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {project.category || "Web Design"}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                      {project.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  {/* Project Information */}
                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    {/* Budget */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Budget
                      </span>

                      <span className="font-semibold text-slate-900">
                        {formatBudget(project)}
                      </span>
                    </div>

                    {/* Budget Type */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Type
                      </span>

                      <span className="text-sm font-medium capitalize text-slate-700">
                        {project.budget_type}
                      </span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Experience
                      </span>

                      <span className="text-sm font-medium capitalize text-slate-700">
                        {project.experience_level ||
                          "Not specified"}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Deadline
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {formatDate(project.deadline)}
                      </span>
                    </div>

                    {/* Location */}
                    {project.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Location
                        </span>

                        <span className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                          {project.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        console.log(
                          "Selected project:",
                          project.id
                        );
                      }}
                      className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      View Project
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}
