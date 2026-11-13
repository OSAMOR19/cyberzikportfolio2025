"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { pad2, type PathModel } from "./model";
import { RollingDigits, ScrambleLabel } from "./HudBits";

interface Props {
  model: PathModel;
  active: number;
  chapter: number;
  reduced: boolean;
  onTravel: (index: number) => void;
  onTravelChapter: (groupId: string) => void;
}

/** Extra space between chapters on the rail, in node-spacing units. */
const CHAPTER_GAP = 0.9;
/** Up to this many stops, show nodes at every desktop width (no chapter segments). */
const NODES_ALWAYS = 10;

/** Roving tabindex: one tab stop; ←/→/Home/End move focus between the buttons. */
function useRoving(count: number, current: number) {
  const [focused, setFocused] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const stop = focused ?? Math.max(0, Math.min(count - 1, current));
  const onKeyDown = (e: KeyboardEvent) => {
    const from = focused ?? stop;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = Math.min(count - 1, from + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, from - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
  };
  const groupProps = {
    onKeyDown,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(null);
    },
  };
  return { stop, focused, setFocused, refs, groupProps };
}

export default function PathwayHud({
  model,
  active,
  chapter,
  reduced,
  onTravel,
  onTravelChapter,
}: Props) {
  const { items, chapters } = model;
  const n = items.length;
  const current = chapters[Math.min(chapter, chapters.length - 1)] ?? chapters[0];

  // Node x positions (0..1) with a little extra room between chapters.
  const xs = useMemo(() => {
    const units = items.map((it) => it.index + it.chapterOrdinal * CHAPTER_GAP);
    const total = units[units.length - 1] ?? 0;
    return units.map((u) => (total > 0 ? u / total : 0.5));
  }, [items]);
  const litX = active >= 0 ? xs[active] : 0;

  const nodes = useRoving(n, active);
  const segs = useRoving(chapters.length, current?.ordinal ?? 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const tip = hovered ?? nodes.focused;
  const tipItem = tip !== null ? items[tip] : null;
  const nodesEverywhere = n <= NODES_ALWAYS;

  return (
    <div className="pointer-events-none sticky top-[92px] z-30 hidden h-0 lg:block">
      <div
        data-pw-hud
        data-visible="false"
        inert
        className="pw-hud relative mx-auto flex h-16 max-w-[1100px] items-center gap-6 rounded-2xl border border-white/10 bg-black/70 px-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,.9)] backdrop-blur-md"
      >
        {/* Left: chapter label */}
        <div className="flex w-[272px] shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
          <span aria-hidden className="relative flex h-2 w-2 shrink-0">
            <span className="pw-ping absolute inset-0 rounded-full bg-[#f5a764] opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-[#f5a764] shadow-[0_0_10px_rgba(245,167,100,.9)]" />
          </span>
          <span aria-hidden className="flex min-w-0 items-center gap-2 whitespace-nowrap">
            <span className="text-white">
              Chapter <ScrambleLabel text={pad2(current?.number ?? 1)} chars="0123456789" reduced={reduced} />
            </span>
            <span className="text-white/30">·</span>
            <ScrambleLabel
              text={current?.group.tab ?? ""}
              reduced={reduced}
              className="truncate text-white/60"
            />
          </span>
          <span className="sr-only">
            Chapter {current?.number}: {current?.group.label}
          </span>
        </div>

        {/* Centre: the rail (hidden on short windows) */}
        <div className="relative h-full min-w-0 flex-1 [@media(max-height:639px)]:hidden">
          {/* 23 project nodes (>= 1280px, or a short filtered path) */}
          <div
            role="group"
            aria-label="Project path"
            {...nodes.groupProps}
            className={`absolute inset-y-0 left-3 right-3 ${nodesEverywhere ? "block" : "hidden xl:block"}`}
          >
            <span aria-hidden className="pw-rail-track" />
            <span
              aria-hidden
              className="pw-rail-lit"
              style={{ transform: `scaleX(${litX})` }}
            />
            {chapters.length > 1 &&
              chapters.map((ch) => (
                <span
                  key={ch.group.id}
                  aria-hidden
                  className={`pointer-events-none absolute top-1.5 -translate-x-1/2 font-mono text-[9px] tracking-[0.18em] transition-colors duration-500 ${
                    ch.ordinal === current?.ordinal ? "text-[#f5a764]" : "text-white/25"
                  }`}
                  style={{ left: `${xs[ch.start] * 100}%` }}
                >
                  {pad2(ch.number)}
                </span>
              ))}
            {items.map((it, i) => {
              const state = i < active ? "reached" : i === active ? "active" : "future";
              return (
                <button
                  key={it.project.slug}
                  ref={(el) => {
                    nodes.refs.current[i] = el;
                  }}
                  type="button"
                  tabIndex={i === nodes.stop ? 0 : -1}
                  aria-label={`${pad2(i + 1)} of ${pad2(n)}: ${it.project.title}${it.soon ? " (coming soon)" : ""}`}
                  aria-current={i === active ? "step" : undefined}
                  data-state={state}
                  data-kind={it.soon ? "soon" : "live"}
                  onClick={() => onTravel(i)}
                  onFocus={() => nodes.setFocused(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                  className="pw-rail-node"
                  style={{ left: `${xs[i] * 100}%` }}
                >
                  <span aria-hidden className="pw-rail-dot" />
                </button>
              );
            })}

            {tipItem && tip !== null && (
              <div
                role="tooltip"
                className="pointer-events-none absolute top-[calc(100%+12px)] z-10 w-[280px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0c0c0e]/95 p-2.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,.9),0_0_0_1px_rgba(245,167,100,.08)]"
                style={{ left: `clamp(140px, ${xs[tip] * 100}%, calc(100% - 140px))` }}
              >
                <div className="flex gap-3">
                  <div className="relative h-[75px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-white/5">
                    <Image
                      src={tipItem.project.images[0]}
                      alt=""
                      fill
                      sizes="120px"
                      className={`object-cover ${tipItem.project.orientation === "portrait" ? "object-top" : ""} ${tipItem.soon ? "opacity-60 grayscale" : ""}`}
                    />
                  </div>
                  <div className="min-w-0 py-0.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f5a764]">
                      {pad2(tip + 1)} · Ch {pad2(tipItem.chapterNumber)}
                      {tipItem.soon ? " · soon" : ""}
                    </p>
                    <p className="mt-1 line-clamp-2 font-orbitron text-[13px] leading-snug text-white">
                      {tipItem.project.title}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-gray-400">
                      {tipItem.project.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 1024-1279px: six chapter segments instead of 23 nodes */}
          {!nodesEverywhere && (
            <div
              role="group"
              aria-label="Chapters"
              {...segs.groupProps}
              className="absolute inset-0 flex items-center gap-2 xl:hidden"
            >
              {chapters.map((ch, c) => {
                const passed = Math.max(0, Math.min(ch.items.length, active - ch.start + 1));
                const isCurrent = ch.ordinal === current?.ordinal;
                return (
                  <button
                    key={ch.group.id}
                    ref={(el) => {
                      segs.refs.current[c] = el;
                    }}
                    type="button"
                    tabIndex={c === segs.stop ? 0 : -1}
                    aria-label={`Chapter ${ch.number}: ${ch.group.label}, ${ch.items.length} projects`}
                    aria-current={isCurrent ? "step" : undefined}
                    onClick={() => onTravelChapter(ch.group.id)}
                    onFocus={() => segs.setFocused(c)}
                    className="group flex h-11 min-w-0 flex-col justify-center gap-1.5 rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-[#f5a764]"
                    style={{ flexGrow: ch.items.length, flexBasis: 0 }}
                  >
                    <span
                      aria-hidden
                      className={`truncate text-left font-mono text-[9px] uppercase tracking-[0.18em] transition-colors ${
                        isCurrent ? "text-[#f5a764]" : "text-white/35 group-hover:text-white/70"
                      }`}
                    >
                      {pad2(ch.number)} {ch.group.tab}
                    </span>
                    <span aria-hidden className="pw-seg-track w-full">
                      <span
                        className="pw-seg-fill"
                        style={{ transform: `scaleX(${passed / ch.items.length})` }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: counter */}
        <div className="ml-auto flex shrink-0 items-baseline gap-1.5 font-mono">
          <RollingDigits
            value={active + 1}
            reduced={reduced}
            className="text-[15px] leading-[1.2] text-white"
          />
          <span aria-hidden className="text-[12px] tabular-nums text-white/40">
            / {pad2(n)}
          </span>
          <span className="sr-only">
            Project {Math.max(0, active + 1)} of {n}
          </span>
        </div>
      </div>
    </div>
  );
}
