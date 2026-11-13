"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import PianoKeyboard from "./PianoKeyboard";
import { noteRange, preloadNotes } from "@/lib/pianoAudio";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { startScroll, stopScroll } from "@/lib/scroll";

const NOTES = noteRange(3, 5);
// Classic "tracker" layout: bottom row = lower octave, top row = upper octave.
const KEYS = "zsxdcvgbhnjmq2w3er5t6y7ui".split("");
const SHORTCUTS = Object.fromEntries(NOTES.map((n, i) => [n.id, KEYS[i]]));

export default function PianoModal({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const [sustain, setSustain] = useState(false);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (prefersReducedMotion()) return onClose();
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, { y: 30, scale: 0.97, opacity: 0, duration: 0.22, ease: "power2.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "<0.05");
  };

  useLayoutEffect(() => {
    preloadNotes(NOTES);
    if (prefersReducedMotion()) return;
    const tl = gsap
      .timeline()
      .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(
        panelRef.current,
        { y: 50, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" },
        "<0.05"
      );
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    stopScroll();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = f[0];
        const last = f[f.length - 1];
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
      previous?.focus({ preventScroll: true });
    };
    // close() only touches refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={backdropRef}
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 px-3 backdrop-blur-md sm:px-6"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="piano-title"
        className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0a08] p-5 shadow-[0_40px_100px_rgba(0,0,0,.7),0_0_80px_rgba(245,167,100,.12)] sm:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#f5a764]/10 blur-[90px]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">Chapter 04 · Music</p>
            <h2 id="piano-title" className="mt-2 font-orbitron text-2xl font-bold text-white sm:text-3xl">
              The piano in me
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
              Two octaves of a real grand piano. Tap or click the keys
              <span className="hidden md:inline">, or play with your keyboard: the bottom row (Z to M) is the lower octave and the top row (Q to I) the upper one</span>.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close the piano"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-gray-300 transition hover:border-[#f5a764] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="relative mt-6 overflow-x-auto pb-1 sm:mt-8">
          <div className="min-w-[640px]">
            <PianoKeyboard notes={NOTES} size="large" shortcuts={SHORTCUTS} sustain={sustain} />
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-pressed={sustain}
            onClick={() => setSustain((s) => !s)}
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764] ${
              sustain ? "border-[#f5a764] bg-[#f5a764]/15 text-[#f5c895]" : "border-white/15 text-gray-300 hover:border-white/30"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${sustain ? "bg-[#f5a764] shadow-[0_0_10px_rgba(245,167,100,.9)]" : "bg-white/25"}`} />
            Sustain pedal {sustain ? "on" : "off"}
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600 sm:hidden">Scroll sideways for more keys</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
