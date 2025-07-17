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
  Sparkles,
  Code,
  Database,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Advanced Particle System with Physics
const AdvancedParticleSystem: React.FC<{
  mousePosition: { x: number; y: number }
  scrollY: number
  isActive: boolean
}> = ({ mousePosition, scrollY, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      life: number
      maxLife: number
      trail: Array<{ x: number; y: number; opacity: number }>
    }>
  >([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"][Math.floor(Math.random() * 6)],
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50,
        trail: [],
      }))
    }

    initParticles()

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particlesRef.current.forEach((particle, index) => {
        // Mouse attraction
        const dx = (mousePosition.x / window.innerWidth) * canvas.offsetWidth - particle.x
        const dy = (mousePosition.y / window.innerHeight) * canvas.offsetHeight - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = ((150 - distance) / 150) * 0.2
          particle.vx += (dx / distance) * force * 0.05
          particle.vy += (dy / distance) * force * 0.05
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity })
        if (particle.trail.length > 10) {
          particle.trail.shift()
        }

        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -0.8

        // Apply friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Update life
        particle.life -= 0.5
        if (particle.life <= 0) {
          particle.life = particle.maxLife
          particle.x = Math.random() * canvas.offsetWidth
          particle.y = Math.random() * canvas.offsetHeight
        }

        // Draw trail
        particle.trail.forEach((point, i) => {
          const trailOpacity = (i / particle.trail.length) * particle.opacity * 0.3
          ctx.fillStyle =
            particle.color +
            Math.floor(trailOpacity * 255)
              .toString(16)
              .padStart(2, "0")
          ctx.beginPath()
          ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        })

        // Draw particle
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, particle.color + "FF")
        gradient.addColorStop(1, particle.color + "00")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size * 2
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition, scrollY, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  )
}

// 3D Floating Elements
const Floating3DElement: React.FC<{
  children: React.ReactNode
  depth: number
  mousePosition: { x: number; y: number }
  className?: string
}> = ({ children, depth, mousePosition, className }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")

  useEffect(() => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (mousePosition.x - centerX) * depth * 0.005
    const deltaY = (mousePosition.y - centerY) * depth * 0.005

    const rotateX = (mousePosition.y - centerY) * depth * 0.01
    const rotateY = (mousePosition.x - centerX) * depth * 0.01

    setTransform(`
      perspective(1000px) 
      translate3d(${deltaX}px, ${deltaY}px, ${depth * 10}px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `)
  }, [mousePosition, depth])

  return (
    <div ref={elementRef} className={cn("transition-transform duration-300 ease-out", className)} style={{ transform }}>
      {children}
    </div>
  )
}

