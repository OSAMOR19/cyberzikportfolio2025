"use client";

// Thin wrapper around the page's Lenis instance (created by components/SmoothScroll.tsx).
// Every helper falls back to native scrolling when Lenis isn't running
// (reduced motion, detail pages, or before it mounts), so callers never need to check.
import type Lenis from "lenis";

let lenis: Lenis | null = null;

/** Called by SmoothScroll only. */
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Height of the fixed navbar plus breathing room, used as the default scroll offset. */
export const NAV_OFFSET = 96;

type Target = number | string | HTMLElement;

export function scrollToTarget(
  target: Target,
  opts: { offset?: number; immediate?: boolean; duration?: number; onComplete?: () => void } = {}
) {
  const offset = opts.offset ?? (typeof target === "number" ? 0 : -NAV_OFFSET);
  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate: opts.immediate,
      duration: opts.duration,
      onComplete: opts.onComplete ? () => opts.onComplete?.() : undefined,
    });
    return;
  }
  let y: number;
  if (typeof target === "number") y = target;
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    y = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: y + offset, behavior: opts.immediate ? "auto" : "smooth" });
  if (opts.onComplete) window.setTimeout(opts.onComplete, opts.immediate ? 0 : 700);
}

/** Pause/resume smooth scrolling (modals, fullscreen menus). Safe to call without Lenis. */
export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
}

/**
 * Current scroll velocity in px per frame-ish units (Lenis' own measure).
 * Falls back to a value derived from window.scrollY deltas when Lenis isn't running.
 */
let lastY = typeof window !== "undefined" ? window.scrollY : 0;
let lastT = typeof performance !== "undefined" ? performance.now() : 0;
let fallbackVelocity = 0;
export function getScrollVelocity(): number {
  if (lenis) return lenis.velocity;
  if (typeof window === "undefined") return 0;
  const now = performance.now();
  const dt = Math.max(1, now - lastT);
  const v = ((window.scrollY - lastY) / dt) * 16.7; // normalise to ~per-frame
  lastY = window.scrollY;
  lastT = now;
  fallbackVelocity += (v - fallbackVelocity) * 0.3;
  return fallbackVelocity;
}
