"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { startScroll, stopScroll } from "@/lib/scroll";
import { projectGroups } from "@/lib/projectsData";
import { getPath, pad2, type Filter } from "./model";

export type SheetAction =
  | { type: "filter"; filter: Filter }
  | { type: "chapter"; groupId: string }
  | null;

interface Props {
  filter: Filter;
  tabs: { id: Filter; label: string; count: number }[];
  active: number;
  chapter: number;
  /** Called after the close animation, with what the visitor picked (if anything). */
  onClose: (action: SheetAction) => void;
}

/** Mobile bottom sheet: filters + chapter jump list. Focus-trapped, Escape/backdrop close. */
export default function PathwaySheet({ filter, tabs, active, chapter, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const model = getPath(filter);
  const all = getPath("all");
  const currentGroup = model.chapters[Math.min(chapter, model.chapters.length - 1)]?.group.id;
  const activeSlug = active >= 0 ? model.items[active]?.project.slug : undefined;

  const close = (action: SheetAction = null) => {
    if (closing.current) return;
    closing.current = true;
    if (prefersReducedMotion()) return onClose(action);
    gsap
      .timeline({ onComplete: () => onClose(action) })
      .to(panelRef.current, { yPercent: 100, duration: 0.28, ease: "power2.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "<0.08");
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap
      .timeline()
      .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(
        panelRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: "power3.out" },
        "<"
      );
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const previously = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    stopScroll();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      startScroll();
      previously?.focus({ preventScroll: true });
    };
    // `close` only reads refs, so binding it once is safe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div data-lenis-prevent className="pw-sheet fixed inset-0 z-[10000] flex items-end justify-center">
      <div
        ref={backdropRef}
        aria-hidden
        onClick={() => close()}
        className="absolute inset-0 bg-black/70"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pw-sheet-title"
        className="relative w-full max-w-lg rounded-t-3xl border-t border-white/10 bg-[#0c0c0e] pb-[env(safe-area-inset-bottom)] shadow-[0_-30px_80px_-20px_rgba(245,167,100,.18)]"
      >
        <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/15" />
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f5a764]">
              Navigate
            </p>
            <h2 id="pw-sheet-title" className="mt-1 font-orbitron text-xl text-white">
              The path
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => close()}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 focus-visible:outline-2 focus-visible:outline-[#f5a764]"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <div
          data-lenis-prevent
          className="max-h-[68svh] overflow-y-auto overscroll-contain px-5 pb-6"
        >
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Filter
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {tabs.map((t) => {
              const on = t.id === filter;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => close(on ? null : { type: "filter", filter: t.id })}
                  className={`flex h-11 items-center justify-between rounded-xl border px-3.5 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a764] ${
                    on
                      ? "border-transparent bg-[#f5a764] text-black"
                      : "border-white/10 bg-white/[.03] text-gray-200"
                  } ${t.id === "all" ? "col-span-2" : ""}`}
                >
                  <span className="truncate">{t.label}</span>
                  <span
                    className={`ml-2 font-mono text-xs tabular-nums ${on ? "text-black/60" : "text-gray-500"}`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Jump to chapter
          </p>
          <ol className="relative mt-2">
            <span
              aria-hidden
              className="absolute bottom-6 left-[15px] top-6 w-px bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,.18)_0_5px,transparent_5px_10px)]"
            />
            {projectGroups.map((g) => {
              const ch = all.chapters.find((c) => c.group.id === g.id)!;
              const isCurrent = g.id === currentGroup;
              const passed =
                activeSlug !== undefined &&
                filter === "all" &&
                ch.start <= all.items.findIndex((it) => it.project.slug === activeSlug);
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => close({ type: "chapter", groupId: g.id })}
                    aria-current={isCurrent ? "step" : undefined}
                    className="relative flex min-h-12 w-full items-center gap-3.5 rounded-xl py-2 pr-2 text-left focus-visible:outline-2 focus-visible:outline-[#f5a764]"
                  >
                    <span
                      aria-hidden
                      className={`ml-[9px] h-3 w-3 shrink-0 rotate-45 rounded-[2px] border ${
                        isCurrent
                          ? "border-[#f5c895] bg-[#f5c895] shadow-[0_0_12px_rgba(245,167,100,.8)]"
                          : passed
                            ? "border-[#f5a764] bg-[#f5a764]"
                            : "border-[#f5a764]/50 bg-[#0c0c0e]"
                      }`}
                    />
                    <span className="font-mono text-[11px] text-[#f5a764]">{pad2(ch.number)}</span>
                    <span
                      className={`min-w-0 flex-1 truncate text-[15px] ${isCurrent ? "text-white" : "text-gray-300"}`}
                    >
                      {g.label}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-gray-500">
                      {pad2(ch.items.length)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>,
    document.body
  );
}