// Morphing SVG Shapes
const MorphingSVGShape: React.FC<{
  className?: string
  colors: string[]
  complexity?: number
}> = ({ className, colors, complexity = 5 }) => {
  const pathRef = useRef<SVGPathElement>(null)
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    const generatePath = () => {
      const points = Array.from({ length: complexity }, (_, i) => {
        const angle = (i / complexity) * Math.PI * 2
        const radius = 50 + Math.sin(Date.now() * 0.001 + i) * 20
        const x = 100 + Math.cos(angle) * radius
        const y = 100 + Math.sin(angle) * radius
        return `${x},${y}`
      })

      return `M${points[0]} ${points
        .slice(1)
        .map((p, i) => (i % 2 === 0 ? `Q${p}` : `${p}`))
        .join(" ")} Z`
    }

    const animate = () => {
      setCurrentPath(generatePath())
      setTimeout(animate, 100)
    }

    animate()
  }, [complexity])

  return (
    <div className={cn("absolute", className)}>
      <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id={`morphGradient-${Math.random()}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {colors.map((color, i) => (
              <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={color} stopOpacity="0.6">
                <animate attributeName="stop-color" values={colors.join(";")} dur="4s" repeatCount="indefinite" />
              </stop>
            ))}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          d={currentPath}
          fill={`url(#morphGradient-${Math.random()})`}
          filter="url(#glow)"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  )
}

// Interactive Code Terminal
const InteractiveTerminal: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const codeSnippets = [
    "npm install @ai-sdk/openai",
    "import { generateText } from 'ai'",
    "const result = await generateText({",
    "  model: openai('gpt-4o'),",
    "  prompt: 'Build the future with AI'",
    "})",
    "console.log('🚀 AI-powered app ready!')",
  ]

  useEffect(() => {
    if (!isVisible) return

    let lineIndex = 0
    let charIndex = 0

    const typeWriter = () => {
      if (lineIndex >= codeSnippets.length) {
        setTimeout(() => {
          setLines([])
          lineIndex = 0
        }, 3000)
        return
      }

      setIsTyping(true)
      const currentSnippet = codeSnippets[lineIndex]

      if (charIndex < currentSnippet.length) {
        setCurrentLine(currentSnippet.slice(0, charIndex + 1))
        charIndex++
        setTimeout(typeWriter, 50)
      } else {
        setLines((prev) => [...prev, currentSnippet])
        setCurrentLine("")
        lineIndex++
        charIndex = 0
        setIsTyping(false)
        setTimeout(typeWriter, 500)
      }
    }

    const timer = setTimeout(typeWriter, 1000)
    return () => clearTimeout(timer)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="absolute top-4 right-4 w-80 bg-gray-900 rounded-lg p-4 font-mono text-sm shadow-2xl border border-gray-700">
      <div className="flex items-center mb-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="ml-3 text-gray-400 text-xs">AI Development Terminal</span>
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="text-green-400">
            <span className="text-blue-400">$</span> {line}
          </div>
        ))}
        {currentLine && (
          <div className="text-green-400">
            <span className="text-blue-400">$</span> {currentLine}
            {isTyping && <span className="animate-pulse">|</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// Advanced Gradient Icon Wrapper with Animations
const GradientIconWrapper: React.FC<{
  children: React.ReactNode
  variant?: "default" | "glow" | "pulse"
}> = ({ children, variant = "default" }) => {
  const variants = {
    default: "relative p-0.5 rounded-xl overflow-hidden group",
    glow: "relative p-0.5 rounded-xl overflow-hidden group shadow-lg",
    pulse: "relative p-0.5 rounded-xl overflow-hidden group animate-pulse",
  }

  return (
    <div className={variants[variant]}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-pulse"></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center group-hover:bg-white/90 transition-colors duration-300">
        {children}
      </div>
      {variant === "glow" && (
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      )}
    </div>
  )
}

// Scroll-triggered animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { elementRef, isVisible }
}

// Main Component
export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [ideaForm, setIdeaForm] = useState({ name: "", email: "", idea: "" })
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHeroActive, setIsHeroActive] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({})
  const { elementRef: heroRef, isVisible: isHeroVisible } = useScrollAnimation(0.3)

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

  // Enhanced mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setHeaderScrolled(currentScrollY > 50)

      // Check if hero is active
      const heroElement = document.getElementById("hero")
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect()
        setIsHeroActive(rect.top < window.innerHeight && rect.bottom > 0)
      }

      const observerOptions = {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
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
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const headerOffset = 80
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

  const chatQuickActions = [
    "What services do you offer?",
    "Tell me about your products.",
    "How can AI help my business?",
    "What's your pricing model?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Noise overlay */}
      <div className="noise-overlay opacity-30"></div>

      {/* Advanced Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pastel-teal to-pastel-lavender rounded-full blur-3xl opacity-50 animate-pulse-slow"
          style={{
            transform: `translate3d(${(mousePosition.x - window.innerWidth / 2) * 0.01}px, ${(mousePosition.y - window.innerHeight / 2) * 0.01}px, 0) scale(${1 + scrollY * 0.0005})`,
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-soft-pink to-light-violet rounded-full blur-3xl opacity-50 animate-pulse-slow delay-1000"
          style={{
            transform: `translate3d(${(mousePosition.x - window.innerWidth / 2) * -0.005}px, ${(mousePosition.y - window.innerHeight / 2) * -0.005}px, 0) scale(${1 + scrollY * 0.0003})`,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-pale-blue to-mint rounded-full blur-3xl opacity-50 animate-pulse-slow delay-2000"
          style={{
            transform: `translate3d(${(mousePosition.x - window.innerWidth / 2) * 0.008}px, ${(mousePosition.y - window.innerHeight / 2) * 0.008}px, 0) scale(${1 + scrollY * 0.0004})`,
          }}
        />
      </div>

      {/* Enhanced Navigation */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          headerScrolled ? "bg-white/90 backdrop-blur-2xl border-b border-gray-200/50 shadow-xl" : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Enhanced Logo */}
            <Floating3DElement depth={1} mousePosition={mousePosition}>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="grid grid-cols-2 gap-1 relative transform group-hover:scale-110 transition-all duration-500">
                  <div className="w-2 h-2 bg-gray-900 rounded-sm group-hover:bg-gradient-to-br from-blue-500 to-purple-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125"></div>
                  <div className="w-2 h-2 bg-gray-700 rounded-sm group-hover:bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-300 delay-75 group-hover:-rotate-12 group-hover:scale-125"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-sm group-hover:bg-gradient-to-br from-pink-500 to-orange-500 transition-all duration-300 delay-150 group-hover:rotate-6 group-hover:scale-125"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-sm group-hover:bg-gradient-to-br from-orange-500 to-yellow-500 transition-all duration-300 delay-200 group-hover:-rotate-6 group-hover:scale-125"></div>
                </div>
                <div className="h-6 w-px bg-gray-300 group-hover:bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300"></div>
                <span className="text-xl font-medium text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300">
                  AI 4U
                </span>
                <div className="h-6 w-px bg-gray-300 group-hover:bg-gradient-to-b from-purple-500 to-pink-500 transition-all duration-300"></div>
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  Labs
                </span>
              </div>
            </Floating3DElement>

            {/* Enhanced Navigation Pills */}
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { label: "SERVICES", id: "services", icon: Code },
                { label: "PRODUCTS", id: "products", icon: Smartphone },
                { label: "RESULTS", id: "results", icon: Database },
                { label: "INSIGHTS", id: "insights", icon: Brain },
                { label: "IDEAS", id: "ideas", icon: Sparkles },
                { label: "CONTACT", id: "contact", icon: Mail },
              ].map((item) => (
                <Floating3DElement key={item.id} depth={0.5} mousePosition={mousePosition}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-500 overflow-hidden group flex items-center space-x-2",
                      activeSection === item.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:scale-105 hover:shadow-md",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="relative z-10">{item.label}</span>
                    {activeSection !== item.id && (
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    )}
                  </button>
                </Floating3DElement>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Floating3DElement depth={1} mousePosition={mousePosition}>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    <Cpu className="w-4 h-4 mr-2" />
                    Chat with AI
                  </span>
                </Button>
              </Floating3DElement>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200/50 py-4 space-y-2 animate-slide-down backdrop-blur-xl bg-white/90">
              {[
                { label: "SERVICES", id: "services", icon: Code },
                { label: "PRODUCTS", id: "products", icon: Smartphone },
                { label: "RESULTS", id: "results", icon: Database },
                { label: "INSIGHTS", id: "insights", icon: Brain },
                { label: "IDEAS", id: "ideas", icon: Sparkles },
                { label: "CONTACT", id: "contact", icon: Mail },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section
        id="hero"
        ref={(el) => {
          sectionsRef.current.hero = el
          if (heroRef.current === null) {
            heroRef.current = el
          }
        }}
        className="relative py-20 px-8 lg:py-24 overflow-hidden min-h-[calc(100vh-80px)] flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="relative h-[700px] perspective-1000">
            {/* Main Content Container */}
            <div
              className="relative h-full rounded-3xl overflow-hidden backdrop-blur-2xl border border-white/50 shadow-2xl"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255,255,255,0.95) 0%, 
                    rgba(255,255,255,0.85) 50%, 
                    rgba(255,255,255,0.75) 100%
                  ),
                  radial-gradient(circle at ${(mousePosition.x / window.innerWidth) * 100}% ${(mousePosition.y / window.innerHeight) * 100}%, 
                    rgba(59,130,246,0.15) 0%, 
                    rgba(139,92,246,0.1) 30%, 
                    rgba(236,72,153,0.05) 60%,
                    transparent 100%
                  )
                `,
                transform: `translateZ(0) scale(${1 + scrollY * 0.0001}) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.005}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.005}deg)`,
                transition: "all 0.3s ease-out",
              }}
            >
              {/* Advanced Particle System */}
              <AdvancedParticleSystem mousePosition={mousePosition} scrollY={scrollY} isActive={isHeroActive} />

              {/* Interactive Terminal */}
              <InteractiveTerminal isVisible={isHeroVisible} />

              {/* Morphing SVG Shapes */}
              <MorphingSVGShape
                className="top-10 left-10 w-32 h-32 opacity-40"
                colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
                complexity={6}
              />
              <MorphingSVGShape
                className="bottom-20 right-20 w-24 h-24 opacity-30"
                colors={["#10B981", "#F59E0B", "#EF4444"]}
                complexity={4}
              />
              <MorphingSVGShape
                className="top-1/2 left-1/3 w-20 h-20 opacity-35"
                colors={["#06B6D4", "#8B5CF6", "#F59E0B"]}
                complexity={5}
              />

              {/* Enhanced Grid Pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="enhancedGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="0.5" fill="currentColor" opacity="0.3">
                        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="r" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.2" />
                      <path
                        d="M 2.5 0 L 2.5 5 M 0 2.5 L 5 2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.1"
                        opacity="0.1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#enhancedGrid)" />
                </svg>
              </div>

              {/* Content Grid */}
              <div className="relative z-10 h-full grid grid-rows-2 gap-8 p-8 lg:p-12">
                {/* Top Section - Enhanced Headline */}
                <div className="flex items-center justify-center relative group">
                  <div className="text-center space-y-8">
                    <Floating3DElement depth={2} mousePosition={mousePosition}>
                      <div className="relative">
                        <h1 className="text-6xl lg:text-8xl font-light text-gray-900 leading-[1.1] tracking-[-0.02em] relative z-10">
                          {["Transform", "your", "business", "with", "AI"].map((word, index) => (
                            <span
                              key={word}
                              className={cn(
                                "inline-block hover:scale-110 hover:-translate-y-2 transition-all duration-700 cursor-default mr-4",
                                index === 1 &&
                                  "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
                                index === 4 && "relative",
                              )}
                              style={{
                                animationDelay: `${index * 0.2}s`,
                                animation: "fadeInUp 1s ease-out forwards",
                              }}
                            >
                              {word}
                              {index === 4 && (
                                <>
                                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                                  <div className="absolute -inset-2 border-2 border-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                                </>
                              )}
                            </span>
                          ))}
                        </h1>

                        {/* Dynamic Underline */}
                        <div
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-1000 ease-out rounded-full"
                          style={{
                            width: `${Math.min(60, (mousePosition.x / window.innerWidth) * 80)}%`,
                            filter: `blur(${Math.abs(mousePosition.x - window.innerWidth / 2) * 0.005}px)`,
                          }}
                        ></div>
                      </div>
                    </Floating3DElement>

                    {/* Enhanced Floating Stats */}
                    <Floating3DElement depth={1.5} mousePosition={mousePosition}>
                      <div className="flex justify-center space-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300">
                        {[
                          { value: "10+", label: "Apps Live", color: "from-blue-500 to-cyan-500", icon: Smartphone },
                          { value: "$2M+", label: "Saved", color: "from-purple-500 to-pink-500", icon: Database },
                          { value: "10K+", label: "Users", color: "from-green-500 to-emerald-500", icon: Brain },
                        ].map((stat, index) => (
                          <div
                            key={index}
                            className="text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 cursor-default"
                            style={{ transitionDelay: `${300 + index * 100}ms` }}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <stat.icon
                                className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                              />
                            </div>
                            <div
                              className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                            >
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            <div
                              className={`w-full h-0.5 bg-gradient-to-r ${stat.color} mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </Floating3DElement>
                  </div>
                </div>

                {/* Bottom Section - Enhanced Content & Actions */}
                <div className="flex items-center justify-center">
                  <div className="max-w-4xl mx-auto text-center space-y-10">
                    {/* Enhanced Description */}
                    <Floating3DElement depth={1} mousePosition={mousePosition}>
                      <div className="relative">
                        <p className="text-xl lg:text-2xl text-gray-600 leading-[1.6] tracking-[-0.01em] relative z-10">
                          We're entering a new era of business transformation — one where{" "}
                          <span className="relative inline-block group/highlight">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                              AI unlocks deeper insights
                            </span>
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-lg blur-sm group-hover/highlight:blur-md transition-all duration-300"></div>
                          </span>
                          , faster growth, and life-changing solutions. At AI 4U, we're building that future.
                        </p>
                      </div>
                    </Floating3DElement>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                      <Floating3DElement depth={2} mousePosition={mousePosition}>
                        <Button
                          size="lg"
                          className="group relative bg-gray-900 hover:bg-gray-800 text-white rounded-full px-12 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                          <span className="relative z-10 flex items-center">
                            <Rocket className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            Start Your AI Project
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
                        </Button>
                      </Floating3DElement>

                      <Floating3DElement depth={2} mousePosition={mousePosition}>
                        <Button
                          size="lg"
                          variant="outline"
                          className="group relative border-2 border-gray-300 text-gray-700 hover:text-white rounded-full px-12 py-6 text-lg font-medium bg-transparent shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-105"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                          <span className="relative z-10 flex items-center">
                            <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            View Portfolio
                          </span>
                          <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
                        </Button>
                      </Floating3DElement>
                    </div>

                    {/* Enhanced Trust Indicators */}
                    <Floating3DElement depth={0.5} mousePosition={mousePosition}>
                      <div className="flex justify-center items-center space-x-8 pt-8 opacity-70 hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center space-x-3 group">
                          <div className="flex -space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-200 hover:rotate-12"
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                            4.8/5 Client Rating
                          </span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                          <span className="font-medium">Naples, FL</span> • Founded 2023
                        </div>
                      </div>
                    </Floating3DElement>
                  </div>
                </div>
              </div>

              {/* Advanced Interactive Hover Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at ${(mousePosition.x / window.innerWidth) * 100}% ${(mousePosition.y / window.innerHeight) * 100}%, rgba(59,130,246,0.05) 0%, transparent 50%)`,
                  }}
                ></div>
              </div>
            </div>

            {/* Enhanced Floating Action Elements */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-6 z-20">
              {[
                { color: "from-blue-500 to-cyan-500", delay: 0 },
                { color: "from-purple-500 to-pink-500", delay: 100 },
                { color: "from-green-500 to-emerald-500", delay: 200 },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 bg-gradient-to-r ${item.color} rounded-full animate-bounce shadow-lg hover:scale-125 transition-transform duration-300 cursor-pointer`}
                  style={{ animationDelay: `${item.delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section
        id="services"
        ref={(el) => (sectionsRef.current.services = el)}
        className="py-24 bg-white/50 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="serviceGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#serviceGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Floating3DElement depth={1} mousePosition={mousePosition}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Complete AI Solutions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From strategy to deployment, we handle every aspect of your AI transformation
              </p>
            </Floating3DElement>
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
                gradient: "from-blue-500 to-cyan-500",
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
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Automation & Workflow AI",
                description: "**Email/CRM** automation and document parsing.",
                features: ["Automated email responses", "CRM data synchronization", "Intelligent document processing"],
                gradient: "from-green-500 to-emerald-500",
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
                gradient: "from-orange-500 to-red-500",
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
                gradient: "from-teal-500 to-blue-500",
              },
              {
                icon: Rocket,
                title: "Rapid MVP Development",
                description: "Launch an **MVP in days**, not months.",
                features: ["Accelerated development cycles", "Lean startup methodology", "Fast market validation"],
                gradient: "from-indigo-500 to-purple-500",
              },
            ].map((service, index) => (
              <Floating3DElement key={index} depth={1 + index * 0.1} mousePosition={mousePosition}>
                <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>
                  <CardHeader className="pb-4 relative z-10">
                    <GradientIconWrapper variant="glow">
                      <service.icon className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors duration-300" />
                    </GradientIconWrapper>
                    <CardTitle className="text-gray-900 text-xl font-medium mb-3 mt-4 group-hover:text-gray-800 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                    <CardDescription
                      className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    <details className="mt-4 group/details">
                      <summary className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium transition-colors duration-300 flex items-center">
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/details:translate-x-1 transition-transform duration-300" />
                      </summary>
                      <ul className="mt-2 space-y-1 text-gray-600 text-sm list-disc pl-5">
                        {service.features.map((feature, i) => (
                          <li
                            key={i}
                            className="opacity-0 animate-fade-in hover:text-gray-800 transition-colors duration-300"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </CardHeader>
                </Card>
              </Floating3DElement>
            ))}
          </div>
        </div>
      </section>

      {/* Continue with other sections... */}
      {/* For brevity, I'll continue with the Products section and then indicate the pattern */}

      {/* Enhanced Live Products Section */}
      <section
        id="products"
        ref={(el) => (sectionsRef.current.products = el)}
        className="py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Floating3DElement depth={1} mousePosition={mousePosition}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Live Products</h2>
              <p className="text-xl text-gray-600">Real AI applications serving thousands of users worldwide</p>
            </Floating3DElement>
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
                gradient: "from-blue-500 to-purple-500",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "Inteligencia Artificial App Mockup",
                title: "Inteligencia Artificial",
                rating: "4.6",
                users: "1,500+",
                url: "https://apps.apple.com/us/app/inteligencia-artificial-ia/id6743879085",
                featured: true,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "Accountability Buddie App Mockup",
                title: "Accountability Buddie",
                rating: "4.8",
                users: "900+",
                url: "https://apps.apple.com/us/app/accountability-buddie/id6742691299",
                gradient: "from-green-500 to-teal-500",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "SheGPT App Mockup",
                title: "SheGPT",
                rating: "4.9",
                users: "2,100+",
                url: "https://apps.apple.com/us/app/shegpt/id6744063469",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "Sober AI App Mockup",
                title: "Sober AI",
                rating: "4.7",
                users: "1,800+",
                url: "https://apps.apple.com/us/app/sober-ai/id6740759999",
                gradient: "from-indigo-500 to-blue-500",
              },
              {
                image: "/placeholder.svg?height=100&width=100",
                alt: "AI Image Create App Mockup",
                title: "AI Image Create",
                rating: "4.5",
                users: "1,200+",
                url: "https://apps.apple.com/us/app/ai-image-create/id6744127405",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((product, index) => (
              <Floating3DElement key={index} depth={1 + index * 0.1} mousePosition={mousePosition}>
                <Card
                  className={cn(
                    "border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden",
                    product.featured ? "ring-2 ring-blue-200 border-blue-300/50" : "",
                  )}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative group/image">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.alt}
                          width={100}
                          height={100}
                          className="rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-lg"
                          loading="lazy"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover/image:opacity-20 rounded-xl transition-opacity duration-500`}
                        ></div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1 justify-end">
                          <Star className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-gray-900 font-medium">{product.rating}</span>
                        </div>
                        <div className="text-gray-500 text-sm">{product.users} users</div>
                      </div>
                    </div>
                    <CardTitle className="text-gray-900 text-xl font-medium mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      {product.title}
                    </CardTitle>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full bg-transparent shadow-sm hover:shadow-lg transition-all duration-500 group/button"
                    >
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${product.title} on App Store`}
                      >
                        View on App Store
                        <ExternalLink className="w-4 h-4 ml-2 group-hover/button:scale-110 transition-transform duration-300" />
                      </a>
                    </Button>
                  </CardHeader>
                </Card>
              </Floating3DElement>
            ))}
          </div>
        </div>
      </section>

      {/* I'll continue with the remaining sections following the same enhanced pattern... */}
      {/* Results, Insights, Ideas, and Contact sections would follow similar enhancements */}

      {/* Enhanced Chat Interface */}
      {isChatOpen && (
        <div
          className={cn(
            "fixed bottom-8 right-8 w-96 bg-white/95 backdrop-blur-2xl border border-gray-200/50 rounded-2xl shadow-2xl transition-all duration-500 z-50",
            isMinimized ? "h-16" : "h-[500px]",
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative shadow-lg">
                <AvatarFallback className="bg-transparent text-white text-sm font-medium">AI</AvatarFallback>
                <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
              </Avatar>
              <div>
                <h3 className="text-gray-900 font-medium">AI 4U Assistant</h3>
                <p className="text-green-600 text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-300"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-300"
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
                          className={cn(
                            "p-3 rounded-2xl shadow-sm",
                            message.role === "user"
                              ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
                              : "bg-gray-100 text-gray-900 border border-gray-200",
                          )}
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
                      maxLength={200}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-full px-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                        className="rounded-full text-xs px-3 py-1.5 border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
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

      {/* Results Section */}
      <section
        id="results"
        ref={(el) => (sectionsRef.current.results = el)}
        className="py-24 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <Floating3DElement depth={1} mousePosition={mousePosition}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Proven Results</h2>
              <p className="text-xl text-gray-600">Real outcomes delivered for our clients and users</p>
            </Floating3DElement>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { value: "$2M+", label: "client savings", icon: Database, color: "from-green-500 to-emerald-500" },
              { value: "10+", label: "apps live", icon: Smartphone, color: "from-blue-500 to-cyan-500" },
              { value: "10,000+", label: "users onboarded", icon: Brain, color: "from-purple-500 to-pink-500" },
              { value: "40%", label: "efficiency gain", icon: Zap, color: "from-orange-500 to-red-500" },
            ].map((stat, index) => (
              <Floating3DElement key={index} depth={1 + index * 0.1} mousePosition={mousePosition}>
                <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl text-center p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex justify-center mb-4">
                    <GradientIconWrapper>
                      <stat.icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                    </GradientIconWrapper>
                  </div>
                  <div
                    className={`text-4xl font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-gray-600">{stat.label}</p>
                </Card>
              </Floating3DElement>
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
                rating: 5,
              },
              {
                content:
                  "The Spanish-language AI tools opened up entirely new markets for us. Phenomenal localization.",
                author: "Carlos Gutierrez",
                role: "Director, Marketing Agency",
                avatar: "/placeholder.svg?height=40&width=40",
                rating: 5,
              },
              {
                content: "From idea to App Store in just weeks. The rapid development process was incredible.",
                author: "Jennifer Lee",
                role: "Founder, Health App",
                avatar: "/placeholder.svg?height=40&width=40",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Floating3DElement key={index} depth={1 + index * 0.1} mousePosition={mousePosition}>
                <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-4 left-4 text-6xl font-serif text-gray-200 opacity-70">"</div>
                  <div className="flex items-center mb-4 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
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
                </Card>
              </Floating3DElement>
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
            <Floating3DElement depth={1} mousePosition={mousePosition}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Insights & Updates</h2>
              <p className="text-xl text-gray-600">Latest thoughts on AI, business transformation, and innovation</p>
            </Floating3DElement>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "The Future of AI in Small Business",
                date: "December 15, 2024",
                excerpt:
                  "How small businesses can leverage AI to compete with larger enterprises and drive unprecedented growth.",
                url: "#",
                category: "Strategy",
                readTime: "5 min read",
              },
              {
                title: "Spanish-Language AI: Untapped Opportunities",
                date: "December 10, 2024",
                excerpt:
                  "Exploring the massive potential of AI applications designed specifically for Spanish-speaking markets.",
                url: "#",
                category: "Localization",
                readTime: "7 min read",
              },
              {
                title: "From Idea to App Store in 7 Days",
                date: "December 5, 2024",
                excerpt:
                  "Our proven methodology for rapid AI app development and what it means for your business timeline.",
                url: "#",
                category: "Development",
                readTime: "4 min read",
              },
              {
                title: "AI Automation ROI: Real Numbers",
                date: "November 28, 2024",
                excerpt:
                  "Breaking down the actual cost savings and efficiency gains our clients have achieved through AI automation.",
                url: "#",
                category: "Results",
                readTime: "6 min read",
              },
            ].map((article, index) => (
              <Floating3DElement key={index} depth={1 + index * 0.1} mousePosition={mousePosition}>
                <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                    <CardTitle className="text-gray-900 text-xl font-medium mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</CardDescription>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium justify-start group/button"
                    >
                      <a href={article.url} aria-label={`Read more about ${article.title}`}>
                        Read more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                      </a>
                    </Button>
                  </CardHeader>
                </Card>
              </Floating3DElement>
            ))}
          </div>
        </div>
      </section>

      {/* Got an Idea Section */}
      <section id="ideas" ref={(el) => (sectionsRef.current.ideas = el)} className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <Floating3DElement depth={1} mousePosition={mousePosition}>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Got an idea?</h2>
              <p className="text-xl text-gray-600">
                We'd love to hear about your vision. Share your AI project ideas with us and let's explore what's
                possible.
              </p>
            </Floating3DElement>
          </div>

          <Floating3DElement depth={1.5} mousePosition={mousePosition}>
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
                    <textarea
                      id="idea"
                      value={ideaForm.idea}
                      onChange={(e) => setIdeaForm({ ...ideaForm, idea: e.target.value })}
                      className="w-full border-gray-300 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 p-3"
                      placeholder="Tell us about your AI project idea..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <Mail className="mr-2 w-5 h-5" />
                    Send Idea
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Floating3DElement>
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
              <Floating3DElement depth={0.5} mousePosition={mousePosition}>
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
              </Floating3DElement>
            </div>

            <div>
              <h3 className="text-gray-900 font-medium mb-4">Services</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a href="#services" className="hover:text-gray-900 transition-colors">
                    AI Strategy Consulting
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-gray-900 transition-colors">
                    Custom App Development
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-gray-900 transition-colors">
                    Automation Solutions
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-gray-900 transition-colors">
                    API Integration
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-medium mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a href="#results" className="hover:text-gray-900 transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#insights" className="hover:text-gray-900 transition-colors">
                    Blog & Insights
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-gray-900 transition-colors">
                    App Portfolio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-medium mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a href="mailto:info@ai4u.space" className="hover:text-gray-900 transition-colors flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    info@ai4u.space
                  </a>
                </li>
                <li>
                  <a href="mailto:ideas@ai4u.space" className="hover:text-gray-900 transition-colors flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    ideas@ai4u.space
                  </a>
                </li>
                <li className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Naples, Florida
                </li>
                <li className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ai4u.space
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2024 AI 4U Labs. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">GitHub</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
