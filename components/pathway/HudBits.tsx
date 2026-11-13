"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** Digits that roll vertically (yPercent ±100) when the value changes. aria-hidden: pair with text. */
export function RollingDigits({
  value,
  reduced,
  className = "",
}: {
  value: number;
  reduced: boolean;
  className?: string;
}) {
  // Remember the previous value (state adjusted during render, not in an effect).
  const [track, setTrack] = useState({ value, prev: value, dir: 1, n: 0 });
  if (track.value !== value) {
    setTrack({ value, prev: track.value, dir: value > track.value ? 1 : -1, n: track.n + 1 });
  }
  const cur = String(Math.max(0, value)).padStart(2, "0");
  const prev = String(Math.max(0, track.prev)).padStart(cur.length, "0");
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || track.n === 0 || reduced) return;
    const tweens: gsap.core.Tween[] = [];
    root.querySelectorAll<HTMLElement>("[data-changed='true']").forEach((slot) => {
      const [oldEl, newEl] = Array.from(slot.children) as HTMLElement[];
      tweens.push(
        gsap.fromTo(
          newEl,
          { yPercent: 100 * track.dir },
          { yPercent: 0, duration: 0.4, ease: "power3.out" }
        ),
        gsap.fromTo(
          oldEl,
          { yPercent: 0, autoAlpha: 1 },
          { yPercent: -100 * track.dir, autoAlpha: 0, duration: 0.4, ease: "power3.out" }
        )
      );
    });
    return () => tweens.forEach((t) => t.revert());
  }, [track, reduced]);

  return (
    <span ref={ref} aria-hidden className={`inline-flex tabular-nums ${className}`}>
      {cur.split("").map((d, i) => (
        <span
          key={i}
          data-changed={track.n > 0 && prev[i] !== d ? "true" : "false"}
          className="pw-roll-slot"
        >
          <span className="invisible absolute inset-0">{prev[i]}</span>
          <span className="block">{d}</span>
        </span>
      ))}
    </span>
  );
}

/** Text that scrambles to its new value (ScrambleText). aria-hidden: pair with plain text. */
export function ScrambleLabel({
  text,
  reduced,
  className = "",
  chars = "upperCase",
}: {
  text: string;
  reduced: boolean;
  className?: string;
  chars?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef<string | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shown.current === null || reduced || shown.current === text) {
      shown.current = text;
      el.textContent = text;
      return;
    }
    shown.current = text;
    const tween = gsap.to(el, {
      duration: 0.55,
      ease: "none",
      scrambleText: { text, chars, speed: 0.6 },
    });
    return () => {
      tween.kill();
    };
  }, [text, reduced, chars]);

  return <span ref={ref} aria-hidden className={className} />;
}
