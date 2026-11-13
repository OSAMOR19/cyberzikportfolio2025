"use client";

import { jumpTo } from "./heroNav";

/**
 * Where the orange journey line begins: a "Start the journey" label, the origin node and a
 * 2px line that grows to fill the space down to the hero's bottom edge, at the horizontal
 * centre, so it continues straight into the projects spine. The lit (orange) part grows as the hero scrolls away
 * (Hero.tsx); a glowing dot travels down it on a loop. The whole thing jumps to #projects.
 */
export default function JourneyStart() {
  return (
    <a
      href="#projects"
      onClick={jumpTo("#projects")}
      data-hero-reveal
      data-hero="journey"
      className="group relative z-10 mx-auto flex w-max flex-1 flex-col items-center pt-12 outline-none lg:-mt-3 lg:pt-0"
    >
      <span className="flex min-h-10 items-center rounded-full border border-white/10 bg-[#0c0c0e]/80 px-4 outline-[#f5a764] outline-offset-4 group-focus-visible:outline-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 group-hover:border-[#f5a764]/50 group-hover:text-[#f5c895]">
        Start the journey
      </span>

      {/* Origin node: the visitor is here */}
      <span aria-hidden="true" className="relative mt-4 grid size-4 place-items-center">
        <span className="journey-node__halo absolute inset-0 rounded-full bg-[#f5a764]/40" />
        <span className="absolute -inset-1.5 rounded-full bg-[rgba(245,167,100,0.18)]" />
        <span className="relative size-2.5 rounded-full bg-[#f5c895] shadow-[0_0_12px_rgba(245,167,100,0.8)]" />
      </span>

      {/* The line itself, flush with the hero's bottom edge */}
      <span
        aria-hidden="true"
        data-hero="journey-line"
        className="journey-line relative mt-1 block min-h-20 w-[2px] flex-1 md:min-h-32"
      >
        <span data-hero="journey-lit" className="journey-line__lit absolute inset-0 rounded-full" />
        <span className="journey-line__track absolute inset-0">
          <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c895] shadow-[0_0_0_3px_rgba(245,167,100,0.2),0_0_14px_rgba(245,167,100,0.9)]" />
        </span>
      </span>
    </a>
  );
}
