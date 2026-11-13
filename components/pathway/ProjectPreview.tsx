"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/projectsData";

/**
 * Device mockup for a project card: a browser window for web projects, a fan of phones
 * for mobile ones. Screenshots crossfade while the card is on screen and its stop has been
 * reached; nothing cycles off screen or under reduced motion.
 */
interface Props {
  project: Project;
  /** The pathway has reached this card. */
  active: boolean;
  soon: boolean;
}

const CYCLE_MS = 2800;

function hostOf(project: Project) {
  if (project.live) {
    try {
      return new URL(project.live).hostname.replace(/^www\./, "");
    } catch {
      /* fall through */
    }
  }
  return `${project.slug}.app`;
}

function useCycle(count: number, enabled: boolean, rootRef: React.RefObject<HTMLElement | null>) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [rootRef]);

  useEffect(() => {
    if (!enabled || !visible || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [enabled, visible, count]);

  return index;
}

/**
 * Crossfading stack. Only the previous, current and next slides are mounted: the previous one
 * stays underneath so a not-yet-loaded image never flashes black, and the next one preloads.
 */
function Slides({
  images,
  index,
  sizes,
  alt,
}: {
  images: string[];
  index: number;
  sizes: string;
  alt: string;
}) {
  const n = images.length;
  const prev = (index - 1 + n) % n;
  const next = (index + 1) % n;
  return (
    <>
      {images.map((src, i) => {
        if (i !== index && i !== prev && i !== next) return null;
        const role = i === index ? "current" : i === prev && n > 1 ? "prev" : "next";
        return (
          <Image
            key={src}
            src={src}
            alt={role === "current" ? alt : ""}
            fill
            sizes={sizes}
            className={`object-cover object-top ${
              role === "current"
                ? "z-10 animate-[pw-slide-in_.7s_ease-out] motion-reduce:animate-none"
                : role === "prev"
                  ? "z-0"
                  : "z-0 opacity-0"
            }`}
          />
        );
      })}
    </>
  );
}

function BrowserWindow({
  host,
  children,
  className = "",
}: {
  host: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/12 bg-[#151210] shadow-[0_24px_50px_-18px_rgba(0,0,0,.9),0_0_0_1px_rgba(245,167,100,.06)] ${className}`}
    >
      <div className="flex h-[22px] items-center gap-1.5 border-b border-white/[.07] bg-[#1d1814] px-2.5 lg:h-[26px]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#ff6159]/80" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#ffbd2e]/80" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#28c941]/80" />
        <span className="mx-auto flex h-[14px] max-w-[62%] items-center gap-1 truncate rounded-full bg-black/40 px-2.5 font-mono text-[8.5px] text-white/50 lg:h-4 lg:text-[9.5px]">
          <svg aria-hidden viewBox="0 0 10 10" className="h-2 w-2 shrink-0 fill-white/40">
            <path d="M3 4V3a2 2 0 1 1 4 0v1h.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 2 8.5v-4a.5.5 0 0 1 .5-.5zm1 0h2V3a1 1 0 0 0-2 0z" />
          </svg>
          <span className="truncate">{host}</span>
        </span>
        <span className="w-[29px]" />
      </div>
      <div className="relative aspect-[16/10] bg-[#0f0c0a]">{children}</div>
    </div>
  );
}

/**
 * A frameless "screen card" for mobile projects. Many mobile screenshots (e.g. App Store
 * marketing shots) already include a phone frame, so drawing another bezel and notch around
 * them doubles up; a rounded card works for both framed and raw screenshots.
 */
function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`aspect-[9/19] overflow-hidden rounded-[18px] border border-white/15 bg-[#0f0c0a] shadow-[0_24px_50px_-18px_rgba(0,0,0,.9),0_0_0_1px_rgba(245,167,100,.08)] lg:rounded-[20px] ${className}`}
    >
      {children}
    </div>
  );
}

export default function ProjectPreview({ project, active, soon }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const images = project.images;
  const index = useCycle(images.length, active && !soon, rootRef);
  const at = (offset: number) => images[(index + offset) % images.length];
  const alt = `${project.title} screenshot`;

  if (project.orientation === "portrait") {
    return (
      <div ref={rootRef} className="pw-preview pw-preview--phone relative h-full">
        {images.length > 1 && (
          <Phone className="pw-pv-back-l absolute bottom-1 left-1/2 h-[82%] -translate-x-1/2 opacity-70">
            <Image src={at(1)} alt="" fill sizes="110px" className="object-cover object-top" />
          </Phone>
        )}
        {images.length > 2 && (
          <Phone className="pw-pv-back-r absolute bottom-1 left-1/2 h-[82%] -translate-x-1/2 opacity-70">
            <Image src={at(2)} alt="" fill sizes="110px" className="object-cover object-top" />
          </Phone>
        )}
        <Phone className="pw-pv-front absolute bottom-1 left-1/2 z-10 h-[96%] -translate-x-1/2">
          <Slides images={images} index={index} sizes="(min-width:1024px) 130px, 100px" alt={alt} />
        </Phone>
      </div>
    );
  }

  const host = hostOf(project);
  return (
    <div ref={rootRef} className="pw-preview pw-preview--web relative h-full">
      {images.length > 1 && (
        <BrowserWindow host={host} className="pw-pv-back-l absolute bottom-3 left-1/2 w-[66%] -translate-x-1/2 opacity-60 lg:w-[62%]">
          <Image src={at(1)} alt="" fill sizes="300px" className="object-cover object-top" />
        </BrowserWindow>
      )}
      {images.length > 2 && (
        <BrowserWindow host={host} className="pw-pv-back-r absolute bottom-3 left-1/2 w-[66%] -translate-x-1/2 opacity-60 lg:w-[62%]">
          <Image src={at(2)} alt="" fill sizes="300px" className="object-cover object-top" />
        </BrowserWindow>
      )}
      <BrowserWindow host={host} className="pw-pv-front absolute bottom-1 left-1/2 z-10 w-[78%] -translate-x-1/2 lg:w-[72%]">
        <Slides images={images} index={index} sizes="(min-width:1024px) 400px, 300px" alt={alt} />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full bg-black/45 px-1.5 py-1 backdrop-blur-sm">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-3.5 bg-[#f5a764]" : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </BrowserWindow>
    </div>
  );
}
