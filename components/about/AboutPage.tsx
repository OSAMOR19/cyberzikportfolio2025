"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import PixelSnow from "../PixelSnow";
import SmoothScroll from "../SmoothScroll";
import PianoKeys from "./PianoKeys";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { projects, projectGroups, orderedProjects, isComingSoon } from "@/lib/projectsData";

const shippedProjects = orderedProjects.filter((p) => !isComingSoon(p));

const STATS = [
  { value: projects.length, suffix: "", label: "projects built" },
  { value: 5, suffix: "+", label: "years in software" },
  { value: projects.filter((p) => p.appStore || p.playStore).length, suffix: "", label: "apps in the app stores" },
  { value: projectGroups.length, suffix: "", label: "product domains" },
];

type Media = "blueprint" | "work" | "world" | "piano" | "art" | null;

const CHAPTERS: {
  kicker: string;
  title: string;
  body: string[];
  media: Media;
}[] = [
  {
    kicker: "Where it started",
    title: "Built on engineering",
    body: [
      "Before I wrote my first line of code, I was a civil engineer. Engineering trained me to think in systems, to plan before I build, and to care about the details nobody sees but everybody relies on.",
      "A structure either holds up or it doesn't. That mindset never left me.",
    ],
    media: "blueprint",
  },
  {
    kicker: "The switch",
    title: "Falling for software",
    body: [
      "Over five years ago I followed a curiosity that kept growing: software. Here was a kind of engineering where you could build something on a laptop and put it in the hands of people anywhere in the world the same day.",
      "I made the move from civil engineering into software engineering, and the passion has only grown since. I still approach every product like an engineer: understand the problem, design something solid, then ship it so it holds up under real use.",
    ],
    media: "work",
  },
  {
    kicker: "Building for the world",
    title: "Apps people use every day",
    body: [
      "Today I work with startups, companies and creators across the UK, Africa and beyond. I've shipped fullstack web platforms, mobile apps that are live on the App Store and Google Play, AI products and onchain apps.",
      "Lots of people around the world use what I've built, and that still feels like the best part of the job.",
    ],
    media: "world",
  },
  {
    kicker: "Music",
    title: "The piano in me",
    body: [
      "I love music, and I love playing the piano. Practice, rhythm and patience have shaped how I build software as much as anything else.",
      "It's also how I came to build for SymphoMe, an AI-powered music education platform: my love for music was a big part of why they chose me. Building something for a thing you love is the best kind of work.",
    ],
    media: "piano",
  },
  {
    kicker: "Art",
    title: "An eye for art",
    body: [
      "Art is everywhere in my space, and it shapes how I think about design.",
      "That love for art is what brought me to Neftwerk. It was a big reason they chose me to help build My Pocket Gallery, the app where collectors discover original work from independent artists and galleries around the world.",
    ],
    media: "art",
  },
  {
    kicker: "Today",
    title: "Still an engineer at heart",
    body: [
      "Civil engineer turned software engineer, pianist and art lover: every part of that story shows up in what I build. If you have a product you want to bring to life, I'd love to hear about it.",
    ],
    media: null,
  },
];

const LINK_PILL =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#f5a764]/70 hover:text-[#f5c895] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]";

