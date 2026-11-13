"use client";

import { ArrowDown, ChevronUp } from "lucide-react";
import { pad2, type PathModel } from "./model";

interface Props {
  model: PathModel;
  active: number;
  chapter: number;
  sheetOpen: boolean;
  onOpenSheet: () => void;
  onSkip: () => void;
}

/**
 * Bottom-sticky controls while the path is on screen:
 * desktop: "Skip to skills" pill; mobile/tablet: a dock with chapter, mini path, counter and skip.
 */
export default function PathwayDock({
  model,
  active,
  chapter,
  sheetOpen,
  onOpenSheet,
  onSkip,
}: Props) {
  const { items, chapters } = model;
  const current = chapters[Math.min(chapter, chapters.length - 1)] ?? chapters[0];
  const n = items.length;

  return (
    <div className="pointer-events-none sticky bottom-0 z-30 h-0">
      <div
        data-pw-hud
        data-visible="false"
        inert
        className="pw-dock absolute inset-x-0 bottom-[calc(14px+env(safe-area-inset-bottom))] flex justify-center lg:bottom-8"
      >
        {/* Desktop: skip pill (like the reference) */}
        <button
          type="button"
          onClick={onSkip}
          className="group hidden h-12 items-center gap-3 rounded-full border border-white/15 bg-black/70 pl-5 pr-1.5 text-sm font-medium text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,.9)] backdrop-blur-md transition-colors hover:border-[#f5a764]/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764] lg:flex"
        >
          Skip to skills
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-y-0.5">
            <ArrowDown aria-hidden className="h-4 w-4" />
          </span>
        </button>

        {/* Mobile / tablet dock */}
        <div className="flex h-[52px] w-[min(358px,calc(100vw-32px))] items-center gap-2 rounded-full border border-white/10 bg-black/80 pl-2 pr-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,.95)] backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={onOpenSheet}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-label={`Chapter ${current?.number}: ${current?.group.label}. Open path navigator`}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full pl-2.5 pr-1 font-mono text-[10.5px] uppercase tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-[#f5a764]"
          >
            <span aria-hidden className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="pw-ping absolute inset-0 rounded-full bg-[#f5a764] opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#f5a764] shadow-[0_0_8px_rgba(245,167,100,.9)]" />
            </span>
            <span aria-hidden className="min-w-0 truncate text-left">
              <span className="text-white">Ch {pad2(current?.number ?? 1)}</span>
              <span className="text-white/30"> · </span>
              <span className="text-white/65">{current?.group.tab}</span>
            </span>
            <ChevronUp aria-hidden className="h-3.5 w-3.5 shrink-0 text-white/50" />
          </button>

          {/* The path in miniature: one segment per chapter */}
          <span aria-hidden className="flex w-[60px] shrink-0 items-center gap-[3px]">
            {chapters.map((ch) => {
              const passed = Math.max(0, Math.min(ch.items.length, active - ch.start + 1));
              return (
                <span
                  key={ch.group.id}
                  className="pw-seg-track"
                  style={{ flexGrow: ch.items.length, flexBasis: 0 }}
                >
                  <span
                    className="pw-seg-fill"
                    style={{ transform: `scaleX(${passed / ch.items.length})` }}
                  />
                </span>
              );
            })}
          </span>

          <span className="shrink-0 font-mono text-[11px] tabular-nums">
            <span aria-hidden>
              <span className="text-white">{pad2(Math.max(0, active + 1))}</span>
              <span className="text-white/40">/{pad2(n)}</span>
            </span>
            <span className="sr-only">
              Project {Math.max(0, active + 1)} of {n}
            </span>
          </span>

          <button
            type="button"
            onClick={onSkip}
            aria-label="Skip to skills"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a764]"
          >
            <ArrowDown aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
