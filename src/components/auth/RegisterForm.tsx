"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { removeStorage } from "../../lib/storage";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          role,
        }),
      });

      // =====================================================
      // IMPORTANT:
      // New account register hone par old account ka data
      // browser me nahi rehna chahiye.
      // =====================================================

      removeStorage("user");
      removeStorage("client_profile");

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");

      setMessage(
        data.message || "Registration successful"
      );

      // Form clear
      setEmail("");
      setPassword("");

    } catch (err) {
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
          setRole(e.target.value)
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
