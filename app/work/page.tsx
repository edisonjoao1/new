"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ExternalLink, Calendar, Zap } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const projects = [
  {
    slug: 'conversational-payments-ap2',
    title: 'Pioneering AP2 Protocol Implementation',
    category: 'AI + Fintech Pioneer',
    year: '2023-2024',
    timeline: 'First-of-its-kind',
    description: 'Built conversational payments system BEFORE Google announced AP2 protocol - pioneering agent-to-payments technology',
    longDescription: 'Pioneered natural language payments across Claude, ChatGPT, and WhatsApp—implementing what would become the AP2 (Agent to Payments) protocol concept BEFORE Google formal announcement in Sept 2025. Built MCP servers, solved OpenAI moderation challenges, and enabled real Wise API international transfers through conversation. First-of-its-kind system proving the viability of agent-initiated payments.',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    tech: ['MCP', 'Claude MCP', 'ChatGPT Actions', 'Wise API', 'AP2 Concepts', 'WhatsApp'],
    stats: [
      { label: 'Timeline', value: 'Pre-AP2' },
      { label: 'Countries', value: '50+' },
      { label: 'Pioneer Status', value: 'First' }
    ],
    impact: 'Built production conversational payment system before billion-dollar companies, proving agent-to-payments viability months before industry standard emerged',
    featured: true
  },
  {
    slug: 'shegpt',
    title: 'SheGPT',
    category: 'Mobile AI',
    year: '2024',
    timeline: '6 days',
    description: 'AI assistant for women - shipped from idea to App Store in just 6 days',
    longDescription: 'Rapid MVP development showcasing our ability to ship production apps at speed. Built with SwiftUI, integrated OpenAI Realtime API for voice conversations, and designed a beautiful, intuitive interface.',
    gradient: 'from-pink-600 to-purple-600',
    tech: ['GPT-4o', 'iOS/Swift', 'OpenAI Realtime', 'SwiftUI'],
    stats: [
      { label: 'Launch Time', value: '6 days' },
      { label: 'App Store Rating', value: '4.8★' },
      { label: 'Downloads', value: '50K+' }
    ],
    impact: 'Demonstrated our rapid MVP capability - from zero to App Store in under a week',
    featured: true
  },
  {
    slug: 'inteligencia-artificial',
    title: 'Inteligencia Artificial Gratis',
    category: 'Multilingual AI',
    year: '2024',
    timeline: '2 weeks',
    description: 'Spanish-first AI app designed specifically for Latin American markets',
    longDescription: 'Localized AI experience for Spanish speakers with cultural adaptation, regional payment methods, and content moderation tailored for LATAM audiences. Integrated multiple AI models (GPT-4o, Llama 3.1) for best results.',
    gradient: 'from-orange-600 to-yellow-600',
    tech: ['GPT-4o', 'Llama 3.1', 'iOS', 'React Native'],
    stats: [
      { label: 'Users', value: '100K+' },
      { label: 'Countries', value: '12' },
      { label: 'Daily Active', value: '25K+' }
    ],
    impact: 'Opened AI access to Spanish-speaking markets with localized experience',
    featured: true
  },
  {
    slug: 'moneylyze',
    title: 'Moneylyze',
    category: 'AI Fintech',
    year: '2024',
    timeline: '3 weeks',
    description: 'AI-powered expense tracking with intelligent categorization and insights',
    longDescription: 'Smart expense tracker that uses AI to automatically categorize transactions, predict spending patterns, and provide actionable financial insights. Built with React Native for cross-platform deployment.',
    gradient: 'from-green-600 to-emerald-600',
    tech: ['GPT-4o', 'React Native', 'Plaid', 'TensorFlow'],
    stats: [
      { label: 'Transactions Tracked', value: '500K+' },
      { label: 'Avg Savings', value: '$250/mo' },
      { label: 'Accuracy', value: '96%' }
    ],
    impact: 'Helped users save an average of $3,000 annually through AI-powered insights',
    featured: false
  },
  {
    slug: 'nutrivision',
    title: 'Nutrivision AI',
    category: 'Health Tech',
    year: '2024',
    timeline: '4 weeks',
    description: 'Snap photos of meals and get instant AI-powered nutrition analysis',
    longDescription: 'Computer vision app that analyzes food photos to provide detailed nutritional information. Uses custom-trained models for food recognition and GPT-4V for detailed analysis.',
    gradient: 'from-teal-600 to-cyan-600',
    tech: ['GPT-4V', 'iOS/Swift', 'CoreML', 'Vision API'],
    stats: [
      { label: 'Meals Analyzed', value: '1M+' },
      { label: 'Foods Recognized', value: '10K+' },
      { label: 'Accuracy', value: '94%' }
    ],
    impact: 'Made nutrition tracking effortless with 3-second photo analysis',
    featured: false
  },
  {
    slug: 'workout-planner',
    title: 'Workout Planner AI',
    category: 'Fitness Tech',
    year: '2024',
    timeline: '3 weeks',
    description: 'Personalized fitness plans generated by AI based on your goals and constraints',
    longDescription: 'AI fitness coach that creates custom workout plans adapting to user feedback, progress tracking, and goal adjustments. Includes exercise demonstrations and form checking.',
    gradient: 'from-red-600 to-orange-600',
    tech: ['GPT-4o', 'React Native', 'TensorFlow', 'Firebase'],
    stats: [
      { label: 'Active Users', value: '75K+' },
      { label: 'Workouts Generated', value: '500K+' },
      { label: 'Completion Rate', value: '78%' }
    ],
    impact: 'Increased workout adherence by 3x compared to generic fitness apps',
    featured: false
  },
  {
    slug: 'realtime-voice-agents',
    title: 'Realtime Voice AI Platform',
    category: 'Voice AI',
    year: '2024',
    timeline: '4 weeks',
    description: 'Voice-first conversational agents using OpenAI Realtime API with sub-200ms latency',
    longDescription: 'Built production voice AI system leveraging OpenAI Realtime API for natural, low-latency conversations. Integrated WebRTC, custom wake-word detection, and real-time emotion analysis for health coaching and customer support applications.',
    gradient: 'from-indigo-600 to-blue-600',
    tech: ['OpenAI Realtime', 'WebRTC', 'WebSockets', 'iOS/Swift', 'Node.js'],
    stats: [
      { label: 'Latency', value: '< 200ms' },
      { label: 'Voice Sessions', value: '100K+' },
      { label: 'Uptime', value: '99.9%' }
    ],
    impact: 'Enabled natural voice interactions with human-like response times',
    featured: true
  },
  {
    slug: 'mcp-servers',
    title: 'Model Context Protocol Servers',
    category: 'AI Infrastructure',
    year: '2024',
    timeline: '2 weeks',
    description: 'Custom MCP servers extending Claude and other AI models with external capabilities',
    longDescription: 'Built specialized Model Context Protocol servers enabling AI assistants to interact with external systems: database queries, API integrations, real-time data feeds, and enterprise tools. Deployed across multiple client environments.',
    gradient: 'from-purple-600 to-violet-600',
    tech: ['MCP', 'Claude 3.5', 'TypeScript', 'Docker', 'WebSockets'],
    stats: [
      { label: 'Servers Built', value: '15+' },
      { label: 'Daily Requests', value: '50K+' },
      { label: 'Integrations', value: '30+' }
    ],
    impact: 'Extended AI capabilities with secure, real-time access to enterprise systems',
    featured: true
  },
  {
    slug: 'multimodal-generation',
    title: 'AI Image & Video Generation Suite',
    category: 'Generative AI',
    year: '2024',
    timeline: '5 weeks',
    description: 'End-to-end multimodal content creation with DALL-E 3, Midjourney, and Runway Gen-3',
    longDescription: 'Complete creative platform combining image generation (DALL-E 3, Stable Diffusion, Midjourney), video synthesis (Runway, Pika), and AI editing tools. Includes style transfer, prompt optimization, and batch processing workflows.',
    gradient: 'from-fuchsia-600 to-pink-600',
    tech: ['DALL-E 3', 'Stable Diffusion', 'Runway Gen-3', 'ComfyUI', 'FFmpeg'],
    stats: [
      { label: 'Assets Generated', value: '500K+' },
      { label: 'Video Minutes', value: '10K+' },
      { label: 'Avg Gen Time', value: '8 sec' }
    ],
    impact: 'Reduced creative production time by 90% while maintaining quality',
    featured: true
  },
  {
    slug: 'multi-model-router',
    title: 'Universal AI Model Router',
    category: 'AI Infrastructure',
    year: '2024',
    timeline: '3 weeks',
    description: 'Intelligent routing across OpenAI, Anthropic, Google, Qwen, and DeepSeek models',
    longDescription: 'Smart routing layer that selects optimal AI models based on task type, cost, latency requirements, and quality needs. Supports GPT-4o, Claude 3.5 Sonnet, Gemini 2.5, Qwen2.5, DeepSeek V3, and 20+ other models with automatic fallbacks.',
    gradient: 'from-emerald-600 to-teal-600',
    tech: ['GPT-4o', 'Claude 3.5', 'Gemini 2.5', 'Qwen2.5', 'DeepSeek', 'LangChain'],
    stats: [
      { label: 'Models Supported', value: '25+' },
      { label: 'Cost Reduction', value: '40%' },
      { label: 'Daily Requests', value: '1M+' }
    ],
    impact: 'Optimized AI spending while improving response quality and reliability',
    featured: true
  },
  {
    slug: 'anthropic-claude-integrations',
    title: 'Claude Enterprise Deployments',
    category: 'Enterprise AI',
    year: '2024',
    timeline: '6 weeks',
    description: 'Production deployments of Claude 3.5 Sonnet for Fortune 500 companies',
    longDescription: 'Integrated Anthropic Claude into enterprise workflows for document analysis, code generation, and customer support. Built custom prompt libraries, safety guardrails, and monitoring dashboards. Handled sensitive data with context isolation.',
    gradient: 'from-amber-600 to-orange-600',
    tech: ['Claude 3.5 Sonnet', 'Anthropic API', 'AWS', 'TypeScript', 'Redis'],
    stats: [
      { label: 'Enterprises', value: '8' },
      { label: 'Documents Processed', value: '2M+' },
      { label: 'Error Rate', value: '< 0.1%' }
    ],
    impact: 'Automated 60% of document review workflows for legal and compliance teams',
    featured: false
  },
  {
    slug: 'gemini-multimodal',
    title: 'Google Gemini Multimodal Apps',
    category: 'Multimodal AI',
    year: '2024',
    timeline: '4 weeks',
    description: 'Vision and reasoning apps powered by Gemini 2.5 Pro and Flash',
    longDescription: 'Built production apps leveraging Gemini 2.5 for multimodal understanding: medical image analysis, receipt scanning, visual search, and AR shopping experiences. Utilized long context windows (1M tokens) for complex document analysis.',
    gradient: 'from-blue-600 to-cyan-600',
    tech: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Vision API', 'Flutter', 'Firebase'],
    stats: [
      { label: 'Images Analyzed', value: '3M+' },
      { label: 'Context Window', value: '1M tokens' },
      { label: 'Accuracy', value: '96%' }
    ],
    impact: 'Enabled visual understanding at scale with Google cutting-edge multimodal AI',
    featured: false
  },
  {
    slug: 'deepseek-qwen-oss',
    title: 'Open Source AI Integration',
    category: 'Open Source AI',
    year: '2024',
    timeline: '2 weeks',
    description: 'Cost-effective deployments with DeepSeek V3 and Qwen2.5 for high-volume workloads',
    longDescription: 'Self-hosted and API-based deployments of DeepSeek V3 and Qwen2.5 models for clients needing cost-effective AI at scale. Built inference optimization, model fine-tuning pipelines, and monitoring for open-source models.',
    gradient: 'from-slate-600 to-gray-600',
    tech: ['DeepSeek V3', 'Qwen2.5', 'vLLM', 'CUDA', 'Docker', 'Kubernetes'],
    stats: [
      { label: 'Cost Savings', value: '85%' },
      { label: 'Throughput', value: '10K req/sec' },
      { label: 'Models Deployed', value: '12' }
    ],
    impact: 'Delivered enterprise-grade AI performance at fraction of commercial API costs',
    featured: false
  },
  {
    slug: 'ai-agent-orchestration',
    title: 'Multi-Agent AI Systems',
    category: 'AI Agents',
    year: '2024',
    timeline: '5 weeks',
    description: 'Orchestrated AI agent teams working together on complex multi-step tasks',
    longDescription: 'Built autonomous agent systems where multiple specialized AI models collaborate: researcher, coder, reviewer, and deployer agents working together. Used LangGraph for orchestration and CrewAI patterns for coordination.',
    gradient: 'from-rose-600 to-red-600',
    tech: ['LangGraph', 'AutoGPT', 'CrewAI', 'GPT-4o', 'Claude 3.5', 'Redis'],
    stats: [
      { label: 'Agents Deployed', value: '50+' },
      { label: 'Tasks Automated', value: '200+' },
      { label: 'Time Saved', value: '1000+ hrs' }
    ],
    impact: 'Automated complex workflows requiring multiple specialized AI capabilities',
    featured: false
  },
  {
    slug: 'perplexity-search',
    title: 'Perplexity-Powered Research Platform',
    category: 'AI Search',
    year: '2024',
    timeline: '3 weeks',
    description: 'Real-time web search and research automation using Perplexity AI',
    longDescription: 'Integrated Perplexity AI for intelligent web search and research synthesis. Built automated research workflows that gather, analyze, and summarize information from across the web with source citations and fact-checking.',
    gradient: 'from-sky-600 to-blue-600',
    tech: ['Perplexity API', 'Next.js', 'Streaming', 'Citations', 'Vector DB'],
    stats: [
      { label: 'Searches/Day', value: '50K+' },
      { label: 'Avg Response', value: '2.5 sec' },
      { label: 'Citation Accuracy', value: '98%' }
    ],
    impact: 'Reduced research time by 85% with AI-powered web intelligence',
    featured: true
  },
  {
    slug: 'mistral-cohere-llms',
    title: 'European & Enterprise AI Integration',
    category: 'Enterprise AI',
    year: '2024',
    timeline: '4 weeks',
    description: 'Production deployments with Mistral AI and Cohere for EU compliance and embeddings',
    longDescription: 'Deployed Mistral Large and Cohere Command-R+ for clients requiring EU data residency and specialized embedding models. Built multilingual support, fine-tuning pipelines, and RAG systems optimized for European languages.',
    gradient: 'from-violet-600 to-purple-600',
    tech: ['Mistral Large', 'Cohere Command-R+', 'Embed v3', 'RAG', 'GDPR'],
    stats: [
      { label: 'EU Clients', value: '12' },
      { label: 'Languages', value: '15+' },
      { label: 'GDPR Compliant', value: '100%' }
    ],
    impact: 'Enabled AI adoption for EU enterprises with strict data sovereignty requirements',
    featured: false
  },
  {
    slug: 'meta-llama-edge',
    title: 'Llama 3 Edge Deployment',
    category: 'Edge AI',
    year: '2024',
    timeline: '3 weeks',
    description: 'On-device AI with Meta Llama 3 for privacy-first mobile applications',
    longDescription: 'Deployed Llama 3 models on mobile devices for offline AI capabilities. Optimized with quantization (4-bit/8-bit), built custom inference engines, and created privacy-preserving AI experiences that never send data to cloud.',
    gradient: 'from-blue-700 to-indigo-700',
    tech: ['Llama 3.2', 'GGUF', 'Metal', 'CoreML', 'Quantization', 'iOS/Android'],
    stats: [
      { label: 'Model Size', value: '2-8GB' },
      { label: 'Inference Speed', value: '20 tok/sec' },
      { label: 'Battery Impact', value: '< 5%' }
    ],
    impact: 'Brought powerful AI to edge devices with zero cloud dependency',
    featured: false
  },
  {
    slug: 'xai-grok-integration',
    title: 'xAI Grok Real-time Intelligence',
    category: 'Real-time AI',
    year: '2024',
    timeline: '2 weeks',
    description: 'Real-time AI responses with xAI Grok for current events and live data',
    longDescription: 'Integrated xAI Grok for applications requiring up-to-the-minute information and real-time analysis. Built systems leveraging Grok access to live X/Twitter data for trend analysis, sentiment tracking, and news monitoring.',
    gradient: 'from-gray-700 to-slate-700',
    tech: ['xAI Grok', 'X API', 'Real-time Streaming', 'Sentiment Analysis'],
    stats: [
      { label: 'Real-time Feeds', value: '100+' },
      { label: 'Data Latency', value: '< 1 min' },
      { label: 'Events Tracked', value: '1M+/day' }
    ],
    impact: 'Enabled real-time AI insights with access to live world events',
    featured: false
  },
  {
    slug: 'ai-customer-care',
    title: 'AI Customer Care System',
    category: 'Enterprise AI',
    year: '2024',
    timeline: '6 weeks',
    description: 'Autonomous customer support AI that saved company $500K annually by eliminating support team costs',
    longDescription: 'Built complete AI customer care system for company with zero customer support infrastructure. Implemented intelligent ticket routing, natural language understanding, automated responses, and escalation workflows. System handled 95% of inquiries autonomously, enabling company to operate without dedicated support team.',
    gradient: 'from-emerald-600 to-green-600',
    tech: ['GPT-4o', 'Claude 3.5', 'Ticket System', 'NLP', 'Automation'],
    stats: [
      { label: 'Annual Savings', value: '$500K+' },
      { label: 'Autonomous Rate', value: '95%' },
      { label: 'Response Time', value: '< 30 sec' }
    ],
    impact: 'Eliminated need for customer support team, saving half a million dollars yearly while improving response times',
    featured: true
  }
]

