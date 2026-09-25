export function normalizeRole(
  role: unknown
): string | null {
  if (!role) {
    return null;
  }

  return String(role)
    .trim()
    .toLowerCase();
}

export function getRoleFromToken(
  token: string
): string | null {
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

export function redirectByRole(
  role: string
): boolean {
  const normalizedRole =
    normalizeRole(role);

  if (normalizedRole === "client") {
    window.location.replace("/client");
    return true;
  }

  if (normalizedRole === "freelancer") {
    window.location.replace("/freelancer");
    return true;
  }

  if (normalizedRole === "admin") {
    window.location.replace("/admin");
    return true;
  }

  return false;
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}