"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ArrowRight, Play, Send, X, Minimize2, Maximize2, Star, ExternalLink, Mail, Menu, Brain, Smartphone, Zap, Plug, Globe, Rocket, Loader2, CheckCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [ideaForm, setIdeaForm] = useState({ name: "", email: "", idea: "" })
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isIdeaSubmitting, setIsIdeaSubmitting] = useState(false)
  const [ideaSubmitSuccess, setIdeaSubmitSuccess] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [sectionsLoaded, setSectionsLoaded] = useState<{[key: string]: boolean}>({})
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const chatEndRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Enhanced scroll handling for navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)

      // Update active section based on scroll position
      const sections = ["services", "products", "results", "insights", "ideas", "contact"]
      let currentSection = ""

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section
            break
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mouse parallax effect for hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        setMousePosition({ x, y })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove)
      return () => heroElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Page loading, section intersection effects, and touch device detection
  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouchDevice()
    window.addEventListener('resize', checkTouchDevice)

    // Simulate page loading
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1000)

    // Set up intersection observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionsLoaded(prev => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    // Observe all main sections
    const sections = ['services', 'products', 'results', 'insights', 'ideas', 'contact']
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', checkTouchDevice)
    }
  }, [])

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.x && !touchStart.y) return
    
    const touch = e.touches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return
    
    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const minSwipeDistance = 50
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        setSwipeDirection('left')
        // Handle swipe left (next section)
        const sections = ["services", "products", "results", "insights", "ideas", "contact"]
        const currentIndex = sections.indexOf(activeSection)
        if (currentIndex < sections.length - 1) {
          scrollToSection(sections[currentIndex + 1])
        }
      } else {
        setSwipeDirection('right')
        // Handle swipe right (previous section)
        const sections = ["services", "products", "results", "insights", "ideas", "contact"]
        const currentIndex = sections.indexOf(activeSection)
        if (currentIndex > 0) {
          scrollToSection(sections[currentIndex - 1])
        }
      }
      
      // Reset swipe direction after animation
      setTimeout(() => setSwipeDirection(null), 300)
    }
    
    // Reset touch positions
    setTouchStart({ x: 0, y: 0 })
    setTouchEnd({ x: 0, y: 0 })
  }

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false) // Close mobile menu on navigation
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = isTouchDevice ? 70 : 80 // Smaller header on mobile
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsIdeaSubmitting(true)
    
    // Simulate loading state with enhanced UX
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const subject = encodeURIComponent("New Idea Submission")
    const body = encodeURIComponent(`Name: ${ideaForm.name}\nEmail: ${ideaForm.email}\n\nIdea:\n${ideaForm.idea}`)
    
    setIdeaSubmitSuccess(true)
    setIsIdeaSubmitting(false)
    
    // Reset form after success animation
    setTimeout(() => {
      window.location.href = `mailto:ideas@ai4u.space?subject=${subject}&body=${body}`
      setIdeaForm({ name: "", email: "", idea: "" })
      setIdeaSubmitSuccess(false)
    }, 2000)
  }

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI 4U Labs",
    "alternateName": "AI 4U",
    "url": "https://ai4u.space",
    "logo": "https://ai4u.space/ai-assistant-mockup.png",
    "description": "AI 4U is a cutting-edge AI consulting studio specializing in custom AI app development, automation, API integration, and rapid MVP development.",
    "foundingDate": "2023",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Naples",
        "addressRegion": "Florida",
        "addressCountry": "US"
      }
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-XXX-XXX-XXXX",
      "contactType": "customer service",
      "email": "info@ai4u.space",
      "availableLanguage": ["English", "Spanish"]
    },
    "sameAs": [
      "https://twitter.com/AI4ULabs",
      "https://linkedin.com/company/ai4ulabs"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Strategy Consulting",
            "description": "Business-specific AI integration plans and competitive analysis"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom AI App Development",
            "description": "iOS/Swift apps, web applications, and SaaS dashboards with AI integration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Automation & Workflow",
            "description": "Email/CRM automation and intelligent document parsing"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "150"
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Page Loading Overlay */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-sm animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="w-4 h-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-sm animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-4 h-4 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-sm animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="w-4 h-4 bg-gradient-to-br from-teal-600 to-teal-700 rounded-sm animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
              <div className="h-2 w-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4 font-medium">Loading AI 4U Experience...</p>
          </div>
        </div>
      )}
      
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"
      onTouchStart={isTouchDevice ? handleTouchStart : undefined}
      onTouchMove={isTouchDevice ? handleTouchMove : undefined}
      onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-gradient-to-br from-cyan-400/20 via-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-orange-400/20 via-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
      </div>

      {/* Enhanced Navigation with mobile optimizations */}
      <nav className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        isScrolled 
          ? "border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-xl shadow-gray-200/25" 
          : "border-gray-200/30 bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/20"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? (isTouchDevice ? "py-2" : "py-3") : (isTouchDevice ? "py-3" : "py-4")
          }`}>
            {/* Enhanced Logo with mobile optimization */}
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="grid grid-cols-2 gap-1 transition-transform duration-300 group-hover:scale-110">
                <div className={`${isTouchDevice ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gradient-to-br from-blue-600 to-blue-700 rounded-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-400/50`}></div>
                <div className={`${isTouchDevice ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gradient-to-br from-purple-600 to-purple-700 rounded-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50`} style={{animationDelay: '0.1s'}}></div>
                <div className={`${isTouchDevice ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/50`} style={{animationDelay: '0.2s'}}></div>
                <div className={`${isTouchDevice ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gradient-to-br from-teal-600 to-teal-700 rounded-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-400/50`} style={{animationDelay: '0.3s'}}></div>
              </div>
              <div className="h-4 sm:h-6 w-px bg-gradient-to-b from-gray-400 to-gray-600"></div>
              <span className={`${isTouchDevice ? 'text-lg' : 'text-xl'} font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent`}>AI 4U</span>
              <div className="h-4 sm:h-6 w-px bg-gradient-to-b from-gray-400 to-gray-600"></div>
              <span className={`${isTouchDevice ? 'text-xs' : 'text-sm'} font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent hidden sm:block`}>Labs</span>
            </div>

            {/* Enhanced Navigation Pills */}
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { label: "SERVICES", id: "services" },
                { label: "PRODUCTS", id: "products" },
                { label: "RESULTS", id: "results" },
                { label: "INSIGHTS", id: "insights" },
                { label: "IDEAS", id: "ideas" },
                { label: "CONTACT", id: "contact" },
              ].map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-400/25"
                        : "text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-400/25"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Enhanced Mobile Menu Button with touch feedback */}
            <div className="lg:hidden flex items-center space-x-3">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 active:scale-95 transition-transform duration-150 p-2 rounded-xl hover:bg-gray-100/50"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className={`${isTouchDevice ? 'w-6 h-6' : 'w-5 h-5'} flex flex-col justify-center items-center`}>
                  <span className={`block ${isTouchDevice ? 'w-5 h-0.5' : 'w-4 h-0.5'} bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
                  <span className={`block ${isTouchDevice ? 'w-5 h-0.5' : 'w-4 h-0.5'} bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block ${isTouchDevice ? 'w-5 h-0.5' : 'w-4 h-0.5'} bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </Button>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-lg shadow-blue-400/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-400/40 group"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="mr-2">Chat with AI</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:scale-110 transition-transform"></div>
              </Button>
            </div>
            
            {/* Mobile Chat Button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsChatOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-4 py-2 shadow-lg shadow-blue-400/25 transition-all duration-300 active:scale-95"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Brain className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Menu with touch interactions */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}>
            <div className="py-4 border-t border-gray-200/30 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col space-y-3">
                {[
                  { label: "SERVICES", id: "services" },
                  { label: "PRODUCTS", id: "products" },
                  { label: "RESULTS", id: "results" },
                  { label: "INSIGHTS", id: "insights" },
                  { label: "IDEAS", id: "ideas" },
                  { label: "CONTACT", id: "contact" },
                ].map((item, index) => {
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`px-6 py-4 text-base font-medium rounded-xl transition-all duration-300 text-left active:scale-95 ${
                        isActive
                          ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-400/25"
                          : "text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-400/25 hover:scale-105"
                      }`}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {item.label}
                    </button>
                  )
                })}
                
                {/* Mobile Chat Button in Menu */}
                <div className="pt-4 border-t border-gray-200/30">
                  <Button
                    onClick={() => {
                      setIsChatOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 text-base font-medium shadow-lg shadow-blue-400/25 transition-all duration-300 active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Chat with AI
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section with 3D Parallax */}
      <section ref={heroRef} className="relative py-16 lg:py-24 overflow-hidden">
        {/* Enhanced layered background with mouse parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Layer 1 - Far background */}
          <div 
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse transition-transform duration-100"
            style={{
              animationDuration: '6s',
              transform: `translate3d(${mousePosition.x * 15}px, ${mousePosition.y * 15}px, 0) scale(${1 + mousePosition.x * 0.05})`
            }}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/30 via-teal-500/30 to-emerald-500/30 rounded-full blur-3xl animate-pulse transition-transform duration-150"
            style={{
              animationDuration: '8s', 
              animationDelay: '2s',
              transform: `translate3d(${mousePosition.x * -20}px, ${mousePosition.y * -10}px, 0) scale(${1 + mousePosition.y * 0.03})`
            }}
          ></div>
          <div 
            className="absolute top-1/2 right-1/2 w-64 h-64 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-200"
            style={{
              animationDuration: '10s', 
              animationDelay: '4s',
              transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 25}px, 0) rotate(${mousePosition.x * 5}deg)`
            }}
          ></div>
          
          {/* Layer 2 - Mid-ground floating elements */}
          <div 
            className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-violet-400/40 to-fuchsia-400/40 rounded-3xl blur-xl rotate-45 animate-pulse transition-transform duration-100"
            style={{
              animationDuration: '7s',
              transform: `translate3d(${mousePosition.x * 30}px, ${mousePosition.y * -20}px, 0) rotate(${45 + mousePosition.x * 10}deg) scale(${1 + mousePosition.y * 0.1})`
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-emerald-400/50 to-cyan-400/50 rounded-2xl blur-lg -rotate-12 animate-pulse transition-transform duration-150"
            style={{
              animationDuration: '9s', 
              animationDelay: '1s',
              transform: `translate3d(${mousePosition.x * -25}px, ${mousePosition.y * 30}px, 0) rotate(${-12 + mousePosition.y * 15}deg)`
            }}
          ></div>
          
          {/* Layer 3 - Foreground interactive elements */}
          <div 
            className="absolute top-1/6 right-1/6 w-16 h-16 bg-gradient-to-br from-pink-500/60 to-rose-500/60 rounded-full shadow-lg transition-transform duration-75"
            style={{
              transform: `translate3d(${mousePosition.x * 40}px, ${mousePosition.y * -30}px, 0) scale(${1 + mousePosition.x * 0.2})`
            }}
          ></div>
          <div 
            className="absolute bottom-1/6 left-1/6 w-12 h-12 bg-gradient-to-br from-blue-500/70 to-indigo-500/70 rounded-lg shadow-md transition-transform duration-100"
            style={{
              transform: `translate3d(${mousePosition.x * -35}px, ${mousePosition.y * 40}px, 0) rotate(${mousePosition.x * 20}deg)`
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 ${isTouchDevice ? 'min-h-[400px] sm:h-[500px] lg:h-[600px]' : 'h-[600px]'}`}>
            {/* Enhanced Top Row - Full Width Headline with mobile optimization */}
            <Card className={`lg:col-span-3 border-gray-200/30 bg-white/70 backdrop-blur-md ${isTouchDevice ? 'rounded-2xl' : 'rounded-3xl'} overflow-hidden relative shadow-xl shadow-gray-200/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-300/30 group mobile-card`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Interactive background pattern */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full h-full opacity-10 transition-transform duration-200"
                  style={{
                    background: `radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`,
                    transform: `translate3d(${mousePosition.x * 5}px, ${mousePosition.y * 5}px, 0)`
                  }}
                ></div>
              </div>
              
              <CardContent className={`${isTouchDevice ? 'p-6 sm:p-8 lg:p-12' : 'p-12 lg:p-16'} flex items-center justify-center h-full relative z-10`}>
                <div className="text-center">
                  <h1 
                    className={`hero-title ${isTouchDevice ? 'text-3xl sm:text-4xl lg:text-6xl' : 'text-5xl lg:text-7xl'} font-light bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight transition-all duration-300`}
                    style={!isTouchDevice ? {
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                      textShadow: `${mousePosition.x * 2}px ${mousePosition.y * 2}px 10px rgba(59, 130, 246, 0.1)`
                    } : {}}
                  >
                    Transform your business with{" "}
                    <span 
                      className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block transition-all duration-200"
                      style={!isTouchDevice ? {
                        transform: `scale(${1 + Math.abs(mousePosition.x) * 0.05}) rotate(${mousePosition.x * 1}deg)`
                      } : {}}
                    >
                      AI
                    </span>
                  </h1>
                  
                  {/* Floating accent elements */}
                  <div className="relative mt-8">
                    <div 
                      className="absolute left-1/2 top-0 w-2 h-2 bg-blue-500 rounded-full opacity-60 transition-all duration-100"
                      style={{
                        transform: `translate(${mousePosition.x * 30 - 50}%, ${mousePosition.y * -20}px)`
                      }}
                    ></div>
                    <div 
                      className="absolute left-1/2 top-0 w-1 h-1 bg-purple-500 rounded-full opacity-80 transition-all duration-150"
                      style={{
                        transform: `translate(${mousePosition.x * -40 + 30}%, ${mousePosition.y * 25}px)`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Bottom Left - Subhead and Buttons */}
            <Card className="lg:col-span-2 border-gray-200/30 bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl shadow-gray-200/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-300/30 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center h-full relative z-10">
                <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
                  We're entering a new era of business transformation — one where AI unlocks deeper insights, faster
                  growth, and life-changing solutions. At <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI 4U</span>, we're building that future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => scrollToSection('ideas')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-400/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-400/40 group"
                  >
                    Start Your AI Project
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <Button
                    onClick={() => scrollToSection('products')}
                    size="lg"
                    variant="outline"
                    className="border-gray-300/50 text-gray-700 hover:bg-white/90 hover:border-blue-300/50 hover:text-blue-700 rounded-full px-8 py-4 text-lg font-medium bg-white/60 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 group"
                  >
                    <Play className="mr-2 w-5 h-5 group-hover:text-blue-600 transition-colors duration-300" />
                    View Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Bottom Right - Interactive 3D Shape */}
            <Card className="border-gray-200/30 bg-white/70 backdrop-blur-md rounded-3xl overflow-visible relative shadow-xl shadow-gray-200/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-200/30 group">
              <CardContent className="p-0 h-full relative">
                {/* Enhanced 3D Organic Shape with mouse parallax */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative w-80 h-80 transform scale-150 transition-transform duration-300"
                    style={{
                      transform: `scale(${1.5 + mousePosition.x * 0.1}) rotate(${mousePosition.x * 5}deg)`
                    }}
                  >
                    {/* Enhanced organic blob layers with parallax */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-[3rem] opacity-90 animate-pulse transition-all duration-200"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                        animationDuration: "4s",
                        transform: `rotate(${12 + mousePosition.x * 10}deg) translate3d(${mousePosition.x * 5}px, ${mousePosition.y * 5}px, 0) scale(${1 + mousePosition.y * 0.05})`
                      }}
                    ></div>
                    <div
                      className="absolute inset-4 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-[2.5rem] opacity-80 animate-pulse transition-all duration-150"
                      style={{
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
                        animationDuration: "5s",
                        animationDelay: "1s",
                        transform: `rotate(${-6 + mousePosition.y * 8}deg) translate3d(${mousePosition.x * -3}px, ${mousePosition.y * 8}px, 0)`
                      }}
                    ></div>
                    <div
                      className="absolute inset-8 bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-500 rounded-[2rem] opacity-70 animate-pulse transition-all duration-100"
                      style={{
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                        animationDuration: "6s",
                        animationDelay: "2s",
                        transform: `rotate(${3 + mousePosition.x * 5}deg) translate3d(${mousePosition.x * 8}px, ${mousePosition.y * -5}px, 0) scale(${1 + mousePosition.x * 0.03})`
                      }}
                    ></div>

                    {/* Enhanced floating elements with mouse interaction */}
                    <div 
                      className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl opacity-80 animate-bounce shadow-lg transition-all duration-75"
                      style={{
                        transform: `rotate(${45 + mousePosition.x * 15}deg) translate3d(${mousePosition.x * 20}px, ${mousePosition.y * -15}px, 0) scale(${1 + mousePosition.y * 0.1})`
                      }}
                    ></div>
                    <div 
                      className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl opacity-70 animate-bounce shadow-md transition-all duration-100"
                      style={{
                        animationDelay: '500ms',
                        transform: `rotate(${-12 + mousePosition.y * 10}deg) translate3d(${mousePosition.x * -15}px, ${mousePosition.y * 20}px, 0)`
                      }}
                    ></div>
                    <div 
                      className="absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg opacity-60 animate-bounce shadow-sm transition-all duration-125"
                      style={{
                        animationDelay: '1000ms',
                        transform: `rotate(${30 + mousePosition.x * 20}deg) translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 10}px, 0)`
                      }}
                    ></div>
                    
                    {/* Additional interactive particles */}
                    <div 
                      className="absolute top-1/4 right-1/4 w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full opacity-50 transition-all duration-50"
                      style={{
                        transform: `translate3d(${mousePosition.x * 30}px, ${mousePosition.y * -25}px, 0) scale(${1 + mousePosition.x * 0.15})`
                      }}
                    ></div>
                    <div 
                      className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-40 transition-all duration-75"
                      style={{
                        transform: `translate3d(${mousePosition.x * -20}px, ${mousePosition.y * 30}px, 0) rotate(${mousePosition.y * 15}deg)`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className={`py-24 bg-gradient-to-br from-white/80 via-blue-50/60 to-purple-50/80 relative overflow-hidden ${sectionsLoaded.services ? 'animate-in fade-in slide-in-from-bottom-8' : 'opacity-0'}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/5 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/5 w-56 h-56 bg-gradient-to-br from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl lg:text-5xl font-light bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 transition-all duration-500 hover:scale-105">
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Complete</span> AI Solutions
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              From strategy to deployment, we handle every aspect of your <span className="font-semibold text-blue-600">AI transformation</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                Icon: Brain,
                iconColor: "from-blue-500 to-indigo-600",
                title: "AI Strategy Consulting",
                description: "**Business-specific** roadmaps and competitive analysis.",
                features: ["Strategic Planning", "ROI Analysis", "Implementation Roadmap"]
              },
              {
                Icon: Smartphone,
                iconColor: "from-purple-500 to-pink-600",
                title: "Custom AI App Development",
                description: "**iOS/Swift**, web apps, SaaS dashboards.",
                features: ["iOS Development", "Web Applications", "SaaS Platforms"]
              },
              {
                Icon: Zap,
                iconColor: "from-orange-500 to-red-600",
                title: "Automation & Workflow AI",
                description: "**Email/CRM** automation and document parsing.",
                features: ["Process Automation", "CRM Integration", "Document AI"]
              },
              {
                Icon: Plug,
                iconColor: "from-green-500 to-emerald-600",
                title: "AI API Integration",
                description: "**GPT-4o**, Claude, Llama 3.1 with RAG pipelines.",
                features: ["API Development", "RAG Systems", "Model Integration"]
              },
              {
                Icon: Globe,
                iconColor: "from-cyan-500 to-teal-600",
                title: "Localization & Personas",
                description: "**Spanish** markets and niche GPTs.",
                features: ["Market Research", "Cultural Adaptation", "Persona GPTs"]
              },
              {
                Icon: Rocket,
                iconColor: "from-violet-500 to-purple-600",
                title: "Rapid MVP Development",
                description: "Launch an **MVP in days**, not months.",
                features: ["Quick Prototyping", "Agile Development", "Fast Deployment"]
              },
            ].map((service, index) => {
              const isLoaded = sectionsLoaded.services
              const isHovered = hoveredCard === `service-${index}`
              
              return (
              <Card
                key={index}
                onMouseEnter={() => setHoveredCard(`service-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`border-gray-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/25 bg-white/70 backdrop-blur-md rounded-2xl group hover:-translate-y-2 relative overflow-hidden cursor-pointer ${
                  isLoaded ? 'animate-in slide-in-from-bottom-8 fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Enhanced card background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.iconColor} opacity-20 blur-sm`}></div>
                </div>
                
                <CardHeader className="pb-6 relative z-10">
                  {/* Enhanced icon with gradient background and loading state */}
                  <div className="relative mb-6">
                    {!isLoaded ? (
                      <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse mb-4 shadow-lg"></div>
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                        {/* Shimmer effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000`}></div>
                        <service.Icon className={`w-8 h-8 text-white transition-all duration-300 ${isHovered ? 'animate-pulse' : ''}`} />
                      </div>
                    )}
                    {/* Floating accent dot with enhanced animation */}
                    <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r ${service.iconColor} opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 ${isHovered ? 'animate-bounce' : ''}`}></div>
                    
                    {/* Loading indicator */}
                    {!isLoaded && (
                      <div className="absolute top-0 left-0 w-16 h-16 rounded-2xl border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
                    )}
                  </div>
                  
                  {!isLoaded ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  ) : (
                    <CardTitle className="text-gray-900 text-xl font-semibold mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  )}
                  
                  {!isLoaded ? (
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : (
                    <CardDescription
                      className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  )}
                  
                  {/* Feature list with enhanced loading states */}
                  <div className="space-y-2">
                    {!isLoaded ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((_, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      service.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className={`flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 ${
                            isHovered ? 'animate-in slide-in-from-left-2 fade-in' : ''
                          }`}
                          style={{ transitionDelay: `${featureIndex * 100}ms` }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.iconColor} ${isHovered ? 'animate-pulse' : ''}`}></div>
                          <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            {feature}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Enhanced progress bar animation with loading state */}
                  {!isLoaded ? (
                    <div className="mt-4 h-1 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div 
                        className={`h-full bg-gradient-to-r ${service.iconColor} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}
                        style={{ transitionDelay: '300ms' }}
                      ></div>
                    </div>
                  )}
                </CardHeader>
              </Card>
            )
            })}
          </div>
        </div>
      </section>

      {/* Featured Product Showcase */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Meet <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Amigo</span>
              </h2>
              <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
                Your personal AI assistant that understands you better than any other chatbot.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <span className="text-lg">Powered by GPT-4o for superior intelligence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-lg">Personalized responses that evolve with you</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-lg">Available 24/7 on your iPhone</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold">4.9</span>
                  <span className="text-gray-300">rating</span>
                </div>
                <div className="text-lg">
                  <span className="font-bold text-cyan-400">3,200+</span> users
                </div>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Download on App Store
              </Button>
            </div>
            
            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/ai-assistant-mockup.png" 
                  alt="AI Amigo App Screenshot" 
                  className="w-full max-w-md mx-auto drop-shadow-2xl rounded-3xl"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-80 animate-bounce" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Products Section */}
      <section id="products" className="py-24 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Live Products</h2>
            <p className="text-xl text-gray-600">Real AI applications serving thousands of users worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Amigo",
                rating: "4.9",
                users: "3,200+",
                url: "https://apps.apple.com/us/app/ai-amigo/id6670725604",
                featured: true,
              },
              {
                icon: "🧠",
                title: "Inteligencia Artificial",
                rating: "4.6",
                users: "1,500+",
                url: "https://apps.apple.com/us/app/inteligencia-artificial-ia/id6743879085",
                featured: true,
              },
              {
                icon: "💪",
                title: "Accountability Buddie",
                rating: "4.8",
                users: "900+",
                url: "https://apps.apple.com/us/app/accountability-buddie/id6742691299",
              },
              {
                icon: "🌟",
                title: "SheGPT",
                rating: "4.9",
                users: "2,100+",
                url: "https://apps.apple.com/us/app/shegpt/id6744063469",
              },
              {
                icon: "🛡️",
                title: "Sober AI",
                rating: "4.7",
                users: "1,800+",
                url: "https://apps.apple.com/us/app/sober-ai/id6740759999",
              },
              {
                icon: "🎨",
                title: "AI Image Create",
                rating: "4.5",
                users: "1,200+",
                url: "https://apps.apple.com/us/app/ai-image-create/id6744127405",
              },
            ].map((product, index) => (
              <Card
                key={index}
                className={`border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl group hover:-translate-y-1 ${
                  product.featured ? "ring-2 ring-blue-200 border-blue-300/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {product.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
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
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full bg-transparent"
                  >
                    <a href={product.url} target="_blank" rel="noopener noreferrer">
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

      {/* App Store Showcase */}
      <section className="py-24 bg-gradient-to-r from-gray-100 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="/app-store-template.jpg" 
                alt="App Store Success Stories" 
                className="w-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">App Store</span> Success
              </h2>
              <p className="text-xl lg:text-2xl mb-8 text-gray-700 leading-relaxed">
                From concept to top charts - we've helped launch multiple successful apps that users love.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-white/80 rounded-2xl backdrop-blur-sm shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                  <div className="text-gray-600">Apps Published</div>
                </div>
                <div className="text-center p-6 bg-white/80 rounded-2xl backdrop-blur-sm shadow-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
                  <div className="text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center p-6 bg-white/80 rounded-2xl backdrop-blur-sm shadow-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-gray-600">Downloads</div>
                </div>
                <div className="text-center p-6 bg-white/80 rounded-2xl backdrop-blur-sm shadow-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">$2M+</div>
                  <div className="text-gray-600">Revenue Generated</div>
                </div>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Start Your App Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24 bg-white/50 backdrop-blur-sm">
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
              <Card key={index} className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl text-center p-8">
                <CardContent className="p-0">
                  <div className="text-4xl font-light text-gray-900 mb-3">{stat.value}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                content:
                  "AI 4U transformed our business operations. The custom automation saved us 30% on routine tasks and increased our productivity dramatically.",
                author: "Maria Rodriguez",
                role: "CEO",
                company: "Tech Startup Inc.",
                image: "/testimonial-maria.png",
                rating: 5,
              },
              {
                content:
                  "The Spanish-language AI tools opened up entirely new markets for us. Phenomenal localization and cultural understanding.",
                author: "Carlos Gutierrez",
                role: "Director",
                company: "Marketing Agency Pro",
                image: "/testimonial-carlos.png",
                rating: 5,
              },
              {
                content: "From idea to App Store in just weeks. The rapid development process was incredible and exceeded all expectations.",
                author: "Jennifer Lee",
                role: "Founder",
                company: "Health App Solutions",
                image: "/testimonial-jennifer.png",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="group border-0 bg-white/80 backdrop-blur-xl rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-200/25 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                {/* Enhanced background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote decoration */}
                <div className="absolute top-4 right-4 text-6xl text-blue-200/30 font-serif group-hover:text-blue-300/40 transition-colors duration-500">”</div>
                
                <CardContent className="p-0 relative z-10">
                  {/* Enhanced star rating */}
                  <div className="flex items-center mb-6 space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" 
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                    <div className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-2 group-hover:translate-x-0">
                      Verified Client
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-8 text-lg italic group-hover:text-gray-800 transition-colors duration-300">
                    “{testimonial.content}”
                  </p>
                  
                  {/* Enhanced author info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
                      <p className="text-gray-900 font-bold text-lg">{testimonial.author}</p>
                      <p className="text-blue-600 font-medium">{testimonial.role}</p>
                      <p className="text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insights & Updates */}
      <section id="insights" className="py-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
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
              },
              {
                title: "Spanish-Language AI: Untapped Opportunities",
                date: "December 10, 2024",
                excerpt:
                  "Exploring the massive potential of AI applications designed specifically for Spanish-speaking markets.",
              },
              {
                title: "From Idea to App Store in 7 Days",
                date: "December 5, 2024",
                excerpt:
                  "Our proven methodology for rapid AI app development and what it means for your business timeline.",
              },
              {
                title: "AI Automation ROI: Real Numbers",
                date: "November 28, 2024",
                excerpt:
                  "Breaking down the actual cost savings and efficiency gains our clients have achieved through AI automation.",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl group hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</CardDescription>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium justify-start"
                  >
                    Read more →
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Got an Idea Section */}
      <section id="ideas" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Got an idea?</h2>
            <p className="text-xl text-gray-600">
              We'd love to hear about your vision. Share your AI project ideas with us and let's explore what's
              possible.
            </p>
          </div>

          <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl">
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
                      className="border-gray-300 rounded-xl"
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
                      className="border-gray-300 rounded-xl"
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
                    className="border-gray-300 rounded-xl min-h-[120px]"
                    placeholder="Tell us about your AI project idea..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3 text-lg font-medium"
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
      <footer id="contact" className="border-t border-gray-200/50 bg-white/80 backdrop-blur-xl py-16">
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

      {/* Enhanced Chat Interface */}
      {isChatOpen && (
        <div
          className={`fixed bottom-8 right-8 w-96 bg-white/95 backdrop-blur-2xl border border-gray-200/30 rounded-3xl shadow-2xl shadow-blue-200/20 transition-all duration-500 z-50 animate-in slide-in-from-bottom-8 fade-in ${
            isMinimized ? "h-16" : "h-[500px]"
          }`}
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
            <div className="flex items-center space-x-3">
              {/* Enhanced AI Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">AI 4U Assistant</h3>
                <p className="text-green-600 text-xs font-medium flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Online</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Enhanced buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 active:scale-95"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <ScrollArea className="h-[340px] p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-3 max-w-[85%] group">
                        {message.role === "assistant" && (
                          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md mt-1">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {message.role === "user" && (
                          <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-md mt-1 order-2 ml-3">
                            <span className="text-white text-xs font-semibold">U</span>
                          </div>
                        )}
                        <div className="relative">
                          <div
                            className={`p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                : "bg-gray-50 text-gray-900 border border-gray-200/50 hover:bg-gray-100/50"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {/* Message timestamp on hover */}
                          <div className="absolute -bottom-6 left-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in">
                      <div className="flex items-start space-x-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                          <Brain className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-gray-50 border border-gray-200/50 p-4 rounded-2xl">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Enhanced Input Section */}
              <div className="p-4 border-t border-gray-200/30 bg-gray-50/30">
                {/* Character count and quick actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-500">
                    {input.length}/500 characters
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInput("Tell me about your AI services")}
                      className="text-xs px-3 py-1 h-auto text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                    >
                      Services
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInput("How much does it cost?")}
                      className="text-xs px-3 py-1 h-auto text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                    >
                      Pricing
                    </Button>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about our AI services..."
                    className="flex-1 border-gray-300/50 rounded-2xl px-4 py-3 bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                      !input.trim() || isLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    } text-white`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : input.trim() && !isLoading ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
