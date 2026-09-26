import { apiFetch } from "../client";
import { endpoints } from "../endpoints";

import type {
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  UserRole,
} from "../../../types/auth";

// =========================
// Login
// =========================

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(
    endpoints.auth.login,
    {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    }
  );
}

// =========================
// Register
// =========================

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>(
    endpoints.auth.register,
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
}

// =========================
// Forgot Password
// =========================

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse> {
  return apiFetch<ForgotPasswordResponse>(
    endpoints.auth.forgotPassword,
    {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
      }),
    }
  );
}

// =========================
// Reset Password
// =========================

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  return apiFetch<ResetPasswordResponse>(
    endpoints.auth.resetPassword,
    {
      method: "POST",
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    }
  );
}
