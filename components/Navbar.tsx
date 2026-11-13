"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget, startScroll, stopScroll, getLenis } from "@/lib/scroll";
import { setJourney, useJourney, type JourneySection } from "@/lib/journey";

/** The in-page stops of the journey, top to bottom. */
const STOPS: { id: JourneySection; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Focus a section (or its "-heading" focus target) after an in-page jump, without scrolling. */
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

function jumpTo(id: string) {
  const reduce = prefersReducedMotion();
  scrollToTarget(`#${id}`, { immediate: reduce, onComplete: () => focusSection(id) });
}

/** In-page anchor on the home page, next/link to "/#id" from other pages. */
function StopLink({ inPage, ...props }: React.ComponentProps<"a"> & { href: string; inPage: boolean }) {
  return inPage ? <a {...props} /> : <Link {...props} />;
}

/** True for clicks the browser should handle itself (new tab, new window, etc.). */
const isModifiedClick = (e: React.MouseEvent) =>
  e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const journey = useJourney();

  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const sectionTextRef = useRef<HTMLSpanElement>(null);
  const countTextRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const liveDotRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const lockedNativeRef = useRef(false);

  // ---- What the centre label should say -------------------------------------------
  const pageLabel = onHome
    ? (STOPS.find((s) => s.id === journey.section)?.label ?? "Home")
    : (pathname.split("/").filter(Boolean)[0] ?? "Home");
  const sectionLabel = pageLabel.toUpperCase();
  const count =
    onHome && journey.section === "projects" && journey.projectIndex > 0 && journey.projectTotal > 0
      ? `${pad2(journey.projectIndex)}/${pad2(journey.projectTotal)}`
      : "";
  const currentStop = onHome ? STOPS.findIndex((s) => s.id === journey.section) : -1;

  // ---- Section tracking + page progress + live dot --------------------------------
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      if (onHome) {
        // The section is the last one whose top has crossed the middle of the viewport.
        // Resolving it from all triggers (not just the one that toggled) keeps it right
        // after jumps that skip whole sections, and between sections.
        const sectionTriggers: { id: JourneySection; st: ScrollTrigger }[] = [];
        const sync = () => {
          let current: JourneySection = "home";
          for (const { id, st } of sectionTriggers) if (st.scroll() >= st.start) current = id;
          setJourney({ section: current });
        };
        for (const { id } of STOPS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const st = ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            end: "bottom 50%",
            // Sections below the projects pathway: measure after its layout settles.
            refreshPriority: -1,
            onToggle: sync,
            onLeave: sync,
            onLeaveBack: sync,
            onRefresh: sync,
          });
          sectionTriggers.push({ id, st });
          triggers.push(st);
        }
        sync();
      }

      // Scroll position indicator: tracks the scrollbar 1:1, so it stays on under
      // reduced motion (it is feedback, not decorative motion).
      const progress = gsap.fromTo(
        progressRef.current,
        { x: 0, xPercent: -100 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "max",
            scrub: true,
            refreshPriority: -1,
          },
        },
      );
      if (progress.scrollTrigger) triggers.push(progress.scrollTrigger);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          liveDotRef.current,
          { scale: 1, opacity: 0.7 },
          { scale: 2.6, opacity: 0, duration: 1.8, ease: "power2.out", repeat: -1 },
        );
      });
    }, navRef);

    // The page keeps growing after mount (images, the pathway). Re-measure only these
    // triggers when it does: they don't pin, so this can't feed back into the layout.
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
  }, [onHome]);

  // ---- Label animations (React never renders into these spans after mount) --------
  useEffect(() => {
    const el = sectionTextRef.current;
    if (!el || el.textContent === sectionLabel) return;
    if (prefersReducedMotion()) {
      el.textContent = sectionLabel;
      return;
    }
    const tween = gsap.to(el, {
      duration: 0.45,
      ease: "none",
      overwrite: true,
      scrambleText: { text: sectionLabel, chars: SCRAMBLE_CHARS, speed: 0.8, tweenLength: true },
    });
    return () => {
      tween.progress(1).kill();
    };
  }, [sectionLabel]);

  useEffect(() => {
    const el = countTextRef.current;
    if (!el || el.textContent === count) return;
    if (prefersReducedMotion() || !count) {
      el.textContent = count;
      return;
    }
    const tween = gsap.to(el, {
      duration: 0.35,
      ease: "none",
      overwrite: true,
      scrambleText: { text: count, chars: "0123456789", speed: 1, tweenLength: false },
    });
    return () => {
      tween.progress(1).kill();
    };
  }, [count]);

  // ---- Menu -------------------------------------------------------------------------
  const unlockScroll = useCallback(() => {
    startScroll();
    if (lockedNativeRef.current) {
      document.documentElement.style.removeProperty("overflow");
      lockedNativeRef.current = false;
    }
  }, []);

  const openMenu = () => {
    closingRef.current = false;
    setOpen(true);
  };

  /** Animate the menu out, unlock scrolling, return focus to the menu button, then run `after`. */
  const closeMenu = useCallback(
    (after?: () => void) => {
      if (closingRef.current) return;
      closingRef.current = true;
      const finish = () => {
        setOpen(false);
        unlockScroll();
        menuButtonRef.current?.focus({ preventScroll: true });
        after?.();
      };
      const dialog = dialogRef.current;
      if (!dialog || prefersReducedMotion()) {
        finish();
        return;
      }
      gsap.to(dialog, { autoAlpha: 0, duration: 0.22, ease: "power2.in", onComplete: finish });
    },
    [unlockScroll],
  );

  // Lock scrolling, move focus in, Escape to close, keep Tab inside while open.
  useEffect(() => {
    if (!open) return;
    stopScroll();
    // Without Lenis (reduced motion, other pages), stop native page scrolling behind the dialog.
    if (!getLenis()) {
      document.documentElement.style.overflow = "hidden";
      lockedNativeRef.current = true;
    }
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const dialog = dialogRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (dialog) gsap.killTweensOf(dialog);
      unlockScroll();
    };
  }, [open, closeMenu, unlockScroll]);

  // Staggered entrance: panel drops in, the route draws itself, the words roll up.
  useLayoutEffect(() => {
    if (!open || !dialogRef.current) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // opacity (not autoAlpha) on anything holding focusables: focus moves in immediately.
        tl.from("[data-menu-backdrop]", { opacity: 0, duration: 0.3 }, 0)
          .from("[data-menu-panel]", { y: -28, opacity: 0, duration: 0.5 }, 0)
          .from("[data-menu-text]", { yPercent: 115, duration: 0.75, stagger: 0.07 }, 0.12)
          .from("[data-menu-num]", { opacity: 0, x: -10, duration: 0.4, stagger: 0.07 }, 0.18)
          .from("[data-menu-node]", { scale: 0, duration: 0.45, stagger: 0.07, ease: "back.out(2.2)" }, 0.18)
          .from(
            "[data-menu-seg]",
            { scaleY: 0, transformOrigin: "50% 0%", duration: 0.35, stagger: 0.07, ease: "power2.inOut" },
            0.28,
          )
          .from("[data-menu-foot]", { opacity: 0, y: 12, duration: 0.45 }, 0.45);
      },
      dialogRef,
    );
    return () => mm.revert();
  }, [open]);

  const onStopClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onHome || isModifiedClick(e)) return; // other pages: let next/link navigate to /#id
    e.preventDefault();
    // Stop Lenis' own anchor handler (window listener) from racing this scroll.
    e.stopPropagation();
    closeMenu(() => {
      startScroll();
      jumpTo(id);
    });
  };

  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onHome || isModifiedClick(e)) return;
    e.preventDefault();
    e.stopPropagation();
    const reduce = prefersReducedMotion();
    scrollToTarget(0, { immediate: reduce, duration: reduce ? undefined : 1.6 });
  };

  const hereTag = (i: number) =>
    i === currentStop ? (count ? `You are here · ${count}` : "You are here") : i < currentStop ? "Passed" : "";

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Site navigation"
        className="pointer-events-none fixed top-6 left-1/2 z-[9999] w-full -translate-x-1/2 px-4"
      >
        <div className="pointer-events-auto relative mx-auto grid h-14 w-full max-w-sm grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 rounded-full border border-[#f5a764] bg-white/10 px-2.5 shadow-[0_0_24px_-6px_rgba(245,167,100,.35)] backdrop-blur-xl md:max-w-md md:px-3 lg:max-w-lg">
          {onHome ? (
            <a
              href="#home"
              onClick={onLogoClick}
              aria-label="Isaac Osamor, back to start"
              className={`grid h-11 w-11 place-items-center rounded-full transition hover:scale-105 ${FOCUS_RING}`}
            >
              <Image src="/logo.png" alt="" width={36} height={36} className="h-8 w-8 md:h-9 md:w-9" />
            </a>
          ) : (
            <Link
              href="/"
              aria-label="Isaac Osamor, home"
              className={`grid h-11 w-11 place-items-center rounded-full transition hover:scale-105 ${FOCUS_RING}`}
            >
              <Image src="/logo.png" alt="" width={36} height={36} className="h-8 w-8 md:h-9 md:w-9" />
            </Link>
          )}

          {/* Live label. Purely visual: the nav's own label is the accessible name. */}
          <div aria-hidden="true" className="flex min-w-0 items-center justify-center gap-2.5 overflow-hidden">
            <span className="relative grid h-1.5 w-1.5 shrink-0 place-items-center">
              <span ref={liveDotRef} className="absolute inset-0 rounded-full bg-[#f5a764]" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#f5a764] shadow-[0_0_8px_rgba(245,167,100,.8)]" />
            </span>
            <span
              ref={sectionTextRef}
              className="min-w-0 truncate font-orbitron text-[13px] font-semibold tracking-[0.14em] text-white sm:text-sm md:text-base"
            >
              HOME
            </span>
            <span
              className={`shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-[#f5a764] tabular-nums md:text-xs ${
                count ? "inline-flex" : "hidden"
              }`}
            >
              <span className="text-white/35">·</span>
              <span ref={countTextRef} />
            </span>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={open ? "site-menu" : undefined}
            className={`group grid h-11 w-11 cursor-pointer place-items-center rounded-full transition hover:bg-white/5 ${FOCUS_RING}`}
          >
            <span className="flex w-6 flex-col items-end gap-[5px]">
              <span className="h-[2px] w-6 rounded-full bg-[#f5a764] transition-all duration-300 group-hover:w-4" />
              <span className="h-[2px] w-4 rounded-full bg-[#f5a764] transition-all duration-300 group-hover:w-6" />
            </span>
          </button>

          {/* Page progress: a 1px heat line inside the pill, hot head at the front. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-9 bottom-[2px] h-[7px] overflow-hidden">
            <div className="absolute inset-x-0 top-[3px] h-px bg-white/[.08]" />
            <div ref={progressRef} data-nav-progress className="absolute inset-0" style={{ transform: "translateX(-100%)" }}>
              <div className="absolute inset-x-0 top-[3px] h-px bg-linear-to-r from-[#c9773a]/0 via-[#f5a764] to-[#f5c895] shadow-[0_0_6px_rgba(245,167,100,.8)]" />
              <div className="absolute top-[1px] right-0 h-[5px] w-[5px] rounded-full bg-[#f5c895] shadow-[0_0_8px_2px_rgba(245,167,100,.7)]" />
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div
          ref={dialogRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[10000] flex items-start justify-center p-3 sm:p-4 md:items-center"
        >
          <div data-menu-backdrop aria-hidden="true" className="absolute inset-0 bg-black/70" onClick={() => closeMenu()} />

          <div
            data-menu-panel
            data-lenis-prevent
            className="relative max-h-[calc(100svh-24px)] w-full max-w-6xl overflow-y-auto overscroll-contain rounded-[30px] border border-[#f5a764] bg-[#0c0c0e]/85 shadow-[0_0_80px_-20px_rgba(245,167,100,.35)] backdrop-blur-2xl sm:max-h-[calc(100svh-32px)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4 md:px-10 md:pt-8">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" alt="" width={60} height={60} className="h-11 w-11 md:h-14 md:w-14" />
                <p className="hidden font-mono text-[11px] tracking-[0.22em] text-white/50 uppercase sm:block">
                  <span className="text-[#f5a764]">●</span> Route map ·{" "}
                  <span className="text-white/80">{pad2(STOPS.length)} stops</span>
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => closeMenu()}
                aria-label="Close menu"
                className={`group grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-[#f5a764]/40 text-[#f5a764] transition hover:border-[#f5a764] hover:bg-[#f5a764] hover:text-black ${FOCUS_RING}`}
              >
                <X className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.25} />
              </button>
            </div>

            {/* The route: one stop per section, lit up to where the visitor is. */}
            <ol className="px-5 pb-2 md:px-12">
              {STOPS.map((stop, i) => {
                const state = currentStop < 0 ? "future" : i < currentStop ? "passed" : i === currentStop ? "active" : "future";
                const segLit = currentStop >= 0 && i < currentStop;
                const tag = hereTag(i);
                return (
                  <li key={stop.id} className="relative">
                    {i < STOPS.length - 1 && (
                      <span
                        data-menu-seg
                        aria-hidden="true"
                        className={`absolute top-1/2 left-[11.5px] h-full w-px ${
                          segLit
                            ? `bg-linear-to-b from-[#f5a764] ${i + 1 === currentStop ? "to-[#f5c895]" : "to-[#f5a764]"} shadow-[0_0_8px_rgba(245,167,100,.6)]`
                            : "bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,.2)_0_6px,transparent_6px_14px)]"
                        }`}
                      />
                    )}
                    <StopLink
                      inPage={onHome}
                      href={onHome ? `#${stop.id}` : `/#${stop.id}`}
                      onClick={(e) => onStopClick(e, stop.id)}
                      aria-current={state === "active" ? "location" : undefined}
                      className={`group relative flex items-center gap-3 rounded-2xl py-5 pr-2 sm:gap-5 md:py-7 ${FOCUS_RING}`}
                    >
                      <span aria-hidden="true" className="relative z-10 grid h-6 w-6 shrink-0 place-items-center">
                        <span
                          data-menu-node
                          className={`block rounded-full transition-transform duration-300 group-hover:scale-125 ${
                            state === "active"
                              ? "h-4 w-4 bg-[#f5c895] shadow-[0_0_0_6px_rgba(245,167,100,.18),0_0_18px_rgba(245,167,100,.8)]"
                              : state === "passed"
                                ? "h-3 w-3 bg-[#f5a764] shadow-[0_0_10px_rgba(245,167,100,.7)]"
                                : "h-3 w-3 border border-white/35 bg-black group-hover:border-[#f5a764]"
                          }`}
                        />
                      </span>
                      <span data-menu-num className="w-7 shrink-0 font-mono text-xs text-[#f5a764] md:w-10 md:text-base">
                        {pad2(i + 1)}.
                      </span>
                      <span className="block overflow-hidden py-1 transition-transform duration-300 ease-out group-hover:translate-x-2">
                        <span
                          data-menu-text
                          className={`block font-orbitron text-3xl leading-none font-bold transition-colors duration-300 group-hover:text-[#f5a764] sm:text-4xl md:text-6xl ${
                            state === "active" ? "text-white" : "text-gray-100/90"
                          }`}
                        >
                          {stop.label}
                        </span>
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-4">
                        {tag && (
                          <span
                            className={`hidden font-mono text-[11px] tracking-[0.22em] uppercase md:inline ${
                              state === "active" ? "text-[#f5c895]" : "text-white/35"
                            }`}
                          >
                            {tag}
                          </span>
                        )}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-6 w-6 -translate-x-3 text-[#f5a764] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:h-9 md:w-9"
                        />
                      </span>
                    </StopLink>
                    <div aria-hidden="true" className="ml-9 h-px bg-[#f5a764]/20 sm:ml-11" />
                  </li>
                );
              })}

              {/* Off the route: separate pages. */}
              {[
                { href: "/about", label: "About" },
                { href: "/pricing", label: "Pricing" },
              ].map((page, pi) => (
              <li key={page.href} className={`relative ${pi === 0 ? "mt-4" : ""}`}>
                <Link
                  href={page.href}
                  onClick={() => {
                    if (pathname === page.href) closeMenu();
                    else unlockScroll();
                  }}
                  aria-current={pathname === page.href ? "page" : undefined}
                  className={`group relative flex items-center gap-3 rounded-2xl py-5 pr-2 sm:gap-5 md:py-7 ${FOCUS_RING}`}
                >
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center">
                    <span
                      data-menu-node
                      className="block h-3 w-3 rounded-full border border-dashed border-[#f5a764]/70 transition-transform duration-300 group-hover:scale-125"
                    />
                  </span>
                  <span data-menu-num className="w-7 shrink-0 font-mono text-xs text-[#f5a764] md:w-10 md:text-base">
                    {pad2(STOPS.length + 1 + pi)}.
                  </span>
                  <span className="block overflow-hidden py-1 transition-transform duration-300 ease-out group-hover:translate-x-2">
                    <span
                      data-menu-text
                      className="block font-orbitron text-3xl leading-none font-bold text-gray-100/90 transition-colors duration-300 group-hover:text-[#f5a764] sm:text-4xl md:text-6xl"
                    >
                      {page.label}
                    </span>
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-4">
                    <span className="hidden font-mono text-[11px] tracking-[0.22em] text-white/35 uppercase md:inline">
                      Separate page
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-6 w-6 text-[#f5a764]/50 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#f5a764] md:h-9 md:w-9"
                    />
                  </span>
                </Link>
              </li>
              ))}
            </ol>

            {/* Footer row */}
            <div
              data-menu-foot
              className="mt-4 flex flex-col gap-3 border-t border-white/[.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-12 md:py-6"
            >
              <p className="font-mono text-[11px] tracking-[0.22em] text-white/45 uppercase">
                Now at · <span className="text-white/85">{sectionLabel}</span>
                {count && <span className="text-[#f5a764]"> · {count}</span>}
              </p>
              <a
                href="mailto:info@cyberzik.online"
                className={`group inline-flex min-h-10 w-fit items-center gap-2 rounded-full font-mono text-[11px] tracking-[0.22em] text-white/70 uppercase transition hover:text-[#f5a764] ${FOCUS_RING}`}
              >
                info@cyberzik.online
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
