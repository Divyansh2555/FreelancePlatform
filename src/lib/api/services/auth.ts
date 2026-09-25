import { apiFetch } from "../client";
import { endpoints } from "../endpoints";
import type {
  LoginResponse,
  RegisterResponse,
} from "../../../types/auth";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(
    endpoints.auth.login,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>(
    endpoints.auth.register,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}