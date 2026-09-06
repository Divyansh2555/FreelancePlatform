"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

type UserRole = "client" | "freelancer" | "admin";

type RegisterResponse = {
  id?: number;
  name?: string;
  email?: string;
  role?: UserRole;
  detail?: string;
  message?: string;
};

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<UserRole>("client");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data: RegisterResponse = await apiFetch(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      console.log("Register response:", data);

      if (!data.id) {
        throw new Error(
          "Registration response is invalid."
        );
      }

      const userRole = data.role || role;

      if (
        userRole !== "client" &&
        userRole !== "freelancer" &&
        userRole !== "admin"
      ) {
        throw new Error(
          "Invalid registration role."
        );
      }

      // Save user information
      localStorage.setItem(
        "user_id",
        String(data.id)
      );

      localStorage.setItem(
        "role",
        userRole
      );

      localStorage.setItem(
        "email",
        data.email || email.trim()
      );

      // Role based redirect
      if (userRole === "client") {
        window.location.replace("/client");
        return;
      }

      if (userRole === "freelancer") {
        window.location.replace("/freelancer");
        return;
      }

      if (userRole === "admin") {
        window.location.replace("/admin");
        return;
      }
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
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
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join FreelanceHub today
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your name"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Register As
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as UserRole
                  )
                }
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="client">
                  Client
                </option>

                <option value="freelancer">
                  Freelancer
                </option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}

              <Link
                href="/auth/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 FreelanceHub. All rights reserved.
        </p>
      </div>
    </main>
  );
}