export default function WorkPage() {
  const [filter, setFilter] = useState<string>('all')
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  const filteredProjects = filter === 'all'
    ? projects
    : filter === 'featured'
    ? projects.filter(p => p.featured)
    : projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen pt-24">
        {/* Header */}
        <section className="max-w-[1600px] mx-auto px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-8" />

            <div className="grid lg:grid-cols-2 gap-16 mb-16">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Our Work
                </p>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight text-black">
                  Real products.
                  <br />
                  Real impact.
                </h1>
              </div>
              <div className="flex items-end">
                <p className="text-xl leading-relaxed text-gray-600 font-light">
                  We have shipped 20+ cutting-edge AI systems since 2023, reaching over 1M users.
                  From ChatGPT apps and MCP servers to voice AI and multimodal generation—we stay at the forefront,
                  working with <span className="relative inline-block">
                    <span className="relative z-10 font-normal text-black">every major AI lab</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-purple-200/40 to-pink-200/40 blur-sm -z-0"></span>
                  </span>: OpenAI, Anthropic, Google, Meta, Perplexity, Mistral, Cohere, Qwen, DeepSeek, xAI, and more.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 pt-8 border-t border-gray-200">
              {['all', 'featured', 'Voice AI', 'Infrastructure', 'Generative', 'Enterprise', 'Mobile', 'Fintech'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 text-sm uppercase tracking-wider ${
                    filter === f
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            <div className="space-y-24">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative group/card">
                    {/* Magical glow behind card */}
                    <motion.div
                      className={`absolute -inset-4 bg-gradient-to-br ${project.gradient} opacity-0 group-hover/card:opacity-20 blur-2xl transition-opacity duration-700 rounded-3xl`}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0, 0.1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <div className="relative grid md:grid-cols-2 gap-16 items-center bg-white rounded-3xl p-12 border border-gray-200 group-hover/card:border-gray-300 hover:shadow-2xl transition-all duration-500">
                      {/* Image placeholder with shimmer */}
                      <div className={`relative ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
                          {/* Animated gradient overlay */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-5`}
                            animate={{
                              opacity: [0.05, 0.15, 0.05]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />

                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/card:opacity-30"
                            animate={{
                              x: ['-100%', '200%']
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              repeatDelay: 1
                            }}
                          />

                          <div className={`relative text-8xl font-light bg-gradient-to-br ${project.gradient} bg-clip-text text-transparent opacity-20 group-hover/card:opacity-30 transition-opacity duration-500`}>
                            {project.title.charAt(0)}
                          </div>
                        </div>
                      </div>

                    {/* Content */}
                    <div className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
                      <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                        {project.category}
                      </div>

                      <h2 className="text-4xl font-light tracking-tight text-black mb-4 group-hover:text-gray-700 transition-colors">
                        {project.title}
                      </h2>

                      <p className="text-gray-600 text-base mb-6 leading-relaxed font-light">
                        {project.longDescription}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 font-light"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                        {project.stats.map((stat, i) => (
                          <div key={i}>
                            <div className="text-2xl font-light text-black mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Impact */}
                      <div className="flex items-start gap-3 mb-6">
                        <Zap className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 font-light">
                          <span className="font-normal text-black">Impact:</span> {project.impact}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {project.year}
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Shipped in {project.timeline}
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1600px] mx-auto px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-6">
              Ready to ship
              <br />
              your AI product?
            </h2>
            <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
              From idea to production in 2-4 weeks. Let's build something that matters.
            </p>
            <Button
              onClick={() => setIsPlanOpen(true)}
              className="bg-black hover:bg-gray-900 text-white px-8 py-6 text-base font-light tracking-wide"
            >
              Start a Project
            </Button>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
