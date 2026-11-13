"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import PianoKeyboard from "./PianoKeyboard";
import PianoModal from "./PianoModal";
import { noteRange, preloadNotes } from "@/lib/pianoAudio";

const INLINE_NOTES = noteRange(4, 5);

/** One playable octave inline, with a button that opens the full two-octave piano. */
export default function PianoKeys() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-md">
        <PianoKeyboard notes={INLINE_NOTES} />
      </div>
      <div className="mt-4 flex flex-col items-center gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
          Go on, play a few notes
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          onPointerEnter={() => preloadNotes(noteRange(3, 5))}
          aria-haspopup="dialog"
          className="inline-flex items-center gap-2 rounded-full bg-[#f5a764] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
        >
          <Maximize2 aria-hidden className="h-4 w-4" />
          Open the full piano
        </button>
      </div>
      {open && <PianoModal onClose={() => setOpen(false)} />}
    </div>
  );
}
