export default function Contact() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
              Contact Us
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              We&apos;d love to
              <span className="text-indigo-600"> hear from you.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have a question, need help with a project, or want to learn more
              about our platform? Send us a message and our team will get back
              to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Get In Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Let&apos;s talk
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Whether you&apos;re a client looking for a freelancer or a
              freelancer looking for opportunities, we&apos;re here to help.
            </p>

            <div className="mt-8 space-y-6">
              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  ✉
                </div>

                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a
                    href="mailto:support@example.com"
                    className="mt-1 block text-sm text-gray-600 transition hover:text-indigo-600"
                  >
                    support@example.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  ☎
                </div>

                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <a
                    href="tel:+911234567890"
                    className="mt-1 block text-sm text-gray-600 transition hover:text-indigo-600"
                  >
                    +91 12345 67890
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  ⌖
                </div>

                <div>
                  <h3 className="font-semibold">Office</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your Company Address
                    <br />
                    India
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  ◷
                </div>

                <div>
                  <h3 className="font-semibold">Working Hours</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Monday - Friday
                    <br />
                    9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">
                  Send us a message
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Fill out the form below and we&apos;ll get back to you as
                  soon as possible.
                </p>
              </div>

              <form className="space-y-6">
                {/* Name + Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 12345 67890"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Subject
                    </label>

                    <select
                      id="subject"
                      name="subject"
                      defaultValue=""
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      <option value="general">General Question</option>
                      <option value="project">Project Help</option>
                      <option value="freelancer">Freelancer Support</option>
                      <option value="client">Client Support</option>
                      <option value="payment">Payment Issue</option>
                      <option value="technical">Technical Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <label
                    htmlFor="privacy"
                    className="text-sm leading-6 text-gray-600"
                  >
                    I agree to the processing of my information for the
                    purpose of responding to my inquiry.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Support Cards */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Need Help?
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              We&apos;re here to support you
            </h2>

            <p className="mt-4 text-gray-600">
              Choose the option that best matches what you need.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Client Support */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600">
                ?
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Client Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Need help finding a freelancer, posting a project, or
                managing your project?
              </p>

              <a
                href="mailto:support@example.com"
                className="mt-5 inline-flex font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Contact Support →
              </a>
            </div>

            {/* Freelancer Support */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl text-purple-600">
                ★
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Freelancer Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Get help with your profile, proposals, projects, payments,
                and account.
              </p>

              <a
                href="mailto:support@example.com"
                className="mt-5 inline-flex font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Get Help →
              </a>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl text-green-600">
                @
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Business Inquiries
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Interested in partnerships, integrations, or working with
                our platform?
              </p>

              <a
                href="mailto:business@example.com"
                className="mt-5 inline-flex font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Talk to Us →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {[
            {
              question: "How quickly will I receive a response?",
              answer:
                "Our support team typically responds during business hours. Response times may vary depending on the type and complexity of your request.",
            },
            {
              question: "Can I contact you about a payment issue?",
              answer:
                "Yes. Select Payment Issue in the contact form and provide the relevant details so our support team can assist you.",
            },
            {
              question: "Can freelancers contact support?",
              answer:
                "Absolutely. Freelancers can contact us regarding profiles, proposals, projects, payments, account issues, and other platform-related questions.",
            },
            {
              question: "Can businesses contact you for partnerships?",
              answer:
                "Yes. For partnerships, integrations, or business-related inquiries, use the Business Inquiries option above.",
            },
          ].map((faq) => (
            <details
              key={faq.question}
              className="group p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {faq.question}

                <span className="text-xl text-indigo-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Still have questions?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Send us a message and our team will help you find the right
            solution.
          </p>

          <a
            href="#contact-form"
            className="mt-8 inline-flex rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </main>
  );
}