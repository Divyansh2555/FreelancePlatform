"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Tumhare existing imports agar hain to unko yahin rakho.

// =====================================================
// TUMHARA EXISTING categories ARRAY YAHAN SE START HOGA
// =====================================================

const categories = [
  // TUMHARA EXISTING categories CODE
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accessToken =
      localStorage.getItem("access_token");

    const role =
      localStorage.getItem("role");

    // =================================================
    // USER LOGIN NAHI HAI
    // Public homepage normally show hogi
    // =================================================
    if (!accessToken || !role) {
      return;
    }

    // =================================================
    // CLIENT
    // =================================================
    if (role === "client") {
      router.replace("/client");
      return;
    }

    // =================================================
    // FREELANCER
    // =================================================
    if (role === "freelancer") {
      router.replace("/freelancer");
      return;
    }

    // =================================================
    // ADMIN
    // =================================================
    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    // =================================================
    // INVALID ROLE
    // =================================================
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  }, [router]);

  return (




    <main className="bg-white text-gray-900">

      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">

            <div className="text-white">
              <span className="mb-5 inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
                🚀 The future of freelancing
              </span>

              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Find the right
                <span className="text-blue-400"> freelancer </span>
                for your next project.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Connect with talented developers, designers and digital
                professionals. Hire experts or showcase your skills and
                start earning today.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-500">
                  Find Freelancers
                </button>

                <button className="rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Become a Freelancer
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-300">
                <div>
                  <strong className="block text-2xl text-white">50K+</strong>
                  Freelancers
                </div>

                <div>
                  <strong className="block text-2xl text-white">100K+</strong>
                  Projects
                </div>

                <div>
                  <strong className="block text-2xl text-white">4.9/5</strong>
                  Client Rating
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative hidden lg:block">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                <div className="rounded-2xl bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Top Freelancer</p>
                      <h3 className="mt-1 text-xl font-bold">
                        Alex Johnson
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                      👨‍💻
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                      React
                    </span>
                    <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                      Next.js
                    </span>
                    <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                      Node.js
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-xl font-bold">$25/hr</p>
                    </div>

                    <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          VIDEO HERO SECTION
      ========================== */}
      <section className="relative min-h-[620px] overflow-hidden bg-gray-950">

        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source src="/videos/freelancing.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-6 lg:px-8">
          <div className="max-w-2xl text-white">

            <span className="rounded-full bg-blue-600/20 px-4 py-2 text-sm text-blue-300">
              Build. Hire. Grow.
            </span>

            <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
              Your ideas deserve
              <span className="text-blue-400"> great talent.</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              From websites and mobile apps to AI, design and marketing,
              find professionals who can turn your ideas into reality.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100">
                Explore Talent
              </button>

              <button className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Post a Project
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          TRUSTED COMPANIES
      ========================== */}
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
            Trusted by businesses and startups worldwide
          </p>

          <div className="mt-10 grid grid-cols-2 gap-8 text-center text-xl font-bold text-gray-400 sm:grid-cols-3 lg:grid-cols-6">
            <span>Microsoft</span>
            <span>Google</span>
            <span>Amazon</span>
            <span>Adobe</span>
            <span>Stripe</span>
            <span>Shopify</span>
          </div>

        </div>
      </section>


      {/* =========================
          CATEGORIES
      ========================== */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-blue-600">
              EXPLORE SERVICES
            </span>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Everything you need to build your next project
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Find skilled professionals across the most popular digital
              services.
            </p>
          </div>


          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: "💻",
                title: "Web Development",
                text: "Websites, SaaS platforms and web applications."
              },
              {
                icon: "📱",
                title: "App Development",
                text: "Build modern iOS and Android applications."
              },
              {
                icon: "🎨",
                title: "UI/UX Design",
                text: "Beautiful interfaces and user experiences."
              },
              {
                icon: "🤖",
                title: "AI & Automation",
                text: "AI solutions, chatbots and business automation."
              },
              {
                icon: "📈",
                title: "Digital Marketing",
                text: "SEO, social media and performance marketing."
              },
              {
                icon: "✍️",
                title: "Content Writing",
                text: "Blogs, copywriting and professional content."
              },
              {
                icon: "🎬",
                title: "Video & Animation",
                text: "Editing, motion graphics and creative videos."
              },
              {
                icon: "🛠️",
                title: "Other Services",
                text: "Find experts for your unique requirements."
              }
            ].map((category) => (
              <div
                key={category.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-600">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {category.title}
                </h3>

                <p className="mt-3 leading-6 text-gray-600">
                  {category.text}
                </p>

                <button className="mt-5 text-sm font-semibold text-blue-600">
                  Explore →
                </button>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =========================
          CTA
      ========================== */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center text-white">

          <h2 className="text-4xl font-bold sm:text-5xl">
            Ready to bring your idea to life?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Join thousands of clients and freelancers already building
            amazing things on Codemofrelancing.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-7 py-4 font-bold text-blue-600 hover:bg-gray-100">
              Start a Project
            </button>

            <button className="rounded-xl border border-white/40 px-7 py-4 font-bold text-white hover:bg-blue-700">
              Join as Freelancer
            </button>
          </div>

        </div>
      </section>

    </main>







  );
}
