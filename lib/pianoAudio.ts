"use client";

// Sampled acoustic grand piano (public/sounds/piano/*.mp3, C3–C5).
// Samples are fetched and decoded once, lazily, and played through the Web Audio API.

export interface PianoNote {
  /** Sample file name, e.g. "Db4" */
  id: string;
  /** Display label, e.g. "C♯" */
  label: string;
  black: boolean;
}

const NAMES = [
  ["C", "C", false],
  ["Db", "C♯", true],
  ["D", "D", false],
  ["Eb", "D♯", true],
  ["E", "E", false],
  ["F", "F", false],
  ["Gb", "F♯", true],
  ["G", "G", false],
  ["Ab", "G♯", true],
  ["A", "A", false],
  ["Bb", "A♯", true],
  ["B", "B", false],
] as const;

/** Notes from C{fromOctave} up to and including C{toOctave}. */
export function noteRange(fromOctave: number, toOctave: number): PianoNote[] {
  const out: PianoNote[] = [];
  for (let o = fromOctave; o < toOctave; o++) {
    for (const [file, label, black] of NAMES) out.push({ id: `${file}${o}`, label, black });
  }
  out.push({ id: `C${toOctave}`, label: "C", black: false });
  return out;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buffers = new Map<string, AudioBuffer>();
const pending = new Map<string, Promise<AudioBuffer | null>>();

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  return ctx;
}

function load(id: string): Promise<AudioBuffer | null> {
  const ready = buffers.get(id);
  if (ready) return Promise.resolve(ready);
  const inFlight = pending.get(id);
  if (inFlight) return inFlight;
  const ac = audio();
  if (!ac) return Promise.resolve(null);
  const p = fetch(`/sounds/piano/${id}.mp3`)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
    .then((data) => ac.decodeAudioData(data))
    .then((buf) => {
      buffers.set(id, buf);
      return buf;
    })
    .catch(() => null)
    .finally(() => pending.delete(id));
  pending.set(id, p);
  return p;
}

/** Start fetching samples ahead of time (e.g. on hover or when the piano opens). */
export function preloadNotes(notes: PianoNote[]) {
  notes.forEach((n) => void load(n.id));
}

/**
 * Play a note. Returns a release function: call it when the key is let go to damp the
 * string (a short fade), or ignore it to let the note ring out naturally.
 */
export function playNote(id: string, velocity = 0.85): () => void {
  const ac = audio();
  if (!ac || !master) return () => {};
  if (ac.state === "suspended") void ac.resume();

  let released = false;
  let gain: GainNode | null = null;
  let source: AudioBufferSourceNode | null = null;

  void load(id).then((buf) => {
    if (!buf || !master) return;
    source = ac.createBufferSource();
    source.buffer = buf;
    gain = ac.createGain();
    gain.gain.value = velocity;
    source.connect(gain).connect(master);
    source.start();
    if (released) release();
  });

  const release = () => {
    released = true;
    if (!gain || !source) return;
    const now = ac.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    source.stop(now + 0.5);
  };
  return release;
}
