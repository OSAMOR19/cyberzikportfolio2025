"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Folder from "./Folder";
import Link from "next/link";
import { projects } from "@/lib/projectsData";

export default function Projects() {
  const [openIndex, setOpenIndex] = useState(-1);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const queueRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Process the queue: open one folder at a time with a 400ms stagger
  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) return;

    const nextIndex = queueRef.current.shift()!;
    setOpenIndex(nextIndex);

    if (queueRef.current.length > 0) {
      timerRef.current = setTimeout(processQueue, 400);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (isNaN(index)) return;

          if (entry.isIntersecting) {
            // Add to queue if not already queued or open
            if (!queueRef.current.includes(index)) {
              queueRef.current.push(index);
              // Start processing if not already running
              if (!timerRef.current) {
                processQueue();
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [processQueue]);

  return (
    <section
      id="projects"
      className="relative mx-auto max-w-7xl px-6 py-28"
    >
      <div className="mb-20 text-center">
        <p className="font-orbitron uppercase tracking-[8px] text-[#f5a764]">
          Portfolio
        </p>

        <h2 className="mt-4 text-5xl md:text-7xl font-bold font-orbitron text-white">
          Featured Projects
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-gray-400">
          Some products I&apos;ve built for startups, companies and clients over the
          last few years.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={`/projects/${project.slug}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            className="group overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#f5a764]/60 hover:shadow-[0_0_45px_rgba(245,167,100,.15)] block"
          >
            <div className="flex justify-center pt-30">
              <Folder
                size={1.45}
                color="#f5c895"
                items={project.images}
                className="custom-folder"
                open={openIndex >= index}
              />
            </div>

            <div className="px-7 py-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="rounded-full bg-[#f5a764]/20 px-3 py-1 text-xs font-semibold text-[#f5a764] uppercase tracking-wider">
                  {project.category}
                </span>
              </div>

              <h3 className="font-orbitron text-2xl text-white">
                {project.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3 py-4">
                {project.live && (
                  <span
                    className="flex-1 rounded-full px-8 bg-[#f5a764] py-3 text-center font-bold text-white transition hover:scale-105"
                  >
                    Live Demo
                  </span>
                )}
                {project.playStore && (
                  <span
                    className="flex-1 rounded-full px-4 bg-[#34a853] py-3 text-center font-bold text-white transition hover:scale-105 whitespace-nowrap"
                  >
                    Google Play
                  </span>
                )}
                {project.appStore && (
                  <span
                    className="flex-1 rounded-full px-4 bg-[#0a84ff] py-3 text-center font-bold text-white transition hover:scale-105 whitespace-nowrap"
                  >
                    App Store
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}