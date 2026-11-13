"use client";

// The Path's scroll engine. One ScrollTrigger on the list drives the spine fill, the comet and
// every node state (written straight to the DOM as data-state). React only hears about discrete
// changes: the active project / chapter, and which folders should be open.
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import type { Filter } from "./model";

export interface PendingJump {
  slug: string;
  /** Only consume once this filter is rendered. */
  filter?: Filter;
  /** Wait two frames (lets Next's own hash/scroll restoration run first). */
  deferred?: boolean;
}

export interface PathwayEngine {
  /** Smooth-travel to a project card (index on the visible path). */
  travelTo(index: number): void;
  /** Smooth-travel to a chapter row. */
  travelToChapter(groupId: string): void;
  /** Stop node/folder state changes (used while the list is swapped). */
  freeze(): void;
  /** Jump (immediately) to a card once it's rendered. */
  setPending(p: PendingJump | null): void;
}

interface Internal {
  travelTo(index: number): void;
  travelToChapter(groupId: string): void;
  freeze(): void;
  consume(): void;
}

/** Where a travelled-to card's top lands: under the navbar (80px) + desktop HUD (92-156px). */
const CARD_TOP_DESKTOP = 176;
const CARD_TOP_MOBILE = 100;
const CHAPTER_TOP_DESKTOP = 108;
const CHAPTER_TOP_MOBILE = 36;

type Mode = "scroll" | "instant" | "arrival";

interface Options {
  rootRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  filter: Filter;
  /** Active project (-1 before the first) and chapter ordinal changed. */
  onPosition: (active: number, chapter: number) => void;
  /** These folders should open now. */
  onOpen: (slugs: string[]) => void;
}

