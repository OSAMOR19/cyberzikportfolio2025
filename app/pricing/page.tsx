"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Download, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import cyberzikLogo from "@/components/images/cyberziklogonobg.png"

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  timeline: string
  popular?: boolean
}

interface ServiceCategory {
  name: string
  description: string
  tiers: PricingTier[]
}

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("web-development")
  const [activeCurrency, setActiveCurrency] = useState("USD")

  // Create refs for each section
  const webDevRef = useRef<HTMLDivElement>(null)
  const mobileAppsRef = useRef<HTMLDivElement>(null)
  const apisRef = useRef<HTMLDivElement>(null)
  const automationRef = useRef<HTMLDivElement>(null)
  const devopsRef = useRef<HTMLDivElement>(null)
  const maintenanceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      // Check which section is currently in view
      const refs = [
        { id: "web-development", ref: webDevRef },
        { id: "mobile-apps", ref: mobileAppsRef },
        { id: "apis-backend", ref: apisRef },
        { id: "automation", ref: automationRef },
        { id: "devops", ref: devopsRef },
        { id: "maintenance", ref: maintenanceRef },
      ]

      for (let i = 0; i < refs.length; i++) {
        const current = refs[i]
        const next = refs[i + 1]

        if (
          current.ref.current &&
          scrollPosition >= current.ref.current.offsetTop &&
          (!next || (next.ref.current && scrollPosition < next.ref.current.offsetTop))
        ) {
          setActiveSection(current.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80,
        behavior: "smooth",
      })
      setMobileMenuOpen(false)
    }
  }

  const serviceCategories: ServiceCategory[] = [
    {
      name: "Web Development",
      description: "Modern, responsive websites and web applications built with the latest technologies.",
      tiers: [
        {
          name: "Basic",
          price: activeCurrency === "USD" ? "$150+" : "₦120,000+",
          description: "1-page static site (HTML/CSS/JS), mobile responsive",
          features: [
            "Mobile responsive design",
            "Basic SEO setup",
            "Contact form",
            "Social media integration",
            "Google Analytics setup",
          ],
          timeline: "2–4 days",
        },
        {
          name: "Standard",
          price: activeCurrency === "USD" ? "$500+" : "₦400,000+",
          description: "Multi-page dynamic site (React/Next.js/Vue), contact form, SEO basics",
          features: [
            "5-7 custom pages",
            "Content Management System",
            "Advanced SEO optimization",
            "Performance optimization",
            "Browser compatibility testing",
            "Basic animations and transitions",
          ],
          timeline: "5–10 days",
          popular: true,
        },
        {
          name: "Premium",
          price: activeCurrency === "USD" ? "$1000+" : "₦800,000+",
          description: "Full-stack web app (frontend + backend + auth + DB)",
          features: [
            "Custom user authentication",
            "Database integration",
            "Admin dashboard",
            "Payment gateway integration",
            "Advanced animations",
            "API development",
            "Comprehensive documentation",
          ],
          timeline: "10–20 days",
        },
      ],
    },
    {
      name: "Mobile Apps",
      description: "Cross-platform mobile applications that deliver exceptional user experiences.",
      tiers: [
        {
          name: "MVP",
          price: activeCurrency === "USD" ? "$600+" : "₦480,000+",
          description: "Basic app (1–3 screens), Flutter/React Native",
          features: [
            "Cross-platform (iOS & Android)",
            "Basic UI/UX design",
            "Local data storage",
            "Essential features only",
            "App icon and splash screen",
          ],
          timeline: "7–14 days",
        },
        {
          name: "Standard",
          price: activeCurrency === "USD" ? "$1200+" : "₦960,000+",
          description: "API-connected app (auth, DB, media upload, etc.)",
          features: [
            "User authentication",
            "Cloud database integration",
            "Media upload capabilities",
            "Push notifications",
            "Offline functionality",
            "Analytics integration",
          ],
          timeline: "15–25 days",
          popular: true,
        },
        {
          name: "Enterprise",
          price: activeCurrency === "USD" ? "$2000+" : "₦1,600,000+",
          description: "Complex logic, push notifications, admin panel",
          features: [
            "Advanced business logic",
            "Real-time data synchronization",
            "Admin dashboard",
            "Payment processing",
            "Third-party API integrations",
            "Comprehensive testing",
            "App store submission",
          ],
          timeline: "3–5 weeks",
        },
      ],
    },
    {
      name: "APIs & Backend",
      description: "Robust, scalable backend solutions and APIs to power your applications.",
      tiers: [
        {
          name: "Simple API",
          price: activeCurrency === "USD" ? "$300+" : "₦240,000+",
          description: "REST API with CRUD, Node.js/Django/FastAPI, MongoDB/Postgres",
          features: [
            "CRUD operations",
            "Basic authentication",
            "Database integration",
            "API documentation",
            "Error handling",
          ],
          timeline: "3–5 days",
        },
        {
          name: "Scalable API",
          price: activeCurrency === "USD" ? "$700+" : "₦560,000+",
          description: "JWT auth, rate limits, versioning, documentation",
          features: [
            "JWT authentication",
            "Role-based access control",
            "API rate limiting",
            "API versioning",
            "Comprehensive documentation",
            "Caching mechanisms",
            "Automated testing",
          ],
          timeline: "1–2 weeks",
          popular: true,
        },
      ],
    },
    {
      name: "Automation Scripts",
      description: "Custom automation solutions to streamline your workflows and save time.",
      tiers: [
        {
          name: "Data Scraper",
          price: activeCurrency === "USD" ? "$200+" : "₦160,000+",
          description: "Web scraping, automation bots, task automation",
          features: [
            "Automated data extraction",
            "Data cleaning and formatting",
            "Scheduled execution",
            "Export to CSV/Excel",
            "Basic error handling",
          ],
          timeline: "2–5 days",
        },
        {
          name: "Custom Tool",
          price: activeCurrency === "USD" ? "$300+" : "₦240,000+",
          description: "Spreadsheet sync, webhook integration, etc.",
          features: [
            "Custom workflow automation",
            "Third-party API integration",
            "Webhook handling",
            "Data synchronization",
            "Notification system",
            "User-friendly interface",
          ],
          timeline: "3–7 days",
          popular: true,
        },
      ],
    },
    {
      name: "DevOps & CI/CD",
      description: "Streamline your development workflow with modern DevOps practices.",
      tiers: [
        {
          name: "Basic Setup",
          price: activeCurrency === "USD" ? "$300+" : "₦240,000+",
          description: "Docker + deployment on DigitalOcean/VPS",
          features: [
            "Docker containerization",
            "Server setup and configuration",
            "Basic deployment pipeline",
            "SSL certificate setup",
            "Domain configuration",
          ],
          timeline: "2–4 days",
        },
        {
          name: "Advanced",
          price: activeCurrency === "USD" ? "$600+" : "₦480,000+",
          description: "CI/CD pipelines, logging, auto backups",
          features: [
            "Continuous Integration setup",
            "Continuous Deployment pipeline",
            "Automated testing integration",
            "Logging and monitoring",
            "Automated backups",
            "Scaling configuration",
            "Documentation",
          ],
          timeline: "5–10 days",
          popular: true,
        },
      ],
    },
    {
      name: "Maintenance & Support",
      description: "Ongoing support and maintenance to keep your applications running smoothly.",
      tiers: [
        {
          name: "Hourly Support",
          price: activeCurrency === "USD" ? "$30–$70/hour" : "₦24,000–₦56,000/hour",
          description: "Bug fixing, updates, optimizations",
          features: [
            "Bug fixes and troubleshooting",
            "Performance optimization",
            "Security updates",
            "Feature enhancements",
            "Technical consultation",
            "24-48 hour response time",
          ],
          timeline: "As needed",
          popular: true,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text"
          >
            <Image 
              src={cyberzikLogo} 
              alt="Cyberzik Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
            Cyberzik
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-sm font-medium relative transition-colors hover:text-purple-400 text-gray-400"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium relative transition-colors hover:text-purple-400 text-gray-400"
            >
              About
            </Link>
            <Link
              href="/#skills"
              className="text-sm font-medium relative transition-colors hover:text-purple-400 text-gray-400"
            >
              Skills
            </Link>
            <Link
              href="/#projects"
              className="text-sm font-medium relative transition-colors hover:text-purple-400 text-gray-400"
            >
              Projects
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium relative transition-colors text-purple-400"
            >
              Pricing
              <motion.div
                layoutId="activeSection"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
              />
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium relative transition-colors hover:text-purple-400 text-gray-400"
            >
              Contact
            </Link>
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
              <motion.a
                href="/"
                className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.a>
              <motion.a
                href="/#about"
                className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.a>
              <motion.a
                href="/#skills"
                className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Skills
              </motion.a>
              <motion.a
                href="/#projects"
                className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Projects
              </motion.a>
              <motion.a
                href="/pricing"
                className="text-2xl font-medium text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pricing
              </motion.a>
              <motion.a
                href="/#contact"
                className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black opacity-50 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-cyan-400 text-transparent bg-clip-text">
              Services & Pricing
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Transparent pricing for quality software development services. Choose the package that fits your needs or contact me for a custom quote.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                onClick={() => setActiveCurrency("USD")}
                variant={activeCurrency === "USD" ? "default" : "outline"}
                className={cn(
                  activeCurrency === "USD"
                    ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
                    : "border-purple-500/50 text-white hover:bg-purple-950/30",
                )}
              >
                USD ($)
              </Button>
              
              <Button
                onClick={() => setActiveCurrency("NGN")}
                variant={activeCurrency === "NGN" ? "default" : "outline"}
                className={cn(
                  activeCurrency === "NGN"
                    ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
                    : "border-purple-500/50 text-white hover:bg-purple-950/30",
                )}
              >
                NGN (₦)
              </Button>

              <Button
                variant="outline"
                className="border-purple-500/50 text-white hover:bg-purple-950/30"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { name: "Web Development", ref: webDevRef, id: "web-development" },
                { name: "Mobile Apps", ref: mobileAppsRef, id: "mobile-apps" },
                { name: "APIs & Backend", ref: apisRef, id: "apis-backend" },
                { name: "Automation", ref: automationRef, id: "automation" },
                { name: "DevOps", ref: devopsRef, id: "devops" },
                { name: "Maintenance", ref: maintenanceRef, id: "maintenance" },
              ].map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.ref)}
                  variant={activeSection === item.id ? "default" : "outline"}
                  className={cn(
                    activeSection === item.id
                      ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
                      : "border-purple-500/50 text-white hover:bg-purple-950/30",
                  )}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Sections */}
      <div className="py-16 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {serviceCategories.map((category, index) => {
            // Determine which ref to use based on category name
            let ref;
            switch(category.name) {
              case "Web Development": ref = webDevRef; break;
              case "Mobile Apps": ref = mobileAppsRef; break;
              case "APIs & Backend": ref = apisRef; break;
              case "Automation Scripts": ref = automationRef; break;
              case "DevOps & CI/CD": ref = devopsRef; break;
              case "Maintenance & Support": ref = maintenanceRef; break;
              default: ref = null;
            }
            
            // Generate ID from category name
            const id = category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
            
            return (
              <motion.section
                key={category.name}
                ref={ref}
                id={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "max-w-7xl mx-auto mb-24",
                  index !== serviceCategories.length - 1 && "pb-16 border-b border-purple-900/30"
                )}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                    {category.name}
                  </span>
                </h2>
                
                <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto">
                  {category.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.tiers.map((tier) => (
                    <motion.div
                      key={tier.name}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 h-full",
                        tier.popular && "border-purple-500/50 shadow-lg shadow-purple-500/10"
                      )}
                    >
                      {tier.popular && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          POPULAR
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8">
                        <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                        
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-white">{tier.price}</span>
                          <span className="text-gray-400 ml-1 text-sm">starting price</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-6 border-b border-purple-900/30 pb-6">
                          {tier.description}
                        </p>
                        
                        <div className="mb-6">
                          <div className="text-sm font-medium text-gray-300 mb-3">Estimated Timeline:</div>
                          <div className="text-white font-bold">{tier.timeline}</div>
                        </div>
                        
                        <div className="space-y-3 mb-8">
                          <div className="text-sm font-medium text-gray-300 mb-2">What's included:</div>
                          {tier.features.map((feature) => (
                            <div key={feature} className="flex items-start">
                              <Check className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-200 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-auto">
                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-none"
                            asChild
                          >
                            <Link 
                              href={`https://wa.me/+2349057469410?text=Hi,%20I'm%20interested%20in%20the%20${tier.name}%20${category.name}%20package%20priced%20at%20${tier.price}.%20I'd%20like%20to%20start%20a%20project.`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Start Project
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black/80 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black opacity-50 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-cyan-400 text-transparent bg-clip-text">
              Need a Custom Solution?
            </h2>
            
            <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto">
              Don't see exactly what you need? Contact me for a personalized quote tailored to your specific requirements.
            </p>

            <Button
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-none"
              size="lg"
              asChild
            >
              <Link 
                href={`https://wa.me/+2349057469410?text=Hi,%20I'm%20interested%20in%20discussing%20a%20custom%20project.%20Can%20we%20talk%20about%20my%20requirements?`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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