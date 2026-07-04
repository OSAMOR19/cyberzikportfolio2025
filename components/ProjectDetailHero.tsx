"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projectsData";
import { getAdjacentProjects } from "@/lib/projectsData";
import "./ProjectDetailPage.css";

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailHeroProps {
  project: Project;
}

export default function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { prev, next } = getAdjacentProjects(project.slug);
  const isPortrait = project.orientation === "portrait";

  // Duplicate images enough times for seamless loop
  const duplicatedImages = [...project.images, ...project.images, ...project.images];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ---- Marquee entrance animation ----
      if (marqueeRef.current) {
        gsap.fromTo(
          marqueeRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
        );
      }

      // ---- Category badge entrance ----
      if (categoryRef.current) {
        gsap.fromTo(
          categoryRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 }
        );
      }

      // ---- Title entrance ----
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.8 }
        );
      }

      // ---- About section scroll trigger ----
      if (aboutRef.current) {
        const aboutElements =
          aboutRef.current.querySelectorAll(".about-animate");
        gsap.set(aboutElements, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: aboutRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(aboutElements, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.15,
            });
          },
          once: true,
        });
      }

      // ---- Gallery scroll trigger ----
      if (galleryRef.current) {
        const galleryItems =
          galleryRef.current.querySelectorAll(".gallery-item");
        gsap.set(galleryItems, { opacity: 0, y: 60, scale: 0.95 });
        ScrollTrigger.create({
          trigger: galleryRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(galleryItems, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
            });
          },
          once: true,
        });
      }
    });

    return () => ctx.revert();
  }, [project.slug]);

  return (
    <div className="project-detail" ref={heroRef}>
      {/* Back Button */}
      <Link href="/#projects" className="project-detail__back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Hero */}
      <section className="project-detail__hero">
        {/* Continuous Sliding Carousel */}
        <div className="marquee-carousel" ref={marqueeRef}>
          <div
            className="marquee-track"
            style={{
              animationDuration: `${project.images.length * 8}s`,
            }}
          >
            {duplicatedImages.map((img, i) => (
              <div
                key={i}
                className={`carousel-slide ${
                  isPortrait
                    ? "carousel-slide--portrait"
                    : "carousel-slide--landscape"
                }`}
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${(i % project.images.length) + 1}`}
                  fill
                  sizes={
                    isPortrait
                      ? "(max-width: 768px) 140px, 180px"
                      : "(max-width: 768px) 320px, 480px"
                  }
                  priority={i < project.images.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Title Area */}
        <div className="project-detail__title-area">
          <span className="project-detail__category" ref={categoryRef}>
            {project.category}
          </span>
          <h1 className="project-detail__title font-orbitron" ref={titleRef}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* About Section */}
      <section className="project-detail__about" ref={aboutRef}>
        <p className="project-detail__about-label about-animate">About</p>
        <p className="project-detail__about-text about-animate">
          {project.about}
        </p>

        {/* Tech Stack */}
        <div className="project-detail__tech-stack about-animate">
          {project.tech.map((t, i) => (
            <span key={i} className="project-detail__tech-tag">
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="project-detail__links about-animate">
          {project.live && project.live !== "#" && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link project-detail__link--live"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
          {project.playStore && (
            <a
              href={project.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link project-detail__link--play"
            >
              Google Play
            </a>
          )}
          {project.appStore && (
            <a
              href={project.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__link project-detail__link--appstore"
            >
              App Store
            </a>
          )}
        </div>

        {/* Screenshot Gallery */}
        <div className="project-detail__gallery" ref={galleryRef}>
          <div
            className={`gallery-grid ${
              isPortrait ? "gallery-grid--portrait" : "gallery-grid--landscape"
            }`}
          >
            {project.images.map((img, i) => (
              <div key={i} className="gallery-item">
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  width={isPortrait ? 360 : 800}
                  height={isPortrait ? 720 : 440}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Previous / Next Navigation */}
      <nav className="project-detail__nav">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="project-nav-link project-nav-link--prev"
          >
            <span className="project-nav-link__label">← Previous Project</span>
            <span className="project-nav-link__title font-orbitron">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="project-nav-link project-nav-link--next"
          >
            <span className="project-nav-link__label">Next Project →</span>
            <span className="project-nav-link__title font-orbitron">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
