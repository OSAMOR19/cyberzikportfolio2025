"use client";

import { ArrowDownRight } from "lucide-react";
import { projects, projectGroups, isComingSoon } from "@/lib/projectsData";
import { jumpTo } from "./heroNav";

export const pad2 = (n: number) => String(n).padStart(2, "0");

const STATS = [
  { value: projects.length, label: "Projects" },
  { value: projectGroups.length, label: "Domains" },
  { value: projects.filter(isComingSoon).length, label: "In the pipeline" },
];

/**
 * Count-up stats strip. Numbers render at their final value (so they're right without JS
 * and under reduced motion); Hero.tsx counts them up from 00 when the strip is in view.
 * Each stat jumps to the projects pathway.
 */
export default function HeroStats({ className = "" }: { className?: string }) {
  const onClick = jumpTo("#projects");
  return (
    <ul
      data-hero-reveal
      data-hero="stats"
      aria-label="At a glance"
      className={`grid w-full max-w-[34rem] grid-cols-3 rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/80 ${className}`}
    >
      {STATS.map((s, i) => (
        <li
          key={s.label}
          data-hero="stat"
          className={i > 0 ? "border-l border-white/[0.08]" : undefined}
        >
          <a
            href="#projects"
            onClick={onClick}
            aria-label={`${s.value} ${s.label.toLowerCase()}. Jump to the projects`}
            className="group relative flex h-full min-h-[84px] flex-col items-center justify-start gap-1.5 rounded-2xl px-2 py-3.5 text-center outline-[#f5a764] outline-offset-4 transition-colors duration-300 hover:bg-white/[0.03] focus-visible:outline-2 sm:min-h-[92px] lg:min-h-[76px] lg:py-3"
          >
            <span className="flex items-start font-orbitron text-[28px] font-bold leading-none tabular-nums text-white transition-colors duration-300 group-hover:text-[#f5a764] sm:text-4xl lg:text-[32px]">
              <span data-count={s.value}>{pad2(s.value)}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase leading-tight tracking-[0.18em] text-white/50 transition-colors duration-300 group-hover:text-white/80 sm:text-[11px] sm:tracking-[0.22em]">
              {s.label}
              <ArrowDownRight
                aria-hidden="true"
                className="hidden size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
              />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
