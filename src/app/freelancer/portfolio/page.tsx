"use client";

import Link from "next/link";

const portfolioItems = [
  {
    id: 1,
    title: "Modern Business Website",
    category: "Web Design",
    description:
      "A clean and responsive business website designed for a modern brand.",
  },
  {
    id: 2,
    title: "E-Commerce Store",
    category: "Development",
    description:
      "A responsive online store with product browsing and a simple shopping experience.",
  },
  {
    id: 3,
    title: "Dashboard UI Design",
    category: "UI/UX Design",
    description:
      "A professional dashboard interface focused on usability and clean visual design.",
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              My Portfolio
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Showcase your best work and projects.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Project
          </button>
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Placeholder Image */}
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <span className="text-5xl font-bold text-white/90">
                    {item.title.charAt(0)}
                  </span>
                </div>

                <div className="p-5">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {item.category}
                  </span>

                  <h2 className="mt-3 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href="#"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View Project →
                    </Link>

                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No portfolio projects yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your first project to showcase your work.
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
