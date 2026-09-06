"use client";

import Link from "next/link";
import { useState } from "react";

type FreelancerHeaderProps = {
  onMenuClick?: () => void;
};

export default function FreelancerHeader({
  onMenuClick,
}: FreelancerHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Search */}
          <div className="relative hidden w-72 md:block lg:w-96">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>

            <input
              type="search"
              placeholder="Search jobs..."
              className="
                h-11 w-full rounded-xl border border-gray-200
                bg-gray-50 pl-10 pr-4 text-sm text-gray-900
                outline-none transition
                placeholder:text-gray-400
                focus:border-blue-400 focus:bg-white
                focus:ring-2 focus:ring-blue-100
              "
            />
          </div>

          {/* Mobile Search */}
          <button
            type="button"
            aria-label="Search"
            className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Earnings */}
          <Link
            href="/freelancer/earnings"
            className="
              hidden items-center gap-2 rounded-xl
              border border-gray-200 bg-gray-50
              px-3 py-2.5 text-sm font-semibold text-gray-700
              transition hover:border-green-200 hover:bg-green-50
              sm:flex
            "
          >
            <span className="text-green-600">₹</span>
            <span>₹32,500</span>
          </Link>

          {/* Find Jobs */}
          <Link
            href="/freelancer/jobs"
            className="
              hidden items-center gap-2 rounded-xl
              bg-blue-600 px-4 py-2.5
              text-sm font-semibold text-white
              shadow-sm transition hover:bg-blue-700
              sm:flex
            "
          >
            <span>🔎</span>
            Find Jobs
          </Link>

          {/* Messages */}
          <Link
            href="/freelancer/messages"
            aria-label="Messages"
            className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
              />
            </svg>

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
          </Link>

          {/* Notifications */}
          <Link
            href="/freelancer/notifications"
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
              />
            </svg>

            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              3
            </span>
          </Link>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* Profile */}
          <div className="relative">

            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                JD
              </div>

              {/* User Info */}
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  John Doe
                </p>

                <p className="text-xs text-gray-500">
                  Freelancer
                </p>
              </div>

              {/* Arrow */}
              <svg
                className={`hidden h-4 w-4 text-gray-400 transition sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 shadow-xl">

                {/* User */}
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    John Doe
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    freelancer@example.com
                  </p>
                </div>

                <Link
                  href="/freelancer/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span>👤</span>
                  My Profile
                </Link>

                <Link
                  href="/freelancer/portfolio"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span>🗂</span>
                  Portfolio
                </Link>

                <Link
                  href="/freelancer/earnings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span>💰</span>
                  Earnings
                </Link>

                <Link
                  href="/freelancer/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span>⚙</span>
                  Settings
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  <span>↪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
