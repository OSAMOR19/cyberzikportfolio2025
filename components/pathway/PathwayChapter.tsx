"use client";

import { memo } from "react";
import { pad2, type PathChapter } from "./model";

/** Chapter row: diamond on the spine, "CHAPTER 02" + title on one side, blurb + count on the other. */
function PathwayChapterImpl({ chapter }: { chapter: PathChapter }) {
  const { group, number, items } = chapter;
  const num = pad2(number);
  return (
    <div
      data-pw-chapter
      data-group={group.id}
      data-state="future"
      className="pw-chapter pb-7 pt-14 lg:pb-10 lg:pt-16"
    >
      <span aria-hidden data-pw-node className="pw-diamond" />
      <span
        aria-hidden
        className="pw-chapter-ghost pointer-events-none absolute right-0 top-6 select-none font-orbitron text-[140px] font-bold leading-none lg:left-[calc(50%+28px)] lg:right-auto lg:top-2 lg:text-[200px]"
      >
        {num}
      </span>
      <div className="relative pl-[var(--conn-w)] lg:grid lg:grid-cols-2 lg:pl-0">
        <div className="lg:pr-16 lg:text-right">
          <p className="pw-chapter-label font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">
            Chapter {num}
          </p>
          <h3
            id={`chapter-${group.id}`}
            className="mt-3 font-orbitron text-[28px] font-bold leading-[1.15] text-white lg:text-[clamp(32px,4vw,52px)] lg:leading-[1.1]"
          >
            <span data-pw-split>{group.label}</span>
          </h3>
        </div>
        <div className="mt-3 lg:mt-0 lg:pl-16 lg:pt-8">
          <p className="max-w-sm text-[15px] leading-relaxed text-gray-400">{group.blurb}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
            {pad2(items.length)} {items.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </div>
    </div>
  );
}

const PathwayChapter = memo(PathwayChapterImpl);
export default PathwayChapter;
