import Link from "next/link";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/freelancehub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.1c0-.87.43-1.6 1.67-1.6h1.73V4.82c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.2 1.53-4.2 4.34V11H7.35v3h2.82v8h3.33Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/freelancehub",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/freelancehub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.38L6.5 22H3.4l7.24-8.28L2.8 2h6.4l4.42 5.85L18.9 2Zm-1.1 17.8h1.73L8.3 4.08H6.44L17.8 19.8Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/freelancehub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M6.5 8.2H3.2V21h3.3V8.2ZM4.85 3A1.95 1.95 0 1 0 4.85 6.9 1.95 1.95 0 0 0 4.85 3ZM21 13.67c0-3.86-2.06-5.66-4.82-5.66-2.22 0-3.22 1.22-3.78 2.08V8.2H9.1V21h3.3v-6.34c0-1.67.32-3.28 2.38-3.28 2.03 0 2.06 1.9 2.06 3.39V21H21v-7.33Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@freelancehub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.58A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.58 9.38.58 9.38.58s7.5 0 9.38-.58a3 3 0 0 0 2.12-2.12A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.8 3.9-6.8 3.9Z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/freelancehub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">

      {/* Newsletter / CTA */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:flex-row md:items-center md:justify-between md:p-10">

            <div className="max-w-xl">
              <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                Stay in the loop
              </div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Get the latest freelance opportunities
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Receive project updates, freelancer tips, platform news,
                and useful resources directly in your inbox.
              </p>
            </div>

            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-xl border border-white/20 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/40"
              />

              <button
                type="submit"
                className="h-12 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Subscribe
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight"
            >
              <span className="text-blue-500">Freelance</span>
              <span className="text-white">Hub</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A modern freelance marketplace connecting talented
              professionals with businesses and clients around the world.
            </p>

            {/* Social */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              For Clients
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/find-freelancers"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Find Freelancers
                </Link>
              </li>

              <li>
                <Link
                  href="/projects"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Browse Projects
                </Link>
              </li>

              <li>
                <Link
                  href="/client/projects/create"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Post a Project
                </Link>
              </li>

              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              For Freelancers
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/find-jobs"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Find Jobs
                </Link>
              </li>

              <li>
                <Link
                  href="/categories"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Browse Categories
                </Link>
              </li>

              <li>
                <Link
                  href="/auth/register"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Become a Freelancer
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Pricing & Fees
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/help"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>

            <ul className="mt-5 space-y-4">

              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-blue-400">
                  ✉
                </span>

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <a
                    href="mailto:support@freelancehub.com"
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    support@freelancehub.com
                  </a>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-blue-400">
                  ☎
                </span>

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <a
                    href="tel:+919876543210"
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-blue-400">
                  ◉
                </span>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="text-sm text-slate-300">
                    India
                  </p>
                </div>
              </li>

            </ul>

            {/* Support Badge */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Support available
                  </p>

                  <p className="text-xs text-slate-500">
                    We are here to help
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Copyright */}
          <div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} FreelanceHub. All rights reserved.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Built for clients and freelancers worldwide.
            </p>
          </div>

          {/* Legal */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-sm text-slate-500 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-slate-500 transition hover:text-white"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cookies"
              className="text-sm text-slate-500 transition hover:text-white"
            >
              Cookie Policy
            </Link>

            <Link
              href="/accessibility"
              className="text-sm text-slate-500 transition hover:text-white"
            >
              Accessibility
            </Link>
          </div>

        </div>

        {/* Trust Row */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Secure payments
            </span>

            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Verified freelancers
            </span>

            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              24/7 support
            </span>
          </div>

          <p className="text-xs text-slate-600">
            FreelanceHub
          </p>

        </div>

      </div>
    </footer>
  );
}