function Blueprint() {
  // A civil-engineering truss elevation, drawn as a blueprint. Every stroke uses pathLength=1
  // so GSAP can "draw" it with stroke-dashoffset.
  const bottom = Array.from({ length: 9 }, (_, i) => 40 + i * 50);
  const zigzag = bottom
    .flatMap((x, i) => (i < bottom.length - 1 ? [`${x},200`, `${x + 25},130`] : [`${x},200`]))
    .join(" ");
  return (
    <figure className="relative overflow-hidden rounded-3xl border border-[#f5a764]/20 bg-[#0d0a08]">
      <svg viewBox="0 0 480 300" className="block w-full" role="img" aria-label="Line drawing of a steel truss bridge, like an engineering blueprint">
        <defs>
          <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(245,167,100,.07)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="480" height="300" fill="url(#bp-grid)" />
        <g fill="none" stroke="#f5a764" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line data-bp x1="20" y1="200" x2="460" y2="200" pathLength={1} />
          <line data-bp x1="65" y1="130" x2="415" y2="130" pathLength={1} />
          <polyline data-bp points={zigzag} pathLength={1} />
          <polyline data-bp points="40,200 28,222 52,222 40,200" pathLength={1} />
          <polyline data-bp points="440,200 428,222 452,222 440,200" pathLength={1} />
          <line data-bp x1="20" y1="226" x2="460" y2="226" strokeOpacity=".4" pathLength={1} />
        </g>
        <g fill="none" stroke="rgba(245,200,149,.55)" strokeWidth="1">
          <line data-bp x1="40" y1="258" x2="440" y2="258" pathLength={1} />
          <line data-bp x1="40" y1="250" x2="40" y2="266" pathLength={1} />
          <line data-bp x1="440" y1="250" x2="440" y2="266" pathLength={1} />
          <line data-bp x1="65" y1="100" x2="65" y2="122" strokeDasharray="3 4" pathLength={1} />
          <line data-bp x1="415" y1="100" x2="415" y2="122" strokeDasharray="3 4" pathLength={1} />
        </g>
        <text x="240" y="282" textAnchor="middle" fill="rgba(245,200,149,.7)" fontSize="10" fontFamily="var(--font-geist-mono), monospace" letterSpacing="2">
          SPAN 24.00 M
        </text>
        <text x="20" y="34" fill="rgba(245,167,100,.8)" fontSize="10" fontFamily="var(--font-geist-mono), monospace" letterSpacing="2">
          TRUSS ELEVATION · SCALE 1:100
        </text>
        <text x="460" y="34" textAnchor="end" fill="rgba(255,255,255,.35)" fontSize="10" fontFamily="var(--font-geist-mono), monospace" letterSpacing="2">
          DWG 01
        </text>
      </svg>
      <figcaption className="border-t border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
        Engineering first. Everything I build still starts with structure.
      </figcaption>
    </figure>
  );
}

