"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Folder from "./Folder";
import Link from "next/link";
import {
  projects,
  projectGroups,
  getProjectsByGroup,
  type Project,
  type ProjectGroupId,
} from "@/lib/projectsData";

type Filter = "all" | ProjectGroupId;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const openedRef = useRef<Set<string>>(new Set());
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());
  const queueRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef(new Map<Filter, HTMLButtonElement>());
  const switchingRef = useRef<gsap.core.Tween | null>(null);
  const hasSwitchedRef = useRef(false);
  const [indicator, setIndicator] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    ready: boolean;
  } | null>(null);

  // Open folders one at a time (400ms apart) as their cards scroll into view.
  // Re-runs when the filter changes so newly shown cards get observed.
  useEffect(() => {
    const queue = queueRef.current;

    const step = () => {
      const slug = queue.shift();
      if (!slug) {
        timerRef.current = null;
        return;
      }
      openedRef.current.add(slug);
      setOpened(new Set(openedRef.current));
      timerRef.current = setTimeout(step, 400);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const slug = (entry.target as HTMLElement).dataset.slug;
          observer.unobserve(entry.target);
          if (!slug || openedRef.current.has(slug) || queue.includes(slug)) continue;
          queue.push(slug);
        }
        // Small delay so folders pop open after the cards have landed.
        if (!timerRef.current && queue.length) timerRef.current = setTimeout(step, 300);
      },
      { threshold: 0.5 }
    );

    cardRefs.current.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      queue.length = 0;
    };
  }, [filter]);

  // Slide the highlight pill behind the active tab.
  useLayoutEffect(() => {
    const measure = () => {
      const btn = tabButtonRefs.current.get(filter);
      if (!btn) return;
      setIndicator((prev) => ({
        x: btn.offsetLeft,
        y: btn.offsetTop,
        w: btn.offsetWidth,
        h: btn.offsetHeight,
        // Skip the transition on the very first placement so it doesn't fly in from 0,0.
        ready: prev !== null,
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (tabsRef.current) ro.observe(tabsRef.current);
    return () => ro.disconnect();
  }, [filter]);

  // Animate the new set of projects in after a tab switch (not on first page load).
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content || !hasSwitchedRef.current) return;

    // Undo the fade-out from selectFilter before the new content paints.
    gsap.set(content, { clearProps: "opacity,transform,filter" });
    if (prefersReducedMotion()) return;

    // Only stagger what's on (or just below) the screen; anything further down
    // would otherwise keep animating out of sight for seconds in the "All" view.
    const inView = (kind: string) =>
      gsap.utils
        .toArray<HTMLElement>(`[data-animate='${kind}']`, content)
        .filter((el) => el.getBoundingClientRect().top < window.innerHeight + 120);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        inView("heading"),
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.12 }
      )
        .fromTo(
          inView("rule"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut", stagger: 0.12 },
          0
        )
        .fromTo(
          inView("count"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
          0.15
        )
        .fromTo(
          inView("card"),
          { opacity: 0, y: 70, scale: 0.94, rotateX: 10, transformPerspective: 900 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.08,
            clearProps: "transform",
          },
          0.1
        );
    }, content);

    return () => ctx.revert();
  }, [filter]);

  const selectFilter = (next: Filter) => {
    if (next === filter && !switchingRef.current) return;

    // Keep the chosen tab visible when the tab row is scrolled sideways on mobile.
    tabButtonRefs.current
      .get(next)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

    const swap = () => {
      switchingRef.current = null;
      hasSwitchedRef.current = true;
      // Close every folder so the visible ones re-open in sequence.
      openedRef.current = new Set();
      setOpened(new Set());
      setFilter(next);
    };

    switchingRef.current?.kill();
    if (prefersReducedMotion() || !contentRef.current) {
      swap();
      return;
    }
    switchingRef.current = gsap.to(contentRef.current, {
      opacity: 0,
      y: 24,
      filter: "blur(8px)",
      duration: 0.25,
      ease: "power2.in",
      onComplete: swap,
    });
  };

  const visibleGroups =
    filter === "all" ? projectGroups : projectGroups.filter((g) => g.id === filter);

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    ...projectGroups.map((g) => ({
      id: g.id,
      label: g.tab,
      count: getProjectsByGroup(g.id).length,
    })),
  ];

  // The animated wrapper is a plain div: the Link has a CSS transform transition
  // for its hover lift, which would fight GSAP if GSAP animated it directly.
  const renderCard = (project: Project) => (
    <div key={project.slug} data-animate="card">
      <Link
        href={`/projects/${project.slug}`}
        ref={(el) => {
          if (el) cardRefs.current.set(project.slug, el);
          else cardRefs.current.delete(project.slug);
        }}
        data-slug={project.slug}
        className="group overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#f5a764]/60 hover:shadow-[0_0_45px_rgba(245,167,100,.15)] block h-full"
      >
        <div className="flex justify-center pt-30">
          <Folder
            size={1.45}
            color="#f5c895"
            items={project.images}
            className="custom-folder"
            open={opened.has(project.slug)}
          />
        </div>

        <div className="px-7 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-full bg-[#f5a764]/20 px-3 py-1 text-xs font-semibold text-[#f5a764] uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <h4 className="font-orbitron text-2xl text-white">{project.title}</h4>

          <p className="mt-4 leading-7 text-gray-400">{project.description}</p>

          <div className="flex flex-wrap gap-3 py-4">
            {project.live && (
              <span className="flex-1 rounded-full px-8 bg-[#f5a764] py-3 text-center font-bold text-white transition hover:scale-105">
                Live Demo
              </span>
            )}
            {project.playStore && (
              <span className="flex-1 rounded-full px-4 bg-[#34a853] py-3 text-center font-bold text-white transition hover:scale-105 whitespace-nowrap">
                Google Play
              </span>
            )}
            {project.appStore && (
              <span className="flex-1 rounded-full px-4 bg-[#0a84ff] py-3 text-center font-bold text-white transition hover:scale-105 whitespace-nowrap">
                App Store
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="mb-12 text-center">
        <p className="font-orbitron uppercase tracking-[8px] text-[#f5a764]">
          Portfolio
        </p>

        <h2 className="mt-4 text-5xl md:text-7xl font-bold font-orbitron text-white">
          Featured Projects
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-gray-400">
          Some products I&apos;ve built for startups, companies and clients over the
          last few years.
        </p>
      </div>

      {/* Filter tabs: scroll sideways on mobile, wrap and centre on larger screens */}
      <div className="-mx-6 mb-20 overflow-x-auto px-6 py-1 [scrollbar-width:none] md:mx-0 md:px-0">
        <div
          ref={tabsRef}
          role="group"
          aria-label="Filter projects by type"
          className="relative flex w-max gap-3 md:mx-auto md:w-auto md:flex-wrap md:justify-center"
        >
          {/* Sliding highlight */}
          <span
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 rounded-full bg-[#f5a764] shadow-[0_0_30px_rgba(245,167,100,.45)] ${
              indicator?.ready
                ? "transition-[transform,width,height] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                : ""
            }`}
            style={
              indicator
                ? {
                    width: indicator.w,
                    height: indicator.h,
                    transform: `translate(${indicator.x}px, ${indicator.y}px)`,
                  }
                : { opacity: 0 }
            }
          />

          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabButtonRefs.current.set(tab.id, el);
                  else tabButtonRefs.current.delete(tab.id);
                }}
                type="button"
                aria-pressed={active}
                onClick={() => selectFilter(tab.id)}
                className={`relative z-10 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-300 active:scale-95 ${
                  active
                    ? "border-transparent text-black"
                    : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-[#f5a764]/60 hover:text-white"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 transition-colors duration-300 ${
                    active ? "text-black/60" : "text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={contentRef} className="space-y-28">
        {visibleGroups.map((group) => {
          const items = getProjectsByGroup(group.id);
          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <div className="relative mb-10 flex flex-col gap-3 pb-6 md:flex-row md:items-end md:justify-between">
                <div data-animate="heading">
                  <h3
                    id={`group-${group.id}`}
                    className="font-orbitron text-2xl md:text-4xl font-bold text-white"
                  >
                    {group.label}
                  </h3>
                  <p className="mt-3 max-w-xl text-gray-400">{group.blurb}</p>
                </div>
                <span
                  data-animate="count"
                  className="font-orbitron text-sm uppercase tracking-[4px] text-[#f5a764]"
                >
                  {String(items.length).padStart(2, "0")}{" "}
                  {items.length === 1 ? "project" : "projects"}
                </span>
                <span
                  aria-hidden
                  data-animate="rule"
                  className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-[#f5a764]/60 via-white/15 to-white/5"
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {items.map(renderCard)}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
