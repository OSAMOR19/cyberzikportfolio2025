"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { NAV_OFFSET, scrollToTarget } from "@/lib/scroll";
import { setJourney } from "@/lib/journey";
import type { Project } from "@/lib/projectsData";
import ComingSoonModal from "../ComingSoonModal";
import FilterTabs from "./FilterTabs";
import PathwayCard from "./PathwayCard";
import PathwayChapter from "./PathwayChapter";
import PathwayHud from "./PathwayHud";
import PathwayDock from "./PathwayDock";
import PathwaySheet, { type SheetAction } from "./PathwaySheet";
import { usePathwayScroll } from "./usePathwayScroll";
import { useReducedMotion } from "./useMediaQuery";
import {
  FILTER_TABS,
  PATH_STATS,
  getPath,
  isBackNavigation,
  saveReturn,
  takeReturn,
  type Filter,
} from "./model";
import "./pathway.css";

/** Scroll so `el`'s top lands `top` px below the viewport top (numeric target: same result with or without Lenis). */
function scrollToEl(el: Element, top: number, onComplete?: () => void) {
  const y = el.getBoundingClientRect().top + window.scrollY - top;
  const dist = Math.abs(y - window.scrollY);
  scrollToTarget(y, {
    duration: gsap.utils.clamp(0.7, 1.8, 0.5 + dist / 3500),
    immediate: prefersReducedMotion(),
    onComplete,
  });
}

