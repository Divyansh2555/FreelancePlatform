"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  "AI & Automation",
  "Development & IT",
  "Design & Creative",
  "Marketing",
  "Data & Analytics",
  "Admin & Support",
  "Writing & Content",
];

const categoryData = {
  "AI & Automation": [
    {
      title: "AI Video Creators & Editors",
      desc: "Generate and edit AI-powered video",
      href: "/hire/ai-video-creators-editors",
    },
    {
      title: "AI Integration Developers",
      desc: "Connect AI to your existing tools",
      href: "/hire/ai-integration-developers",
    },
    {
      title: "Chatbot Developers",
      desc: "Build AI for support and sales",
      href: "/hire/chatbot-developers",
    },
    {
      title: "Machine Learning Engineers",
      desc: "Models that learn from your data",
      href: "/hire/machine-learning-engineers",
    },
    {
      title: "AI Developers",
      desc: "Custom AI-powered apps and features",
      href: "/hire/ai-developers",
    },
    {
      title: "Automation Experts",
      desc: "Streamline your business processes",
      href: "/hire/automation-experts",
    },
    {
      title: "N8N Experts",
      desc: "No-code workflow automation",
      href: "/hire/n8n-experts",
    },
    {
      title: "Vibe Coders",
      desc: "Prototype and build rapidly with AI",
      href: "/hire/vibe-coders",
    },
    {
      title: "Claude Experts",
      desc: "Build with Anthropic's Claude",
      href: "/hire/claude-experts",
    },
    {
      title: "AI Consultants",
      desc: "Strategic AI guidance for business",
      href: "/hire/ai-consultants",
    },
  ],

  "Development & IT": [
    {
      title: "Full Stack Developers",
      desc: "Build complete web applications",
      href: "/hire/full-stack-developers",
    },
    {
      title: "Frontend Developers",
      desc: "Modern and responsive interfaces",
      href: "/hire/frontend-developers",
    },
    {
      title: "Backend Developers",
      desc: "Powerful APIs and server systems",
      href: "/hire/backend-developers",
    },
    {
      title: "React Developers",
      desc: "Build fast React applications",
      href: "/hire/react-developers",
    },
    {
      title: "Next.js Developers",
      desc: "Production-ready Next.js apps",
      href: "/hire/nextjs-developers",
    },
    {
      title: "WordPress Developers",
      desc: "Custom WordPress websites",
      href: "/hire/wordpress-developers",
    },
    {
      title: "Shopify Developers",
      desc: "Build and customize Shopify stores",
      href: "/hire/shopify-developers",
    },
    {
      title: "Mobile App Developers",
      desc: "iOS and Android applications",
      href: "/hire/mobile-app-developers",
    },
  ],

  "Design & Creative": [
    {
      title: "UI/UX Designers",
      desc: "Beautiful and intuitive digital products",
      href: "/hire/ui-ux-designers",
    },
    {
      title: "Graphic Designers",
      desc: "Visuals that make your brand stand out",
      href: "/hire/graphic-designers",
    },
    {
      title: "Logo Designers",
      desc: "Memorable logos for your brand",
      href: "/hire/logo-designers",
    },
    {
      title: "Product Designers",
      desc: "Design products people love",
      href: "/hire/product-designers",
    },
    {
      title: "Web Designers",
      desc: "Modern websites that convert",
      href: "/hire/web-designers",
    },
    {
      title: "Video Editors",
      desc: "Professional video editing",
      href: "/hire/video-editors",
    },
  ],

  Marketing: [
    {
      title: "SEO Experts",
      desc: "Grow your organic search traffic",
      href: "/hire/seo-experts",
    },
    {
      title: "Digital Marketers",
      desc: "Build campaigns that drive growth",
      href: "/hire/digital-marketers",
    },
    {
      title: "Social Media Managers",
      desc: "Grow and manage your social presence",
      href: "/hire/social-media-managers",
    },
    {
      title: "Google Ads Experts",
      desc: "Get more from paid advertising",
      href: "/hire/google-ads-experts",
    },
    {
      title: "Content Marketers",
      desc: "Content strategies that convert",
      href: "/hire/content-marketers",
    },
    {
      title: "Email Marketing Experts",
      desc: "Turn email into a growth channel",
      href: "/hire/email-marketing-experts",
    },
  ],

  "Data & Analytics": [
    {
      title: "Data Analysts",
      desc: "Turn business data into insights",
      href: "/hire/data-analysts",
    },
    {
      title: "Data Scientists",
      desc: "Advanced data science solutions",
      href: "/hire/data-scientists",
    },
    {
      title: "Machine Learning Experts",
      desc: "Build intelligent data models",
      href: "/hire/machine-learning",
    },
    {
      title: "Power BI Experts",
      desc: "Interactive business dashboards",
      href: "/hire/power-bi",
    },
    {
      title: "SQL Developers",
      desc: "Database and SQL solutions",
      href: "/hire/sql-developers",
    },
  ],

  "Admin & Support": [
    {
      title: "Virtual Assistants",
      desc: "Reliable support for your business",
      href: "/hire/virtual-assistants",
    },
    {
      title: "Customer Support",
      desc: "Professional customer service",
      href: "/hire/customer-support",
    },
    {
      title: "Data Entry Experts",
      desc: "Accurate and efficient data work",
      href: "/hire/data-entry",
    },
    {
      title: "Project Managers",
      desc: "Keep your projects on track",
      href: "/hire/project-managers",
    },
  ],

  "Writing & Content": [
    {
      title: "Content Writers",
      desc: "High-quality content for your audience",
      href: "/hire/content-writers",
    },
    {
      title: "Copywriters",
      desc: "Words that turn visitors into customers",
      href: "/hire/copywriters",
    },
    {
      title: "Technical Writers",
      desc: "Clear and useful technical documentation",
      href: "/hire/technical-writers",
    },
    {
      title: "Blog Writers",
      desc: "Engaging blogs and articles",
      href: "/hire/blog-writers",
    },
    {
      title: "Editors",
      desc: "Polished and professional writing",
      href: "/hire/editors",
    },
  ],
};

