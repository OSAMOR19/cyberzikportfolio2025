"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"  // Fixed named import

interface Skill {
  name: string
  level: number
  icon: string  // Changed from optional to required
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
        { name: "React", level: 95, icon: "vscode-icons:file-type-reactjs" },
        { name: "Next.js", level: 90, icon: "vscode-icons:file-type-next" },
        { name: "TypeScript", level: 85, icon: "vscode-icons:file-type-typescript-official" },
        { name: "Tailwind CSS", level: 90, icon: "vscode-icons:file-type-tailwind" },
        { name: "Framer Motion", level: 80, icon: "simple-icons:framermotion" },
        { name: "Three.js", level: 75, icon: "simple-icons:threedotjs" },
      ],
    },
    {
      name: "backend",
      skills: [
        { name: "Node.js", level: 90, icon: "vscode-icons:file-type-node" },
        { name: "Express", level: 85, icon: "simple-icons:express" },
        { name: "MongoDB", level: 80, icon: "vscode-icons:file-type-mongo" },
        { name: "PostgreSQL", level: 75, icon: "vscode-icons:file-type-pgsql" },
        { name: "GraphQL", level: 80, icon: "vscode-icons:file-type-graphql" },
        { name: "REST API", level: 90, icon: "gis:globe" },
      ],
    },
    {
      name: "blockchain",
      skills: [
        { name: "Solidity", level: 90, icon: "vscode-icons:file-type-solidity" },
        { name: "Web3.js", level: 85, icon: "logos:web3js" },
        { name: "Ethers.js", level: 85, icon: "simple-icons:ethersdotjs" },
        { name: "Smart Contracts", level: 90, icon: "material-symbols:contract" },
        { name: "DeFi Protocols", level: 80, icon: "arcticons:defi" },
        { name: "NFT Development", level: 85, icon: "arcticons:nft" },
      ],
    },
    {
      name: "tools",
      skills: [
        { name: "Git", level: 90, icon: "vscode-icons:file-type-git" },
        { name: "Docker", level: 80, icon: "vscode-icons:file-type-docker" },
        { name: "AWS", level: 75, icon: "vscode-icons:file-type-aws" },
        { name: "CI/CD", level: 80, icon: "simple-icons:circleci" },
        { name: "Figma", level: 70, icon: "vscode-icons:file-type-figma" },
        { name: "Testing", level: 85, icon: "ion:test-tube" },
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
                      <div className="flex items-center gap-3">
                        <Icon icon={skill.icon} className="h-5 w-5 text-purple-400" />
                        <span className="text-white font-medium">{skill.name}</span>
                      </div>
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

