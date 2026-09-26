"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { resetPassword } from "../../lib/api/services/auth";

// =========================
// Reset Password Content
// =========================

function ResetPasswordContent() {
  const searchParams = useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) {
      return;
    }

    setSuccess("");
    setError("");

    if (!token) {
      setError(
        "Password reset token is missing."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await resetPassword(
          token,
          password
        );

      setSuccess(
        response.message ||
          "Password reset successful."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-3xl font-extrabold tracking-tight text-blue-600"
          >
            Freelance
            <span className="text-indigo-600">
              Hub
            </span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your account.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-8">

          {!token ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">
                Invalid or missing reset token.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Success */}
              {success && (
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-700">
                    {success}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Login */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// =========================
// Loading
// =========================

function ResetPasswordLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading reset page...
        </p>
      </div>
    </main>
  );
}

// =========================
// Main Component
// =========================

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={<ResetPasswordLoading />}
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