type Category = keyof typeof categoryData;

export default function Navbar() {
  const [hireOpen, setHireOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<Category>("AI & Automation");

  return (
    <header className="relative z-[100] border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-gray-950"
        >
          Your<span className="text-emerald-600">Work</span>
        </Link>

        {/* NAVIGATION */}
        <div className="hidden h-full items-center gap-8 md:flex">

          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-emerald-600"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-gray-700 transition hover:text-emerald-600"
          >
            About
          </Link>

          {/* HIRE */}
          <div
            className="flex h-full items-center"
            onMouseEnter={() => setHireOpen(true)}
            onMouseLeave={() => setHireOpen(false)}
          >
            <Link
              href="/hire"
              className={`flex h-full items-center gap-1.5 border-b-2 text-sm font-medium transition ${
                hireOpen
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-700 hover:text-emerald-600"
              }`}
            >
              Hire freelancers

              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  hireOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>
          </div>

          <Link
            href="/how-it-works"
            className="text-sm font-medium text-gray-700 transition hover:text-emerald-600"
          >
            How it works
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 transition hover:text-emerald-600"
          >
            Contact
          </Link>
        </div>

        {/* RIGHT AUTH */}
        <div className="flex items-center gap-3">

          {/* LOGIN */}
          <Link
            href="/auth/login"
            className="hidden text-sm font-semibold text-gray-700 hover:text-emerald-600 sm:block"
          >
            Log in
          </Link>

          {/* REGISTER */}
          <Link
            href="/auth/register"
            className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Sign up
          </Link>

        </div>
      </nav>

      {/* HIRE MEGA MENU */}
      {hireOpen && (
        <div
          className="absolute left-0 top-[72px] w-full border-t border-gray-100 bg-white shadow-[0_25px_60px_rgba(0,0,0,.10)]"
          onMouseEnter={() => setHireOpen(true)}
          onMouseLeave={() => setHireOpen(false)}
        >
          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">

            <div className="grid grid-cols-[235px_1fr] gap-8">

              {/* CATEGORIES */}
              <aside className="border-r border-gray-100 pr-6">

                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-gray-400">
                    Categories
                  </p>
                </div>

                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onMouseEnter={() =>
                        setActiveCategory(category as Category)
                      }
                      className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                        activeCategory === category
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                            activeCategory === category
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {getCategoryIcon(category)}
                        </span>

                        {category}
                      </span>

                      <span
                        className={`transition ${
                          activeCategory === category
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0"
                        }`}
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* SERVICES */}
              <div className="min-w-0">

                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-600">
                      {activeCategory}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
                      Hire {activeCategory} experts
                    </h2>
                  </div>

                  <Link
                    href="/hire"
                    className="hidden text-sm font-semibold text-emerald-600 hover:text-emerald-700 sm:block"
                  >
                    View all →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-5 gap-y-2 lg:grid-cols-3">
                  {categoryData[activeCategory].map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group rounded-xl p-3.5 transition hover:bg-emerald-50"
                    >
                      <div className="flex items-start gap-3">

                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition group-hover:bg-emerald-600 group-hover:text-white">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M12 3v18M3 12h18" />
                          </svg>
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 transition group-hover:text-emerald-700">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-gray-400">
                            {item.desc}
                          </p>
                        </div>

                      </div>
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 px-5 py-3.5">
                  <p className="text-sm text-gray-500">
                    Can't find what you're looking for?
                  </p>

                  <Link
                    href="/hire"
                    className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Browse all freelancers →
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* CATEGORY ICON */
function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    "AI & Automation": "✦",
    "Development & IT": "⌘",
    "Design & Creative": "◈",
    Marketing: "↗",
    "Data & Analytics": "▥",
    "Admin & Support": "◎",
    "Writing & Content": "✎",
  };

  return icons[category] || "•";
}
