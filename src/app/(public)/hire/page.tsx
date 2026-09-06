"use client";

import { useState } from "react";

const categories = [
  {
    name: "Dev & IT",
    icon: "⌘",
    specialties: [
      ["Full Stack Developers", "869+"],
      ["WordPress Developers", "17,101+"],
      ["Web Developers", "1,588+"],
      ["Shopify Developers", "8,721+"],
    ],
  },
  {
    name: "AI & Automation",
    icon: "✦",
    specialties: [
      ["AI Engineers", "2,400+"],
      ["AI Developers", "5,800+"],
      ["Automation Experts", "3,200+"],
      ["Machine Learning Engineers", "4,100+"],
    ],
  },
  {
    name: "Design & Creative",
    icon: "◈",
    specialties: [
      ["UI/UX Designers", "8,200+"],
      ["Graphic Designers", "15,400+"],
      ["Logo Designers", "6,700+"],
      ["Product Designers", "4,300+"],
    ],
  },
  {
    name: "Marketing",
    icon: "↗",
    specialties: [
      ["Digital Marketers", "9,500+"],
      ["SEO Experts", "7,200+"],
      ["Social Media Managers", "6,800+"],
      ["Google Ads Experts", "3,900+"],
    ],
  },
  {
    name: "Data & Analytics",
    icon: "▥",
    specialties: [
      ["Data Analysts", "5,600+"],
      ["Data Scientists", "3,700+"],
      ["Power BI Experts", "2,800+"],
      ["SQL Developers", "4,900+"],
    ],
  },
  {
    name: "Admin & Support",
    icon: "◎",
    specialties: [
      ["Virtual Assistants", "12,400+"],
      ["Customer Support", "8,900+"],
      ["Data Entry Experts", "14,200+"],
      ["Project Managers", "5,100+"],
    ],
  },
  {
    name: "Writing & Content",
    icon: "✎",
    specialties: [
      ["Content Writers", "10,200+"],
      ["Copywriters", "7,600+"],
      ["Technical Writers", "3,400+"],
      ["Editors", "5,800+"],
    ],
  },
];

const freelancers = [
  {
    name: "Sunil S.",
    location: "Mohali, India",
    rate: "$15/hr",
    rating: "4.8",
    jobs: "53 jobs",
    image:
      "https://www.upwork.com/profile-portraits/c1M1Yj57sqvU3VDvd9gZfRPDh89oWCK5NBss0bVtbROT5vqmULwHZqR04insGJeYE5",
    badge: "Top Rated Plus",
    skills: ["Full-Stack Development", "React", "Next.js"],
    description:
      "I help startups and businesses build fast, scalable and production-ready web applications.",
  },
  {
    name: "Alexandra K.",
    location: "Ivano-Frankivsk, Ukraine",
    rate: "$35/hr",
    rating: "4.9",
    jobs: "59 jobs",
    image:
      "https://www.upwork.com/profile-portraits/c1dSA1Sanb3UJ4tXDzU7zmvyDNuGaR-Lq36AjrrDfr0vrOTkswtbZ6BtyAZCVZS9Fj",
    badge: "Top Rated",
    skills: ["JavaScript", "WordPress", "Vue.js"],
    description:
      "Full Stack Developer helping companies create reliable digital products and business platforms.",
  },
  {
    name: "Artem C.",
    location: "Kyiv, Ukraine",
    rate: "$25/hr",
    rating: "4.9",
    jobs: "109 jobs",
    image:
      "https://www.upwork.com/profile-portraits/c1uwXN8b07J_dZ1jQyGyVOS3R8Fkz9aPpXQOXbqNy9NdOf_NSVq-B666NP2tm-5ts1",
    badge: "Expert",
    skills: ["Full-Stack", "API", "AI Integration"],
    description:
      "CTO and Full Stack Developer building SaaS platforms, AI systems and complex applications.",
  },
  {
    name: "Mitul P.",
    location: "Surat, India",
    rate: "$12/hr",
    rating: "5.0",
    jobs: "26 jobs",
    image:
      "https://www.upwork.com/profile-portraits/c1VSMyr-QCRN7JL5myM-uwgLyuyuZNQbAsYVFUleyEHZDwzlIRPBBpw8ONX1ANP_cV",
    badge: "Top Rated",
    skills: ["MERN Stack", "React", "Node.js"],
    description:
      "I build secure, scalable and modern web applications for startups and growing businesses.",
  },
];

