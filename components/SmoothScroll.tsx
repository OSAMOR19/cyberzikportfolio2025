"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenis, NAV_OFFSET } from "@/lib/scroll";

/**
 * Smooth scrolling for the home page, driven by GSAP's ticker so Lenis and ScrollTrigger
 * stay in lockstep. Not created under prefers-reduced-motion (native scrolling instead).
 * Use the helpers in lib/scroll.ts to scroll, pause or read velocity.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: false,
      // In-page #anchor links scroll smoothly and land below the fixed navbar.
      anchors: { offset: -NAV_OFFSET },
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
