"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Folder from "../Folder";
import type { Project } from "@/lib/projectsData";
import { chipPlan, pad2, type PathItem } from "./model";

interface Props {
  item: PathItem;
  open: boolean;
  onSoon: (project: Project) => void;
  onNavigate: (slug: string) => void;
}

const FOLDER_SIZES = "(min-width: 1024px) 150px, 124px";

function Chips({ tech, soon }: { tech: string[]; soon: boolean }) {
  const plan = chipPlan(tech);
  const max = Math.max(plan.sm, plan.lg, plan.xl);
  const more = (shown: number) => tech.length - shown;
  const chip = `h-7 items-center rounded-full border px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
    soon ? "border-white/10 text-gray-500" : "border-white/12 text-gray-300"
  }`;
  return (
    <div className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap">
      <span className="mr-1.5 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 lg:inline">
        Built with
      </span>
      {tech.slice(0, max).map((t, k) => (
        <span
          key={t}
          className={`${chip} ${k < plan.sm ? "inline-flex" : "hidden"} ${
            k < plan.lg ? "lg:inline-flex" : "lg:hidden"
          } ${k < plan.xl ? "xl:inline-flex" : "xl:hidden"}`}
        >
          {t}
        </span>
      ))}
      {more(plan.sm) > 0 && (
        <span className={`${chip} inline-flex text-gray-500 lg:hidden`}>+{more(plan.sm)}</span>
      )}
      {more(plan.lg) > 0 && (
        <span className={`${chip} hidden text-gray-500 lg:inline-flex xl:hidden`}>
          +{more(plan.lg)}
        </span>
      )}
      {more(plan.xl) > 0 && (
        <span className={`${chip} hidden text-gray-500 xl:inline-flex`}>+{more(plan.xl)}</span>
      )}
    </div>
  );
}

const external = (project: Project) =>
  [
    project.live && { href: project.live, label: "Live", long: "Live site", Icon: ArrowUpRight },
    project.appStore && {
      href: project.appStore,
      label: "App Store",
      long: "App Store",
      Icon: FaApple,
    },
    project.playStore && {
      href: project.playStore,
      label: "Google Play",
      long: "Google Play",
      Icon: FaGooglePlay,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    long: string;
    Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  }[];

function PathwayCardImpl({ item, open, onSoon, onNavigate }: Props) {
  const { project, index, side, soon } = item;
  const num = pad2(index + 1);
  const links = soon ? [] : external(project);

  const folder = (
    <div className="pw-folder relative h-[190px] shrink-0 lg:h-[250px]">
      <span
        aria-hidden
        className={`pw-ghost pointer-events-none absolute top-2 select-none font-orbitron text-[88px] font-bold leading-none lg:top-3 lg:text-[120px] ${
          side === "right" ? "right-5 lg:right-6" : "right-5 lg:left-6 lg:right-auto"
        }`}
      >
        {num}
      </span>
      <div
        className={`absolute inset-x-0 bottom-[46px] flex justify-center lg:bottom-[62px] ${
          soon ? "opacity-70 grayscale" : ""
        }`}
      >
        <div className="scale-[1.2] lg:scale-[1.45]">
          <Folder
            size={1}
            color="#f5c895"
            items={project.images}
            open={open}
            interactive={false}
            imageSizes={FOLDER_SIZES}
          />
        </div>
      </div>
    </div>
  );

  const header = (
    <>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 max-w-full items-center truncate rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-wider ${
            soon ? "bg-white/[.07] text-gray-400" : "bg-[#f5a764]/15 text-[#f5a764]"
          }`}
        >
          {project.category}
        </span>
      </div>
    </>
  );

  if (soon) {
    return (
      <li
        data-pw-item
        data-index={index}
        data-side={side}
        data-kind="soon"
        data-state="soon"
        data-slug={project.slug}
        data-chapter={item.chapterOrdinal}
        className="pw-item"
      >
        <span aria-hidden className="pw-conn">
          <span className="pw-conn-lit" />
        </span>
        <span aria-hidden data-pw-node className="pw-node">
          <span className="pw-burst" />
        </span>
        <span aria-hidden className="pw-idx">
          {num}
        </span>
        <div data-pw-card>
          <div
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-label={`${project.title}: coming soon`}
            onClick={() => onSoon(project)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSoon(project);
              }
            }}
            className="pw-card group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-dashed border-white/[.12] bg-[#0c0c0e]/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
          >
            <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#f5a764]/40 bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f5a764] lg:right-5 lg:top-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5a764] opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f5a764]" />
              </span>
              Coming soon
            </span>
            {folder}
            <div className="flex flex-1 flex-col px-5 pb-5 lg:px-7 lg:pb-7">
              {header}
              <h4 className="mt-2.5 line-clamp-2 font-orbitron text-[21px] leading-[1.22] text-gray-300 lg:text-[26px]">
                {project.title}
              </h4>
              <p className="mt-2.5 line-clamp-3 text-[14px] leading-[22px] text-gray-500 lg:text-[15px] lg:leading-6">
                {project.description}
              </p>
              <div className="mt-auto pt-4">
                <Chips tech={project.tech} soon />
              </div>
              <div className="mt-4 flex">
                <span className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-dashed border-white/20 text-sm font-bold text-gray-400 transition-colors group-hover:border-[#f5a764]/50 group-hover:text-gray-200">
                  In the pipeline · tell me more
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      data-pw-item
      data-index={index}
      data-side={side}
      data-kind="live"
      data-state="future"
      data-slug={project.slug}
      data-chapter={item.chapterOrdinal}
      className="pw-item"
    >
      <span aria-hidden className="pw-conn">
        <span className="pw-conn-lit" />
      </span>
      <span aria-hidden data-pw-node className="pw-node">
        <span className="pw-burst" />
      </span>
      <span aria-hidden className="pw-idx">
        {num}
      </span>
      <div data-pw-card>
        <article className="pw-card group relative flex flex-col overflow-hidden rounded-3xl border border-white/[.08] bg-[#0c0c0e]/90">
          {folder}
          <div className="flex flex-1 flex-col px-5 pb-5 lg:px-7 lg:pb-7">
            {header}
            <h4 className="mt-2.5 line-clamp-2 font-orbitron text-[21px] leading-[1.22] text-white lg:text-[26px]">
              <Link
                href={`/projects/${project.slug}`}
                onClick={() => onNavigate(project.slug)}
                className="outline-none after:absolute after:inset-0 after:z-[1] after:rounded-3xl after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[#f5a764]"
              >
                {project.title}
              </Link>
            </h4>
            <p className="mt-2.5 line-clamp-3 text-[14px] leading-[22px] text-gray-400 lg:text-[15px] lg:leading-6">
              {project.description}
            </p>
            <div className="mt-auto pt-4">
              <Chips tech={project.tech} soon={false} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#f5a764] px-5 text-sm font-bold text-black shadow-[0_0_24px_-6px_rgba(245,167,100,.6)] transition-colors duration-300 group-hover:bg-[#f5c895] lg:flex-none lg:px-6"
              >
                View project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              {links.map(({ href, label, long, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${long}: ${project.title} (opens in a new tab)`}
                  className="relative z-10 inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-white/15 bg-black/30 text-sm font-semibold text-white transition-colors hover:border-[#f5a764]/70 hover:text-[#f5c895] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764] xl:px-4"
                >
                  <Icon aria-hidden className="h-4 w-4 xl:hidden" />
                  <span className="hidden xl:inline">{label} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </li>
  );
}

const PathwayCard = memo(PathwayCardImpl);
export default PathwayCard;