const logos = [
  "Calendly",
  "Semrush",
  "Toast",
  "Coinbase",
  "Zapier",
  "Wayfair",
  "data.ai",
];

const markets = [
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Germany",
  "Netherlands",
  "UAE",
  "Singapore",
  "France",
  "Sweden",
];

export default function HirePage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <main className="min-h-screen bg-white text-gray-950">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#f5f9f6] px-5 pb-20 pt-14 sm:px-8 lg:px-16 lg:pb-28 lg:pt-20">

        {/* Background */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-60 -right-40 h-[550px] w-[550px] rounded-full bg-green-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">

          <div>
            {/* Trust badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                ✓
              </span>
              1M+ jobs completed, rated, and reviewed
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-7xl">
              Hire proven freelancers
              <span className="block text-emerald-600">
                who deliver results.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-500 sm:text-xl">
              Post a job, discover exceptional talent, and get your project
              moving in minutes. Hire confidently with verified profiles,
              reviews, and secure payments.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button className="group rounded-xl bg-gray-950 px-7 py-4 font-semibold text-white shadow-lg transition hover:bg-emerald-600 hover:shadow-emerald-600/20">
                Post a job
                <span className="ml-3 transition group-hover:translate-x-1 inline-block">
                  →
                </span>
              </button>

              <button className="rounded-xl border border-gray-200 bg-white px-7 py-4 font-semibold text-gray-800 transition hover:border-emerald-300 hover:text-emerald-700">
                Browse freelancers
              </button>
            </div>

            {/* Mini trust */}
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Verified talent
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Secure payments
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Flexible contracts
              </span>
            </div>
          </div>

          {/* Hero Search Card */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-emerald-200/30 blur-2xl" />

            <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,.08)] sm:p-8">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Find the right talent
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    What do you need help with?
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-600">
                  ✦
                </div>
              </div>

              {/* Search */}
              <div className="mt-7 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition focus-within:border-emerald-400 focus-within:bg-white">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Search for skills or services..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Popular */}
              <div className="mt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Popular searches
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Web Development",
                    "AI Development",
                    "UI/UX Design",
                    "SEO",
                    "Content Writing",
                  ].map((item) => (
                    <button
                      key={item}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match */}
              <div className="mt-7 rounded-xl bg-gray-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">
                      Smart talent matching
                    </p>
                    <p className="mt-1 font-semibold">
                      Get matched with experts
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          TRUSTED LOGOS
      ===================================================== */}
      <section className="border-b border-gray-100 bg-white px-5 py-9 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <p className="mb-7 text-center text-sm font-medium text-gray-400">
            Trusted by innovative companies around the world
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:justify-between">
            {logos.map((logo) => (
              <div
                key={logo}
                className="text-lg font-bold tracking-tight text-gray-500 transition hover:text-gray-900"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <section className="px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-emerald-600">
              Find your expert
            </p>

            <h2 className="text-4xl font-bold tracking-[-.035em] sm:text-5xl">
              Browse freelancers by category
            </h2>

            <p className="mt-5 text-lg leading-7 text-gray-500">
              Find specialists with the skills and experience you need to
              get your project done right.
            </p>
          </div>

          {/* Category buttons */}
          <div className="mt-10 flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(index)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  activeCategory === index
                    ? "bg-gray-950 text-white shadow-lg"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Specialty cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories[activeCategory].specialties.map(
              ([title, count]) => (
                <div
                  key={title}
                  className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_15px_40px_rgba(16,185,129,.09)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                      {categories[activeCategory].icon}
                    </div>

                    <span className="text-xl text-gray-300 transition group-hover:text-emerald-500">
                      →
                    </span>
                  </div>

                  <h3 className="mt-6 font-bold text-gray-900">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    {count} available
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-7 text-center">
            <button className="font-semibold text-emerald-600 hover:text-emerald-700">
              View more specialties →
            </button>
          </div>
        </div>
      </section>


      {/* =====================================================
          FREELANCER CARDS
      ===================================================== */}
      <section className="bg-[#f7f9f7] px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-emerald-600">
                Top talent
              </p>

              <h2 className="text-4xl font-bold tracking-[-.035em] sm:text-5xl">
                Meet freelancers ready to work
              </h2>
            </div>

            <button className="font-semibold text-emerald-600">
              View all talent →
            </button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {freelancers.map((person) => (
              <div
                key={person.name}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,.08)]"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                    {person.badge}
                  </div>

                  <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:bg-emerald-600 hover:text-white">
                    ♡
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-950">
                        {person.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {person.location}
                      </p>
                    </div>

                    <p className="font-bold text-gray-900">
                      {person.rate}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-900">
                      ★ {person.rating}
                    </span>

                    <span className="text-gray-400">
                      • {person.jobs}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                    {person.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {person.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="mt-6 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-900 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white">
                    View profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-600">
              How work gets done
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-[-.035em] sm:text-5xl">
              Simple by design
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              From posting your job to receiving the final result, everything
              is designed to make hiring easier.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: "✎",
                title: "Tell us what you need",
                text: "Describe your project, goals and requirements. Create a job post in just a few minutes.",
              },
              {
                number: "02",
                icon: "✦",
                title: "Get matched with talent",
                text: "Browse experienced freelancers, compare reviews and choose the perfect person for your project.",
              },
              {
                number: "03",
                icon: "✓",
                title: "Drive real results",
                text: "Collaborate, review work and pay securely as your freelancer turns your idea into reality.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative rounded-3xl border border-gray-200 bg-white p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-600">
                    {step.icon}
                  </div>

                  <span className="text-5xl font-bold text-gray-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =====================================================
          WHY US
      ===================================================== */}
      <section className="bg-gray-950 px-5 py-20 text-white sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-400">
                Why choose us
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-[-.035em] sm:text-5xl">
                One platform.
                <span className="block text-emerald-400">
                  Complete control.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                Hire, manage projects, communicate with freelancers, track
                progress and make secure payments — all from one place.
              </p>

              <button className="mt-8 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-400">
                Start hiring →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["✓", "Verified talent", "Work with professionals with proven experience."],
                ["$", "Payment protection", "Your payment stays protected until work is approved."],
                ["◷", "Project management", "Keep conversations, files and milestones organized."],
                ["∞", "Flexible contracts", "Hire hourly or fixed-price talent for any project."],
              ].map(([icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-emerald-800"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-lg text-emerald-400">
                    {icon}
                  </div>

                  <h3 className="mt-5 font-bold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    {text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-b border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 sm:grid-cols-4">

          {[
            ["1M+", "Jobs completed"],
            ["800K+", "Clients served"],
            ["98%", "Client satisfaction"],
            ["180+", "Countries reached"],
          ].map(([number, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                {number}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {label}
              </p>
            </div>
          ))}

        </div>
      </section>


      {/* =====================================================
          MARKETS
      ===================================================== */}
      <section className="px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-600">
              Global talent
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-[-.035em]">
              Explore freelancer markets
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              Connect with skilled professionals from leading talent markets
              around the world.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {markets.map((market) => (
              <button
                key={market}
                className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Freelancers in {market}
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="px-5 pb-20 sm:px-8 lg:px-16 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-600 px-7 py-16 text-center text-white sm:px-12 sm:py-20">

          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-emerald-100">
              Ready when you are
            </p>

            <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-[-.04em] sm:text-5xl lg:text-6xl">
              The talent your business needs is ready when you are.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
              Post your project today and start working with talented
              professionals who can help you achieve your goals.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="rounded-xl bg-white px-8 py-4 font-semibold text-gray-950 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                Post a job →
              </button>

              <button className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Explore freelancers
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
