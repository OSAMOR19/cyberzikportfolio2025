"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PixelSnow from "@/components/PixelSnow";

const plans = {
  project: [
    {
      name: "Starter",
      icon: <Zap size={24} />,
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
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Growth",
      icon: <Rocket size={24} />,
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
      gradient: "from-[#f5a764]/30 to-orange-600/20",
      iconBg: "bg-[#f5a764]/20 text-[#f5a764]",
    },
    {
      name: "Enterprise",
      icon: <Shield size={24} />,
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
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/20 text-purple-400",
    },
  ],
  monthly: [
    {
      name: "Part-Time",
      icon: <Zap size={24} />,
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
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Full-Time",
      icon: <Rocket size={24} />,
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
      gradient: "from-[#f5a764]/30 to-orange-600/20",
      iconBg: "bg-[#f5a764]/20 text-[#f5a764]",
    },
    {
      name: "Advisory",
      icon: <Shield size={24} />,
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
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/20 text-purple-400",
    },
  ],
};

export default function Page() {
  const [billing, setBilling] = useState<"project" | "monthly">("project");

  return (
    <>
      {/* Background - same as homepage */}
      <div className="fixed inset-0 -z-10 bg-black">
        <PixelSnow
          color="white"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={1000}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <Navbar />

        <section className="relative overflow-hidden pt-32 pb-28">
          {/* Accent Glows */}
          <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
            <div className="absolute left-1/2 top-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f5a764]/10 blur-[200px]" />
            <div className="absolute -right-32 top-40 h-[400px] w-[400px] rounded-full bg-orange-500/8 blur-[160px]" />
            <div className="absolute -left-32 bottom-20 h-[400px] w-[400px] rounded-full bg-yellow-500/8 blur-[160px]" />
          </div>

          <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
            

            {/* Heading */}
            <h1 className="mt-8 max-w-5xl font-orbitron text-4xl font-bold leading-tight text-white sm:text-5xl md:text-7xl">
              Invest In{" "}
              <span className="bg-gradient-to-r from-[#f5a764] via-[#f7c794] to-[#f5a764] bg-clip-text text-transparent">
                Premium
              </span>
              <br />
              Digital Experiences
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              Whether you&apos;re launching your first startup or scaling an
              enterprise platform, I build high-performance experiences tailored
              to your business goals.
            </p>

            {/* Toggle */}
            <div className="mt-12 rounded-full border border-white/15 bg-black/60 p-1.5 backdrop-blur-2xl">
              <div className="flex gap-1">
                <button
                  onClick={() => setBilling("project")}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-400 sm:px-8 ${
                    billing === "project"
                      ? "bg-gradient-to-r from-[#f5a764] to-[#e8944f] text-black shadow-[0_0_30px_rgba(245,167,100,.3)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  One-Time Project
                </button>

                <button
                  onClick={() => setBilling("monthly")}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-400 sm:px-8 ${
                    billing === "monthly"
                      ? "bg-gradient-to-r from-[#f5a764] to-[#e8944f] text-black shadow-[0_0_30px_rgba(245,167,100,.3)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Monthly Retainer
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="mt-16 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {plans[billing].map((plan, index) => (
                <div
                  key={plan.name}
                  className={`group relative flex flex-col overflow-hidden rounded-[28px] border transition-all duration-500 ${
                    plan.popular
                      ? "border-[#f5a764]/50 bg-gradient-to-b from-[#f5a764]/10 via-black/80 to-black/90 shadow-[0_0_80px_rgba(245,167,100,.1)] scale-[1.03] z-10"
                      : "border-white/10 bg-black/60 hover:border-white/20 hover:bg-black/50"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f5a764] to-transparent" />
                  )}

                  <div className="p-8 pb-0">
                    {plan.popular && (
                      <div className="mb-6 flex justify-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f5a764] to-[#e8944f] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(245,167,100,.3)]">
                          <Sparkles size={12} />
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Icon + Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${plan.iconBg}`}
                      >
                        {plan.icon}
                      </div>
                      <h3 className="font-orbitron text-xl font-bold text-white">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-2">
                      <span
                        className={`font-orbitron text-5xl font-bold ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#f5a764] to-[#f7c794] bg-clip-text text-transparent"
                            : "text-white"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {plan.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-6 text-gray-400">
                      {plan.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="mx-8 my-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  {/* Features */}
                  <div className="flex-1 px-8">
                    <ul className="space-y-3.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5a764]/15">
                            <Check
                              size={12}
                              className="text-[#f5a764]"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="p-8 pt-8">
                    <Link
                      href="/#contact"
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#f5a764] to-[#e8944f] text-black shadow-[0_8px_30px_rgba(245,167,100,.25)] hover:shadow-[0_8px_40px_rgba(245,167,100,.4)] hover:scale-[1.02]"
                          : "border border-white/15 bg-white/5 text-white hover:border-[#f5a764]/50 hover:bg-[#f5a764]/10 hover:text-[#f5a764] hover:scale-[1.02]"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-28 grid w-full max-w-5xl grid-cols-2 gap-5 md:grid-cols-4">
              {[
                { number: "40+", label: "Projects Delivered" },
                { number: "15+", label: "Happy Clients" },
                { number: "5+", label: "Years Experience" },
                { number: "99%", label: "Client Satisfaction" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-white/10 bg-black/40 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:border-[#f5a764]/30 hover:bg-[#f5a764]/5 sm:p-8"
                >
                  <h2 className="font-orbitron text-3xl font-bold text-[#f5a764] transition-transform duration-300 group-hover:scale-110 sm:text-4xl">
                    {item.number}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400 sm:mt-3">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-20 flex flex-col items-center gap-4">
              <h3 className="font-orbitron text-2xl font-bold text-white sm:text-3xl">
                Ready to get started?
              </h3>
              <p className="max-w-md text-gray-400">
                Let&apos;s discuss your project and find the perfect plan for
                your needs.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/#contact"
                  className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#f5a764] to-[#e8944f] px-8 py-4 font-bold text-black shadow-[0_0_30px_rgba(245,167,100,.2)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,167,100,.35)] hover:scale-105"
                >
                  Start a Project
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/#contact"
                  className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-[#f5a764]/50 hover:bg-[#f5a764]/10 hover:text-[#f5a764]"
                >
                  Book Discovery Call
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}