const categories = [
  {
    name: "AI Services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    name: "Development & IT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
      </svg>
    ),
  },
  {
    name: "Design & Creative",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h2a7 7 0 0 0 0-10Z" />
        <circle cx="7.5" cy="11" r="1" />
        <circle cx="9" cy="7.5" r="1" />
        <circle cx="14" cy="7" r="1" />
      </svg>
    ),
  },
  {
    name: "Sales & Marketing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 18V9M10 18V5M16 18v-7M22 18V3" />
      </svg>
    ),
  },
  {
    name: "Writing & Translation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 8.5l2 2M14 4h6M17 2v4" />
      </svg>
    ),
  },
  {
    name: "Admin & Support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 9h8M8 13h5M8 16h3" />
      </svg>
    ),
  },
  {
    name: "Finance & Accounting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 8.5c-.7-.7-1.7-1-3-1-1.7 0-3 .9-3 2.2 0 1.4 1.3 2 3 2.3 1.7.3 3 .9 3 2.3 0 1.3-1.3 2.2-3 2.2-1.3 0-2.3-.3-3-1M12 5v14" />
      </svg>
    ),
  },
  {
    name: "Legal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4v16M6 20h12M5 8h14M4 8l-3 6h6l-2-6M20 8l-3 6h6l-3-6" />
      </svg>
    ),
  },
  {
    name: "HR & Training",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11a3 3 0 1 0 0-6M17 14c2.2.5 4 2.5 4 5" />
      </svg>
    ),
  },
  {
    name: "Engineering & Architecture",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 20h18M5 20V9l7-5 7 5v11M8 20v-6h8v6M9 10h6" />
      </svg>
    ),
  },
];








export default function Home() {
  return (
    <main>
      {/* Hero Section */}




      <section>


      </section>


      <section className="relative min-h-[620px] overflow-hidden bg-gray-950">

        {/* =====================================================
      BACKGROUND VIDEO
  ===================================================== */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source
              src="/videos/freelancing-work.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* =====================================================
      DARK OVERLAY
  ===================================================== */}
        <div className="absolute inset-0 bg-gray-950/65" />

        {/* Green cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/75 to-emerald-950/50" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 to-transparent" />

        {/* Decorative glow */}
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />

        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-green-500/10 blur-[100px]" />


        {/* =====================================================
      CONTENT
  ===================================================== */}
        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-10">

          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">

            {/* LEFT CONTENT */}
            <div className="max-w-3xl">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />

                Trusted by 800,000+ clients
              </div>


              {/* Heading */}
              <h1 className="text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">

                Hire talented
                <span className="block text-emerald-400">
                  freelancers.
                </span>

                <span className="block">
                  Build something great.
                </span>

              </h1>


              {/* Description */}
              <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 sm:text-xl">
                Find skilled professionals for design, development, AI,
                marketing, writing and more. Post a project and start
                working with the right talent today.
              </p>


              {/* Buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <button className="group rounded-xl bg-emerald-500 px-7 py-4 font-semibold text-white shadow-[0_10px_35px_rgba(16,185,129,.25)] transition duration-300 hover:-translate-y-1 hover:bg-emerald-400">
                  Post a job

                  <span className="ml-3 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </button>


                <button className="rounded-xl border border-white/25 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20">
                  Browse freelancers
                </button>

              </div>


              {/* Trust points */}
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gray-200">

                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Verified talent
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Secure payments
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Flexible contracts
                </span>

              </div>

            </div>


            {/* =====================================================
          RIGHT GLASS CARD
      ===================================================== */}
            <div className="hidden lg:block">

              <div className="relative mx-auto max-w-md">

                {/* Glow */}
                <div className="absolute -inset-5 rounded-[2rem] bg-emerald-500/20 blur-2xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

                  {/* Card header */}
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-medium text-gray-300">
                        Find your expert
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-white">
                        What do you need?
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-xl text-white shadow-lg">
                      ✦
                    </div>

                  </div>


                  {/* Search */}
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-4">

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

                    <span className="text-sm text-gray-400">
                      Search skills or services...
                    </span>

                  </div>


                  {/* Categories */}
                  <div className="mt-5 grid grid-cols-2 gap-2">

                    {[
                      "Development",
                      "AI & Automation",
                      "Design",
                      "Marketing",
                      "Writing",
                      "Data",
                    ].map((item) => (

                      <div
                        key={item}
                        className="group rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
                      >

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs text-emerald-400">
                            ✦
                          </div>

                          <span className="text-xs font-medium text-gray-200">
                            {item}
                          </span>

                        </div>

                      </div>

                    ))}

                  </div>


                  {/* Bottom */}
                  <div className="mt-5 rounded-xl bg-emerald-500 p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs text-emerald-100">
                          Smart matching
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                          Find the right talent faster
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-600">
                        →
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>





      <section className="border-y border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Trusted by 800,000 clients
            </h2>
          </div>

          {/* Logos */}
          <div className="grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-7 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-8">

            {/* Airbnb */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/airbnb-logo.svg"
                alt="Airbnb"
                className="h-6 w-auto max-w-[85px] object-contain"
              />
            </div>

            {/* Databricks */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/databricks-logo.svg"
                alt="Databricks"
                className="h-6 w-auto max-w-[100px] object-contain"
              />
            </div>

            {/* Cloudflare */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/cloudflare-logo.svg"
                alt="Cloudflare"
                className="h-6 w-auto max-w-[105px] object-contain"
              />
            </div>

            {/* Scale AI */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/scale-ai-logo.svg"
                alt="Scale AI"
                className="h-6 w-auto max-w-[90px] object-contain"
              />
            </div>

            {/* Microsoft */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/microsoft-logo.svg"
                alt="Microsoft"
                className="h-6 w-auto max-w-[95px] object-contain"
              />
            </div>

            {/* Grammarly */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/grammarly-logo.svg"
                alt="Grammarly"
                className="h-6 w-auto max-w-[100px] object-contain"
              />
            </div>

            {/* BambooHR */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/bamboohr-logo.svg"
                alt="BambooHR"
                className="h-6 w-auto max-w-[105px] object-contain"
              />
            </div>

            {/* Shutterstock */}
            <div className="flex h-10 w-full items-center justify-center">
              <img
                src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/shutterstock-logo.svg"
                alt="Shutterstock"
                className="h-6 w-auto max-w-[105px] object-contain"
              />
            </div>

          </div>
        </div>
      </section>








      <section className="relative overflow-hidden bg-[#f7f9f7] px-5 py-20 sm:px-8 lg:px-16">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-green-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Explore top categories
            </div>

            <h2 className="text-4xl font-bold tracking-[-0.03em] text-gray-950 sm:text-5xl">
              Find freelancers for
              <span className="text-emerald-600"> every type of work</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
              Connect with skilled professionals who can help bring your ideas,
              projects, and business goals to life.
            </p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)]"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Number */}
                <div className="absolute right-5 top-5 text-xs font-semibold text-gray-200 transition-colors group-hover:text-emerald-200">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-700 ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-600/20">
                  <div className="h-7 w-7">{category.icon}</div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="pr-5 text-[17px] font-semibold leading-6 text-gray-900 transition-colors group-hover:text-emerald-700">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-gray-400">
                    Find skilled experts
                  </p>

                  {/* Arrow */}
                  <div className="mt-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="font-semibold text-gray-900">
                Can't find what you're looking for?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Browse thousands of specialized freelancers.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/20">
              Explore all services
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>










    </main>
  );
}