function Photo({
  src,
  alt,
  caption,
  ratio = "aspect-[4/5]",
  sizes = "(max-width: 1024px) 90vw, 520px",
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  sizes?: string;
}) {
  return (
    <figure className="group">
      <div className={`relative ${ratio} overflow-hidden rounded-3xl border border-white/10 bg-[#120c08] shadow-[0_40px_80px_-40px_rgba(245,167,100,.35)]`}>
        <div data-parallax className="absolute inset-[-8%]">
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#f5a764]/10" />
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}

function ChapterMedia({ media }: { media: Media }) {
  switch (media) {
    case "blueprint":
      return <Blueprint />;
    case "work":
      return (
        <Photo
          src="/about/isaac-at-work.jpg"
          alt="Isaac's hands on his laptop keyboard at his desk"
          caption="Same engineer, new tools."
          ratio="aspect-[16/15]"
        />
      );
    case "world":
      return (
        <div className="space-y-6">
          <Photo src="/about/isaac-smile.jpg" alt="Isaac Osamor smiling at his desk next to his laptop" ratio="aspect-[4/4.2]" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            {/* Moving strip of shipped projects (static, wrapped list when reduced motion is on) */}
            <ul className="hidden w-max gap-3 px-3 motion-safe:flex motion-safe:animate-marquee" aria-hidden>
              {[...shippedProjects, ...shippedProjects].map((p, i) => (
                <li key={`${p.slug}-${i}`} className="whitespace-nowrap rounded-full border border-white/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5c895]/80">
                  {p.title}
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2 px-3 motion-safe:sr-only">
              {shippedProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="inline-block rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f5c895]/80 hover:text-white">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "piano":
      return (
        <div className="rounded-3xl border border-white/10 bg-[#0d0a08]/90 p-6 sm:p-8">
          <PianoKeys />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/projects/symphome-landing" className={LINK_PILL}>
              SymphoMe website →
            </Link>
            <Link href="/projects/symphome" className={LINK_PILL}>
              SymphoMe app →
            </Link>
          </div>
        </div>
      );
    case "art":
      return (
        <div className="space-y-5">
          <Photo
            src="/about/wall-art.jpg"
            alt="Two framed prints on Isaac's wall: a 'Talkless' sculpture print and a Fela Kuti poster"
            caption="The wall behind my desk."
            ratio="aspect-[4/3]"
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/projects/my-pocket-gallery-app" className={LINK_PILL}>
              My Pocket Gallery app →
            </Link>
            <Link href="/projects/my-pocket-gallery" className={LINK_PILL}>
              The web platform →
            </Link>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const story = storyRef.current;
    if (!root || !story) return;

    const mm = gsap.matchMedia(root);
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { motion } = ctx.conditions as { motion: boolean; reduce: boolean };
        const fill = story.querySelector<HTMLElement>("[data-line-fill]");
        const headTrack = story.querySelector<HTMLElement>("[data-line-head]");
        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", story);

        // Nodes light up once the playhead has passed them (and go dark again scrolling back up).
        nodes.forEach((node) =>
          ScrollTrigger.create({
            trigger: node,
            start: "top 55%",
            end: "max",
            toggleClass: { targets: node, className: "is-on" },
          })
        );

        if (!motion) {
          gsap.set(fill, { scaleY: 1 });
          gsap.set(headTrack, { autoAlpha: 0 });
          gsap.set(gsap.utils.toArray("[data-bp]", root), { strokeDashoffset: 0 });
          gsap.utils.toArray<HTMLElement>("[data-count]", root).forEach((el) => {
            el.textContent = el.dataset.count ?? "";
          });
          return;
        }

        // The story line fills with light as you read, with a glowing head riding its end.
        ScrollTrigger.create({
          trigger: story,
          start: "top 55%",
          end: "bottom 55%",
          onUpdate: (self) => {
            gsap.set(fill, { scaleY: self.progress });
            gsap.set(headTrack, { yPercent: self.progress * 100 });
          },
        });

        // Intro
        const h1 = root.querySelector<HTMLElement>("[data-hero-title]");
        if (h1) {
          const split = SplitText.create(h1, { type: "words", mask: "words" });
          gsap.from(split.words, { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.1 });
        }
        gsap.from("[data-hero-fade]", { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.35 });
        gsap.fromTo(
          "[data-hero-photo]",
          { clipPath: "inset(100% 0% 0% 0% round 32px)" },
          { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.3, ease: "expo.inOut", delay: 0.15 }
        );
        gsap.from("[data-hero-photo] img", { scale: 1.18, duration: 1.8, ease: "expo.out", delay: 0.15 });

        // Stats count up when they come into view.
        gsap.utils.toArray<HTMLElement>("[data-count]", root).forEach((el) => {
          const target = Number(el.dataset.count ?? 0);
          const obj = { v: 0 };
          el.textContent = "0";
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.to(obj, {
                v: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = String(Math.round(obj.v));
                },
              }),
          });
        });

        // Chapter content rises in.
        ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>("[data-reveal]", root), {
          start: "top 85%",
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: 40, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }
            ),
        });

        // Node burst when first reached.
        nodes.forEach((node) => {
          const ring = node.querySelector("[data-ring]");
          ScrollTrigger.create({
            trigger: node,
            start: "top 55%",
            once: true,
            onEnter: () => gsap.fromTo(ring, { scale: 1, opacity: 0.7 }, { scale: 3, opacity: 0, duration: 0.8, ease: "expo.out" }),
          });
        });

        // Photo parallax inside their frames.
        gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        // The blueprint draws itself.
        const bp = gsap.utils.toArray<SVGElement>("[data-bp]", root);
        if (bp.length) {
          gsap.fromTo(
            bp,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: { trigger: bp[0].closest("figure"), start: "top 80%", end: "center 45%", scrub: 0.6 },
            }
          );
        }

        // Ghost chapter numbers drift a little.
        gsap.utils.toArray<HTMLElement>("[data-ghost]", root).forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -15 },
            { yPercent: 15, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });
      }
    );

    // Fonts and images can change heights after the triggers are measured.
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <SmoothScroll>
      <div className="fixed inset-0 -z-10 bg-black">
        <PixelSnow
          color="white"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={1000}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>

      <div ref={rootRef} className="relative z-10 min-h-screen text-white">
        {/* Top bar */}
        <header className="fixed left-1/2 top-6 z-[9999] w-full -translate-x-1/2 px-4">
          <nav
            aria-label="About page"
            className="mx-auto flex h-14 w-full max-w-sm items-center justify-between rounded-full border border-[#f5a764] bg-white/10 px-3 pl-4 backdrop-blur-xl md:max-w-md lg:max-w-lg"
          >
            <Link href="/" aria-label="Back to the home page" className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]">
              <Image src="/logo.png" alt="" width={36} height={36} className="h-8 w-8 md:h-9 md:w-9" />
            </Link>
            <span className="font-orbitron text-sm font-semibold tracking-wide text-white md:text-base">ABOUT</span>
            <Link
              href="/#contact"
              className="rounded-full bg-[#f5a764] px-4 py-2 text-xs font-bold text-black transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764] md:text-sm"
            >
              Let&apos;s talk
            </Link>
          </nav>
        </header>

        <main className="overflow-x-clip">
          {/* Intro */}
          <section className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-28">
            <div>
              <p data-hero-fade className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">
                About me
              </p>
              <h1
                data-hero-title
                className="mt-5 font-orbitron text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-tight"
              >
                From civil engineering <span className="text-[#f5a764]">to software engineering.</span>
              </h1>
              <p data-hero-fade className="mt-7 text-xl text-[#f5c895]">
                I&apos;m Isaac Osamor, known online as Cyberzik.
              </p>
              <p data-hero-fade className="mt-4 max-w-xl text-lg leading-8 text-gray-300">
                I started out as a civil engineer. Today I&apos;m a software engineer building web apps, mobile
                apps and blockchain products for clients all over the world, and lots of people use what I&apos;ve
                built every day.
              </p>
              <ul data-hero-fade className="mt-7 flex flex-wrap gap-2.5">
                {["Software engineer", "Pianist", "Art lover"].map((t) => (
                  <li key={t} className="rounded-full border border-[#f5a764]/40 bg-[#f5a764]/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f5c895]">
                    {t}
                  </li>
                ))}
              </ul>
              <a
                data-hero-fade
                href="#story"
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-5 pr-1.5 text-sm font-semibold transition hover:border-[#f5a764]/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
              >
                Read my story
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black" aria-hidden>
                  ↓
                </span>
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div aria-hidden className="absolute -inset-10 rounded-full bg-[#f5a764]/15 blur-[90px]" />
              <div
                data-hero-photo
                className="relative aspect-[3/4] overflow-hidden rounded-[32px] border border-white/10 shadow-[0_50px_100px_-40px_rgba(245,167,100,.45)]"
              >
                <Image
                  src="/about/isaac-portrait.jpg"
                  alt="Isaac Osamor at his desk in a brown shirt, with framed art on the wall behind him"
                  fill
                  preload
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-5 rounded-2xl border border-white/10 bg-black/75 px-4 py-3 backdrop-blur-md sm:left-auto sm:right-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-400">Isaac Osamor</p>
                <p className="mt-1 font-orbitron text-sm text-[#f5c895]">Engineer · Pianist · Art lover</p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section aria-label="At a glance" className="mx-auto max-w-6xl px-6">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#0b0806] px-6 py-8 text-center">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">{s.label}</dt>
                  <dd className="mt-3 font-orbitron text-4xl font-bold tabular-nums text-[#f5a764] md:text-5xl">
                    <span data-count={s.value}>{s.value}</span>
                    {s.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Story */}
          <section id="story" aria-labelledby="story-title" className="mx-auto max-w-6xl scroll-mt-28 px-6 pt-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">My story</p>
            <h2 id="story-title" className="mt-4 max-w-2xl font-orbitron text-4xl font-bold leading-tight md:text-5xl">
              The path that got me here
            </h2>

            <div ref={storyRef} className="relative mt-16">
              {/* The line */}
              <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-[2px] lg:left-[15px]">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,.18)_0_6px,transparent_6px_14px)]" />
                <div
                  data-line-fill
                  className="absolute inset-0 origin-top bg-gradient-to-b from-[#c9773a] via-[#f5a764] to-[#f5c895]"
                  style={{ transform: "scaleY(0)" }}
                />
                <div data-line-head className="absolute inset-0">
                  <span className="absolute -left-[5px] top-0 h-3 w-3 -translate-y-1/2 rounded-full bg-[#fff4e6] shadow-[0_0_12px_4px_rgba(245,200,149,.9),0_0_40px_12px_rgba(245,167,100,.45)]" />
                </div>
              </div>

              {CHAPTERS.map((c, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <article key={c.title} aria-labelledby={`ch-${n}`} className="relative pb-24 pl-12 last:pb-8 lg:pb-32 lg:pl-20">
                    <span
                      data-node
                      aria-hidden
                      className="about-node absolute left-[12px] top-[10px] h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white/30 bg-black transition-[background-color,border-color,box-shadow,transform] duration-300 lg:left-[16px] [&.is-on]:scale-125 [&.is-on]:border-[#f5c895] [&.is-on]:bg-[#f5a764] [&.is-on]:shadow-[0_0_0_6px_rgba(245,167,100,.18),0_0_18px_rgba(245,167,100,.8)]"
                    >
                      <span data-ring className="absolute inset-0 rounded-full border border-[#f5a764] opacity-0" />
                    </span>

                    <span
                      data-ghost
                      aria-hidden
                      className="pointer-events-none absolute -top-10 right-0 select-none font-orbitron text-[clamp(7rem,18vw,14rem)] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(245,167,100,.09)]"
                    >
                      {n}
                    </span>

                    <div className={`relative grid items-start gap-10 ${c.media ? "lg:grid-cols-2 lg:gap-16" : ""}`}>
                      <div data-reveal className={`min-w-0 ${c.media ? "" : "max-w-3xl"}`}>
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">
                          Chapter {n} · {c.kicker}
                        </p>
                        <h3 id={`ch-${n}`} className="mt-4 font-orbitron text-3xl font-bold leading-tight md:text-[2.6rem]">
                          {c.title}
                        </h3>
                        <div className="mt-6 space-y-5 text-lg leading-8 text-gray-300">
                          {c.body.map((p) => (
                            <p key={p.slice(0, 24)}>{p}</p>
                          ))}
                        </div>
                        {c.media === "world" && (
                          <Link href="/#projects" className={`${LINK_PILL} mt-8`}>
                            Explore the projects →
                          </Link>
                        )}
                      </div>
                      {c.media && (
                        <div data-reveal className="min-w-0">
                          <ChapterMedia media={c.media} />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Studio */}
          <section aria-label="Where the work happens" className="mx-auto max-w-6xl px-6 pt-10">
            <Photo
              src="/about/isaac-studio.jpg"
              alt="Isaac's workspace: his desk and laptop, a digital piano on the right and framed art on the wall"
              caption="Code, keys and art on the wall: the room where it all comes together."
              ratio="aspect-[4/5] sm:aspect-[16/10]"
              sizes="(max-width: 1152px) 95vw, 1100px"
            />
          </section>

          {/* CTA */}
          <section aria-labelledby="cta-title" className="relative mx-auto max-w-6xl px-6 py-32 text-center">
            <div aria-hidden className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5a764]/10 blur-[140px]" />
            <p className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-[#f5a764]">Next stop</p>
            <h2 id="cta-title" className="relative mx-auto mt-5 max-w-3xl font-orbitron text-4xl font-bold leading-tight md:text-6xl">
              Let&apos;s build something people love.
            </h2>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="rounded-full bg-[#f5a764] px-8 py-4 font-orbitron font-bold text-black transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
              >
                Start a project
              </Link>
              <Link href="/#projects" className={`${LINK_PILL} px-8 py-4 text-base`}>
                See my work
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Isaac Osamor</p>
            <div className="flex gap-3">
              {[
                { label: "Email", href: "mailto:info@cyberzik.online", icon: <MdOutlineEmail size={18} /> },
                { label: "GitHub", href: "https://github.com/OSAMOR19", icon: <FaGithub size={18} /> },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/peter-osamor-isaac-chukwuka-003ab51a4/",
                  icon: <FaLinkedin size={18} />,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#f5a764] hover:bg-[#f5a764] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
