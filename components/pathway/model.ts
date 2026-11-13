"use client";

// Data model for "The Path": turns lib/projectsData into chapters + numbered stops for a filter.
import {
  projects,
  projectGroups,
  getProjectsByGroup,
  isComingSoon,
  type Project,
  type ProjectGroup,
  type ProjectGroupId,
} from "@/lib/projectsData";

export type Filter = "all" | ProjectGroupId;

export interface PathItem {
  project: Project;
  /** 0-based position on the visible (possibly filtered) path. */
  index: number;
  /** Desktop zig-zag side; restarts on the left for every chapter. */
  side: "left" | "right";
  soon: boolean;
  /** Ordinal of the chapter on the visible path (0-based). */
  chapterOrdinal: number;
  /** Global chapter number (1-based), stays the same when filtered. */
  chapterNumber: number;
}

export interface PathChapter {
  group: ProjectGroup;
  /** Global chapter number (1-based). */
  number: number;
  /** Ordinal on the visible path (0-based). */
  ordinal: number;
  /** Index of the chapter's first project on the visible path. */
  start: number;
  items: PathItem[];
}

export interface PathModel {
  filter: Filter;
  chapters: PathChapter[];
  items: PathItem[];
}

const cache = new Map<Filter, PathModel>();

export function getPath(filter: Filter): PathModel {
  const hit = cache.get(filter);
  if (hit) return hit;
  const groups =
    filter === "all" ? projectGroups : projectGroups.filter((g) => g.id === filter);
  const items: PathItem[] = [];
  const chapters: PathChapter[] = groups.map((group, ordinal) => {
    const number = projectGroups.indexOf(group) + 1;
    const start = items.length;
    const chapterItems = getProjectsByGroup(group.id).map((project, k) => {
      const item: PathItem = {
        project,
        index: items.length,
        side: k % 2 === 0 ? "left" : "right",
        soon: isComingSoon(project),
        chapterOrdinal: ordinal,
        chapterNumber: number,
      };
      items.push(item);
      return item;
    });
    return { group, number, ordinal, start, items: chapterItems };
  });
  const model = { filter, chapters, items };
  cache.set(filter, model);
  return model;
}

export const FILTER_TABS: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "All", count: projects.length },
  ...projectGroups.map((g) => ({
    id: g.id as Filter,
    label: g.tab,
    count: getProjectsByGroup(g.id).length,
  })),
];

export const PATH_STATS = {
  projects: projects.length,
  chapters: projectGroups.length,
  soon: projects.filter(isComingSoon).length,
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------------------------------
 * Tech chips: how many fit on one row, per breakpoint, without measuring the DOM.
 * Geist Mono 10px with 0.12em tracking is ~7.2px per character; each chip adds ~28px of
 * padding, border and gap. Budgets are the inner card width minus the "BUILT WITH" label
 * (desktop only) and room for a "+N" chip.
 * ---------------------------------------------------------------------------------------- */
const chipCost = (t: string) => t.length * 7.2 + 28;

function fitChips(tech: string[], max: number, budget: number) {
  let used = 0;
  let count = 0;
  for (const t of tech) {
    if (count >= max) break;
    const cost = chipCost(t);
    if (count > 0 && used + cost > budget) break;
    used += cost;
    count++;
  }
  return count;
}

export function chipPlan(tech: string[]) {
  return {
    /** < 1024px: card ~300-330px wide, no label. */
    sm: fitChips(tech, 3, 214),
    /** 1024-1279px: card ~430px wide, with label. */
    lg: fitChips(tech, 4, 236),
    /** >= 1280px: card ~520px wide, with label. */
    xl: fitChips(tech, 4, 320),
  };
}

/* ------------------------------------------------------------------------------------------
 * "Back from a case study" restore.
 * ---------------------------------------------------------------------------------------- */
const RETURN_KEY = "pathway:return";

export function saveReturn(filter: Filter, slug: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify({ filter, slug }));
  } catch {
    /* storage blocked: nothing to restore later */
  }
}

/** Reads and clears the saved entry. */
export function takeReturn(): { filter: Filter; slug: string } | null {
  try {
    const raw = sessionStorage.getItem(RETURN_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RETURN_KEY);
    const parsed = JSON.parse(raw) as { filter?: string; slug?: string };
    const valid =
      parsed.filter === "all" || projectGroups.some((g) => g.id === parsed.filter);
    if (!valid || !parsed.slug || !projects.some((p) => p.slug === parsed.slug)) return null;
    return { filter: parsed.filter as Filter, slug: parsed.slug };
  } catch {
    return null;
  }
}

// Client-side back/forward navigations fire popstate before the home page remounts.
let lastPopState = -Infinity;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    lastPopState = performance.now();
  });
}

/** True when the home page was reached by going back (browser back, or the case study's "Back" link). */
export function isBackNavigation() {
  if (performance.now() - lastPopState < 5000) return true;
  if (window.location.hash === "#projects") return true;
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "back_forward" && performance.now() < 15000;
}
