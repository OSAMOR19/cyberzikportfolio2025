"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react"
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
  screenshots?: string[]
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const screenshots = project.screenshots || [project.image]
  const isMobileApp = project.category === "Mobile Apps"

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <>
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
              "object-cover transition-transform duration-700 ease-in-out cursor-pointer",
              isHovered ? "scale-110" : "scale-100",
            )}
            onClick={() => isMobileApp && setShowGallery(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"></div>

          <div className="absolute top-4 right-4 bg-purple-900/80 backdrop-blur-sm text-xs font-medium text-white px-2 py-1 rounded-full">
            {project.category}
          </div>

          {isMobileApp && screenshots.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-xs text-white px-2 py-1 rounded-full">
              {screenshots.length} screenshots
            </div>
          )}
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
            {isMobileApp && screenshots.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/50 text-white hover:bg-purple-950/30"
                onClick={() => setShowGallery(true)}
              >
                View Screenshots
              </Button>
            )}
            
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

      {/* Screenshot Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-black/80 rounded-xl overflow-hidden border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
                <h3 className="text-xl font-bold text-white">{project.title} - Screenshots</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowGallery(false)}
                  className="text-white hover:bg-purple-900/30"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="relative">
                <Image
                  src={screenshots[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />

                {screenshots.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-purple-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {currentImageIndex + 1} of {screenshots.length}
                  </span>
                  <div className="flex gap-2">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          index === currentImageIndex ? "bg-purple-500" : "bg-gray-600"
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

