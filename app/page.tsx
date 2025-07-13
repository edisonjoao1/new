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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI 4U</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </a>
              <a href="#products" className="text-gray-300 hover:text-white transition-colors">
                Products
              </a>
              <a href="#results" className="text-gray-300 hover:text-white transition-colors">
                Results
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Portfolio
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
        </div>

        {/* Abstract Visualization */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-96 h-96 opacity-30">
            {/* Central Core */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>

            {/* Orbiting Rings */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-400/30 rounded-full animate-spin"
              style={{ animationDuration: "20s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-pink-400/20 rounded-full animate-spin"
              style={{ animationDuration: "30s", animationDirection: "reverse" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-400/15 rounded-full animate-spin"
              style={{ animationDuration: "40s" }}
            ></div>

            {/* Data Points */}
            <div
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 right-1/6 w-1 h-1 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: "2.5s" }}
            ></div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 384">
              <defs>
                <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="lineGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Trend Lines */}
              <path
                d="M96 288 Q192 240 288 192 T384 144"
                stroke="url(#lineGradient1)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M96 192 Q192 144 288 96 T384 48"
                stroke="url(#lineGradient2)"
                strokeWidth="1.5"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <path
                d="M48 240 Q144 192 240 144 T336 96"
                stroke="url(#lineGradient1)"
                strokeWidth="1"
                fill="none"
                className="animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </svg>

            {/* Floating Geometric Shapes */}
            <div
              className="absolute top-16 left-16 w-6 h-6 border border-purple-400/40 rotate-45 animate-spin"
              style={{ animationDuration: "15s" }}
            ></div>
            <div
              className="absolute top-20 right-20 w-4 h-4 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rotate-12 animate-spin"
              style={{ animationDuration: "25s", animationDirection: "reverse" }}
            ></div>
            <div className="absolute bottom-16 left-20 w-5 h-5 border border-blue-400/30 rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-20 right-16 w-3 h-8 bg-gradient-to-t from-cyan-400/20 to-transparent animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-purple-500/20 text-purple-200 border-purple-500/30">
              <Zap className="w-3 h-3 mr-1" />
              AI Consulting Studio • Naples, Florida
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AI Consulting &
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Solutions
              </span>
              <br />
              That Work for You
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We simplify AI adoption for businesses and individuals by building powerful tools, automations, and
              mobile-first applications that actually solve problems, save time, and generate money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
              >
                Start Your AI Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              >
                <Play className="mr-2 w-5 h-5" />
                View Portfolio
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>$2M+ saved</span>
              </div>
              <div className="flex items-center">
                <Smartphone className="w-4 h-4 mr-1" />
                <span>10+ apps launched</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>10,000+ users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete AI Solutions & Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From strategy to deployment, we handle every aspect of your AI transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">AI Strategy Consulting</CardTitle>
                <CardDescription className="text-gray-300">
                  Business-specific AI integration plans, competitive analysis, and technical roadmaps tailored to your
                  goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Custom AI App Development</CardTitle>
                <CardDescription className="text-gray-300">
                  iOS/Swift apps with LLM integrations, web apps, SaaS dashboards, and mobile-first AI solutions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Automation & Workflow AI</CardTitle>
                <CardDescription className="text-gray-300">
                  Email/CRM automation, document parsing, and agent-based tools for customer support and operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">AI API Integration</CardTitle>
                <CardDescription className="text-gray-300">
                  OpenAI GPT-4o, Claude, Llama 3.1, Mistral integration with RAG pipelines and real-time assistants
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Localization & Personas</CardTitle>
                <CardDescription className="text-gray-300">
                  Spanish-speaking markets, persona-aligned GPTs for women, students, creators, and niche audiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Rapid MVP Development</CardTitle>
                <CardDescription className="text-gray-300">
                  Fast turnaround from idea to app launch - MVP in days, not months, with proven development processes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Products on App Store</h2>
            <p className="text-xl text-gray-300">Real AI applications serving thousands of users worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Foxie</CardTitle>
                <CardDescription className="text-gray-300">
                  Social network for deeper, meaningful conversations powered by AI matching algorithms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">AI Amigo</CardTitle>
                <CardDescription className="text-gray-300">
                  Friendly AI companion supporting both Spanish and English speakers with personalized assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Sober AI</CardTitle>
                <CardDescription className="text-gray-300">
                  AI-powered sobriety assistant providing 24/7 support and accountability for recovery journeys
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Inteligencia Artificial</CardTitle>
                <CardDescription className="text-gray-300">
                  Spanish-focused AI productivity tool designed specifically for Latin American markets
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Accountability Buddie</CardTitle>
                <CardDescription className="text-gray-300">
                  Goal-setting and AI coaching assistant that helps users stay on track with their objectives
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">SheGPT / Woman GPT</CardTitle>
                <CardDescription className="text-gray-300">
                  Female-oriented AI assistants designed with women's perspectives and needs in mind
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proven Results & Impact</h2>
            <p className="text-xl text-gray-300">Real outcomes delivered for our clients and users</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">$2M+</div>
                <p className="text-gray-300">Client savings through AI automation</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-pink-400 mb-2">10+</div>
                <p className="text-gray-300">AI apps launched and live</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
                <p className="text-gray-300">Users onboarded across platforms</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">40%</div>
                <p className="text-gray-300">Improvement in operational efficiency</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "AI 4U transformed our business operations. The custom automation saved us 30% on routine tasks and
                  the mobile app exceeded our expectations."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">MR</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Maria Rodriguez</p>
                    <p className="text-gray-400 text-sm">CEO, Tech Startup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The Spanish-language AI tools opened up entirely new markets for us. The cultural understanding and
                  localization is phenomenal."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">CG</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Carlos Gutierrez</p>
                    <p className="text-gray-400 text-sm">Director, Marketing Agency</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "From idea to App Store in just weeks. The rapid development process and quality of the final product
                  was incredible."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">JL</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Jennifer Lee</p>
                    <p className="text-gray-400 text-sm">Founder, Health App</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business with AI?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the businesses already using our AI solutions to save time, reduce costs, and accelerate growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
            >
              Start Your AI Project
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              Schedule Consultation
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free consultation • Custom quotes • Fast turnaround</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI 4U</span>
              </div>
              <p className="text-gray-400">AI Consulting & Solutions That Work for You</p>
              <p className="text-gray-500 text-sm mt-2">Naples, Florida • Founded 2023</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Strategy Consulting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Custom App Development
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Automation Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Integration
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Foxie Social Network
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Amigo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sober AI
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    SheGPT
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Get Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ai4u.space
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI 4U. All rights reserved. • Naples, Florida</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
