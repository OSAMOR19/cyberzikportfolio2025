"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = {
  project: [
    {
      name: "Starter",
      price: "$1,500",
      label: "per project",
      description:
        "Perfect for landing pages, small business sites, or single-page applications.",
      features: [
        "Responsive landing page or portfolio",
        "Up to 5 pages",
        "Mobile-first design",
        "Basic SEO setup",
        "Contact form integration",
        "1 round of revisions",
        "2-week delivery",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Growth",
      price: "$4,000",
      label: "per project",
      description:
        "Full-stack web applications with custom features, databases, and API integrations.",
      features: [
        "Everything in Starter",
        "Custom web application",
        "Up to 15 pages / views",
        "Database & API integration",
        "User authentication",
        "Admin dashboard",
        "Payment integration",
        "3 rounds of revisions",
        "4-week delivery",
      ],
      cta: "Start Building",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      label: "let's discuss",
      description:
        "Complex platforms, blockchain dApps, mobile apps, and multi-service architectures.",
      features: [
        "Everything in Growth",
        "Blockchain / Web3 integration",
        "Mobile app (iOS & Android)",
        "Complex architecture design",
        "CI/CD pipeline setup",
        "Performance optimization",
        "Ongoing technical consultation",
        "Unlimited revisions",
        "Custom timeline",
      ],
      cta: "Book a Call",
      popular: false,
    },
  ],
  monthly: [
    {
      name: "Part-Time",
      price: "$2,000",
      label: "per month",
      description:
        "20 hours/week of dedicated development time for ongoing projects and maintenance.",
      features: [
        "20 hrs/week dedicated time",
        "Bug fixes & maintenance",
        "Feature development",
        "Code reviews",
        "Weekly progress reports",
        "Slack/Discord support",
        "1-month minimum",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Full-Time",
      price: "$4,500",
      label: "per month",
      description:
        "40 hours/week of full-time development, acting as an embedded member of your team.",
      features: [
        "Everything in Part-Time",
        "40 hrs/week full commitment",
        "Architecture planning",
        "Team collaboration",
        "Sprint planning & standups",
        "Priority support",
        "Performance optimization",
        "Technical documentation",
        "3-month minimum",
      ],
      cta: "Let's Talk",
      popular: true,
    },
    {
      name: "Advisory",
      price: "$1,000",
      label: "per month",
      description:
        "Strategic technical consultation, code audits, and architecture reviews.",
      features: [
        "8 hrs/month consultation",
        "Architecture reviews",
        "Code audits & feedback",
        "Technology recommendations",
        "Team mentoring sessions",
        "Async communication",
        "Monthly summary report",
      ],
      cta: "Book a Call",
      popular: false,
    },
  ],
};

export default function Page() {
  const [billing, setBilling] = useState<"project" | "monthly">("project");

  return (
    <section className="relative overflow-hidden pt-40 pb-28">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#f5a764]/15 blur-[150px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-400/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-yellow-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)]" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <span className="rounded-full border border-[#f5a764]/40 bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#f5a764] backdrop-blur-xl">
          Pricing
        </span>

        <h1 className="mt-8 max-w-5xl font-orbitron text-5xl font-bold leading-tight text-white md:text-7xl">
          Transparent Pricing
          <br />
          For Modern Digital Products
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
          Whether you&apos;re launching your first startup or scaling an
          enterprise platform, I build high-performance experiences tailored to
          your business goals.
        </p>

        {/* Toggle */}
        <div className="mt-14 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
          <div className="flex">
            <button
              onClick={() => setBilling("project")}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
                billing === "project"
                  ? "bg-[#f5a764] text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              One-Time Project
            </button>

            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 ${
                billing === "monthly"
                  ? "bg-[#f5a764] text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly Retainer
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans[billing].map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[32px] border p-8 text-left transition-all duration-500 backdrop-blur-xl ${
                plan.popular
                  ? "border-[#f5a764]/60 bg-white/10 shadow-[0_0_60px_rgba(245,167,100,.12)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5a764] px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
                    <Sparkles size={14} />
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="font-orbitron text-xl font-bold text-white">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-orbitron text-4xl font-bold text-[#f5a764]">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.label}</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-400">
                {plan.description}
              </p>

              <div className="my-8 h-px w-full bg-white/10" />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-[#f5a764]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/#contact"
                className={`mt-8 flex items-center justify-center gap-2 rounded-full py-4 font-bold transition duration-300 hover:scale-[1.02] ${
                  plan.popular
                    ? "bg-[#f5a764] text-black"
                    : "border border-white/20 bg-white/5 text-white hover:border-[#f5a764] hover:bg-white/10"
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-24 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { number: "40+", label: "Projects" },
            { number: "15+", label: "Clients" },
            { number: "5+", label: "Years Experience" },
            { number: "99%", label: "Client Satisfaction" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-[#f5a764]/40 hover:bg-white/10"
            >
              <h2 className="font-orbitron text-4xl font-bold text-[#f5a764]">
                {item.number}
              </h2>
              <p className="mt-3 text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col gap-5 sm:flex-row">
          <Link
            href="/#contact"
            className="group flex items-center justify-center gap-3 rounded-full bg-[#f5a764] px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            Start a Project
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/#contact"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:border-[#f5a764] hover:bg-white/10"
          >
            Book Discovery Call
          </Link>
        </div>
      </div>
    </section>
  );
}