export default function ProjectPathway() {
  const [filter, setFilter] = useState<Filter>("all");
  const [pos, setPos] = useState({ active: -1, chapter: 0 });
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const [soonProject, setSoonProject] = useState<Project | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduced = useReducedMotion();
  const model = getPath(filter);

  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listWrapRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<gsap.core.Tween | null>(null);
  const switchedRef = useRef(false);

  const engine = usePathwayScroll({
    rootRef,
    listRef,
    filter,
    onPosition: (active, chapter) => {
      setPos((p) => (p.active === active && p.chapter === chapter ? p : { active, chapter }));
      const m = getPath(filter);
      setJourney({
        projectIndex: active + 1,
        projectTotal: m.items.length,
        chapterLabel: m.chapters[chapter]?.group.label ?? "",
      });
    },
    onOpen: (slugs) => {
      setOpened((prev) => {
        if (slugs.every((s) => prev.has(s))) return prev;
        const next = new Set(prev);
        slugs.forEach((s) => next.add(s));
        return next;
      });
    },
  });

  // Back from a case study: restore the filter and jump to the card that was opened.
  useLayoutEffect(() => {
    const saved = takeReturn();
    if (!saved || !isBackNavigation()) return;
    engine.setPending({ slug: saved.slug, filter: saved.filter, deferred: true });
    if (saved.filter === "all") return;
    const raf = requestAnimationFrame(() => {
      switchedRef.current = true;
      setFilter(saved.filter);
    });
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  // Fade the new list in after a filter switch (opacity only: transforms would skew measuring).
  useLayoutEffect(() => {
    if (!switchedRef.current) return;
    const wrap = listWrapRef.current;
    if (!wrap) return;
    if (reduced) {
      gsap.set(wrap, { clearProps: "opacity" });
      return;
    }
    const tween = gsap.fromTo(
      wrap,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: "power2.out", clearProps: "opacity" }
    );
    return () => {
      tween.kill();
    };
  }, [filter, reduced]);

  const selectFilter = (next: Filter) => {
    if (next === filter) return;
    const tabs = tabsRef.current;
    // Below the tabs? Jump back to them before the list shrinks, or the page clamps into Contact.
    const below = !!tabs && tabs.getBoundingClientRect().top < NAV_OFFSET;
    const activeSlug = pos.active >= 0 ? model.items[pos.active]?.project.slug : undefined;

    const swap = () => {
      fadeRef.current = null;
      if (below && tabs) {
        scrollToTarget(tabs.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - 8, {
          immediate: true,
        });
        // If the project we were on is part of the new set, land back on it.
        if (activeSlug) engine.setPending({ slug: activeSlug, filter: next });
      }
      switchedRef.current = true;
      setOpened(new Set());
      setFilter(next);
    };

    engine.freeze();
    fadeRef.current?.kill();
    const wrap = listWrapRef.current;
    if (reduced || !wrap) {
      swap();
      return;
    }
    fadeRef.current = gsap.to(wrap, {
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
      onComplete: swap,
    });
  };

  const openSoon = useCallback((p: Project) => setSoonProject(p), []);
  const onNavigate = useCallback((slug: string) => saveReturn(filter, slug), [filter]);

  const skip = () => {
    const target =
      document.getElementById("stack") ?? rootRef.current?.nextElementSibling ?? null;
    if (!target) return;
    scrollToEl(target, NAV_OFFSET, () => {
      const heading = document.getElementById("stack-heading");
      (heading ?? (target as HTMLElement)).focus?.({ preventScroll: true });
    });
  };

  const goContact = (e: React.MouseEvent) => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    e.preventDefault();
    scrollToEl(contact, NAV_OFFSET);
  };

  const closeSheet = (action: SheetAction) => {
    setSheetOpen(false);
    if (!action) return;
    // Run after the sheet has unmounted and smooth scrolling has been resumed.
    requestAnimationFrame(() => {
      if (action.type === "filter") selectFilter(action.filter);
      else if (filter === "all" || filter === action.groupId)
        engine.travelToChapter(action.groupId);
      else selectFilter(action.groupId as Filter);
    });
  };

  return (
    <section
      id="projects"
      ref={rootRef}
      aria-labelledby="projects-heading"
      className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 [overflow-x:clip] sm:px-6"
    >
      <PathwayHud
        model={model}
        active={pos.active}
        chapter={pos.chapter}
        reduced={reduced}
        onTravel={engine.travelTo}
        onTravelChapter={engine.travelToChapter}
      />

      <header className="mb-10 text-center">
        <p className="font-orbitron uppercase tracking-[8px] text-[#f5a764]">Portfolio</p>
        <h2
          id="projects-heading"
          className="mt-4 font-orbitron text-[40px] font-bold leading-[1.05] text-white sm:text-5xl md:text-7xl"
        >
          Featured Projects
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-gray-400">
          Some products I&apos;ve built for startups, companies and clients over the last few
          years.
        </p>
        <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
          <span>
            <span className="text-[#f5a764]">{PATH_STATS.projects}</span> projects
          </span>
          <span aria-hidden className="text-white/20">
            ·
          </span>
          <span>
            <span className="text-[#f5a764]">{PATH_STATS.chapters}</span> chapters
          </span>
          <span aria-hidden className="text-white/20">
            ·
          </span>
          <span>
            <span className="text-[#f5a764]">{PATH_STATS.soon}</span> in the pipeline
          </span>
        </p>
      </header>

      <FilterTabs ref={tabsRef} filter={filter} tabs={FILTER_TABS} onSelect={selectFilter} />

      <div ref={listWrapRef} className="mt-10 lg:mt-14">
        <div
          ref={listRef}
          data-pw-list
          className="pw-list mx-auto max-w-[640px] lg:max-w-6xl"
        >
          <div aria-hidden data-pw-spine className="pw-spine">
            <div className="pw-track" />
            <div data-pw-fill className="pw-fill" />
            <div data-pw-head className="pw-head">
              <span data-pw-tail className="pw-tail" />
              <span className="pw-dot" />
            </div>
          </div>

          {model.chapters.map((ch) => (
            <section key={ch.group.id} aria-labelledby={`chapter-${ch.group.id}`}>
              <PathwayChapter chapter={ch} />
              <ol className="pw-cards">
                {ch.items.map((item) => (
                  <PathwayCard
                    key={item.project.slug}
                    item={item}
                    open={reduced || opened.has(item.project.slug)}
                    onSoon={openSoon}
                    onNavigate={onNavigate}
                  />
                ))}
              </ol>
            </section>
          ))}

          {/* End of the line */}
          <div data-pw-end data-state="future" className="pw-end pt-16 lg:pt-20">
            <span aria-hidden data-pw-node className="pw-end-node" />
            <div className="pl-[var(--conn-w)] pt-1 lg:flex lg:flex-col lg:items-center lg:pl-0 lg:pt-12 lg:text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">
                Next stop
              </p>
              <p className="mt-2 font-orbitron text-[28px] font-bold leading-tight text-white lg:text-[44px]">
                Your project
              </p>
              <p className="mt-2 max-w-sm text-[15px] text-gray-400">
                The path keeps going. Tell me what you want to build.
              </p>
              <a
                href="#contact"
                onClick={goContact}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#f5a764] px-6 text-sm font-bold text-black shadow-[0_0_30px_-6px_rgba(245,167,100,.6)] transition-colors hover:bg-[#f5c895] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
              >
                Let&apos;s talk
                <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <PathwayDock
        model={model}
        active={pos.active}
        chapter={pos.chapter}
        sheetOpen={sheetOpen}
        onOpenSheet={() => setSheetOpen(true)}
        onSkip={skip}
      />

      {soonProject && (
        <ComingSoonModal project={soonProject} onClose={() => setSoonProject(null)} />
      )}
      {sheetOpen && (
        <PathwaySheet
          filter={filter}
          tabs={FILTER_TABS}
          active={pos.active}
          chapter={pos.chapter}
          onClose={closeSheet}
        />
      )}
    </section>
  );
}
