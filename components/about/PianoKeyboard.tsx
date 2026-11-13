"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playNote, preloadNotes, type PianoNote } from "@/lib/pianoAudio";

interface Props {
  notes: PianoNote[];
  /** "compact" for the inline card, "large" for the modal. */
  size?: "compact" | "large";
  /** Optional computer-keyboard shortcut per note id (shown on the keys). */
  shortcuts?: Record<string, string>;
  /** Let notes ring out on release instead of damping them. */
  sustain?: boolean;
}

/**
 * A playable piano keyboard. Pointer and keyboard (Enter/Space on a focused key, or the
 * shortcuts) trigger sampled piano notes; releasing damps them unless sustain is on.
 */
export default function PianoKeyboard({ notes, size = "compact", shortcuts, sustain = false }: Props) {
  const [down, setDown] = useState<Set<string>>(() => new Set());
  const releases = useRef(new Map<string, () => void>());
  const sustainRef = useRef(sustain);
  useEffect(() => {
    sustainRef.current = sustain;
  }, [sustain]);

  const press = useCallback((id: string) => {
    releases.current.get(id)?.();
    releases.current.set(id, playNote(id));
    setDown((s) => new Set(s).add(id));
  }, []);

  const lift = useCallback((id: string) => {
    const release = releases.current.get(id);
    releases.current.delete(id);
    if (release && !sustainRef.current) release();
    setDown((s) => {
      if (!s.has(id)) return s;
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }, []);

  // Computer-keyboard shortcuts.
  useEffect(() => {
    if (!shortcuts) return;
    const byKey = new Map(Object.entries(shortcuts).map(([id, key]) => [key.toLowerCase(), id]));
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const id = byKey.get(e.key.toLowerCase());
      if (!id) return;
      e.preventDefault();
      press(id);
    };
    const onUp = (e: KeyboardEvent) => {
      const id = byKey.get(e.key.toLowerCase());
      if (id) lift(id);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [shortcuts, press, lift]);

  // Release anything still held when unmounting.
  useEffect(() => {
    const map = releases.current;
    return () => {
      map.forEach((release) => release());
      map.clear();
    };
  }, []);

  const whites = notes.filter((n) => !n.black);
  const large = size === "large";

  const keyHandlers = (id: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      press(id);
    },
    onPointerUp: () => lift(id),
    onPointerCancel: () => lift(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
        e.preventDefault();
        press(id);
      }
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") lift(id);
    },
  });

  let whiteIndex = -1;
  return (
    <div
      role="group"
      aria-label="Playable piano"
      onPointerEnter={() => preloadNotes(notes)}
      onFocus={() => preloadNotes(notes)}
      className={`relative w-full select-none touch-none rounded-2xl border border-white/10 bg-gradient-to-b from-[#1c130c] to-[#0b0705] shadow-[0_30px_60px_-30px_rgba(245,167,100,.35)] ${
        large ? "h-[clamp(180px,34vh,300px)] p-3 pt-7" : "h-40 p-2 pt-5 sm:h-44"
      }`}
    >
      {/* felt strip */}
      <span aria-hidden className={`absolute inset-x-3 rounded-full bg-[#7a2e1f]/85 ${large ? "top-3 h-2" : "top-2 h-1.5"}`} />
      <div className="relative flex h-full w-full gap-[3px]">
        {notes.map((n) => {
          const isDown = down.has(n.id);
          const shortcut = shortcuts?.[n.id];
          if (!n.black) {
            whiteIndex++;
            return (
              <button
                key={n.id}
                type="button"
                aria-label={`Play ${n.label}${n.id.slice(-1)}`}
                {...keyHandlers(n.id)}
                className={`relative flex flex-1 flex-col items-center justify-end gap-1 rounded-b-lg rounded-t-sm pb-2 font-mono transition-[background-color,box-shadow,transform] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a764] ${
                  large ? "text-[11px]" : "text-[10px]"
                } ${
                  isDown
                    ? "translate-y-[2px] bg-[#f5c895] text-black shadow-[0_0_24px_rgba(245,167,100,.8)]"
                    : "bg-[#f3ead9] text-black/40 hover:bg-white"
                }`}
              >
                {shortcut && (
                  <span className="hidden rounded border border-black/15 px-1 text-[9px] uppercase text-black/45 md:inline">
                    {shortcut}
                  </span>
                )}
                {n.label}
              </button>
            );
          }
          // Black key: centred on the gap after the previous white key.
          const left = `calc(${((whiteIndex + 1) / whites.length) * 100}% - ${(0.3 / whites.length) * 100}%)`;
          return (
            <button
              key={n.id}
              type="button"
              aria-label={`Play ${n.label}${n.id.slice(-1)}`}
              {...keyHandlers(n.id)}
              style={{ left, width: `${(0.6 / whites.length) * 100}%` }}
              className={`absolute top-0 z-10 flex h-[60%] items-end justify-center rounded-b-md pb-1.5 transition-[background-color,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a764] ${
                isDown
                  ? "bg-[#f5a764] shadow-[0_0_24px_rgba(245,167,100,.9)]"
                  : "bg-gradient-to-b from-[#2a1d14] to-[#0b0705] hover:from-[#3a2a1e]"
              }`}
            >
              {shortcut && (
                <span className="hidden font-mono text-[9px] uppercase text-white/45 md:inline">{shortcut}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
