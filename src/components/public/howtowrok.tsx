export default function HowItWorks() {
  const clientSteps = [
    {
      number: "01",
      title: "Create Your Project",
      description:
        "Tell us what you need, add your project requirements, budget, deadline, and any important details.",
    },
    {
      number: "02",
      title: "Receive Proposals",
      description:
        "Skilled freelancers can discover your project and send proposals based on your requirements.",
    },
    {
      number: "03",
      title: "Compare Freelancers",
      description:
        "Review freelancer profiles, portfolios, skills, ratings, reviews, pricing, and proposals.",
    },
    {
      number: "04",
      title: "Hire the Right Freelancer",
      description:
        "Choose the professional who best matches your project requirements and expectations.",
    },
    {
      number: "05",
      title: "Work Together",
      description:
        "Communicate with your freelancer, share files, discuss progress, and keep everything organized.",
    },
    {
      number: "06",
      title: "Review & Complete",
      description:
        "Review the final work, approve the project, and leave a review based on your experience.",
    },
  ];

  const freelancerSteps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Showcase your skills, experience, portfolio, services, and professional background.",
    },
    {
      number: "02",
      title: "Find Projects",
      description:
        "Browse projects that match your skills, experience, interests, and preferred budget.",
    },
    {
      number: "03",
      title: "Send a Proposal",
      description:
        "Create a personalized proposal explaining how you can help and why you're a good fit.",
    },
    {
      number: "04",
      title: "Get Hired",
      description:
        "Discuss project details with the client and get selected for projects that match your expertise.",
    },
    {
      number: "05",
      title: "Deliver Great Work",
      description:
        "Work with the client, meet deadlines, communicate clearly, and deliver quality results.",
    },
    {
      number: "06",
      title: "Build Your Reputation",
      description:
        "Complete projects, receive reviews, grow your profile, and unlock new opportunities.",
    },
  ];

  const benefits = [
    {
      icon: "✓",
      title: "Simple Process",
      description:
        "Everything you need to manage your freelance projects in one place.",
    },
    {
      icon: "⚡",
      title: "Find Work Faster",
      description:
        "Discover relevant projects and connect with clients looking for your skills.",
    },
    {
      icon: "★",
      title: "Build Trust",
      description:
        "Profiles, portfolios, ratings, and reviews help create better professional connections.",
    },
    {
      icon: "🔒",
      title: "Secure Experience",
      description:
        "Designed to make communication, collaboration, and payments more straightforward.",
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            How It Works
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            From idea to
            <span className="text-indigo-600"> completed project.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Whether you&apos;re hiring a freelancer or looking for your next
            project, our platform makes the entire process simple,
            transparent, and easy to manage.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/post-project"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Post a Project
            </a>

            <a
              href="/freelancers"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Find Work
            </a>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            ["01", "Post", "Create a project or find an opportunity."],
            ["02", "Connect", "Meet the right client or freelancer."],
            ["03", "Collaborate", "Work together and communicate easily."],
            ["04", "Complete", "Deliver work and build your reputation."],
          ].map(([number, title, description]) => (
            <div key={number} className="text-center">
              <div className="text-sm font-bold text-indigo-600">
                {number}
              </div>

              <h3 className="mt-2 font-semibold">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* For Clients */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              For Clients
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Hire the right talent for your project
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              From small tasks to long-term projects, find professionals with
              the skills and experience you need.
            </p>

            <a
              href="/post-project"
              className="mt-8 inline-flex rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Post Your Project →
            </a>
          </div>

          <div className="space-y-6">
            {clientSteps.map((step) => (
              <div
                key={step.number}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-8"
              >
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>

                    <p className="mt-3 leading-7 text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Freelancer Section */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="order-2 space-y-6 lg:order-1">
              {freelancerSteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-purple-200 hover:shadow-md sm:p-8"
                >
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 font-bold text-white">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        {step.title}
                      </h3>

                      <p className="mt-3 leading-7 text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-1 lg:sticky lg:top-24 lg:order-2">
              <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                For Freelancers
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn your skills into opportunities
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Build your professional profile, find projects that match your
                expertise, work with clients, and grow your freelance career.
              </p>

              <a
                href="/signup"
                className="mt-8 inline-flex rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Start Freelancing →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Why Our Platform
          </span>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Everything you need to work better
          </h2>

          <p className="mt-4 text-gray-600">
            A simple experience designed for both clients and freelancers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-600">
                {benefit.icon}
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Journey */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-200">
              Project Journey
            </span>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              One simple journey from start to finish
            </h2>

            <p className="mt-5 leading-7 text-indigo-100">
              Keep your project organized while you move from the initial idea
              to successful completion.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="hidden h-px bg-white/20 lg:absolute lg:left-16 lg:right-16 lg:top-7 lg:block" />

            <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["01", "Discover"],
                ["02", "Connect"],
                ["03", "Hire"],
                ["04", "Deliver"],
                ["05", "Review"],
              ].map(([number, title]) => (
                <div key={number} className="text-center">
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-indigo-600 bg-white font-bold text-indigo-600">
                    {number}
                  </div>

                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            FAQ
          </span>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {[
            {
              question: "How do I hire a freelancer?",
              answer:
                "Create a project with your requirements, review incoming proposals, compare freelancer profiles and portfolios, and choose the professional who fits your project.",
            },
            {
              question: "How can I find freelance projects?",
              answer:
                "Create your freelancer profile, add your skills and portfolio, browse available projects, and submit proposals to projects that match your expertise.",
            },
            {
              question: "Can I communicate with a freelancer before hiring?",
              answer:
                "Yes. You can discuss project requirements and expectations before making a hiring decision.",
            },
            {
              question: "How do reviews work?",
              answer:
                "After a completed project, clients and freelancers can share feedback about their experience, helping build trust within the marketplace.",
            },
          ].map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold">
                {faq.question}

                <span className="text-xl text-indigo-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 leading-7 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Start your next project or turn your skills into your next
            opportunity.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/post-project"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Post a Project
            </a>

            <a
              href="/signup"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Join as Freelancer
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}