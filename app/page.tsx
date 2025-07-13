"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ArrowRight, Play, Send, X, Minimize2, Maximize2, ChevronDown, Menu, ExternalLink } from "lucide-react"
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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-xl font-medium text-gray-900">AI 4U</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Labs</span>
            </div>

            {/* Navigation Pills */}
            <div className="hidden lg:flex items-center space-x-2">
              {["Services", "Products", "Results", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6">
                Portfolio
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6">Get Started</Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
              {["Services", "Products", "Results", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-8 bg-gray-100 text-gray-600 border-gray-200 rounded-full px-4 py-2 text-sm font-medium">
                AI Consulting Studio • Naples, Florida
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
                Transform your business with AI
              </h1>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-lg">
                We simplify AI adoption for businesses by building powerful tools, automations, and mobile applications
                that solve real problems and generate measurable results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-4 text-lg font-medium"
                >
                  Start Your AI Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-4 text-lg font-medium bg-transparent"
                >
                  <Play className="mr-2 w-5 h-5" />
                  View Portfolio
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { value: "$2M+", label: "Saved" },
                  { value: "10+", label: "Apps" },
                  { value: "10K+", label: "Users" },
                  { value: "40%", label: "Efficiency" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract 3D-like Visualization */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Main blob */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 rounded-[3rem] transform rotate-3 opacity-80"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 rounded-[2.5rem] transform -rotate-2 opacity-70"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 rounded-[2rem] transform rotate-1 opacity-60"></div>

                {/* Floating elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-2xl transform rotate-12 opacity-80"></div>
                <div className="absolute bottom-12 left-12 w-12 h-12 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-xl transform -rotate-6 opacity-70"></div>
                <div className="absolute top-1/2 left-8 w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-lg transform rotate-45 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
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
                title: "AI Strategy Consulting",
                description:
                  "Business-specific AI integration plans, competitive analysis, and technical roadmaps tailored to your goals",
                color: "from-blue-100 to-blue-200",
              },
              {
                title: "Custom AI App Development",
                description:
                  "iOS/Swift apps with LLM integrations, web apps, SaaS dashboards, and mobile-first AI solutions",
                color: "from-purple-100 to-purple-200",
              },
              {
                title: "Automation & Workflow AI",
                description:
                  "Email/CRM automation, document parsing, and agent-based tools for customer support and operations",
                color: "from-green-100 to-green-200",
              },
              {
                title: "AI API Integration",
                description:
                  "OpenAI GPT-4o, Claude, Llama 3.1, Mistral integration with RAG pipelines and real-time assistants",
                color: "from-orange-100 to-orange-200",
              },
              {
                title: "Localization & Personas",
                description:
                  "Spanish-speaking markets, persona-aligned GPTs for women, students, creators, and niche audiences",
                color: "from-pink-100 to-pink-200",
              },
              {
                title: "Rapid MVP Development",
                description:
                  "Fast turnaround from idea to app launch - MVP in days, not months, with proven development processes",
                color: "from-cyan-100 to-cyan-200",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg bg-white rounded-2xl overflow-hidden group"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-full h-24 bg-gradient-to-br ${service.color} rounded-xl mb-6 group-hover:scale-105 transition-transform duration-300`}
                  ></div>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Live Products</h2>
            <p className="text-xl text-gray-600">Real AI applications serving thousands of users worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Foxie",
                description: "Social network for deeper, meaningful conversations powered by AI matching algorithms",
                users: "2,500+ users",
                rating: "4.8",
                color: "from-purple-100 to-purple-200",
              },
              {
                title: "AI Amigo",
                description:
                  "Friendly AI companion supporting both Spanish and English speakers with personalized assistance",
                users: "3,200+ users",
                rating: "4.9",
                color: "from-blue-100 to-blue-200",
              },
              {
                title: "Sober AI",
                description:
                  "AI-powered sobriety assistant providing 24/7 support and accountability for recovery journeys",
                users: "1,800+ users",
                rating: "4.7",
                color: "from-green-100 to-green-200",
              },
              {
                title: "Inteligencia Artificial",
                description: "Spanish-focused AI productivity tool designed specifically for Latin American markets",
                users: "1,500+ users",
                rating: "4.6",
                color: "from-orange-100 to-orange-200",
              },
              {
                title: "Accountability Buddie",
                description:
                  "Goal-setting and AI coaching assistant that helps users stay on track with their objectives",
                users: "900+ users",
                rating: "4.8",
                color: "from-pink-100 to-pink-200",
              },
              {
                title: "SheGPT / Woman GPT",
                description: "Female-oriented AI assistants designed with women's perspectives and needs in mind",
                users: "2,100+ users",
                rating: "4.9",
                color: "from-cyan-100 to-cyan-200",
              },
            ].map((product, index) => (
              <Card
                key={index}
                className="border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg bg-white rounded-2xl overflow-hidden group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                    ></div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">★ {product.rating}</div>
                      <div className="text-xs text-gray-500">{product.users}</div>
                    </div>
                  </div>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-3">{product.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full bg-transparent"
                  >
                    View on App Store
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Proven Results</h2>
            <p className="text-xl text-gray-600">Real outcomes delivered for our clients and users</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { value: "$2M+", label: "Client savings through AI automation" },
              { value: "10+", label: "AI apps launched and live" },
              { value: "10,000+", label: "Users onboarded across platforms" },
              { value: "40%", label: "Improvement in operational efficiency" },
            ].map((stat, index) => (
              <Card key={index} className="border-gray-200 bg-gray-50 rounded-2xl text-center p-8">
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
                  "AI 4U transformed our business operations. The custom automation saved us 30% on routine tasks and the mobile app exceeded our expectations.",
                author: "Maria Rodriguez",
                role: "CEO, Tech Startup",
                avatar: "MR",
              },
              {
                content:
                  "The Spanish-language AI tools opened up entirely new markets for us. The cultural understanding and localization is phenomenal.",
                author: "Carlos Gutierrez",
                role: "Director, Marketing Agency",
                avatar: "CG",
              },
              {
                content:
                  "From idea to App Store in just weeks. The rapid development process and quality of the final product was incredible.",
                author: "Jennifer Lee",
                role: "Founder, Health App",
                avatar: "JL",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-gray-200 bg-white rounded-2xl p-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 text-yellow-400">
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-900 font-medium">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-light text-white mb-8">Ready to transform your business?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the businesses already using our AI solutions to save time, reduce costs, and accelerate growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 py-4 text-lg font-medium"
            >
              Start Your AI Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 rounded-full px-8 py-4 text-lg font-medium bg-transparent"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-lg font-medium text-gray-900">AI 4U</span>
              </div>
              <p className="text-gray-600 mb-2">AI Consulting & Solutions That Work for You</p>
              <p className="text-gray-500 text-sm">Naples, Florida • Founded 2023</p>
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
                <h3 className="text-gray-900 font-medium mb-4">{section.title}</h3>
                <ul className="space-y-3 text-gray-600">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-gray-900 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 AI 4U. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Clean Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg z-50"
        >
          <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
        </Button>
      )}

      {/* Clean Chat Interface */}
      {isChatOpen && (
        <div
          className={`fixed bottom-8 right-8 w-96 bg-white border border-gray-200 rounded-2xl shadow-xl transition-all duration-300 z-50 ${isMinimized ? "h-16" : "h-[500px]"}`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border border-white rounded-sm"></div>
              </div>
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
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <ScrollArea className="h-[380px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
                        {message.role === "user" && (
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
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

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about our AI services..."
                    className="flex-1 border-gray-300 rounded-full px-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4"
                  >
                    <Send className="w-4 h-4" />
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
