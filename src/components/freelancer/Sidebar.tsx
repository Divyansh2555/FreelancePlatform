"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const workspaceItems = [
  {
    name: "Dashboard",
    href: "/freelancer",
    icon: "⌂",
  },
  {
    name: "Find Jobs",
    href: "/freelancer/jobs",
    icon: "🔎",
  },
  {
    name: "My Proposals",
    href: "/freelancer/proposals",
    icon: "📨",
  },
  {
    name: "My Projects",
    href: "/freelancer/projects",
    icon: "📁",
  },
  {
    name: "Contracts",
    href: "/freelancer/contracts",
    icon: "📄",
  },
  {
    name: "Messages",
    href: "/freelancer/messages",
    icon: "💬",
  },
  {
    name: "Earnings",
    href: "/freelancer/earnings",
    icon: "💰",
  },
  {
    name: "Reviews",
    href: "/freelancer/reviews",
    icon: "⭐",
  },
];

const profileItems = [
  {
    name: "My Profile",
    href: "/freelancer/profile",
    icon: "👤",
  },
  {
    name: "Portfolio",
    href: "/freelancer/portfolio",
    icon: "🗂",
  },
  {
    name: "Settings",
    href: "/freelancer/settings",
    icon: "⚙",
  },
  {
    name: "Notifications",
    href: "/freelancer/notifications",
    icon: "🔔",
  },
];

type FreelancerSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function FreelancerSidebar({
  open,
  onClose,
}: FreelancerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/freelancer") {
      return pathname === "/freelancer";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");

    router.replace("/auth/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <Link
            href="/freelancer"
            onClick={onClose}
            className="text-2xl font-extrabold tracking-tight"
          >
            <span className="text-blue-600">Freelance</span>
            <span className="text-indigo-600">Hub</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {/* Workspace */}
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <div className="space-y-1">
            {workspaceItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg text-base
                      ${
                        active
                          ? "bg-blue-100"
                          : "bg-gray-50 group-hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  <span>{item.name}</span>

                  {/* Proposal Badge */}
                  {item.name === "My Proposals" && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                      5
                    </span>
                  )}

                  {/* Message Badge */}
                  {item.name === "Messages" && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1.5 text-[10px] font-bold text-white">
                      2
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Profile */}
          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Profile
          </p>

          <div className="space-y-1">
            {profileItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg text-base
                      ${
                        active
                          ? "bg-blue-100"
                          : "bg-gray-50 group-hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  <span>{item.name}</span>

                  {/* Notification Badge */}
                  {item.name === "Notifications" && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3 rounded-xl
              px-3 py-3 text-sm font-medium
              text-red-500 transition
              hover:bg-red-50
            "
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              ↪
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
