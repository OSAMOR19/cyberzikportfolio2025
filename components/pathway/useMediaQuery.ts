"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Hydration-safe media query: renders `serverValue` on the server and during hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
