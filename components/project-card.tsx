"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  demoLink: string
  codeLink: string
  category: string
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={800}
          height={600}
          className={cn(
            "object-cover transition-transform duration-700 ease-in-out",
            isHovered ? "scale-110" : "scale-100",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>

        <div className="absolute top-4 right-4 bg-purple-900/80 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded-full">
          {project.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-none"
            asChild
          >
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-purple-500/50 text-white hover:bg-purple-950/30"
            asChild
          >
            <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Code
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

