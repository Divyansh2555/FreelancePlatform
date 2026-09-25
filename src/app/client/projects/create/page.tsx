"use client";

import { FormEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type FormData = {
  title: string;
  description: string;
  category: string;
  budget_type: "fixed" | "hourly";
  budget_min: string;
  budget_max: string;
  experience_level: "beginner" | "intermediate" | "expert";
  deadline: string;
  location: string;
};

const initialForm: FormData = {
  title: "",
  description: "",
  category: "",
  budget_type: "fixed",
  budget_min: "",
  budget_max: "",
  experience_level: "intermediate",
  deadline: "",
  location: "",
};

function getApiError(data: any): string {
  if (!data) {
    return "Failed to create project.";
  }

  // FastAPI string error
  if (typeof data.detail === "string") {
    return data.detail;
  }

  // FastAPI validation errors
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item: any) => {
        if (typeof item === "string") {
          return item;
        }

        if (item?.msg) {
          const location = Array.isArray(item.loc)
            ? item.loc.join(" → ")
            : "";

          return location
            ? `${location}: ${item.msg}`
            : item.msg;
        }

        return JSON.stringify(item);
      })
      .join("\n");
  }

  // Object error
  if (typeof data.detail === "object") {
    return JSON.stringify(data.detail);
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return "Failed to create project.";
}

export default function PostProjectPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // =========================
      // CHECK LOGIN
      // =========================

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please login first."
        );
      }

      // =========================
      // FRONTEND VALIDATION
      // =========================

      if (!form.title.trim()) {
        throw new Error("Project title is required.");
      }

      if (!form.description.trim()) {
        throw new Error(
          "Project description is required."
        );
      }

      if (!form.category.trim()) {
        throw new Error("Category is required.");
      }

      // =========================
      // BUDGET VALIDATION
      // =========================

      const budgetMin =
        form.budget_min.trim() === ""
          ? null
          : Number(form.budget_min);

      const budgetMax =
        form.budget_max.trim() === ""
          ? null
          : Number(form.budget_max);

      if (
        budgetMin !== null &&
        (Number.isNaN(budgetMin) || budgetMin < 0)
      ) {
        throw new Error(
          "Minimum budget must be a valid positive number."
        );
      }

      if (
        budgetMax !== null &&
        (Number.isNaN(budgetMax) || budgetMax < 0)
      ) {
        throw new Error(
          "Maximum budget must be a valid positive number."
        );
      }

      if (
        budgetMin !== null &&
        budgetMax !== null &&
        budgetMin > budgetMax
      ) {
        throw new Error(
          "Minimum budget cannot be greater than maximum budget."
        );
      }

      // =========================
      // DEADLINE
      // =========================

      let deadline: string | null = null;

      if (form.deadline) {
        const deadlineDate = new Date(form.deadline);

        if (Number.isNaN(deadlineDate.getTime())) {
          throw new Error(
            "Please select a valid deadline."
          );
        }

        deadline = deadlineDate.toISOString();
      }

      // =========================
      // REQUEST PAYLOAD
      // =========================

      const payload = {
        title: form.title.trim(),

        description: form.description.trim(),

        category: form.category.trim(),

        budget_type: form.budget_type,

        budget_min: budgetMin,

        budget_max: budgetMax,

        experience_level: form.experience_level,

        deadline,

        location: form.location.trim() || null,
      };

      console.log(
        "Creating project with payload:",
        payload
      );

      // =========================
      // CREATE PROJECT
      // =========================

      const response = await fetch(
        `${API_URL}/api/v1/projects/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      // =========================
      // RESPONSE
      // =========================

      let data: any = null;

      const contentType =
        response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          detail: text,
        };
      }

      console.log(
        "Create project response:",
        data
      );

      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {
        throw new Error(
          getApiError(data)
        );
      }

      // =========================
      // SUCCESS
      // =========================

      setSuccess(
        "Project posted successfully!"
      );

      setForm({
        ...initialForm,
      });

    } catch (err) {
      console.error(
        "Create project error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while creating the project."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-8">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Client Workspace
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Post a Project
          </h1>

          <p className="mt-2 text-slate-600">
            Tell freelancers what you need and find
            the right person for your project.
          </p>
        </div>

        {/* =========================
            SUCCESS
        ========================== */}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-700">
              {success}
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            FORM
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >

          {/* =========================
              PROJECT INFORMATION
          ========================== */}

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Project Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide basic information about your project.
            </p>
          </div>

          <div className="mt-6 space-y-6">

            {/* TITLE */}

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Project Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Build a modern business website"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Project Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={7}
                placeholder="Describe your project, requirements, features, goals, and deliverables..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

          </div>

          {/* =========================
              BUDGET
          ========================== */}

          <div className="mt-10 border-t border-slate-100 pt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Budget
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set the budget you are willing to pay.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">

              {/* BUDGET TYPE */}

              <div>
                <label
                  htmlFor="budget_type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Budget Type
                </label>

                <select
                  id="budget_type"
                  name="budget_type"
                  value={form.budget_type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="fixed">
                    Fixed
                  </option>

                  <option value="hourly">
                    Hourly
                  </option>
                </select>
              </div>

              {/* MINIMUM */}

              <div>
                <label
                  htmlFor="budget_min"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Minimum Budget
                </label>

                <input
                  id="budget_min"
                  name="budget_min"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget_min}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* MAXIMUM */}

              <div>
                <label
                  htmlFor="budget_max"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Maximum Budget
                </label>

                <input
                  id="budget_max"
                  name="budget_max"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget_max}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </div>

          {/* =========================
              REQUIREMENTS
          ========================== */}

          <div className="mt-10 border-t border-slate-100 pt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Requirements
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* EXPERIENCE */}

              <div>
                <label
                  htmlFor="experience_level"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Experience Level
                </label>

                <select
                  id="experience_level"
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="expert">
                    Expert
                  </option>
                </select>
              </div>

              {/* DEADLINE */}

              <div>
                <label
                  htmlFor="deadline"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Deadline
                </label>

                <input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* LOCATION */}

            <div className="mt-6">

              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Remote, India, USA"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>
          </div>

          {/* =========================
              SUBMIT
          ========================== */}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Posting Project..."
                : "Post Project"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}
