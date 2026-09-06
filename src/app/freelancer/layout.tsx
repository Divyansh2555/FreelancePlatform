"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/src/components/freelancer/Header";
import Sidebar from "@/src/components/freelancer/Sidebar";

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    // Login nahi hai
    if (!accessToken) {
      router.replace(
        `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
      );
      return;
    }

    // Freelancer nahi hai
    if (role !== "freelancer") {
      router.replace("/auth/login");
      return;
    }

    // Auth OK
    setCheckingAuth(false);
  }, [router, pathname]);

  // Auth check hone tak dashboard mat dikhao
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="lg:pl-72">

        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
