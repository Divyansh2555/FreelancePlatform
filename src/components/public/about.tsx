export default function About() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
              About Our Platform
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Great work starts with
              <span className="text-indigo-600"> great people.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              We connect talented freelancers with businesses and individuals
              looking for quality work. Our goal is to make finding talent,
              managing projects, and getting work done simple and reliable.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/freelancers"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Find a Freelancer
              </a>

              <a
                href="/signup"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Start Freelancing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Who We Are
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A better way to work together
            </h2>

            <p className="mt-6 leading-7 text-gray-600">
              Our platform brings clients and skilled professionals together
              in one place. Whether you need a website, a logo, content,
              marketing, software development, or another professional
              service, you can find the right talent for your project.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Freelancers can showcase their skills, discover new
              opportunities, build their reputation, and grow their careers
              while working with clients from anywhere.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-indigo-50 p-6">
              <div className="text-3xl font-bold text-indigo-600">10K+</div>
              <p className="mt-2 text-sm text-gray-600">
                Skilled Freelancers
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-6">
              <div className="text-3xl font-bold text-purple-600">5K+</div>
              <p className="mt-2 text-sm text-gray-600">
                Projects Completed
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-6">
              <div className="text-3xl font-bold text-blue-600">2K+</div>
              <p className="mt-2 text-sm text-gray-600">Happy Clients</p>
            </div>

            <div className="rounded-2xl bg-green-50 p-6">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <p className="mt-2 text-sm text-gray-600">
                Service Categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Our Mission
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
            Making professional work accessible to everyone
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            We believe talented people should have access to opportunities,
            regardless of where they live. At the same time, businesses should
            be able to find the right skills without unnecessary barriers.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Simple from start to finish
          </h2>

          <p className="mt-4 text-gray-600">
            We make the process easy for both clients and freelancers.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Post a Project",
              description:
                "Tell freelancers what you need, your requirements, timeline, and budget.",
            },
            {
              number: "02",
              title: "Choose Your Freelancer",
              description:
                "Review profiles, skills, proposals, ratings, and portfolios to find the right professional.",
            },
            {
              number: "03",
              title: "Get the Work Done",
              description:
                "Collaborate, communicate, review the work, and complete your project with confidence.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                {item.number}
              </div>

              <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>

              <p className="mt-3 leading-7 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              What You Can Find
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Skills for almost every project
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Web Development",
              "Mobile App Development",
              "UI/UX Design",
              "Graphic Design",
              "Content Writing",
              "Digital Marketing",
              "Video Editing",
              "AI & Automation",
            ].map((service) => (
              <div
                key={service}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
              >
                <h3 className="font-semibold">{service}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Find experienced professionals for your project.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Built around trust and quality
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              We want every interaction between clients and freelancers to be
              professional, transparent, and straightforward.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                title: "Verified Talent",
                description:
                  "Discover professionals with profiles, portfolios, skills, and reviews.",
              },
              {
                title: "Transparent Communication",
                description:
                  "Keep project requirements, communication, and expectations clear.",
              },
              {
                title: "Secure Payments",
                description:
                  "Designed to provide a safer payment experience for clients and freelancers.",
              },
              {
                title: "Reviews & Reputation",
                description:
                  "Build trust through ratings, reviews, completed projects, and professional profiles.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-gray-200 p-5"
              >
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-600">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">
              Our Values
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              What we believe in
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                title: "Trust",
                description:
                  "We believe strong professional relationships start with trust.",
              },
              {
                title: "Quality",
                description:
                  "We aim to create an environment where quality work gets recognized.",
              },
              {
                title: "Transparency",
                description:
                  "Clear communication and expectations lead to better projects.",
              },
              {
                title: "Opportunity",
                description:
                  "Everyone deserves a fair opportunity to showcase their skills.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-white/10 p-6 text-white ring-1 ring-white/20"
              >
                <h3 className="text-lg font-semibold">{value.title}</h3>

                <p className="mt-3 text-sm leading-6 text-indigo-100">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Whether you need talented professionals or want to grow your
            freelance career, your next opportunity starts here.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/freelancers"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Find a Freelancer
            </a>

            <a
              href="/signup"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Join as a Freelancer
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}