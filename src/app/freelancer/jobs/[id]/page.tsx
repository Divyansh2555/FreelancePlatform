"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

function getApiError(data: any) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item: any) => {
        if (typeof item === "string") {
          return item;
        }

        const location = Array.isArray(item?.loc)
          ? item.loc.join(" → ")
          : "";

        return (
          item?.msg ||
          item?.message ||
          (location
            ? `Validation error at ${location}`
            : "Validation error")
        );
      })
      .join(", ");
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return "Something went wrong.";
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

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplyProjectPage() {
  const params = useParams();
  const router = useRouter();

  const rawProjectId = params?.id;
  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  const numericProjectId = Number(projectId);

  const [project, setProject] = useState<Project | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // GET PROJECT
  // =========================================================

  useEffect(() => {
    if (!projectId || Number.isNaN(numericProjectId)) {
      setError("Invalid project ID.");
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
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
          `${API_URL}/api/v1/projects/${numericProjectId}`,
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

        setProject(data);
      } catch (err) {
        console.error("Get project error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, numericProjectId]);

  // =========================================================
  // APPLY PROJECT
  // =========================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // Project ID validation
    // -----------------------------

    if (
      !projectId ||
      Number.isNaN(numericProjectId) ||
      numericProjectId <= 0
    ) {
      setError("Invalid project ID.");
      return;
    }

    // -----------------------------
    // Project status validation
    // -----------------------------

    if (
      project &&
      project.status?.toLowerCase() !== "open"
    ) {
      setError("This project is no longer open for proposals.");
      return;
    }

    // -----------------------------
    // Cover letter validation
    // -----------------------------

    const cleanCoverLetter = coverLetter.trim();

    if (cleanCoverLetter.length < 20) {
      setError(
        "Cover letter must be at least 20 characters."
      );
      return;
    }

    // -----------------------------
    // Bid validation
    // -----------------------------

    const bid = Number(bidAmount);

    if (
      !bidAmount.trim() ||
      Number.isNaN(bid) ||
      bid <= 0
    ) {
      setError("Please enter a valid bid amount.");
      return;
    }

    // -----------------------------
    // Estimated days validation
    // -----------------------------

    const days = Number(estimatedDays);

    if (
      !estimatedDays.trim() ||
      Number.isNaN(days) ||
      days <= 0 ||
      !Number.isInteger(days)
    ) {
      setError(
        "Estimated days must be a positive whole number."
      );
      return;
    }

    // -----------------------------
    // Token validation
    // -----------------------------

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please login as a freelancer first.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        project_id: numericProjectId,
        cover_letter: cleanCoverLetter,
        bid_amount: bid,
        estimated_days: days,
      };

      console.log("Submitting proposal:", payload);

      /*
       * IMPORTANT:
       * Tumhare backend ka current actual URL:
       *
       * /api/v1/api/v1/proposals/
       *
       * Isliye yahan wahi URL use kiya gaya hai.
       */

      const response = await fetch(
        `${API_URL}/api/v1/api/v1/proposals/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("Proposal response:", {
        status: response.status,
        data,
      });

      if (!response.ok) {
        throw new Error(getApiError(data));
      }

      setSuccess(
        "Your proposal has been submitted successfully!"
      );

      setCoverLetter("");
      setBidAmount("");
      setEstimatedDays("");

      setTimeout(() => {
        router.push("/freelancer/jobs");
      }, 2000);
    } catch (err) {
      console.error("Apply project error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit proposal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-8 w-2/3 rounded-lg bg-slate-200" />

          <div className="mt-4 h-5 w-1/2 rounded bg-slate-200" />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-2xl bg-white" />
            <div className="h-96 rounded-2xl bg-white lg:col-span-2" />
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load project
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.push("/freelancer/jobs")}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Back to Jobs
          </button>
        </div>
      </main>
    );
  }

  if (!project) {
    return null;
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/freelancer/jobs")}
            className="mb-5 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to Jobs
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                {project.category || "General Project"}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {project.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Posted by client • Project #{project.id}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                project.status?.toLowerCase() === "open"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </div>

              <div>
                <p className="font-semibold text-emerald-800">
                  Proposal Submitted
                </p>

                <p className="text-sm text-emerald-700">
                  {success}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-800">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">

          {/* Project Details */}
          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <h2 className="text-xl font-bold text-slate-900">
                Project Details
              </h2>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-500">
                  Description
                </h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {project.description}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Budget
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formatBudget(project)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Budget Type
                  </p>

                  <p className="mt-1 font-bold capitalize text-slate-900">
                    {project.budget_type}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Experience
                  </p>

                  <p className="mt-1 font-bold capitalize text-slate-900">
                    {project.experience_level || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Deadline
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formatDate(project.deadline)}
                  </p>
                </div>

              </div>

              {project.location && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    📍 {project.location}
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* Apply Form */}
          <section className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
            >

              <h2 className="text-xl font-bold text-slate-900">
                Submit a Proposal
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Tell the client why you are the right freelancer
                for this project.
              </p>

              {/* Cover Letter */}
              <div className="mt-6">

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="cover_letter"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Cover Letter
                  </label>

                  <span
                    className={`text-xs ${
                      coverLetter.trim().length < 20
                        ? "text-slate-400"
                        : "text-emerald-600"
                    }`}
                  >
                    {coverLetter.trim().length}/20 min
                  </span>
                </div>

                <textarea
                  id="cover_letter"
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  rows={7}
                  placeholder="Explain your experience, approach, relevant skills, and why you are a good fit..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                {coverLetter.length > 0 &&
                  coverLetter.trim().length < 20 && (
                    <p className="mt-2 text-xs text-red-500">
                      Cover letter must contain at least 20
                      characters.
                    </p>
                  )}

              </div>

              {/* Bid */}
              <div className="mt-5">

                <label
                  htmlFor="bid_amount"
                  className="text-sm font-semibold text-slate-700"
                >
                  Your Bid Amount
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    $
                  </span>

                  <input
                    id="bid_amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) =>
                      setBidAmount(e.target.value)
                    }
                    placeholder="1500"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

              </div>

              {/* Estimated Days */}
              <div className="mt-5">

                <label
                  htmlFor="estimated_days"
                  className="text-sm font-semibold text-slate-700"
                >
                  Estimated Completion
                </label>

                <div className="relative mt-2">

                  <input
                    id="estimated_days"
                    type="number"
                    min="1"
                    step="1"
                    value={estimatedDays}
                    onChange={(e) =>
                      setEstimatedDays(e.target.value)
                    }
                    placeholder="7"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    days
                  </span>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  project.status?.toLowerCase() !== "open"
                }
                className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting Proposal..."
                  : project.status?.toLowerCase() !== "open"
                  ? "Project Closed"
                  : "Apply Now"}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Your proposal will be sent directly to the client.
              </p>

            </form>
          </section>

        </div>
      </div>
    </main>
  );
}
