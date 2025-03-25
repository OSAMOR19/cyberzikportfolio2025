"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Code, ExternalLink, Github, Mail, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import curate from "@/components/images/zeitprotocol.png"
import Me from "@/components/images/aboutme.jpg"
import ecommerce from "@/components/images/ephronpage.png"
import solbet from "@/components/images/solbetdapp.png"

import curatelearn from "@/components/images/curatelearn.png"
import syndeo from "@/components/images/syndeopage.png"
import Aceembeded from "@/components/images/aceembededpage.png"
import skyeyez from "@/components/images/skyeyes.png"
import buidl from "@/components/images/buidl.png"
import Nftdapp from "@/components/images/vyperiumtracker.png"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ProjectCard from "@/components/project-card"
import SkillsSection from "@/components/skills-section"
import ContactForm from "@/components/contact-form"
import { ThreeDScene } from "@/components/three-d-scene"

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  // Update ref type declarations
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      if (
        aboutRef.current &&
        scrollPosition >= aboutRef.current.offsetTop &&
        skillsRef.current &&
        scrollPosition < skillsRef.current.offsetTop
      ) {
        setActiveSection("about")
      } else if (
        skillsRef.current &&
        scrollPosition >= skillsRef.current.offsetTop &&
        projectsRef.current &&
        scrollPosition < projectsRef.current.offsetTop
      ) {
        setActiveSection("skills")
      } else if (
        projectsRef.current &&
        scrollPosition >= projectsRef.current.offsetTop &&
        contactRef.current &&
        scrollPosition < contactRef.current.offsetTop
      ) {
        setActiveSection("projects")
      } else if (contactRef.current && scrollPosition >= contactRef.current.offsetTop) {
        setActiveSection("contact")
      } else {
        setActiveSection("home")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update scrollToSection parameter type
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80,
        behavior: "smooth",
      })
      setMobileMenuOpen(false)
    }
  }

  // In the navigation section, update the button props:
  {[
    { name: "Home", ref: heroRef, id: "home" },
    { name: "About", ref: aboutRef, id: "about" },
    { name: "Skills", ref: skillsRef, id: "skills" },
    { name: "Projects", ref: projectsRef, id: "projects" },
    { name: "Contact", ref: contactRef, id: "contact" },
  ].map((item) => (
    <button
      key={item.name}
      onClick={() => scrollToSection(item.ref)}
      className={cn(
        "text-sm font-medium relative transition-colors hover:text-purple-400",
        activeSection === item.id ? "text-purple-400" : "text-gray-400",
      )}
    >
      {item.name}
      {activeSection === item.id && (
        <motion.div
          layoutId="activeSection"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
        />
      )}
    </button>
  ))}

  const projects = [
    {
      id: 1,
      title: "ZEIT PROTOCOL",
      description:
        "A decentralized exchange platform built with Solidity and React that allows users to swap tokens, provide liquidity, and earn rewards.",
      image: curate.src,
      tags: ["Blockchain", "Solidity", "React", "Web3.js"],
      demoLink: "https://zeitprotocol.vercel.app/", // Add your live demo URL
      codeLink: "https://zeitprotocol.vercel.app/", // Add GitHub repo
      category: "DApps",
    },
    {
      id: 2,
      title: "E-Commerce Dashboard",
      description:
        "A comprehensive e-commerce dashboard with inventory management, sales analytics, and customer insights.",
      image: ecommerce.src,
      tags: ["Next.js", "Tailwind CSS", "MongoDB", "Express"],
      demoLink: "https://ephrondeployment.vercel.app/", // Add your live demo URL
      codeLink: "https://ephrondeployment.vercel.app/", // Add GitHub repo
      category: "E-commerce",
    },
    {
      id: 3,
      title: "VYPERIUM WALLET TRACKER",
      description:
        "A marketplace for creating, buying, and selling NFTs with wallet integration and auction functionality.",
      image: Nftdapp.src,
      tags: ["Ethereum", "IPFS", "React", "Node.js"],
      demoLink: "https://vyperium-lilac.vercel.app/", // Add your live demo URL
      codeLink: "https://vyperium-lilac.vercel.app/", // Add GitHub repo
      category: "DApps",
    },
    {
      id: 5,
      title: "SOLBET",
      description:
        "A blockchain-based supply chain tracking system that ensures transparency and authenticity of products.",
      image: solbet.src,
      tags: ["Hyperledger", "React", "Node.js", "Express"],
      demoLink: "https://solbet-done.vercel.app/", // Add your live demo URL
      codeLink: "https://solbet-done.vercel.app/", // Add GitHub repo
      category: "DApps",
    },
    {
      id: 4,
      title: "AI-guided self-learning platform",
      description:
        "A real-time messaging platform with end-to-end encryption, file sharing, and group chat capabilities.",
      image: curatelearn.src,
      tags: ["Socket.io", "React", "Express", "MongoDB"],
      demoLink: "https://curatelearn.com/",
      codeLink: "https://curatelearn.com/",
      category: "Web Apps",
    },
    {
      id: 6,
      title: "SkyEyez Analytics Platform",
      description: 
        "Advanced aerial data analysis platform for real-time drone analytics and geospatial intelligence.",
      image: skyeyez.src,
      tags: ["Next.js", "Python", "GIS", "TensorFlow"],
      demoLink: "https://skyeyez.ai/",
      codeLink: "https://skyeyez.ai/",
      category: "Web Apps",
    },
    {
      id: 7,
      title: "Syndeo Collaboration Suite",
      description:
        "Decentralized collaboration platform with integrated project management and DAO governance features.",
      image: syndeo.src,
      tags: ["Solidity", "IPFS", "React", "Node.js"],
      demoLink: "https://www.syndeoltd.com/",
      codeLink: "https://www.syndeoltd.com/",
      category: "DApps",
    },
    {
      id: 8,
      title: "Ace Embedded Systems",
      description:
        "IoT platform for industrial automation with real-time monitoring and predictive maintenance.",
      image: Aceembeded.src,
      tags: ["Embedded C", "RTOS", "Python", "MQTT"],
      demoLink: "https://aceembedded.io/",
      codeLink: "https://aceembedded.io/",
      category: "Web Apps",
    },
    {
      id: 9,
      title: "BUIDL Developer Platform",
      description:
        "Blockchain developer toolkit with smart contract templates and deployment automation.",
      image: buidl.src,
      tags: ["Hardhat", "Ethers.js", "React", "TypeScript"],
      demoLink: "https://buidlai.pro/",
      codeLink: "https://buidlai.pro/",
      category: "DApps",
    }
]

  const [filter, setFilter] = useState("All")
  const categories = ["All", "Web Apps", "E-commerce", "DApps"]

  const filteredProjects = filter === "All" ? projects : projects.filter((project) => project.category === filter)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text"
          >
            Cyberzik
          </Link>

          <nav className="hidden md:flex space-x-8">
            {[
              { name: "Home", ref: heroRef, id: "home" },
              { name: "About", ref: aboutRef, id: "about" },
              { name: "Skills", ref: skillsRef, id: "skills" },
              { name: "Projects", ref: projectsRef, id: "projects" },
              { name: "Contact", ref: contactRef, id: "contact" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => item.ref.current && scrollToSection(item.ref)}
                className={cn(
                  "text-sm font-medium relative transition-colors hover:text-purple-400",
                  activeSection === item.id ? "text-purple-400" : "text-gray-400",
                )}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                )}
              </button>
            ))}
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg"
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {[
                { name: "Home", ref: heroRef },
                { name: "About", ref: aboutRef },
                { name: "Skills", ref: skillsRef },
                { name: "Projects", ref: projectsRef },
                { name: "Contact", ref: contactRef },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.ref)}
                  className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <ThreeDScene />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block px-4 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 text-sm font-medium"
            >
              Fullstack & Blockchain Developer
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-cyan-400 text-transparent bg-clip-text"
            >
              Building the future,
              <br /> one block at a time
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Crafting innovative web applications and decentralized solutions that bridge the gap between traditional
              tech and the blockchain revolution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-none"
                size="lg"
                onClick={() => scrollToSection(projectsRef)}
              >
                View My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-purple-500/50 text-white hover:bg-purple-950/30"
                onClick={() => scrollToSection(contactRef)}
              >
                Contact Me
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown className="h-6 w-6 text-purple-400" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black opacity-50 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                About Me
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl shadow-purple-500/10">
                    <Image
                      src={Me}
                      alt="Developer Portrait"
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-black/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 shadow-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-400">5+</div>
                        <div className="text-xs text-gray-400">Years Exp.</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyan-400">50+</div>
                        <div className="text-xs text-gray-400">Projects</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">20+</div>
                        <div className="text-xs text-gray-400">Clients</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white">
                  Hi, I'm <span className="text-purple-400">Cyberzik</span>
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  I'm a passionate fullstack and blockchain developer with extensive experience in building web
                  applications, e-commerce platforms, and decentralized solutions. My journey in tech began over 5 years
                  ago, and I've been pushing the boundaries of what's possible ever since.
                </p>

                <p className="text-gray-300 leading-relaxed">
                  I specialize in creating seamless user experiences backed by robust, scalable architectures. Whether
                  it's a complex web application or a cutting-edge blockchain solution, I approach each project with
                  creativity, technical expertise, and a commitment to excellence.
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  {["JavaScript", "React", "Node.js", "Solidity", "Next.js", "Web3"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="border-purple-500/50 text-white hover:bg-purple-950/30">
                    Download Resume
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-20 md:py-32 bg-black/80 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                My Skills
              </span>
            </h2>

            <SkillsSection />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black opacity-50 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                Featured Projects
              </span>
            </h2>

            <div className="flex justify-center mb-12">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filter === category ? "default" : "outline"}
                    className={cn(
                      filter === category
                        ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
                        : "border-purple-500/50 text-white hover:bg-purple-950/30",
                    )}
                    onClick={() => setFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 md:py-32 bg-black/80 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                Get In Touch
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white">Let's work together</h3>

                <p className="text-gray-300 leading-relaxed">
                  Have a project in mind or want to discuss potential opportunities? I'm always open to new challenges
                  and collaborations.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-white">isaacchukwuka67@gmail.com</div>
                      <div className="text-white">cyberzikk1@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                      <Code className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">GitHub</div>
                      <div className="text-white">github.com/Osamor19</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="text-lg font-medium text-white mb-4">Connect with me</h4>
                  <div className="flex gap-4">
                    {[Github, ExternalLink, Mail].map((Icon, index) => (
                      <motion.a
                        key={index}
                        href="https://github.com/OSAMOR19"
                        className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center hover:bg-purple-800/40 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="h-5 w-5 text-purple-400" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-purple-900/30 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text"
              >
                Cyberzik
              </Link>
            </div>

            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Cyberzik. All rights reserved.
            </div>

            <div className="mt-4 md:mt-0 flex gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

