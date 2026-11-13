"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import TextType from "./TextType";
import HeroLogo from "./hero/HeroLogo";
import HeroStats, { pad2 } from "./hero/HeroStats";
import JourneyStart from "./hero/JourneyStart";
import { jumpTo } from "./hero/heroNav";
import "./hero/hero.css";

const MOTION = "(prefers-reduced-motion: no-preference)";
const LABEL =
  "mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/45";
const PARA = "font-mono text-[15px] leading-7 text-gray-300 sm:text-base sm:leading-8";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Decided once per mount (StrictMode runs effects twice; the second run must agree).
  const introRef = useRef<"play" | "skip" | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    if (introRef.current === null) {
      // If the CSS failsafe already revealed the content (very slow hydration), don't hide
      // it again just to replay the intro.
      const probe = root.querySelector<HTMLElement>("[data-hero-reveal]");
      const pending = root.getAttribute("data-intro") === "pending";
      const alreadyShown = !probe || parseFloat(getComputedStyle(probe).opacity) > 0.01;
      introRef.current = pending && !alreadyShown ? "play" : "skip";
    }
    const playIntro = introRef.current === "play";
    // JS is in charge from here: drop the CSS pre-hide (from-states below are set before paint).
    root.removeAttribute("data-intro");

    const mm = gsap.matchMedia(root);
    mm.add(MOTION, () => {
      const q = gsap.utils.selector(root);

      // ---- Entrance (< 1.5s) ----
      if (playIntro) {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(q('[data-hero="eyebrow"]'), { y: 14, autoAlpha: 0, duration: 0.7 }, 0)
          .from(q('[data-hero="cta"]'), { y: 22, autoAlpha: 0, duration: 0.8, clearProps: "transform" }, 0.1)
          .from(q('[data-hero="stats"]'), { y: 22, autoAlpha: 0, duration: 0.8 }, 0.18)
          .from(q('[data-hero="stat"]'), { y: 10, autoAlpha: 0, duration: 0.7, stagger: 0.07 }, 0.24)
          .from(
            q('[data-hero="logo"]'),
            { scale: 0.88, autoAlpha: 0, duration: 1.1, ease: "expo.out", clearProps: "transform" },
            0.12
          )
          .from(q('[data-hero="label"]'), { x: -12, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.2)
          .from(q('[data-hero="journey"]'), { y: -10, autoAlpha: 0, duration: 0.8 }, 0.55);

        q('[data-hero="para"]').forEach((p) => {
          SplitText.create(p, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 105,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.06,
                delay: 0.2,
                onComplete: () => self.revert(),
              }),
          });
        });
      }

      // ---- Count-up, when the strip is on screen ----
      const counters = q("[data-count]") as HTMLElement[];
      const finals = counters.map((el) => Number(el.dataset.count) || 0);
      ScrollTrigger.create({
        trigger: q('[data-hero="stats"]')[0],
        start: "top bottom",
        once: true,
        onEnter: () => {
          counters.forEach((el, i) => {
            const state = { v: 0 };
            el.textContent = pad2(0);
            gsap.to(state, {
              v: finals[i],
              duration: 1.2,
              ease: "power2.out",
              delay: playIntro ? 0.3 : 0,
              onUpdate: () => {
                el.textContent = pad2(Math.round(state.v));
              },
            });
          });
        },
      });

      // ---- Exit: content recedes as the hero scrolls away ----
      // power2.in keeps text readable while it is still being read (the hero is taller than
      // the viewport, especially on phones) and saves most of the fade for the last stretch.
      gsap.to(inner, {
        scale: 0.96,
        opacity: 0.35,
        ease: "power2.in",
        transformOrigin: "50% 100%",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      // ---- Journey line lights up as you head for the projects ----
      const line = q('[data-hero="journey-line"]')[0];
      const lit = q('[data-hero="journey-lit"]')[0];
      if (line && lit) {
        gsap.fromTo(
          lit,
          { scaleY: 0.3 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top 92%", end: "bottom 45%", scrub: true },
          }
        );
      }

      return () => {
        counters.forEach((el, i) => {
          el.textContent = pad2(finals[i]);
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      data-intro="pending"
      aria-label="Introduction"
      className="hero relative flex min-h-[100svh] flex-col px-5 pt-28 sm:px-8 md:px-10 md:pt-32 lg:px-16 lg:pt-[clamp(6.5rem,13svh,8.5rem)]"
    >
      {/* Ambient warm light behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[80svh] bg-[radial-gradient(60%_55%_at_50%_28%,rgba(245,167,100,0.09),transparent_70%)]"
      />

      <div
        ref={innerRef}
        data-hero="inner"
        className="relative mx-auto flex w-full max-w-7xl flex-col items-center"
      >
        {/* Eyebrow */}
        <p
          data-hero-reveal
          data-hero="eyebrow"
          className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60 md:mb-6"
        >
          <span aria-hidden="true" className="relative flex size-2">
            <span className="hero-pulse absolute inset-0 rounded-full bg-[#f5a764]" />
            <span className="relative size-2 rounded-full bg-[#f5a764] shadow-[0_0_10px_rgba(245,167,100,0.8)]" />
          </span>
          Fullstack &amp; Blockchain Developer
        </p>

        {/* Heading */}
        <TextType
          as="h1"
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="|"
          text={["Hi, I'm Cyberzik, a Software Engineer."]}
          deletingSpeed={50}
          startOnVisible
          className="max-w-5xl text-center font-orbitron text-[clamp(2.25rem,9vw,2.75rem)] font-bold leading-[1.05] tracking-tight text-[#f5a764] sm:text-5xl md:text-6xl lg:text-[clamp(3.5rem,min(5.4vw,9svh),4.75rem)]"
        />

        {/* CTA + stats */}
        <div className="mt-8 flex w-full flex-col items-center gap-6 md:mt-10 lg:w-auto lg:flex-row lg:gap-5">
          <a
            href="#contact"
            onClick={jumpTo("#contact")}
            data-hero-reveal
            data-hero="cta"
            className="group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-[#f5a764] py-1.5 pl-7 pr-1.5 font-orbitron text-base font-bold text-black shadow-[0_0_40px_rgba(245,167,100,0.28)] outline-[#f5a764] outline-offset-4 transition-[scale,box-shadow] duration-300 hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(245,167,100,0.5)] focus-visible:outline-2 md:pl-9 md:text-xl"
          >
            Let&apos;s Talk
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full bg-black text-[#f5a764] md:size-11"
            >
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 md:size-5" />
            </span>
          </a>

          <HeroStats className="lg:w-[32rem]" />
        </div>

        {/* Bio + logo */}
        <div className="mt-14 grid w-full grid-cols-1 items-center justify-items-center gap-12 md:mt-16 lg:mt-[clamp(2.5rem,6svh,4rem)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-14">
          <div className="w-full max-w-xl lg:justify-self-start">
            <p data-hero-reveal data-hero="label" className={LABEL}>
              <span aria-hidden="true" className="h-px w-6 bg-[#f5a764]" />
              About
            </p>
            <p data-hero-reveal data-hero="para" className={PARA}>
              I&apos;m a passionate fullstack and blockchain developer with extensive
              experience building web applications, e-commerce platforms, and
              decentralized solutions. My journey in tech began over 5 years ago,
              and I&apos;ve been pushing the boundaries of what&apos;s possible ever since.
            </p>
          </div>

          <div className="order-first lg:order-none">
            <HeroLogo />
          </div>

          <div className="w-full max-w-xl lg:justify-self-end">
            <p data-hero-reveal data-hero="label" className={LABEL}>
              <span aria-hidden="true" className="h-px w-6 bg-[#f5a764]" />
              Approach
            </p>
            <p data-hero-reveal data-hero="para" className={PARA}>
              I specialize in creating seamless user experiences backed by robust,
              scalable architectures. Whether it&apos;s a complex web application or a
              cutting-edge blockchain solution, I approach every project with
              creativity, technical expertise, and a commitment to excellence.
            </p>
          </div>
        </div>
      </div>

      <JourneyStart />
    </section>
  );
}
