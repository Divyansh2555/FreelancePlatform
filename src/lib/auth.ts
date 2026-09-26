import type { UserRole } from "../types/auth";

// =========================
// Normalize Role
// =========================

export function normalizeRole(
  role: unknown
): UserRole | null {
  if (
    role !== "client" &&
    role !== "freelancer" &&
    role !== "admin"
  ) {
    return null;
  }

  return role;
}

// =========================
// Get Role From JWT Token
// =========================

export function getRoleFromToken(
  token: string
): UserRole | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    const decoded = JSON.parse(
      atob(paddedBase64)
    );

    return normalizeRole(
      decoded?.role ||
        decoded?.user_role ||
        decoded?.user?.role
    );
  } catch (error) {
    console.error(
      "JWT decode error:",
      error
    );

    return null;
  }
}

// =========================
// Get Role Redirect Path
// =========================

export function getRoleRedirectPath(
  role: unknown
): string | null {
  const normalizedRole =
    normalizeRole(role);

  if (normalizedRole === "client") {
    return "/client";
  }

  if (normalizedRole === "freelancer") {
    return "/freelancer";
  }

  if (normalizedRole === "admin") {
    return "/admin";
  }

  return null;
}

// =========================
// Clear Authentication
// =========================

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}
