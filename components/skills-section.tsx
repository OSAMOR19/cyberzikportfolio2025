"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Skill {
  name: string
  level: number
  icon?: string
}

interface SkillCategory {
  name: string
  skills: Skill[]
}

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState("frontend")

  const skillCategories: SkillCategory[] = [
    {
      name: "frontend",
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Tailwind CSS", level: 90 },
        { name: "Framer Motion", level: 80 },
        { name: "Three.js", level: 75 },
      ],
    },
    {
      name: "backend",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "PostgreSQL", level: 75 },
        { name: "GraphQL", level: 80 },
        { name: "REST API", level: 90 },
      ],
    },
    {
      name: "blockchain",
      skills: [
        { name: "Solidity", level: 90 },
        { name: "Web3.js", level: 85 },
        { name: "Ethers.js", level: 85 },
        { name: "Smart Contracts", level: 90 },
        { name: "DeFi Protocols", level: 80 },
        { name: "NFT Development", level: 85 },
      ],
    },
    {
      name: "tools",
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 80 },
        { name: "AWS", level: 75 },
        { name: "CI/CD", level: 80 },
        { name: "Figma", level: 70 },
        { name: "Testing", level: 85 },
      ],
    },
  ]

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 md:p-8">
      <Tabs defaultValue="frontend" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          {skillCategories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name}
              className={cn("data-[state=active]:bg-purple-600 data-[state=active]:text-white", "capitalize")}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {skillCategories.map((category) => (
          <TabsContent key={category.name} value={category.name} className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                {category.skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

