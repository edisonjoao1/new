"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import {
  ArrowRight,
  Play,
  Send,
  X,
  Minimize2,
  Maximize2,
  Star,
  ExternalLink,
  Mail,
  Brain,
  Smartphone,
  Zap,
  Plug,
  Globe,
  Rocket,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Custom component for animated gradient icon border
const GradientIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative p-0.5 rounded-xl overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-pulse"></div>
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center">
      {children}
    </div>
  </div>
)

export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [ideaForm, setIdeaForm] = useState({ name: "", email: "", idea: "" })
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm AI 4U's assistant. I can help you learn about our AI consulting services, mobile apps, and how we can transform your business. What would you like to know?",
      },
    ],
  })

  // Mouse parallax state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e
    setMousePosition({ x: clientX, y: clientY })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    // Existing useEffect for chatEndRef
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Add a separate useEffect for window dimensions to run only once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setHeaderScrolled(scrollY > 50)

      // Intersection Observer for active section highlighting
      const observerOptions = {
        root: null,
        rootMargin: "-50% 0px -50% 0px", // Adjust this to highlight when section is in middle
        threshold: 0,
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      }, observerOptions)

      Object.values(sectionsRef.current).forEach((section) => {
        if (section) {
          observer.observe(section)
        }
      })

      return () => {
        Object.values(sectionsRef.current).forEach((section) => {
          if (section) {
            observer.unobserve(section)
          }
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once on mount to set initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const headerOffset = 80 // Adjust based on your sticky header height
      const elementPosition = section.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setIsMenuOpen(false)
    }
  }

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent("New Idea Submission")
    const body = encodeURIComponent(`Name: ${ideaForm.name}\nEmail: ${ideaForm.email}\n\nIdea:\n${ideaForm.idea}`)
    window.location.href = `mailto:ideas@ai4u.space?subject=${subject}&body=${body}`
  }

  const heroParallaxStyle = (depth: number) => {
    if (windowDimensions.width === 0) return {} // Return empty object on server
    return {
      transform: `translate3d(${(mousePosition.x - windowDimensions.width / 2) * depth * 0.01}px, ${
        (mousePosition.y - windowDimensions.height / 2) * depth * 0.01
      }px, 0)`,
    }
  }

  const floatingShapeStyle = (depth: number) => {
    if (windowDimensions.width === 0) return {} // Return empty object on server
    return {
      transform: `translate3d(${(mousePosition.x - windowDimensions.width / 2) * depth * 0.005}px, ${
        (mousePosition.y - windowDimensions.height / 2) * depth * 0.005
      }px, 0)`,
    }
  }

  const chatQuickActions = [
    "What services do you offer?",
    "Tell me about your products.",
    "How can AI help my business?",
    "What's your pricing model?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Dynamic Background Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-cyan-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          headerScrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm" : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo with gradient hover */}
            <div className="flex items-center space-x-3 group">
              <div className="grid grid-cols-2 gap-1 relative">
                <div className="w-2 h-2 bg-gray-900 rounded-sm group-hover:bg-gradient-to-br from-blue-500 to-purple-500 transition-all duration-300"></div>
                <div className="w-2 h-2 bg-gray-700 rounded-sm group-hover:bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-300 delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-sm group-hover:bg-gradient-to-br from-pink-500 to-orange-500 transition-all duration-300 delay-150"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-sm group-hover:bg-gradient-to-br from-orange-500 to-yellow-500 transition-all duration-300 delay-200"></div>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-xl font-medium text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300">
                AI 4U
              </span>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Labs</span>
            </div>

            {/* Navigation Pills with gradient transitions */}
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { label: "SERVICES", id: "services" },
                { label: "PRODUCTS", id: "products" },
                { label: "RESULTS", id: "results" },
                { label: "INSIGHTS", id: "insights" },
                { label: "IDEAS", id: "ideas" },
                { label: "CONTACT", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 overflow-hidden group",
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10",
                      activeSection === item.id ? "text-white" : "text-gray-600 group-hover:text-gray-900",
                    )}
                  >
                    {item.label}
                  </span>
                  {activeSection !== item.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Chat with AI
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200/50 py-4 space-y-2 animate-slide-down">
              {[
                { label: "SERVICES", id: "services" },
                { label: "PRODUCTS", id: "products" },
                { label: "RESULTS", id: "results" },
                { label: "INSIGHTS", id: "insights" },
                { label: "IDEAS", id: "ideas" },
                { label: "CONTACT", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - 3x2 Grid with Parallax */}
      <section
        id="hero"
        ref={(el) => (sectionsRef.current.hero = el)}
        className="relative py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] perspective-1000">
            {/* Top Row - Full Width Headline */}
            <Card className="lg:col-span-3 border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden relative shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-12 lg:p-16 flex items-center justify-center h-full">
                <h1
                  className="text-5xl lg:text-7xl font-light text-gray-900 text-center leading-tight"
                  style={{ transform: `translate3d(0, 0, 0)` }}
                >
                  Transform your business with AI
                </h1>
              </CardContent>
            </Card>

            {/* Bottom Left - Subhead and Buttons */}
            <Card className="lg:col-span-2 border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center h-full">
                <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                  We're entering a new era of business transformation — one where AI unlocks deeper insights, faster
                  growth, and life-changing solutions. At AI 4U, we're building that future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-4 text-lg font-medium group shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Start Your AI Project
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-4 text-lg font-medium bg-transparent shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    View Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Right - 3D Shape that bleeds outside with Parallax */}
            <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-3xl overflow-visible relative shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0 h-full relative">
                {/* 3D Organic Shape with Parallax */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80 transform scale-150">
                    {/* Main organic blob */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 rounded-[3rem] transform rotate-12 opacity-90 animate-pulse-slow"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                        animationDuration: "4s",
                        ...heroParallaxStyle(0.5),
                      }}
                    ></div>
                    <div
                      className="absolute inset-4 bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 rounded-[2.5rem] transform -rotate-6 opacity-80 animate-pulse-slow"
                      style={{
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
                        animationDuration: "5s",
                        animationDelay: "1s",
                        ...heroParallaxStyle(0.7),
                      }}
                    ></div>
                    <div
                      className="absolute inset-8 bg-gradient-to-br from-pink-300 via-pink-400 to-orange-400 rounded-[2rem] transform rotate-3 opacity-70 animate-pulse-slow"
                      style={{
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                        animationDuration: "6s",
                        animationDelay: "2s",
                        ...heroParallaxStyle(0.9),
                      }}
                    ></div>

                    {/* Floating elements that escape the container with Parallax */}
                    <div
                      className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-2xl transform rotate-45 opacity-80 animate-bounce-slow"
                      style={floatingShapeStyle(1.2)}
                    ></div>
                    <div
                      className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-xl transform -rotate-12 opacity-70 animate-bounce-slow delay-500"
                      style={floatingShapeStyle(1.5)}
                    ></div>
                    <div
                      className="absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-br from-green-300 to-green-400 rounded-lg transform rotate-30 opacity-60 animate-bounce-slow delay-1000"
                      style={floatingShapeStyle(1.8)}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        ref={(el) => (sectionsRef.current.services = el)}
        className="py-24 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Complete AI Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy to deployment, we handle every aspect of your AI transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Strategy Consulting",
                description: "**Business-specific** roadmaps and competitive analysis.",
                features: [
                  "Custom AI integration plans",
                  "Competitive AI landscape analysis",
                  "Technical roadmap development",
                ],
              },
              {
                icon: Smartphone,
                title: "Custom AI App Development",
                description: "**iOS/Swift**, web apps, SaaS dashboards.",
                features: [
                  "Mobile-first AI solutions",
                  "LLM integrations for apps",
                  "Scalable SaaS dashboard development",
                ],
              },
              {
                icon: Zap,
                title: "Automation & Workflow AI",
                description: "**Email/CRM** automation and document parsing.",
                features: ["Automated email responses", "CRM data synchronization", "Intelligent document processing"],
              },
              {
                icon: Plug,
                title: "AI API Integration",
                description: "**GPT-4o**, Claude, Llama 3.1 with RAG pipelines.",
                features: [
                  "Seamless API integrations",
                  "Retrieval-Augmented Generation (RAG)",
                  "Real-time AI assistant deployment",
                ],
              },
              {
                icon: Globe,
                title: "Localization & Personas",
                description: "**Spanish** markets and niche GPTs.",
                features: [
                  "Culturally sensitive AI models",
                  "Persona-aligned GPT development",
                  "Multilingual AI solutions",
                ],
              },
              {
                icon: Rocket,
                title: "Rapid MVP Development",
                description: "Launch an **MVP in days**, not months.",
                features: ["Accelerated development cycles", "Lean startup methodology", "Fast market validation"],
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader className="pb-4">
                  <GradientIconWrapper>
                    <service.icon className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors duration-300" />
                  </GradientIconWrapper>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-3 mt-4">{service.title}</CardTitle>
                  <CardDescription
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                  <details className="mt-4">
                    <summary className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium">
                      Learn more
                    </summary>
                    <ul className="mt-2 space-y-1 text-gray-600 text-sm list-disc pl-5">
                      {service.features.map((feature, i) => (
                        <li key={i} className="opacity-0 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </details>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Products Section */}
      <section
        id="products"
        ref={(el) => (sectionsRef.current.products = el)}
        className="py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Live Products</h2>
            <p className="text-xl text-gray-600">Real AI applications serving thousands of users worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "AI Amigo App Mockup",
                title: "AI Amigo",
                rating: "4.9",
                users: "3,200+",
                url: "https://apps.apple.com/us/app/ai-amigo/id6670725604",
                featured: true,
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "Inteligencia Artificial App Mockup",
                title: "Inteligencia Artificial",
                rating: "4.6",
                users: "1,500+",
                url: "https://apps.apple.com/us/app/inteligencia-artificial-ia/id6743879085",
                featured: true,
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "Accountability Buddie App Mockup",
                title: "Accountability Buddie",
                rating: "4.8",
                users: "900+",
                url: "https://apps.apple.com/us/app/accountability-buddie/id6742691299",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "SheGPT App Mockup",
                title: "SheGPT",
                rating: "4.9",
                users: "2,100+",
                url: "https://apps.apple.com/us/app/shegpt/id6744063469",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "Sober AI App Mockup",
                title: "Sober AI",
                rating: "4.7",
                users: "1,800+",
                url: "https://apps.apple.com/us/app/sober-ai/id6740759999",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "AI Image Create App Mockup",
                title: "AI Image Create",
                rating: "4.5",
                users: "1,200+",
                url: "https://apps.apple.com/us/app/ai-image-create/id6744127405",
              },
            ].map((product, index) => (
              <Card
                key={index}
                className={cn(
                  "border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group",
                  product.featured ? "ring-2 ring-blue-200 border-blue-300/50" : "",
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.alt}
                      width={100}
                      height={100}
                      className="rounded-xl group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1 justify-end">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-900 font-medium">{product.rating}</span>
                      </div>
                      <div className="text-gray-500 text-sm">{product.users} users</div>
                    </div>
                  </div>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-4">{product.title}</CardTitle>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full bg-transparent shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${product.title} on App Store`}
                    >
                      View on App Store
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section
        id="results"
        ref={(el) => (sectionsRef.current.results = el)}
        className="py-24 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Proven Results</h2>
            <p className="text-xl text-gray-600">Real outcomes delivered for our clients and users</p>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { value: "$2M+", label: "client savings" },
              { value: "10+", label: "apps live" },
              { value: "10,000+", label: "users onboarded" },
              { value: "40%", label: "efficiency gain" },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl text-center p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="text-4xl font-light text-gray-900 mb-3">{stat.value}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                content:
                  "AI 4U transformed our business operations. The custom automation saved us 30% on routine tasks.",
                author: "Maria Rodriguez",
                role: "CEO, Tech Startup",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                content:
                  "The Spanish-language AI tools opened up entirely new markets for us. Phenomenal localization.",
                author: "Carlos Gutierrez",
                role: "Director, Marketing Agency",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                content: "From idea to App Store in just weeks. The rapid development process was incredible.",
                author: "Jennifer Lee",
                role: "Founder, Health App",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="absolute top-4 left-4 text-6xl font-serif text-gray-200 opacity-70">“</div>
                  <div className="flex items-center mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic relative z-10">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3 relative z-10">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={`Avatar of ${testimonial.author}`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      <span className="text-xs text-blue-600 font-semibold flex items-center mt-1">
                        <Star className="w-3 h-3 mr-1 fill-blue-600" /> Verified Client
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insights & Updates */}
      <section
        id="insights"
        ref={(el) => (sectionsRef.current.insights = el)}
        className="py-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Insights & Updates</h2>
            <p className="text-xl text-gray-600">Latest thoughts on AI, business transformation, and innovation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "The Future of AI in Small Business",
                date: "December 15, 2024",
                excerpt:
                  "How small businesses can leverage AI to compete with larger enterprises and drive unprecedented growth.",
                url: "#", // Placeholder for actual article link
              },
              {
                title: "Spanish-Language AI: Untapped Opportunities",
                date: "December 10, 2024",
                excerpt:
                  "Exploring the massive potential of AI applications designed specifically for Spanish-speaking markets.",
                url: "#",
              },
              {
                title: "From Idea to App Store in 7 Days",
                date: "December 5, 2024",
                excerpt:
                  "Our proven methodology for rapid AI app development and what it means for your business timeline.",
                url: "#",
              },
              {
                title: "AI Automation ROI: Real Numbers",
                date: "November 28, 2024",
                excerpt:
                  "Breaking down the actual cost savings and efficiency gains our clients have achieved through AI automation.",
                url: "#",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</CardDescription>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium justify-start"
                  >
                    <a href={article.url} aria-label={`Read more about ${article.title}`}>
                      Read more →
                    </a>
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Got an Idea Section */}
      <section id="ideas" ref={(el) => (sectionsRef.current.ideas = el)} className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Got an idea?</h2>
            <p className="text-xl text-gray-600">
              We'd love to hear about your vision. Share your AI project ideas with us and let's explore what's
              possible.
            </p>
          </div>

          <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleIdeaSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={ideaForm.name}
                      onChange={(e) => setIdeaForm({ ...ideaForm, name: e.target.value })}
                      className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={ideaForm.email}
                      onChange={(e) => setIdeaForm({ ...ideaForm, email: e.target.value })}
                      className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Idea
                  </label>
                  <Textarea
                    id="idea"
                    value={ideaForm.idea}
                    onChange={(e) => setIdeaForm({ ...ideaForm, idea: e.target.value })}
                    className="border-gray-300 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tell us about your AI project idea..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Send Idea
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        ref={(el) => (sectionsRef.current.contact = el)}
        className="border-t border-gray-200/50 bg-white/80 backdrop-blur-xl py-16"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                  <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-lg font-medium text-gray-900">AI 4U</span>
              </div>
              <p className="text-gray-600 mb-4">AI Consulting & Solutions That Work for You</p>
              <p className="text-gray-500 text-sm">Naples, Florida • Founded 2023</p>
            </div>

            <div>
              <h3 className="text-gray-900 font-medium mb-4">Services</h3>
              <ul className="space-y-3 text-gray-600">
                <li>AI Strategy Consulting</li>
                <li>Custom App Development</li>
                <li>Automation Solutions</li>
                <li>API Integration</li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-medium mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-600">
                <li>Case Studies</li>
                <li>Blog & Insights</li>
                <li>App Portfolio</li>
                <li>Documentation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-medium mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a href="mailto:info@ai4u.space" className="hover:text-gray-900 transition-colors">
                    info@ai4u.space
                  </a>
                </li>
                <li>
                  <a href="mailto:ideas@ai4u.space" className="hover:text-gray-900 transition-colors">
                    ideas@ai4u.space
                  </a>
                </li>
                <li>Naples, Florida</li>
                <li>ai4u.space</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200/50 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 AI 4U Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Clean Chat Interface */}
      {isChatOpen && (
        <div
          className={`fixed bottom-8 right-8 w-96 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl transition-all duration-300 z-50 ${isMinimized ? "h-16" : "h-[500px]"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative">
                <AvatarFallback className="bg-transparent text-white text-sm font-medium">AI</AvatarFallback>
                <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
              </Avatar>
              <div>
                <h3 className="text-gray-900 font-medium">AI 4U Assistant</h3>
                <p className="text-green-600 text-xs">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <ScrollArea className="h-[380px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
                    >
                      <div className="flex items-start space-x-2 max-w-[80%]">
                        {message.role === "assistant" && (
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${
                            message.role === "user"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 border border-gray-200 p-3 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200/50">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about our AI services..."
                      className="flex-1 border-gray-300 rounded-full px-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                      maxLength={200} // Example character limit
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 shadow-sm hover:shadow-md transition-all duration-300"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right text-xs text-gray-500">{input.length} / 200 characters</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {chatQuickActions.map((action, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleInputChange({ target: { value: action } } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="rounded-full text-xs px-3 py-1.5 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
