"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Page() {
  const [billing, setBilling] = useState("project");

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
          Whether you're launching your first startup or scaling an enterprise
          platform, I build high-performance experiences tailored to your
          business goals.
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

        {/* Stats */}

        <div className="mt-24 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            {
              number: "40+",
              label: "Projects",
            },
            {
              number: "15+",
              label: "Clients",
            },
            {
              number: "5+",
              label: "Years Experience",
            },
            {
              number: "99%",
              label: "Client Satisfaction",
            },
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
          <button className="group flex items-center justify-center gap-3 rounded-full bg-[#f5a764] px-8 py-4 font-bold text-black transition hover:scale-105">
            Start a Project

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition hover:border-[#f5a764] hover:bg-white/10">
            Book Discovery Call
          </button>
        </div>
      </div>
    </section>
  );
}