export function usePathwayScroll({ rootRef, listRef, filter, onPosition, onOpen }: Options) {
  const emitPosition = useEffectEvent(onPosition);
  const emitOpen = useEffectEvent(onOpen);
  const internal = useRef<Internal | null>(null);
  const pending = useRef<PendingJump | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;

    const mm = gsap.matchMedia(root);
    mm.add(
      {
        desktop: "(min-width: 1024px)",
        reduce: "(prefers-reduced-motion: reduce)",
        // gsap.matchMedia only runs this setup when at least one condition matches, so
        // without a catch-all the pathway never initialises on phones/tablets.
        any: "all",
      },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        const motion = !reduce;
        const playhead = desktop ? 0.55 : 0.5;

        const itemEls = gsap.utils.toArray<HTMLElement>("[data-pw-item]", list);
        const nodeEls = itemEls.map((el) => el.querySelector<HTMLElement>("[data-pw-node]") ?? el);
        const cardEls = itemEls.map((el) => el.querySelector<HTMLElement>("[data-pw-card]") ?? el);
        const soon = itemEls.map((el) => el.dataset.kind === "soon");
        const slugs = itemEls.map((el) => el.dataset.slug ?? "");
        const chapterOf = itemEls.map((el) => Number(el.dataset.chapter ?? 0));
        const chapterEls = gsap.utils.toArray<HTMLElement>("[data-pw-chapter]", list);
        const chapterNodes = chapterEls.map(
          (el) => el.querySelector<HTMLElement>("[data-pw-node]") ?? el
        );
        const endEl = list.querySelector<HTMLElement>("[data-pw-end]");
        const endNode = endEl?.querySelector<HTMLElement>("[data-pw-node]") ?? null;
        const spine = list.querySelector<HTMLElement>("[data-pw-spine]");
        const fill = list.querySelector<HTMLElement>("[data-pw-fill]");
        const head = list.querySelector<HTMLElement>("[data-pw-head]");
        const tail = list.querySelector<HTMLElement>("[data-pw-tail]");
        const huds = gsap.utils.toArray<HTMLElement>("[data-pw-hud]", root);
        const n = itemEls.length;

        let offsets: number[] = [];
        let chapterOffsets: number[] = [];
        let length = 1;
        const states: string[] = new Array(n).fill("");
        const chapterStates: string[] = new Array(chapterEls.length).fill("");
        let endState = "";
        const seen = new Set<number>();
        let active = -2;
        let chapter = -2;
        let frozen = false;
        let travelling: (() => void) | null = null;

        const timeouts = new Set<number>();
        const later = (fn: () => void, ms: number) => {
          const id = window.setTimeout(() => {
            timeouts.delete(id);
            fn();
          }, ms);
          timeouts.add(id);
          return id;
        };
        const rafs = new Set<number>();
        const frame = (fn: () => void) => {
          const id = requestAnimationFrame(() => {
            rafs.delete(id);
            fn();
          });
          rafs.add(id);
        };

        // Node centres relative to the list top. Nodes live outside the animated card
        // wrappers, so entrance transforms never skew these.
        const measure = () => {
          const top = list.getBoundingClientRect().top;
          const mid = (el: HTMLElement) => {
            const r = el.getBoundingClientRect();
            return r.top + r.height / 2 - top;
          };
          offsets = nodeEls.map(mid);
          chapterOffsets = chapterNodes.map(mid);
          length = Math.max(1, endNode ? mid(endNode) : list.offsetHeight);
          if (spine) spine.style.height = `${length}px`;
        };

        // Kill CSS transitions for a frame so states set on load / after a jump don't cascade.
        let instantQueued = false;
        const instant = () => {
          if (instantQueued) return;
          instantQueued = true;
          list.classList.add("pw-instant");
          frame(() =>
            frame(() => {
              instantQueued = false;
              list.classList.remove("pw-instant");
            })
          );
        };

        const toOpen = new Set<string>();
        let openTimer = 0;
        const flushOpen = () => {
          openTimer = 0;
          if (!toOpen.size) return;
          const batch = [...toOpen];
          toOpen.clear();
          emitOpen(batch);
        };

        const burst = (i: number) => {
          const ring = nodeEls[i].querySelector(".pw-burst");
          if (!ring) return;
          ctx.add(() => {
            gsap.fromTo(
              ring,
              { scale: 1, opacity: 0.6 },
              { scale: 2.6, opacity: 0, duration: 0.6, ease: "expo.out", overwrite: true }
            );
          });
        };

        const apply = (lit: number, mode: Mode, dest = -1) => {
          let idx = -1;
          for (let i = 0; i < n; i++) {
            if (offsets[i] <= lit + 0.5) idx = i;
            else break;
          }
          const fresh: number[] = [];
          for (let i = 0; i < n; i++) {
            const s = i < idx ? "reached" : i === idx ? "active" : soon[i] ? "soon" : "future";
            if (states[i] === s) continue;
            if (mode === "instant") instant();
            states[i] = s;
            itemEls[i].dataset.state = s;
            if ((s === "reached" || s === "active") && !seen.has(i)) {
              seen.add(i);
              fresh.push(i);
            }
          }
          let ch = -1;
          for (let c = 0; c < chapterEls.length; c++) {
            const s = chapterOffsets[c] <= lit + 0.5 ? "reached" : "future";
            if (s === "reached") ch = c;
            if (chapterStates[c] === s) continue;
            if (mode === "instant") instant();
            chapterStates[c] = s;
            chapterEls[c].dataset.state = s;
          }
          if (endEl) {
            const s = lit >= length - 1 ? "reached" : "future";
            if (s !== endState) {
              endState = s;
              endEl.dataset.state = s;
            }
          }

          if (fresh.length) {
            // Celebrate (burst + delayed folder fan) only what the visitor actually watched
            // arrive. Jumps, reloads and fast flings open everything at once instead.
            const celebrate =
              !motion || mode === "instant"
                ? []
                : mode === "arrival"
                  ? fresh.filter((i) => i === dest)
                  : fresh.length <= 2
                    ? fresh
                    : fresh.filter((i) => i === idx);
            const quiet = fresh.filter((i) => !celebrate.includes(i));
            if (quiet.length) emitOpen(quiet.map((i) => slugs[i]));
            for (const i of celebrate) {
              burst(i);
              toOpen.add(slugs[i]);
            }
            if (celebrate.length && !openTimer) openTimer = later(flushOpen, 250);
          }

          const chOut = Math.max(0, ch);
          if (idx !== active || chOut !== chapter) {
            active = idx;
            chapter = chOut;
            emitPosition(idx, chOut);
          }
        };

        const setFill = fill ? gsap.quickSetter(fill, "scaleY") : null;
        const setHead = head ? gsap.quickSetter(head, "y", "px") : null;
        const tailTo =
          motion && tail
            ? gsap.quickTo(tail, "scaleY", { duration: 0.35, ease: "power3.out" })
            : null;
        const settle = tailTo ? gsap.delayedCall(0.12, () => tailTo(1)).pause() : null;
        const draw = (lit: number) => {
          setFill?.(lit / length);
          setHead?.(lit);
        };
        const litOf = (self: ScrollTrigger) =>
          gsap.utils.clamp(0, length, self.scroll() - self.start);

        const main = ScrollTrigger.create({
          trigger: list,
          start: `top ${playhead * 100}%`,
          end: () => {
            measure();
            return `+=${length}`;
          },
          onRefresh: (self) => {
            const lit = litOf(self);
            draw(lit);
            if (!frozen) apply(lit, "instant");
          },
          onUpdate: (self) => {
            const lit = litOf(self);
            draw(lit);
            if (tailTo && settle) {
              tailTo(1 + gsap.utils.clamp(0, 2, Math.abs(self.getVelocity()) / 1500));
              settle.restart(true);
            }
            if (!frozen) apply(lit, "scroll");
          },
        });
        const litNow = () => gsap.utils.clamp(0, length, window.scrollY - main.start);

        // HUD (desktop flight deck, skip pill, mobile dock): only while the list is on screen.
        const setHud = (on: boolean) => {
          for (const el of huds) {
            el.dataset.visible = on ? "true" : "false";
            el.inert = !on;
          }
        };
        const hudTrigger = ScrollTrigger.create({
          trigger: list,
          start: desktop ? "top 35%" : "top 55%",
          end: () => `top+=${length} ${desktop ? 45 : 40}%`,
          onToggle: (self) => setHud(self.isActive),
        });
        setHud(hudTrigger.isActive);

        // ---- travel (rail clicks, chapter jumps) -------------------------------------------
        const travel = (y: number, dest: number) => {
          travelling?.();
          const dist = Math.abs(y - window.scrollY);
          const duration = gsap.utils.clamp(0.6, 1.8, 0.5 + dist / 3500);
          frozen = true;
          if (dest >= 0 && (dest !== active || chapterOf[dest] !== chapter)) {
            // The HUD shows the destination straight away; the path catches up on arrival.
            active = dest;
            chapter = chapterOf[dest];
            emitPosition(dest, chapter);
          }
          let done = false;
          let fallback = 0;
          const cancel = () => {
            done = true;
            travelling = null;
            window.clearTimeout(fallback);
            timeouts.delete(fallback);
            window.removeEventListener("wheel", finish);
            window.removeEventListener("touchstart", finish);
          };
          function finish() {
            if (done) return;
            cancel();
            frozen = false;
            const lit = litNow();
            draw(lit);
            apply(lit, "arrival", dest);
          }
          travelling = cancel;
          fallback = later(finish, duration * 1000 + 600);
          // A wheel/touch takes over from the programmatic scroll: resume live tracking.
          window.addEventListener("wheel", finish, { passive: true });
          window.addEventListener("touchstart", finish, { passive: true });
          scrollToTarget(y, { duration, immediate: !motion, onComplete: finish });
        };

        const cardY = (i: number) =>
          itemEls[i].getBoundingClientRect().top +
          window.scrollY -
          (desktop ? CARD_TOP_DESKTOP : CARD_TOP_MOBILE);

        const jump = (i: number) => {
          frozen = true;
          scrollToTarget(cardY(i), { immediate: true });
          frozen = false;
          const lit = litNow();
          draw(lit);
          apply(lit, "instant");
        };

        const consume = () => {
          const p = pending.current;
          if (!p) return;
          if (p.filter && p.filter !== filter) return;
          pending.current = null;
          const i = slugs.indexOf(p.slug);
          if (i < 0) return;
          if (p.deferred) frame(() => frame(() => jump(i)));
          else jump(i);
        };

        internal.current = {
          travelTo: (i) => {
            if (i < 0 || i >= n) return;
            travel(cardY(i), i);
          },
          travelToChapter: (groupId) => {
            const row = chapterEls.find((el) => el.dataset.group === groupId);
            if (!row) return;
            const y =
              row.getBoundingClientRect().top +
              window.scrollY -
              (desktop ? CHAPTER_TOP_DESKTOP : CHAPTER_TOP_MOBILE);
            travel(y, -1);
          },
          freeze: () => {
            frozen = true;
          },
          consume,
        };

        const restoring =
          !!pending.current?.deferred &&
          (!pending.current.filter || pending.current.filter === filter);

        // ---- entrances (motion only, only for what's below the fold right now) ------------
        if (motion && !restoring) {
          const vh = window.innerHeight;
          const below = cardEls.filter((c) => c.getBoundingClientRect().top > vh * 0.88);
          for (const c of below) {
            const side = c.closest<HTMLElement>("[data-pw-item]")?.dataset.side;
            gsap.set(c, {
              autoAlpha: 0,
              x: desktop ? (side === "right" ? 48 : -48) : 0,
              y: desktop ? 0 : 36,
              scale: 0.96,
            });
          }
          if (below.length) {
            ScrollTrigger.batch(below, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  duration: 0.7,
                  ease: "power3.out",
                  stagger: 0.08,
                  overwrite: true,
                  clearProps: "transform",
                }),
            });
          }

          for (const row of chapterEls) {
            const target = row.querySelector<HTMLElement>("[data-pw-split]");
            if (!target || row.getBoundingClientRect().top < vh * 0.8) continue;
            const split = SplitText.create(target, { type: "words,chars", mask: "chars" });
            gsap.from(split.chars, {
              yPercent: 115,
              duration: 0.6,
              ease: "power4.out",
              stagger: 0.02,
              scrollTrigger: { trigger: row, start: "top 80%", once: true },
            });
          }
        }

        consume();

        return () => {
          travelling?.();
          frozen = true;
          timeouts.forEach((id) => window.clearTimeout(id));
          timeouts.clear();
          rafs.forEach((id) => cancelAnimationFrame(id));
          rafs.clear();
          settle?.kill();
          list.classList.remove("pw-instant");
          internal.current = null;
        };
      }
    );

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [filter, rootRef, listRef]);

  // Layout above us (the hero) and web fonts change heights: keep trigger positions fresh.
  useEffect(() => {
    let t = 0;
    let alive = true;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return useMemo<PathwayEngine>(
    () => ({
      travelTo: (i) => internal.current?.travelTo(i),
      travelToChapter: (id) => internal.current?.travelToChapter(id),
      freeze: () => internal.current?.freeze(),
      setPending: (p) => {
        pending.current = p;
        internal.current?.consume();
      },
    }),
    []
  );
}
