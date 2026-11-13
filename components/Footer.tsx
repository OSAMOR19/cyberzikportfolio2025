"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget, getScrollVelocity } from "@/lib/scroll";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]";
const LABEL = "font-mono text-[11px] uppercase tracking-[0.22em]";

const SOCIALS = [
  { name: "Twitter", icon: <FaTwitter />, link: "https://twitter.com/" },
  {
    name: "LinkedIn",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/in/peter-osamor-isaac-chukwuka-003ab51a4/",
  },
  { name: "GitHub", icon: <FaGithub />, link: "https://github.com/OSAMOR19" },
];

const NAV = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

const SERVICES = ["Frontend Development", "Mobile Applications", "Fullstack Solutions"];

/** Make a section (or its "-heading" focus target) the keyboard starting point, without scrolling. */
function focusSection(id: string) {
  const el = document.getElementById(`${id}-heading`) ?? document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.style.outline = "none";
    el.addEventListener(
      "blur",
      () => {
        el.removeAttribute("tabindex");
        el.style.removeProperty("outline");
      },
      { once: true },
    );
  }
  el.focus({ preventScroll: true });
}

/** Smooth in-page jump for #anchor links; the href stays for no-JS and new-tab clicks. */
function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  // Keep Lenis' own window-level anchor handler from restarting this scroll.
  e.stopPropagation();
  const reduce = prefersReducedMotion();
  scrollToTarget(`#${id}`, { immediate: reduce, onComplete: () => focusSection(id) });
}

function backToStart() {
  const reduce = prefersReducedMotion();
  focusSection("home");
  scrollToTarget(0, { immediate: reduce, duration: reduce ? undefined : 2 });
}

/** One marquee run: filled phrase, node, outlined phrase, node. Rendered twice per half. */
function MarqueeRun() {
  return (
    <>
      {[0, 1].map((k) => (
        <Fragment key={k}>
          <span className="pr-6 font-orbitron text-4xl leading-none font-bold text-[#f5a764] uppercase md:pr-10 md:text-6xl lg:pr-14 lg:text-8xl">
            Let&apos;s work together
          </span>
          <span className="flex items-center pr-6 md:pr-10 lg:pr-14">
            <span className="block h-3 w-3 rounded-full bg-[#f5c895] shadow-[0_0_0_6px_rgba(245,167,100,.18),0_0_18px_rgba(245,167,100,.8)] md:h-4 md:w-4" />
          </span>
          <span className="pr-6 font-orbitron text-4xl leading-none font-bold text-transparent uppercase [-webkit-text-stroke:1px_rgba(245,167,100,.85)] md:pr-10 md:text-6xl md:[-webkit-text-stroke:1.5px_rgba(245,167,100,.85)] lg:pr-14 lg:text-8xl">
            Let&apos;s work together
          </span>
          <span className="flex items-center pr-6 md:pr-10 lg:pr-14">
            <span className="block h-3 w-3 rounded-full border border-dashed border-[#f5a764]/70 md:h-4 md:w-4" />
          </span>
        </Fragment>
      ))}
    </>
  );
}

