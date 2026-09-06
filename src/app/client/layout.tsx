"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import ClientHeader from "@/src/components/client/Header";
import ClientSidebar from "@/src/components/client/Sidebare";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Auth sirf layout mount hone par check karo.
    // Har pathname change par dobara loading mat dikhao.
    const accessToken = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (!accessToken) {
      router.replace(
        `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
      );
      return;
    }

    if (role !== "client") {
      router.replace("/auth/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]); // pathname yahan se hata diya

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
      <ClientSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72">
        <ClientHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
