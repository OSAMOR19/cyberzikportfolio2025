"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const MAX_TILT = 8;

/**
 * The centre logo as the journey's origin: an orange halo, two slow dashed orbits (the outer
 * one carries a glowing dot with a comet tail) and a 3D tilt that follows the pointer on
 * mouse/trackpad devices. Tilt and orbits are off under prefers-reduced-motion.
 */
export default function HeroLogo({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;

    const mm = gsap.matchMedia(stage);
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(tilt, { transformPerspective: 900 });
      const rotX = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3" });
      const rotY = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3" });
      const area: HTMLElement = stage.closest("section") ?? document.body;

      // Stage centre in page coordinates, cached so pointermove never forces layout.
      let cx = 0;
      let cy = 0;
      const measure = () => {
        const r = stage.getBoundingClientRect();
        cx = r.left + r.width / 2 + window.scrollX;
        cy = r.top + r.height / 2 + window.scrollY;
      };
      measure();

      const clamp = gsap.utils.clamp(-1, 1);
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = clamp((e.clientX - (cx - window.scrollX)) / (window.innerWidth / 2));
        const ny = clamp((e.clientY - (cy - window.scrollY)) / (window.innerHeight / 2));
        rotY(nx * MAX_TILT);
        rotX(-ny * MAX_TILT);
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
      };

      area.addEventListener("pointerenter", measure);
      area.addEventListener("pointermove", onMove, { passive: true });
      area.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", measure);
      return () => {
        area.removeEventListener("pointerenter", measure);
        area.removeEventListener("pointermove", onMove);
        area.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", measure);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      data-hero-reveal
      data-hero="logo"
      className={`hero-logo relative grid place-items-center ${className}`}
    >
      {/* Halo: a warm ring around the mark, clear at the centre so the logo's cut-outs stay crisp */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[22%] rounded-full bg-[radial-gradient(closest-side,transparent_44%,rgba(245,167,100,0.16)_58%,rgba(245,167,100,0.06)_72%,transparent_86%)]"
      />

      <div ref={tiltRef} className="hero-tilt relative grid size-full place-items-center">
        {/* Inner orbit: fine dashes, counter-rotating */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="hero-orbit hero-orbit--reverse pointer-events-none absolute inset-[5%] size-[90%] overflow-visible"
        >
          <circle
            cx="50"
            cy="50"
            r="49.5"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            pathLength={360}
            strokeDasharray="1.5 4.5"
          />
        </svg>

        {/* Outer orbit with a riding dot and comet tail */}
        <div
          aria-hidden="true"
          className="hero-orbit pointer-events-none absolute -inset-[8%]"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
            <circle
              cx="50"
              cy="50"
              r="49.6"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              pathLength={360}
              strokeDasharray="5 7"
            />
          </svg>
          <div className="hero-orbit__tail absolute inset-0 rounded-full" />
          <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c895] shadow-[0_0_0_4px_rgba(245,167,100,0.18),0_0_16px_rgba(245,167,100,0.8)]" />
        </div>

        <Image
          src="/logo.png"
          width={225}
          height={221}
          preload
          sizes="(min-width: 1024px) 212px, (min-width: 640px) 174px, 148px"
          alt="Cyberzik Logo"
          className="hero-logo__img relative"
        />
      </div>
    </div>
  );
}
