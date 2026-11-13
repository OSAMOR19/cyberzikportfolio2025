"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { NAV_OFFSET, scrollToTarget, startScroll, stopScroll } from "@/lib/scroll";
import type { Project } from "@/lib/projectsData";

interface Props {
  project: Project;
  onClose: () => void;
}

const reducedMotion = prefersReducedMotion;

export default function ComingSoonModal({ project, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const askRef = useRef(false);

  // Animate out, then tell the parent to unmount.
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (reducedMotion()) return onClose();
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, { opacity: 0, y: 24, scale: 0.96, duration: 0.2, ease: "power2.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "<0.05");
  };

  // Animate in.
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const tl = gsap
      .timeline()
      .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(
        panelRef.current,
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
        "<0.05"
      )
      .fromTo(
        panelRef.current!.querySelectorAll("[data-stagger]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
        "<0.15"
      );
    return () => {
      tl.kill();
    };
  }, []);

  // Focus, Escape to close, keep Tab inside the dialog, lock page scroll.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    // Lenis keeps scrolling under body overflow:hidden, so pause it too.
    stopScroll();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      startScroll();
      // preventScroll: don't yank the page back if "Ask about it" is scrolling to #contact.
      previouslyFocused?.focus({ preventScroll: true });
      if (askRef.current) {
        // Scrolling is only possible again now that the modal is gone.
        const contact = document.getElementById("contact");
        if (contact) {
          const y = contact.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
          requestAnimationFrame(() =>
            scrollToTarget(y, { duration: 1.4, immediate: reducedMotion() })
          );
        }
      }
    };
    // `close` only reads refs, so it's safe to bind once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      data-lenis-prevent
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
        aria-describedby="coming-soon-desc"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0f] shadow-[0_30px_80px_rgba(0,0,0,.6),0_0_60px_rgba(245,167,100,.12)]"
      >
        {/* Greyed preview of the first screenshot */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={project.images[0]}
            alt=""
            fill
            sizes="448px"
            className={`object-cover grayscale opacity-50 ${
              project.orientation === "portrait" ? "object-top" : "object-center"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d0f]/40 to-[#0d0d0f]" />
          <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#f5a764]/40 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#f5a764] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5a764] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f5a764]" />
            </span>
            In the pipeline
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl leading-none text-gray-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="px-7 pb-7 -mt-6 relative">
          <p data-stagger className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {project.category}
          </p>
          <h3
            id="coming-soon-title"
            data-stagger
            className="mt-2 font-orbitron text-3xl text-white"
          >
            {project.title}
          </h3>
          <p id="coming-soon-desc" data-stagger className="mt-4 leading-7 text-gray-400">
            {`${project.title} is still being built and will be launched soon. I'm putting the finishing touches on it, so check back shortly to see the full case study.`}
          </p>

          <div data-stagger className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              className="flex-1 rounded-full bg-[#f5a764] px-6 py-3 font-bold text-black transition hover:scale-[1.03]"
            >
              Got it
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                askRef.current = true;
                close();
              }}
              className="flex-1 rounded-full border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-[#f5a764]/60"
            >
              Ask about it
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
