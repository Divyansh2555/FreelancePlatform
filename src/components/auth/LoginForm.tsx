"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "../../lib/api/services/auth";

import {
  clearAuth,
  getRoleFromToken,
  normalizeRole,
} from "../../lib/auth";

type LoginResponseData = {
  access_token?: string;
  token?: string;
  refresh_token?: string;

  role?: string | null;
  user_role?: string | null;

  user?: {
    role?: string | null;
    user_role?: string | null;
    [key: string]: unknown;
  } | null;

  [key: string]: unknown;
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] =
    useState(true);
  const [error, setError] = useState("");

  // =========================
  // Role Redirect
  // =========================

  function redirectByRole(role: string) {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === "client") {
      router.replace("/client");
      return true;
    }

    if (normalizedRole === "freelancer") {
      router.replace("/freelancer");
      return true;
    }

    if (normalizedRole === "admin") {
      router.replace("/admin");
      return true;
    }

    return false;
  }

  // =========================
  // Already Logged In Check
  // =========================

  useEffect(() => {
    const accessToken =
      localStorage.getItem("access_token");

    const savedRole = normalizeRole(
      localStorage.getItem("role")
    );

    if (!accessToken) {
      setCheckingAuth(false);
      return;
    }

    if (savedRole) {
      const redirected =
        redirectByRole(savedRole);

      if (redirected) {
        return;
      }
    }

    clearAuth();
    setCheckingAuth(false);
  }, []);

  // =========================
  // Login
  // =========================

  async function handleLogin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      clearAuth();

      const rawData = await login(
        email.trim(),
        password
      );

      const data =
        rawData as unknown as LoginResponseData;

      console.log("LOGIN RESPONSE:", data);

      const token =
        data.access_token ||
        data.token;

      if (!token) {
        throw new Error(
          "Login successful, but access token was not returned."
        );
      }

      localStorage.setItem(
        "access_token",
        token
      );

      if (data.refresh_token) {
        localStorage.setItem(
          "refresh_token",
          data.refresh_token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      let role =
        data.user?.role ||
        data.user?.user_role ||
        data.role ||
        data.user_role ||
        null;

      if (role) {
        role = normalizeRole(role);
      }

      if (!role) {
        role = getRoleFromToken(token);
      }

      if (!role) {
        clearAuth();

        throw new Error(
          "Login successful, but user role was not found."
        );
      }

      localStorage.setItem(
        "role",
        role
      );

      console.log("LOGIN ROLE:", role);

      const redirected =
        redirectByRole(role);

      if (redirected) {
        return;
      }

      clearAuth();

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
  }

  // =========================
  // Checking Auth
  // =========================

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

          <p className="mt-4 text-sm font-medium text-slate-400">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-[-150px] right-[-100px] h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-3xl font-black tracking-tight"
          >
            <span className="text-white">
              Freelance
            </span>

            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Hub
            </span>
          </Link>

          <h1 className="mt-7 text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Email address
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-500">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

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
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                {/* Lock Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-slate-500">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />

                {/* Show Password */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-slate-200 disabled:opacity-40"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6a17.5 17.5 0 0 1-3.1 3.8" />
                      <path d="M6.2 6.2C3.4 8.2 2 12 2 12s3.5 6 10 6c1.4 0 2.7-.3 3.8-.8" />
                    </svg>
                  )}
                </button>

              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                  !
                </div>

                <p className="text-sm leading-5 text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>
                      Signing in...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Sign in
                    </span>

                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}

              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-500">
              NEW TO FREELANCEHUB?
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Register */}
          <Link
            href="/auth/register"
            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Create a new account
          </Link>

        </div>

        {/* Footer */}
        <div className="mt-7 text-center">
          <p className="text-xs text-slate-600">
            © 2026 FreelanceHub. All rights reserved.
          </p>
        </div>

      </div>
    </main>
  );
}
