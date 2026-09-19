"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  allowedRole?: "client" | "freelancer" | "admin";
};

export default function AuthGuard({
  children,
  allowedRole,
}: Props) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    // Token nahi hai
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // Role required hai lekin match nahi karta
    if (allowedRole && role !== allowedRole) {
      if (role === "client") {
        router.replace("/client");
      } else if (role === "freelancer") {
        router.replace("/freelancer");
      } else if (role === "admin") {
        router.replace("/admin");
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("role");

        router.replace("/auth/login");
      }

      return;
    }

    setChecking(false);
  }, [router, allowedRole]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </main>
    );
  }

  return <>{children}</>;
}