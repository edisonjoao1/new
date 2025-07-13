"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import {
  ArrowRight,
  Brain,
  Code,
  Globe,
  Play,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
  MessageSquare,
  Shield,
  Rocket,
  Send,
  Bot,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ChevronDown,
  Menu,
  ExternalLink,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm AI 4U's assistant. I can help you learn about our AI consulting services, mobile apps, and how we can transform your business with cutting-edge AI solutions. What would you like to know?",
      },
    ],
  })

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Cursor Glow Effect */}
      <div
        className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 transition-all duration-300 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-2xl bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  AI 4U
                </span>
                <div className="text-sm text-purple-300 font-medium">Naples, FL • Est. 2023</div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-10">
              {["Services", "Products", "Results", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium text-lg relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 font-medium"
              >
                Portfolio
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 font-semibold">
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-white/10 py-4 space-y-4">
              {["Services", "Products", "Results", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        {/* Ultra-Enhanced Abstract Visualization */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[800px] h-[800px] opacity-15">
            {/* Central Pulsing Core */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-2xl shadow-purple-400/50"></div>
              <div className="absolute inset-0 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping delay-1000"></div>
            </div>

            {/* Multiple Orbiting Systems */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border rounded-full animate-spin`}
                style={{
                  width: `${(i + 2) * 80}px`,
                  height: `${(i + 2) * 80}px`,
                  borderColor: `rgba(${i % 3 === 0 ? "168, 85, 247" : i % 3 === 1 ? "236, 72, 153" : "59, 130, 246"}, ${0.4 - i * 0.04})`,
                  borderWidth: `${Math.max(1, 3 - i * 0.3)}px`,
                  animationDuration: `${15 + i * 8}s`,
                  animationDirection: i % 2 ? "normal" : "reverse",
                }}
              ></div>
            ))}

            {/* Enhanced Floating Elements */}
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-bounce"
                style={{
                  width: `${4 + (i % 4)}px`,
                  height: `${4 + (i % 4)}px`,
                  backgroundColor: [
                    "#a855f7",
                    "#ec4899",
                    "#3b82f6",
                    "#06b6d4",
                    "#8b5cf6",
                    "#f59e0b",
                    "#10b981",
                    "#f97316",
                  ][i % 8],
                  top: `${10 + ((i * 7) % 80)}%`,
                  left: `${10 + ((i * 11) % 80)}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${1.5 + (i % 4) * 0.5}s`,
                  boxShadow: `0 0 20px ${["#a855f7", "#ec4899", "#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#f97316"][i % 8]}40`,
                }}
              ></div>
            ))}

            {/* Complex SVG Network */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800">
              <defs>
                {[...Array(6)].map((_, i) => (
                  <linearGradient key={i} id={`grad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop
                      offset="0%"
                      stopColor={["#a855f7", "#ec4899", "#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b"][i]}
                      stopOpacity="0.6"
                    />
                    <stop
                      offset="100%"
                      stopColor={["#ec4899", "#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#a855f7"][i]}
                      stopOpacity="0.1"
                    />
                  </linearGradient>
                ))}
              </defs>

              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d={`M${100 + i * 15} ${600 - i * 25} Q${400 + i * 10} ${400 - i * 15} ${700 - i * 20} ${200 + i * 30} T${750 - i * 10} ${150 + i * 20}`}
                  stroke={`url(#grad${i % 6})`}
                  strokeWidth={4 - i * 0.2}
                  fill="none"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${3 + i * 0.2}s` }}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="text-center">
            <Badge className="mb-10 bg-purple-500/20 text-purple-200 border-purple-500/30 backdrop-blur-xl px-8 py-3 text-lg font-medium shadow-2xl shadow-purple-500/10">
              <Zap className="w-5 h-5 mr-3" />
              AI Consulting Studio • Naples, Florida • Founded 2023
            </Badge>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-12 leading-tight">
              AI Consulting &
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
                {" "}
                Solutions
              </span>
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                That Work for You
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
              We simplify AI adoption for businesses and individuals by building powerful tools, automations, and
              mobile-first applications that actually solve problems, save time, and generate money.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-2xl px-16 py-8 rounded-3xl shadow-2xl shadow-purple-500/25 transition-all duration-500 hover:scale-110 hover:shadow-purple-500/40 font-bold group"
              >
                Start Your AI Journey
                <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-2xl px-16 py-8 rounded-3xl bg-black/20 backdrop-blur-xl transition-all duration-500 hover:scale-110 font-bold group"
              >
                <Play className="mr-4 w-7 h-7 group-hover:scale-110 transition-transform" />
                View Portfolio
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-xl">
              {[
                { icon: Star, text: "$2M+ saved", color: "text-yellow-400" },
                { icon: Smartphone, text: "10+ apps launched", color: "text-purple-400" },
                { icon: Users, text: "10,000+ users", color: "text-pink-400" },
                { icon: TrendingUp, text: "40% efficiency boost", color: "text-green-400" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-black/30 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 hover:scale-105 transition-all duration-300 hover:bg-black/40"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <span className="font-bold text-white">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-40 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-blue-500/20 text-blue-200 border-blue-500/30 backdrop-blur-xl px-6 py-2">
              <Code className="w-4 h-4 mr-2" />
              Our Services
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Complete AI Solutions</h2>
            <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light">
              From strategy to deployment, we handle every aspect of your AI transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Brain,
                title: "AI Strategy Consulting",
                description:
                  "Business-specific AI integration plans, competitive analysis, and technical roadmaps tailored to your goals",
                gradient: "from-purple-500 to-pink-500",
                features: ["Custom AI Roadmaps", "Competitive Analysis", "ROI Projections"],
              },
              {
                icon: Smartphone,
                title: "Custom AI App Development",
                description:
                  "iOS/Swift apps with LLM integrations, web apps, SaaS dashboards, and mobile-first AI solutions",
                gradient: "from-blue-500 to-cyan-500",
                features: ["iOS/Swift Development", "Web Applications", "SaaS Dashboards"],
              },
              {
                icon: Zap,
                title: "Automation & Workflow AI",
                description:
                  "Email/CRM automation, document parsing, and agent-based tools for customer support and operations",
                gradient: "from-green-500 to-emerald-500",
                features: ["Email Automation", "Document Processing", "Support Agents"],
              },
              {
                icon: Code,
                title: "AI API Integration",
                description:
                  "OpenAI GPT-4o, Claude, Llama 3.1, Mistral integration with RAG pipelines and real-time assistants",
                gradient: "from-orange-500 to-red-500",
                features: ["GPT-4o Integration", "RAG Pipelines", "Real-time Assistants"],
              },
              {
                icon: Globe,
                title: "Localization & Personas",
                description:
                  "Spanish-speaking markets, persona-aligned GPTs for women, students, creators, and niche audiences",
                gradient: "from-purple-500 to-indigo-500",
                features: ["Spanish Localization", "Persona GPTs", "Niche Markets"],
              },
              {
                icon: Rocket,
                title: "Rapid MVP Development",
                description:
                  "Fast turnaround from idea to app launch - MVP in days, not months, with proven development processes",
                gradient: "from-pink-500 to-rose-500",
                features: ["MVP in Days", "Proven Process", "Fast Launch"],
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-black/30 border-white/10 backdrop-blur-2xl hover:bg-black/40 transition-all duration-700 hover:scale-105 hover:border-white/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-6 relative z-10">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-500 relative`}
                  >
                    <service.icon className="w-10 h-10 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="text-white text-3xl mb-6 font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-lg leading-relaxed mb-6">
                    {service.description}
                  </CardDescription>
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative py-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-green-500/20 text-green-200 border-green-500/30 backdrop-blur-xl px-6 py-2">
              <Smartphone className="w-4 h-4 mr-2" />
              Live Products
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Apps on the App Store</h2>
            <p className="text-2xl md:text-3xl text-gray-300 font-light">
              Real AI applications serving thousands of users worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: MessageSquare,
                title: "Foxie",
                description: "Social network for deeper, meaningful conversations powered by AI matching algorithms",
                gradient: "from-purple-500 to-pink-500",
                users: "2,500+ users",
                rating: "4.8",
              },
              {
                icon: Users,
                title: "AI Amigo",
                description:
                  "Friendly AI companion supporting both Spanish and English speakers with personalized assistance",
                gradient: "from-blue-500 to-cyan-500",
                users: "3,200+ users",
                rating: "4.9",
              },
              {
                icon: Shield,
                title: "Sober AI",
                description:
                  "AI-powered sobriety assistant providing 24/7 support and accountability for recovery journeys",
                gradient: "from-green-500 to-emerald-500",
                users: "1,800+ users",
                rating: "4.7",
              },
              {
                icon: Brain,
                title: "Inteligencia Artificial",
                description: "Spanish-focused AI productivity tool designed specifically for Latin American markets",
                gradient: "from-orange-500 to-red-500",
                users: "1,500+ users",
                rating: "4.6",
              },
              {
                icon: TrendingUp,
                title: "Accountability Buddie",
                description:
                  "Goal-setting and AI coaching assistant that helps users stay on track with their objectives",
                gradient: "from-purple-500 to-indigo-500",
                users: "900+ users",
                rating: "4.8",
              },
              {
                icon: Star,
                title: "SheGPT / Woman GPT",
                description: "Female-oriented AI assistants designed with women's perspectives and needs in mind",
                gradient: "from-pink-500 to-rose-500",
                users: "2,100+ users",
                rating: "4.9",
              },
            ].map((product, index) => (
              <Card
                key={index}
                className="bg-black/30 border-white/10 backdrop-blur-2xl hover:bg-black/40 transition-all duration-700 hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${product.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-bold">{product.rating}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{product.users}</div>
                    </div>
                  </div>
                  <CardTitle className="text-white text-2xl mb-4 font-bold">{product.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-lg leading-relaxed mb-6">
                    {product.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 group-hover:border-white/30 transition-all duration-300 bg-transparent"
                  >
                    View on App Store
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="relative py-40 bg-gradient-to-b from-black/30 to-transparent">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-yellow-500/20 text-yellow-200 border-yellow-500/30 backdrop-blur-xl px-6 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Proven Impact
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Results That Matter</h2>
            <p className="text-2xl md:text-3xl text-gray-300 font-light">
              Real outcomes delivered for our clients and users
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { value: "$2M+", label: "Client savings through AI automation", color: "text-purple-400", icon: Star },
              { value: "10+", label: "AI apps launched and live", color: "text-pink-400", icon: Smartphone },
              { value: "10,000+", label: "Users onboarded across platforms", color: "text-blue-400", icon: Users },
              {
                value: "40%",
                label: "Improvement in operational efficiency",
                color: "text-green-400",
                icon: TrendingUp,
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-black/30 border-white/10 backdrop-blur-2xl text-center hover:scale-110 transition-all duration-500 hover:bg-black/40 group"
              >
                <CardContent className="p-10">
                  <stat.icon
                    className={`w-12 h-12 ${stat.color} mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <div className={`text-6xl font-black ${stat.color} mb-6`}>{stat.value}</div>
                  <p className="text-gray-300 text-xl font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                content:
                  "AI 4U transformed our business operations. The custom automation saved us 30% on routine tasks and the mobile app exceeded our expectations.",
                author: "Maria Rodriguez",
                role: "CEO, Tech Startup",
                avatar: "MR",
                rating: 5,
              },
              {
                content:
                  "The Spanish-language AI tools opened up entirely new markets for us. The cultural understanding and localization is phenomenal.",
                author: "Carlos Gutierrez",
                role: "Director, Marketing Agency",
                avatar: "CG",
                rating: 5,
              },
              {
                content:
                  "From idea to App Store in just weeks. The rapid development process and quality of the final product was incredible.",
                author: "Jennifer Lee",
                role: "Founder, Health App",
                avatar: "JL",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-black/30 border-white/10 backdrop-blur-2xl hover:bg-black/40 transition-all duration-500 hover:scale-105 group"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-bold text-lg">{testimonial.author}</p>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-12">Ready to Transform Your Business?</h2>
          <p className="text-2xl md:text-3xl text-gray-300 mb-16 font-light">
            Join the businesses already using our AI solutions to save time, reduce costs, and accelerate growth
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-2xl px-16 py-8 rounded-3xl shadow-2xl shadow-purple-500/25 transition-all duration-500 hover:scale-110 font-bold"
            >
              Start Your AI Project
              <ArrowRight className="ml-4 w-7 h-7" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-2xl px-16 py-8 rounded-3xl bg-black/20 backdrop-blur-xl transition-all duration-500 hover:scale-110 font-bold"
            >
              Schedule Consultation
            </Button>
          </div>
          <p className="text-xl text-gray-400">Free consultation • Custom quotes • Fast turnaround</p>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-16">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-9 h-9 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">AI 4U</span>
                  <div className="text-purple-300 font-medium">Naples, FL</div>
                </div>
              </div>
              <p className="text-gray-400 text-xl mb-4">AI Consulting & Solutions That Work for You</p>
              <p className="text-gray-500">Founded 2023 • Transforming businesses with AI</p>
            </div>

            {[
              {
                title: "Services",
                links: ["AI Strategy Consulting", "Custom App Development", "Automation Solutions", "API Integration"],
              },
              {
                title: "Products",
                links: ["Foxie Social Network", "AI Amigo", "Sober AI", "SheGPT"],
              },
              {
                title: "Contact",
                links: ["Get Started", "Portfolio", "Case Studies", "ai4u.space"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-bold mb-8 text-2xl">{section.title}</h3>
                <ul className="space-y-4 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors text-lg hover:translate-x-1 inline-block transition-transform duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-16 pt-12 text-center text-gray-400">
            <p className="text-xl">&copy; 2024 AI 4U. All rights reserved. • Naples, Florida</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Floating Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-110 z-50 group"
        >
          <Bot className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </Button>
      )}

      {/* Enhanced AI Chat Interface */}
      {isChatOpen && (
        <div
          className={`fixed bottom-8 right-8 w-[420px] bg-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl transition-all duration-500 z-50 ${isMinimized ? "h-20" : "h-[700px]"}`}
        >
          {/* Enhanced Chat Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI 4U Assistant</h3>
                <p className="text-green-400 text-sm font-medium">Online • Powered by GPT-4o</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Enhanced Chat Messages */}
              <ScrollArea className="h-[540px] p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start space-x-3 max-w-[85%]">
                        {message.role === "assistant" && (
                          <Avatar className="w-8 h-8 mt-1">
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-4 rounded-2xl ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                              : "bg-white/10 text-gray-200 backdrop-blur-xl border border-white/10"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="w-8 h-8 mt-1">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                              U
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                          <div className="flex space-x-2">
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

              {/* Enhanced Chat Input */}
              <div className="p-6 border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about our AI services..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl px-6 shadow-lg disabled:opacity-50 transition-all duration-200 hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">Powered by OpenAI GPT-4o</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
