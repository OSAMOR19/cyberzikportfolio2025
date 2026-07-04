"use client";

import { use } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projectsData";
import ProjectDetailHero from "@/components/ProjectDetailHero";

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailHero project={project} />;
}
