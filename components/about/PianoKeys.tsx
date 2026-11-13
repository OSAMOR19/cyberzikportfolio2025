"use client";

import { useEffect, useRef, useState } from "react";

// A small playable octave (C4–C5). Tones are synthesised with the Web Audio API on click/tap,
// so nothing loads until someone actually presses a key.
const WHITE = [
  { note: "C", freq: 261.63 },
  { note: "D", freq: 293.66 },
  { note: "E", freq: 329.63 },
  { note: "F", freq: 349.23 },
  { note: "G", freq: 392.0 },
  { note: "A", freq: 440.0 },
  { note: "B", freq: 493.88 },
  { note: "C", freq: 523.25 },
];
// Black keys sit after these white-key indexes.
const BLACK = [
  { after: 0, note: "C♯", freq: 277.18 },
  { after: 1, note: "D♯", freq: 311.13 },
  { after: 3, note: "F♯", freq: 369.99 },
  { after: 4, note: "G♯", freq: 415.3 },
  { after: 5, note: "A♯", freq: 466.16 },
];

export default function PianoKeys() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      ctxRef.current?.close().catch(() => {});
    },
    []
  );

  const play = (id: string, freq: number) => {
    setLit(id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLit(null), 380);

    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = ctxRef.current ?? (ctxRef.current = new AC());
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;

      // A soft, piano-ish tone: a fundamental plus two quiet harmonics with a quick attack
      // and an exponential decay.
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, now);
      out.gain.exponentialRampToValueAtTime(0.22, now + 0.012);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 2400;
      out.connect(lowpass).connect(ctx.destination);

      [
        { mult: 1, type: "triangle" as OscillatorType, vol: 1 },
        { mult: 2, type: "sine" as OscillatorType, vol: 0.35 },
        { mult: 3, type: "sine" as OscillatorType, vol: 0.12 },
      ].forEach(({ mult, type, vol }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq * mult;
        g.gain.value = vol;
        osc.connect(g).connect(out);
        osc.start(now);
        osc.stop(now + 1.7);
      });
    } catch {
      // Audio unavailable: the key still lights up.
    }
  };

  return (
    <div className="w-full">
      <div
        role="group"
        aria-label="A playable piano octave"
        className="relative mx-auto flex h-40 w-full max-w-md select-none rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a120c] to-[#0c0806] p-2 pt-5 shadow-[0_30px_60px_-30px_rgba(245,167,100,.35)] sm:h-44"
      >
        {/* felt strip */}
        <span aria-hidden className="absolute inset-x-2 top-2 h-1.5 rounded-full bg-[#7a2e1f]/80" />
        <div className="relative flex h-full w-full gap-[3px]">
          {WHITE.map((k, i) => {
            const id = `w${i}`;
            return (
              <button
                key={id}
                type="button"
                aria-label={`Play ${k.note}${i === 7 ? " (high)" : ""}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  play(id, k.freq);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    play(id, k.freq);
                  }
                }}
                className={`relative flex-1 rounded-b-lg rounded-t-sm pb-2 text-[10px] font-mono transition-[background-color,box-shadow,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a764] flex items-end justify-center ${
                  lit === id
                    ? "translate-y-[2px] bg-[#f5c895] text-black shadow-[0_0_24px_rgba(245,167,100,.8)]"
                    : "bg-[#f3ead9] text-black/40 hover:bg-white"
                }`}
              >
                {k.note}
              </button>
            );
          })}
          {BLACK.map((k) => {
            const id = `b${k.after}`;
            // Centre each black key on the gap after its white key.
            const left = `calc(${((k.after + 1) / WHITE.length) * 100}% - 4.5%)`;
            return (
              <button
                key={id}
                type="button"
                aria-label={`Play ${k.note}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  play(id, k.freq);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    play(id, k.freq);
                  }
                }}
                style={{ left }}
                className={`absolute top-0 z-10 h-[58%] w-[9%] rounded-b-md transition-[background-color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a764] ${
                  lit === id
                    ? "bg-[#f5a764] shadow-[0_0_24px_rgba(245,167,100,.9)]"
                    : "bg-gradient-to-b from-[#2a1d14] to-[#0b0705] hover:from-[#3a2a1e]"
                }`}
              />
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
        Go on, play a few notes
      </p>
    </div>
  );
}