const Footer = () => {
  const rootRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(rootRef);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;

        // ---- Velocity-reactive seamless marquee --------------------------------------
        // The track holds two identical halves, so wrapping xPercent in [-50, 0) is seamless.
        const BASE = 50 / 38; // % of the track per second at rest (one half every ~38s)
        const setX = gsap.quickSetter(track, "xPercent");
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.45, ease: "power3.out" });
        const wrap = gsap.utils.wrap(-50, 0);
        let pos = 0;
        let dir = 1; // 1 = drifting left (scrolling down), -1 = drifting right (scrolling up)
        let timeScale = 1;

        const tick = (_time: number, deltaMs: number) => {
          const dt = Math.min(deltaMs, 100) / 1000;
          const v = getScrollVelocity();
          if (Math.abs(v) > 0.4) dir = v > 0 ? 1 : -1;
          // Speed up with scroll speed, then ease back to base when the visitor stops.
          const target = 1 + gsap.utils.clamp(0, 5, Math.abs(v) / 6);
          timeScale += (target - timeScale) * Math.min(1, dt * (target > timeScale ? 10 : 2.5));
          pos = wrap(pos - dir * BASE * timeScale * dt);
          setX(pos);
          skewTo(gsap.utils.clamp(-8, 8, v * 0.35));
        };

        // Only tick while the marquee is on screen.
        let running = false;
        const run = (on: boolean) => {
          if (on === running) return;
          running = on;
          if (on) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        };
        const visibility = ScrollTrigger.create({
          trigger: marqueeRef.current,
          start: "top bottom",
          end: "bottom top",
          refreshPriority: -1,
          onToggle: (self) => run(self.isActive),
        });
        triggers.push(visibility);

        // ---- Entrance for the link columns ---------------------------------------------
        const entrance = gsap.from("[data-footer-col]", {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-footer-grid]", start: "top 88%", once: true, refreshPriority: -1 },
        });
        if (entrance.scrollTrigger) triggers.push(entrance.scrollTrigger);

        return () => {
          run(false);
          triggers.length = 0;
          gsap.set(track, { clearProps: "transform" });
        };
      });
    }, rootRef);

    // The page above keeps changing height after mount; re-measure these triggers when it does.
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => triggers.forEach((t) => t.refresh()), 150);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const linkClass = `group inline-flex min-h-10 items-center gap-3 rounded-md text-white/65 transition-colors hover:text-white ${FOCUS_RING}`;

  return (
    <footer
      ref={rootRef}
      className="relative w-full bg-linear-to-b from-transparent via-black/60 to-black/85 pt-24 font-sans md:pt-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-20 xl:px-32">
        <div
          data-footer-grid
          className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-x-10"
        >
          {/* Brand */}
          <div data-footer-col className="col-span-2 flex flex-col gap-6 lg:col-span-1">
            <Image src="/logo.png" alt="" width={45} height={44} />

            <h2 className="text-2xl font-semibold text-white">Isaac Osamor</h2>

            <p className="max-w-sm leading-7 text-gray-400">
              Frontend Engineer with full-stack capabilities. I craft stunning,
              high-performance web experiences that blend creativity with clean
              code.
            </p>

            <a
              href="mailto:info@cyberzik.online"
              className={`inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#f5a764] px-6 py-3 font-semibold text-black shadow-[0_0_24px_-4px_rgba(245,167,100,.55)] transition hover:scale-105 hover:bg-[#f5c895] ${FOCUS_RING}`}
            >
              <MdOutlineEmail size={20} aria-hidden="true" />
              Email Me
            </a>

            <div className="flex flex-wrap gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} (opens in a new tab)`}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/[.08] bg-white/10 text-white transition hover:border-[#f5a764] hover:bg-[#f5a764] hover:text-black ${FOCUS_RING}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav data-footer-col aria-labelledby="footer-nav-heading" className="space-y-4">
            <h2 id="footer-nav-heading" className={`${LABEL} text-white/45`}>
              <span className="text-[#f5a764]">01</span> · Navigation
            </h2>
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={(e) => onAnchorClick(e, item.id)} className={linkClass}>
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full border border-white/35 bg-black transition group-hover:border-[#f5a764] group-hover:bg-[#f5a764] group-hover:shadow-[0_0_10px_rgba(245,167,100,.8)]"
                    />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services: what I do, plus one real way in. */}
          <div data-footer-col className="space-y-4">
            <h2 className={`${LABEL} text-white/45`}>
              <span className="text-[#f5a764]">02</span> · Services
            </h2>
            <ul className="space-y-1 text-white/65">
              {SERVICES.map((service) => (
                <li key={service} className="flex min-h-10 items-center gap-3">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full border border-dashed border-[#f5a764]/60" />
                  {service}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => onAnchorClick(e, "contact")}
              className={`group inline-flex min-h-10 items-center gap-2 rounded-md text-[#f5a764] transition-colors hover:text-[#f5c895] ${LABEL} ${FOCUS_RING}`}
            >
              Start a project
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Connect */}
          <div data-footer-col className="space-y-4">
            <h2 className={`${LABEL} text-white/45`}>
              <span className="text-[#f5a764]">03</span> · Connect
            </h2>
            <ul className="space-y-1">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a href={social.link} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {social.name}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 text-[#f5a764]/60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#f5a764]"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="mt-16 mb-6 h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent md:mt-20" />
      </div>

      {/* Marquee: GSAP drives it (see effect), it reacts to scroll speed and direction. */}
      <div
        ref={marqueeRef}
        className="relative overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:py-10"
      >
        <p className="sr-only">Let&apos;s work together</p>
        <div ref={trackRef} aria-hidden="true" className="flex w-max will-change-transform">
          <div className="flex shrink-0 items-center whitespace-nowrap">
            <MarqueeRun />
          </div>
          <div className="flex shrink-0 items-center whitespace-nowrap">
            <MarqueeRun />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-start gap-6 px-6 pt-4 pb-10 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-20 xl:px-32">
        <p className={`${LABEL} text-white/40`}>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Isaac Osamor
          <span className="text-white/20"> · </span>
          <span className="text-white/55">End of the line</span>
        </p>
        <button
          type="button"
          onClick={backToStart}
          className={`group inline-flex min-h-12 cursor-pointer items-center gap-4 rounded-full border border-white/15 bg-black/50 py-1.5 pr-1.5 pl-5 text-white/80 transition hover:border-[#f5a764] hover:text-white ${LABEL} ${FOCUS_RING}`}
        >
          Back to start
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#f5a764] text-black shadow-[0_0_18px_-2px_rgba(245,167,100,.7)]">
            <ArrowUp
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-8"
              strokeWidth={2.5}
            />
            <ArrowUp
              aria-hidden="true"
              className="absolute h-4 w-4 translate-y-8 transition-transform duration-300 group-hover:translate-y-0"
              strokeWidth={2.5}
            />
          </span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
