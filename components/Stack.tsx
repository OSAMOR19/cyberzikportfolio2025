"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/projectsData";
import "./Stack.css";

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "React Native",
  "GSAP",
  "Three.js",
  "Node.js",
];

// "Node" and "Node.js" are the same thing in the project data.
const normalize = (tech: string) => {
  const t = tech.trim().toLowerCase();
  return t === "node" ? "node.js" : t;
};

const TOTAL_PROJECTS = projects.length;

// Room left around a lit word for its glow; keep in sync with --stack-glow-pad in Stack.css.
const GLOW_PAD = 64;

const ROWS = SKILLS.map((name) => {
  const key = normalize(name);
  const count = projects.filter((p) => p.tech.some((t) => normalize(t) === key)).length;
  return { name, count };
});

function Stack() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // The markup's default is the fully lit state (no JS, reduced motion).
    // Only with motion allowed do we drop back to outlines and scrub towards it.
    const mm = gsap.matchMedia(root);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 1024px)",
      },
      (context) => {
        const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        // Inherited fallback for the words' --stack-fill. GSAP removes a CSS variable (rather than
        // restoring it) when ScrollTrigger reverts animations to re-measure, so words that haven't
        // started yet would otherwise fall back to the CSS default of 1 and show up lit.
        gsap.set(root, { "--stack-fill": 0 });

        const rows = gsap.utils.toArray<HTMLElement>("[data-stack-row]", root);
        rows.forEach((row, i) => {
          const word = row.querySelector<HTMLElement>("[data-word]");
          const fill = row.querySelector<HTMLElement>("[data-fill]");
          const spark = row.querySelector<HTMLElement>("[data-spark]");
          const lit = row.querySelector<HTMLElement>("[data-rail-lit]");
          const core = row.querySelector<HTMLElement>("[data-node-core]");
          const caption = row.querySelector<HTMLElement>("[data-caption]");
          const ticks = row.querySelectorAll<HTMLElement>("[data-tick]");
          if (!word || !fill || !spark || !lit || !core || !caption) return;

          // Unlit start state. Set outside the timeline on purpose: ScrollTrigger reverts its
          // animations while it re-measures, and they then fall back to these values rather
          // than to the CSS default (which is the lit state, for no-JS and reduced motion).
          gsap.set(fill, { "--stack-fill": 0 });
          gsap.set(spark, { x: 0, opacity: 0 });
          gsap.set(lit, { scaleX: 0 });
          gsap.set(core, { scale: 0, opacity: 0 });
          gsap.set(caption, { opacity: 0, y: 8 });
          if (ticks.length) gsap.set(ticks, { opacity: 0 });

          // One trigger per word: it charges up between 72% and 40% of the viewport,
          // so whatever sits above the centre is lit and whatever is below is still outlined.
          // Every tween is a fromTo, so invalidating on refresh never records a lit value as a start.
          const tl = gsap.timeline({
            defaults: { ease: "none", immediateRender: false },
            scrollTrigger: {
              trigger: row,
              start: "center 72%",
              end: "center 40%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });

          // Word: the filled layer wipes in left to right (clip-path driven by --stack-fill, see Stack.css).
          tl.fromTo(fill, { "--stack-fill": 0 }, { "--stack-fill": 1, duration: 0.6 }, 0);
          // Hot edge riding the wipe edge, which sits at --stack-fill * (width + GLOW_PAD).
          // Tweened in px on a 2px element, so it never widens the page.
          tl.fromTo(spark, { x: 0 }, { x: () => word.offsetWidth + GLOW_PAD, duration: 0.6 }, 0);
          tl.fromTo(spark, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.02);
          tl.fromTo(spark, { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0.46);

          // Rail draws out to the readout, then the node lights.
          tl.fromTo(lit, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power1.in" }, 0.42);
          tl.fromTo(
            core,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.08, ease: "back.out(3)" },
            0.72
          );

          // Readout: caption fades in, project ticks light one by one.
          tl.fromTo(caption, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.22 }, 0.66);
          if (ticks.length) {
            tl.fromTo(
              ticks,
              { opacity: 0 },
              { opacity: 1, duration: 0.03, stagger: 0.16 / ticks.length },
              0.8
            );
          }

          // Desktop parallax: odd words drift left, even words drift right.
          if (desktop) {
            const dir = i % 2 === 0 ? -1 : 1;
            gsap.fromTo(
              word,
              { xPercent: -dir * 2.5 },
              {
                xPercent: dir * 2.5,
                ease: "none",
                scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
              }
            );
          }
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="stack"
      aria-labelledby="stack-heading"
      className="relative overflow-x-clip pb-12 pt-24 md:pb-20 md:pt-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-10 grid gap-5 md:mb-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[8px] text-[#f5a764] md:text-sm">
              Toolbox
            </p>
            <h2
              id="stack-heading"
              tabIndex={-1}
              className="mt-4 w-fit rounded-lg font-orbitron text-4xl font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764] md:text-6xl"
            >
              Stack I build with
            </h2>
          </div>
          <p className="max-w-md text-gray-400 lg:max-w-none lg:pb-2 lg:text-right">
            The tools behind the projects above, and how many each one powers.
          </p>
        </header>

        <ul className="flex flex-col gap-5 md:gap-3 lg:gap-0">
          {ROWS.map(({ name, count }) => (
            <li
              key={name}
              data-stack-row
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-1 lg:grid-cols-[auto_minmax(3rem,1fr)_auto] lg:gap-x-8"
            >
              <div className="col-span-2 lg:col-span-1">
                <span data-word className="stack-word relative inline-block font-orbitron font-bold">
                  <span className="stack-word__outline">{name}</span>
                  <span data-fill aria-hidden="true" className="stack-word__fill absolute inset-0">
                    {name}
                  </span>
                  <span
                    data-spark
                    aria-hidden="true"
                    className="stack-spark pointer-events-none absolute bottom-[12%] left-0 top-[14%] w-[2px] rounded-full"
                  />
                </span>
              </div>

              {/* Rail: dashed until travelled, then a lit line ending in a node. */}
              <div aria-hidden="true" className="relative h-[2px]">
                <span className="stack-rail__track absolute inset-0" />
                <span data-rail-lit className="stack-rail__lit absolute inset-0" />
                <span className="absolute right-0 top-1/2 size-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white/35 bg-black">
                  <span data-node-core className="stack-node__core absolute -inset-0.5 rounded-full" />
                </span>
              </div>

              <div className="flex flex-col items-end gap-2 lg:w-[13.5rem] lg:items-start">
                <p
                  data-caption
                  className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] text-white/55"
                >
                  {count === 0 ? (
                    "in my toolkit"
                  ) : (
                    <>
                      used in <span className="text-[#f5a764]">{count}</span>{" "}
                      {count === 1 ? "project" : "projects"}
                    </>
                  )}
                </p>
                {count > 0 && (
                  <span aria-hidden="true" className="flex gap-[3px]">
                    {Array.from({ length: TOTAL_PROJECTS }, (_, t) => (
                      <span key={t} className="relative h-2.5 w-[3px] rounded-[1px] bg-white/15">
                        {t < count && (
                          <span data-tick className="stack-tick__lit absolute inset-0 rounded-[1px]" />
                        )}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Stack;
