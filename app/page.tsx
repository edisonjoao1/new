"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ArrowRight, Play, Send, X, Minimize2, Maximize2, Star, ExternalLink, Mail } from "lucide-react"
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
  const chatEndRef = useRef<HTMLDivElement>(null)

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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent("New Idea Submission")
    const body = encodeURIComponent(`Name: ${ideaForm.name}\nEmail: ${ideaForm.email}\n\nIdea:\n${ideaForm.idea}`)
    window.location.href = `mailto:ideas@ai4u.space?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-gray-900 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-xl font-medium text-gray-900">AI 4U</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Labs</span>
            </div>

            {/* Navigation Pills */}
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
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-full transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
              >
                Chat with AI
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - 3x2 Grid */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Abstract Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Top Row - Full Width Headline */}
            <Card className="lg:col-span-3 border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden relative">
              <CardContent className="p-12 lg:p-16 flex items-center justify-center h-full">
                <h1 className="text-5xl lg:text-7xl font-light text-gray-900 text-center leading-tight">
                  Transform your business with AI
                </h1>
              </CardContent>
            </Card>

            {/* Bottom Left - Subhead and Buttons */}
            <Card className="lg:col-span-2 border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center h-full">
                <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                  We're entering a new era of business transformation — one where AI unlocks deeper insights, faster
                  growth, and life-changing solutions. At AI 4U, we're building that future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-4 text-lg font-medium group"
                  >
                    Start Your AI Project
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              </CardContent>
            </Card>

            {/* Bottom Right - 3D Shape that bleeds outside */}
            <Card className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-3xl overflow-visible relative">
              <CardContent className="p-0 h-full relative">
                {/* 3D Organic Shape */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80 transform scale-150">
                    {/* Main organic blob */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 rounded-[3rem] transform rotate-12 opacity-90 animate-pulse"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                        animationDuration: "4s",
                      }}
                    ></div>
                    <div
                      className="absolute inset-4 bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 rounded-[2.5rem] transform -rotate-6 opacity-80 animate-pulse"
                      style={{
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
                        animationDuration: "5s",
                        animationDelay: "1s",
                      }}
                    ></div>
                    <div
                      className="absolute inset-8 bg-gradient-to-br from-pink-300 via-pink-400 to-orange-400 rounded-[2rem] transform rotate-3 opacity-70 animate-pulse"
                      style={{
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                        animationDuration: "6s",
                        animationDelay: "2s",
                      }}
                    ></div>

                    {/* Floating elements that escape the container */}
                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-2xl transform rotate-45 opacity-80 animate-bounce"></div>
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-xl transform -rotate-12 opacity-70 animate-bounce delay-500"></div>
                    <div className="absolute top-1/2 -left-4 w-8 h-8 bg-gradient-to-br from-green-300 to-green-400 rounded-lg transform rotate-30 opacity-60 animate-bounce delay-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white/50 backdrop-blur-sm">
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
                icon: "🧠",
                title: "AI Strategy Consulting",
                description: "**Business-specific** roadmaps and competitive analysis.",
              },
              {
                icon: "📱",
                title: "Custom AI App Development",
                description: "**iOS/Swift**, web apps, SaaS dashboards.",
              },
              {
                icon: "⚡",
                title: "Automation & Workflow AI",
                description: "**Email/CRM** automation and document parsing.",
              },
              {
                icon: "🔗",
                title: "AI API Integration",
                description: "**GPT-4o**, Claude, Llama 3.1 with RAG pipelines.",
              },
              {
                icon: "🌍",
                title: "Localization & Personas",
                description: "**Spanish** markets and niche GPTs.",
              },
              {
                icon: "🚀",
                title: "Rapid MVP Development",
                description: "Launch an **MVP in days**, not months.",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl group hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="text-gray-900 text-xl font-medium mb-3">{service.title}</CardTitle>
                  <CardDescription
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                </CardHeader>
              </Card>
            ))}
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

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                content:
                  "AI 4U transformed our business operations. The custom automation saved us 30% on routine tasks.",
                author: "Maria Rodriguez",
                role: "CEO, Tech Startup",
                avatar: "MR",
              },
              {
                content:
                  "The Spanish-language AI tools opened up entirely new markets for us. Phenomenal localization.",
                author: "Carlos Gutierrez",
                role: "Director, Marketing Agency",
                avatar: "CG",
              },
              {
                content: "From idea to App Store in just weeks. The rapid development process was incredible.",
                author: "Jennifer Lee",
                role: "Founder, Health App",
                avatar: "JL",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl p-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
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

      {/* Clean Chat Interface */}
      {isChatOpen && (
        <div
          className={`fixed bottom-8 right-8 w-96 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl transition-all duration-300 z-50 ${isMinimized ? "h-16" : "h-[500px]"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
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
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about our AI services..."
                    className="flex-1 border-gray-300 rounded-full px-4"
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
