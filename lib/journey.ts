"use client";

// Tiny shared store for "where is the visitor on the journey", so the navbar can show
// e.g. "PROJECTS · 07/23" without the pathway and navbar knowing about each other.
// Use with React's useSyncExternalStore: useSyncExternalStore(subscribeJourney, getJourney, getServerJourney)
import { useSyncExternalStore } from "react";

export type JourneySection = "home" | "projects" | "stack" | "contact";

export interface JourneyState {
  section: JourneySection;
  /** 1-based index of the project the pathway's playhead is on (0 before the first). */
  projectIndex: number;
  /** Number of projects on the current (possibly filtered) pathway. */
  projectTotal: number;
  /** e.g. "E-Commerce" */
  chapterLabel: string;
}

const SERVER_STATE: JourneyState = { section: "home", projectIndex: 0, projectTotal: 0, chapterLabel: "" };

let state: JourneyState = SERVER_STATE;
const listeners = new Set<() => void>();

export function setJourney(patch: Partial<JourneyState>) {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof JourneyState)[]) {
    if (patch[k] !== undefined && patch[k] !== state[k]) changed = true;
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function subscribeJourney(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getJourney = () => state;
export const getServerJourney = () => SERVER_STATE;

export function useJourney() {
  return useSyncExternalStore(subscribeJourney, getJourney, getServerJourney);
}
