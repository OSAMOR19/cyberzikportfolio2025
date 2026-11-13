"use client";

import type { MouseEvent } from "react";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Click handler for in-page links (`<a href="#projects">`): smooth-scrolls with the shared
 * helper (Lenis, or native under reduced motion) and moves keyboard focus to the target
 * when it is focusable (has a tabindex), so "skip" links work for keyboard users too.
 * The href stays a real anchor, so the link still works without JavaScript.
 */
export function jumpTo(selector: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
    if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
  };
}
