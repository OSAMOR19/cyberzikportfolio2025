"use client";

import { useLayoutEffect, useRef, type Ref } from "react";
import type { Filter } from "./model";

interface Props {
  filter: Filter;
  tabs: { id: Filter; label: string; count: number }[];
  onSelect: (next: Filter) => void;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Filter tabs with a sliding highlight. The highlight is positioned by writing to the DOM
 * (no React state), and the row scrolls sideways on small screens with faded edges.
 */
export default function FilterTabs({ filter, tabs, onSelect, ref }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttons = useRef(new Map<Filter, HTMLButtonElement>());

  useLayoutEffect(() => {
    const row = rowRef.current;
    const pill = pillRef.current;
    if (!row || !pill) return;

    const place = () => {
      const btn = buttons.current.get(filter);
      if (!btn) return;
      pill.style.width = `${btn.offsetWidth}px`;
      pill.style.height = `${btn.offsetHeight}px`;
      pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
      pill.style.opacity = "1";
    };
    place();
    // Enable the slide only after the first placement, so it doesn't fly in from 0,0.
    const raf = requestAnimationFrame(() => {
      pill.dataset.ready = "true";
    });

    // Keep the chosen tab in view when the row scrolls sideways (mobile). Horizontal only:
    // scrollIntoView would also scroll the page.
    const scroller = scrollerRef.current;
    const btn = buttons.current.get(filter);
    if (scroller && btn && scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollTo({
        left: btn.offsetLeft - (scroller.clientWidth - btn.offsetWidth) / 2,
        behavior: pill.dataset.ready ? "smooth" : "auto",
      });
    }

    const ro = new ResizeObserver(place);
    ro.observe(row);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [filter]);

  return (
    <div ref={ref} className="relative">
      <div
        ref={scrollerRef}
        className="-mx-4 overflow-x-auto px-4 py-1 [mask-image:linear-gradient(90deg,transparent,#000_28px,#000_calc(100%-28px),transparent)] [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={rowRef}
          role="group"
          aria-label="Filter projects by type"
          className="relative mx-auto flex w-max gap-2.5 pr-4 md:w-auto md:flex-wrap md:justify-center md:gap-3 md:pr-0"
        >
          <span
            ref={pillRef}
            aria-hidden
            style={{ opacity: 0 }}
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-[#f5a764] shadow-[0_0_30px_rgba(245,167,100,.45)] data-ready:transition-[transform,width,height] data-ready:duration-500 data-ready:ease-[cubic-bezier(0.65,0,0.35,1)]"
          />
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) buttons.current.set(tab.id, el);
                  else buttons.current.delete(tab.id);
                }}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(tab.id)}
                className={`relative z-10 h-11 whitespace-nowrap rounded-full border px-5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764] active:scale-95 motion-reduce:active:scale-100 ${
                  active
                    ? "border-transparent text-black"
                    : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-[#f5a764]/60 hover:text-white"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 font-mono text-xs tabular-nums transition-colors duration-300 ${
                    active ? "text-black/60" : "text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
