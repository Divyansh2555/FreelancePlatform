"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { removeStorage } from "../../lib/storage";

type UserRole = "client" | "freelancer" | "admin";

type RegisterResponse = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: UserRole | string;
  detail?: string;
  message?: string;
};

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<UserRole>("freelancer");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data =
        await apiFetch<RegisterResponse>(
          "/auth/register",
          {
            method: "POST",

            body: JSON.stringify({
              email: email.trim(),
              password,
              role,
            }),
          }
        );

      console.log(
        "Register response:",
        data
      );

      // ---------------------------------------------------
      // BACKEND ERROR-LIKE RESPONSE
      // ---------------------------------------------------

      if (
        data &&
        typeof data === "object" &&
        "detail" in data &&
        typeof data.detail === "string"
      ) {
        throw new Error(data.detail);
      }

      // ---------------------------------------------------
      // OLD ACCOUNT DATA CLEAR
      // ---------------------------------------------------

      removeStorage("user");
      removeStorage("client_profile");

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
        "user_id"
      );

      // ---------------------------------------------------
      // SUCCESS MESSAGE
      // ---------------------------------------------------

      setMessage(
        data?.message ||
          "Registration successful"
      );

      // ---------------------------------------------------
      // CLEAR FORM
      // ---------------------------------------------------

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full rounded-lg border p-3"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="w-full rounded-lg border p-3"
        required
      />

      <select
        value={role}
        onChange={(e) =>
          setRole(
            e.target.value as UserRole
          )
        }
        className="w-full rounded-lg border p-3"
      >
        <option value="freelancer">
          Freelancer
        </option>

        <option value="client">
          Client
        </option>
      </select>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {message && (
        <p className="text-sm text-green-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Creating account..."
          : "Register"}
      </button>
    </form>
  );
}
