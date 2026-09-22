export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About Our Freelancing Platform
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            We connect talented freelancers with businesses and individuals
            looking for quality work, trusted professionals, and creative
            solutions.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              What We Do
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Our platform makes it simple for clients to find skilled
              freelancers and for professionals to discover exciting
              projects. From web development and graphic design to marketing,
              writing, video editing, and more, our marketplace brings
              opportunities together in one place.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              We aim to make freelancing easier, transparent, and accessible
              for everyone.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900">
              Why Choose Us?
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <h4 className="font-semibold text-blue-600">
                  🚀 Easy to Use
                </h4>
                <p className="mt-1 text-gray-600">
                  Find projects, hire freelancers, and manage your work with
                  an easy-to-use platform.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-600">
                  💼 Professional Talent
                </h4>
                <p className="mt-1 text-gray-600">
                  Connect with freelancers offering skills across different
                  industries.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-600">
                  🔒 Secure & Reliable
                </h4>
                <p className="mt-1 text-gray-600">
                  We focus on creating a trusted environment for clients and
                  freelancers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Mission
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Our mission is to build a platform where skills meet opportunity.
            We want freelancers to grow their careers while helping clients
            find the right people for their projects.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-gray-900 px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to Start Freelancing?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Join our community, showcase your skills, find new projects, and
            start building your freelance career.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700">
              Find Projects
            </button>

            <button className="rounded-lg border border-gray-600 px-6 py-3 font-semibold transition hover:bg-gray-800">
              Hire a Freelancer
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
