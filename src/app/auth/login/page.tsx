"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

type LoginResponse = {
  access_token?: string;
  refresh_token?: string;
  token?: string;

  role?: string;
  user_role?: string;

  message?: string;
  detail?: string;

  user?: {
    id?: number | string;
    email?: string;
    role?: string;
    user_role?: string;
  };
};

/**
 * Normalize role
 */
function normalizeRole(
  role: unknown
): string | null {
  if (!role) {
    return null;
  }

  return String(role)
    .trim()
    .toLowerCase();
}

/**
 * JWT se role nikalna
 */
function getRoleFromToken(
  token: string
): string | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];

    // Base64URL -> Base64
    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    // Padding add
    const paddedBase64 =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    const decoded = JSON.parse(
      atob(paddedBase64)
    );

    console.log(
      "JWT PAYLOAD:",
      decoded
    );

    return normalizeRole(
      decoded.role ||
        decoded.user_role ||
        decoded.user?.role
    );
  } catch (error) {
    console.error(
      "JWT decode error:",
      error
    );

    return null;
  }
}

/**
 * Role ke according redirect
 */
function redirectByRole(
  role: string
): boolean {
  const normalizedRole =
    normalizeRole(role);

  if (
    normalizedRole === "client"
  ) {
    window.location.replace(
      "/client"
    );

    return true;
  }

  if (
    normalizedRole === "freelancer"
  ) {
    window.location.replace(
      "/freelancer"
    );

    return true;
  }

  if (
    normalizedRole === "admin"
  ) {
    window.location.replace(
      "/admin"
    );

    return true;
  }

  return false;
}

export default function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [error, setError] =
    useState("");

  /**
   * ------------------------------------------------
   * ALREADY LOGIN CHECK
   * ------------------------------------------------
   */
  useEffect(() => {
    const accessToken =
      localStorage.getItem(
        "access_token"
      );

    const savedRole =
      normalizeRole(
        localStorage.getItem("role")
      );

    // Token nahi hai -> login page show karo
    if (!accessToken) {
      setCheckingAuth(false);
      return;
    }

    // Token + role available -> dashboard
    if (savedRole) {
      const redirected =
        redirectByRole(
          savedRole
        );

      if (redirected) {
        return;
      }
    }

    // Invalid session clear karo
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "user"
    );

    setCheckingAuth(false);
  }, []);

  /**
   * ------------------------------------------------
   * LOGIN
   * ------------------------------------------------
   */
  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      /**
       * Old session clear karo
       */
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "user"
      );

      /**
       * Backend Login
       *
       * IMPORTANT:
       * Direct fetch ki jagah apiFetch use ho raha hai.
       */
      const data: LoginResponse =
        await apiFetch(
          "/auth/login",
          {
            method: "POST",

            body: JSON.stringify({
              email: email.trim(),
              password,
            }),
          }
        );

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      /**
       * ------------------------------------------------
       * TOKEN
       * ------------------------------------------------
       */
      const token =
        data.access_token ||
        data.token;

      if (!token) {
        throw new Error(
          "Login successful, but access token was not returned."
        );
      }

      /**
       * Save access token
       */
      localStorage.setItem(
        "access_token",
        token
      );

      /**
       * Save refresh token
       */
      if (data.refresh_token) {
        localStorage.setItem(
          "refresh_token",
          data.refresh_token
        );
      }

      /**
       * ------------------------------------------------
       * USER
       * ------------------------------------------------
       */
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      /**
       * ------------------------------------------------
       * FIND ROLE FROM API RESPONSE
       * ------------------------------------------------
       */
      let role =
        data.user?.role ||
        data.user?.user_role ||
        data.role ||
        data.user_role ||
        null;

      role = normalizeRole(
        role
      );

      console.log(
        "ROLE FROM API:",
        role
      );

      /**
       * ------------------------------------------------
       * FIND ROLE FROM JWT
       * ------------------------------------------------
       *
       * Agar API response me role nahi hai,
       * JWT se role nikalo.
       */
      if (!role) {
        role =
          getRoleFromToken(
            token
          );
      }

      console.log(
        "FINAL ROLE:",
        role
      );

      /**
       * ------------------------------------------------
       * ROLE NOT FOUND
       * ------------------------------------------------
       */
      if (!role) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        localStorage.removeItem(
          "role"
        );

        localStorage.removeItem(
          "user"
        );

        throw new Error(
          "Login successful, but user role was not found."
        );
      }

      /**
       * ------------------------------------------------
       * SAVE ROLE
       * ------------------------------------------------
       */
      localStorage.setItem(
        "role",
        role
      );

      console.log(
        "ROLE SAVED:",
        localStorage.getItem(
          "role"
        )
      );

      /**
       * ------------------------------------------------
       * REDIRECT
       * ------------------------------------------------
       */
      const redirected =
        redirectByRole(
          role
        );

      if (redirected) {
        return;
      }

      /**
       * Unknown role
       */
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "user"
      );

      throw new Error(
        `Unsupported user role: ${role}`
      );
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
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
  };

  /**
   * ------------------------------------------------
   * AUTH CHECK LOADING
   * ------------------------------------------------
   */
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
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
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-blue-100/50">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

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
                  setEmail(
                    e.target.value
                  )
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
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

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
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}

              <Link
                href="/auth/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
