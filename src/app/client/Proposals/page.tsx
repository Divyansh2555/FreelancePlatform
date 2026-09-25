"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Freelancer {
  id: number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
}

interface Project {
  id: number;
  title: string;
}

interface Proposal {
  id: number;
  project_id: number;
  freelancer_id: number;
  cover_letter: string;
  bid_amount: string | number;
  estimated_days: number;
  status: string;
  created_at: string;
  updated_at?: string | null;

  freelancer?: Freelancer | null;
  project?: Project | null;
}

function getApiError(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data
  ) {
    const detail = (data as { detail?: unknown }).detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (
            typeof item === "object" &&
            item !== null
          ) {
            const error = item as {
              msg?: string;
              message?: string;
            };

            return (
              error.msg ||
              error.message ||
              "Validation error"
            );
          }

          return "Validation error";
        })
        .join(", ");
    }
  }

  return "Unable to load proposals.";
}

function formatDate(date: string) {
  if (!date) {
    return "Unknown";
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

function formatAmount(amount: string | number) {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return String(amount);
  }

  return `$${value.toLocaleString()}`;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700";

    case "rejected":
      return "bg-red-50 text-red-700";

    case "pending":
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      /*
       * IMPORTANT:
       *
       * Backend router should be:
       * prefix="/proposals"
       *
       * and main.py should have:
       * app.include_router(api_router, prefix="/api/v1")
       *
       * Therefore final URL:
       *
       * /api/v1/proposals/client
       */

      const response = await fetch(
        `${API_URL}/api/v1/proposals/client`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const text = await response.text();

      let data: unknown = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(getApiError(data));
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid proposals response from server."
        );
      }

      setProposals(data as Proposal[]);
    } catch (err) {
      console.error(
        "Get client proposals error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading proposals."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const totalProposals = proposals.length;

  const pendingProposals = proposals.filter(
    (proposal) =>
      proposal.status?.toLowerCase() === "pending"
  ).length;

  const acceptedProposals = proposals.filter(
    (proposal) =>
      proposal.status?.toLowerCase() === "accepted"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                Client Workspace
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Proposals
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Review freelancers who applied to your projects.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProposals}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* ===================================================
            STATS
        ==================================================== */}

        {!loading && !error && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Proposals
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalProposals}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingProposals}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Accepted
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {acceptedProposals}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="mt-5 h-7 w-3/4 rounded bg-slate-200" />

                <div className="mt-4 h-20 rounded-xl bg-slate-200" />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-xl bg-slate-200" />
                  <div className="h-16 rounded-xl bg-slate-200" />
                </div>

                <div className="mt-5 h-10 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-900">
              Unable to load proposals
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProposals}
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!loading &&
          !error &&
          proposals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                📨
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No proposals yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When freelancers apply to your projects,
                their proposals will appear here.
              </p>
            </div>
          )}

        {/* ===================================================
            PROPOSALS
        ==================================================== */}

        {!loading &&
          !error &&
          proposals.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {proposals.map((proposal) => {
                const status =
                  proposal.status?.toLowerCase() ||
                  "pending";

                const freelancerName =
                  proposal.freelancer?.name ||
                  proposal.freelancer?.username ||
                  `Freelancer #${proposal.freelancer_id}`;

                return (
                  <article
                    key={proposal.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    {/* Project + Status */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Project
                        </p>

                        <h2 className="mt-1 truncate text-lg font-bold text-slate-900 group-hover:text-blue-600">
                          {proposal.project?.title ||
                            `Project #${proposal.project_id}`}
                        </h2>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Freelancer */}

                    <div className="mt-6 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                        {freelancerName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Freelancer
                        </p>

                        <p className="truncate font-bold text-slate-900">
                          {freelancerName}
                        </p>

                        {proposal.freelancer?.email && (
                          <p className="truncate text-xs text-slate-500">
                            {proposal.freelancer.email}
                          </p>
                        )}

                        {!proposal.freelancer && (
                          <p className="text-xs text-slate-500">
                            Freelancer ID:{" "}
                            {proposal.freelancer_id}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cover Letter */}

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-slate-700">
                        Cover Letter
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {proposal.cover_letter}
                      </p>
                    </div>

                    {/* Bid + Days */}

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-blue-50 p-4">
                        <p className="text-xs font-medium text-blue-600">
                          Freelancer Bid
                        </p>

                        <p className="mt-1 text-lg font-bold text-blue-900">
                          {formatAmount(
                            proposal.bid_amount
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          Completion
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {proposal.estimated_days} days
                        </p>
                      </div>
                    </div>

                    {/* Applied */}

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400">
                        Applied
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {formatDate(
                          proposal.created_at
                        )}
                      </p>
                    </div>

                    {/* Actions */}

                    {status === "pending" && (
                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            console.log(
                              "Reject proposal:",
                              proposal.id
                            )
                          }
                          className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            console.log(
                              "Accept proposal:",
                              proposal.id
                            )
                          }
                          className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Hire Freelancer
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}
