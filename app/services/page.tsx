"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const services = [
  {
    number: '01',
    title: 'Rapid MVPs',
    tagline: '2-4 weeks, idea to production',
    description: 'What takes other teams months, we ship in weeks. Production-ready from day one—the same velocity that built Xoom-level apps in 4 weeks.',
    features: [
      'Full-stack development',
      'Production deployment',
      'User testing & feedback',
      'Analytics setup',
      'Scale-ready architecture'
    ],
    pricing: 'Fixed: $15-25K',
    highlight: false
  },
  {
    number: '02',
    title: 'Mobile AI Apps',
    tagline: 'Native iOS & cross-platform',
    description: 'Beautiful apps with AI at the core. Integrated with GPT-5.2, Claude Opus 4.5, Gemini 3.0, and custom models. App Store ready.',
    features: [
      'Native iOS (Swift/SwiftUI)',
      'React Native cross-platform',
      'Multi-model AI integration',
      'Backend & API development',
      'App Store optimization'
    ],
    pricing: 'From $20K',
    highlight: false
  },
  {
    number: '03',
    title: 'Video & Image AI',
    tagline: 'Gemini 3.0 + Vision AI',
    description: 'Real-time video analysis like Pet Health Scan—gait detection, visual diagnostics, image generation. Capabilities that took Google years, deployed in weeks.',
    features: [
      'Real-time video analysis',
      'Image generation (Veo)',
      'Visual diagnostics',
      'Object detection & tracking',
      'Multi-modal AI pipelines'
    ],
    pricing: 'From $25K',
    highlight: true
  },
  {
    number: '04',
    title: 'MCP Server Development',
    tagline: 'Model Context Protocol experts',
    description: '15+ MCP servers built. Extend any AI with custom tools—databases, APIs, business logic. The infrastructure layer most teams don\'t know exists.',
    features: [
      'Custom MCP server architecture',
      'Tool & resource definitions',
      'Multi-server orchestration',
      'Claude Desktop integration',
      'Production deployment'
    ],
    pricing: 'From $10K',
    highlight: true
  },
  {
    number: '05',
    title: 'Analytics & BI Dashboards',
    tagline: 'AI-powered insights',
    description: 'Built a 24-property analytics dashboard with predictive AI in one day. Real-time metrics, trend forecasting, auto-discovery—what BI teams build in quarters.',
    features: [
      'GA4 & multi-source integration',
      'AI-powered predictions',
      'Real-time dashboards',
      'Custom visualizations',
      'Automated reporting'
    ],
    pricing: 'From $12K',
    highlight: true
  },
  {
    number: '06',
    title: 'Conversational Agents',
    tagline: 'OpenAI Conversations API',
    description: 'Production AI agents that work across platforms. The same architecture powering apps with 100K+ users across 12 countries.',
    features: [
      'Multi-platform deployment',
      'Payment integration',
      'Persistent conversations',
      'Function calling & tools',
      'Analytics & monitoring'
    ],
    pricing: 'From $15K',
    highlight: false
  },
  {
    number: '07',
    title: 'Voice AI & TTS',
    tagline: 'OpenAI TTS + Whisper',
    description: 'Voice assistants and audio apps like Tourist—real-time AI narration with sub-200ms latency. What audio tour companies take years to build.',
    features: [
      'Text-to-speech integration',
      'Speech recognition (Whisper)',
      'Real-time voice processing',
      'Multi-language support',
      'Voice cloning & synthesis'
    ],
    pricing: 'From $18K',
    highlight: true
  },
  {
    number: '08',
    title: 'RAG & Knowledge Systems',
    tagline: 'Vector databases & embeddings',
    description: 'Turn your documents into intelligent search. RAG systems that actually work—retrieval, reranking, and generation in one pipeline.',
    features: [
      'Vector database setup',
      'Document processing',
      'Semantic search',
      'Hybrid retrieval',
      'Context-aware generation'
    ],
    pricing: 'From $15K',
    highlight: false
  },
  {
    number: '09',
    title: 'AI Agent Development',
    tagline: 'Multi-model orchestration',
    description: 'Like Pulse Wire\'s 5-agent newsroom—multiple AI models working together. GPT-5.2 for analysis, Gemini for vision, Claude for reasoning.',
    features: [
      'Multi-agent architecture',
      'Model routing & selection',
      'Tool use & function calling',
      'Memory & context management',
      'Autonomous workflows'
    ],
    pricing: 'From $20K',
    highlight: true
  },
  {
    number: '10',
    title: 'Multilingual AI',
    tagline: 'Spanish-first for LATAM',
    description: 'Native Spanish AI experiences reaching 100K+ users across 12 countries. Cultural adaptation that actually resonates.',
    features: [
      'Spanish language fine-tuning',
      'Cultural adaptation',
      'LATAM payment integration',
      'Regional content moderation',
      'Market research'
    ],
    pricing: 'From $12K',
    highlight: false
  },
  {
    number: '11',
    title: 'API Integration',
    tagline: 'Connect AI to your systems',
    description: 'Seamless integration of GPT-5.2, Claude Opus 4.5, Gemini 3.0 into your workflows. Multi-model routing and cost optimization.',
    features: [
      'OpenAI, Anthropic, Google',
      'Custom API development',
      'Multi-model routing',
      'Cost optimization',
      'Rate limiting & caching'
    ],
    pricing: 'From $8K',
    highlight: false
  },
  {
    number: '12',
    title: 'Enterprise AI Consulting',
    tagline: 'Strategy to execution',
    description: 'Not slides—real implementation. We identify high-impact opportunities and build them. 30+ apps shipped proves we deliver.',
    features: [
      'AI opportunity assessment',
      'Technical architecture',
      'Model selection & benchmarking',
      'Cost & ROI analysis',
      'Implementation roadmap'
    ],
    pricing: 'From $5K',
    highlight: false
  },
  {
    number: '13',
    title: 'Media & Transparency AI',
    tagline: 'Bias detection & analysis',
    description: 'Like Pulse Wire—ownership tracking, hypocrisy detection, propaganda scoring. The investigative tools newsrooms dream of.',
    features: [
      'Sentiment analysis',
      'Bias detection',
      'Ownership tracking',
      'Trend analysis',
      'Real-time monitoring'
    ],
    pricing: 'From $25K',
    highlight: true
  }
]

export default function ServicesPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

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
                  Services
                </p>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight text-black mb-6">
                  90% Less People.
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    10x Faster.
                  </span>
                </h1>
              </div>
              <div className="flex items-end">
                <p className="text-xl leading-relaxed text-gray-600 font-light">
                  Building million-dollar apps with lean teams. What used to take 100 engineers and years,
                  we ship in weeks. No consulting theater—just real products with real users.
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-12 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-light text-black mb-1">1 day</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">Fastest MVP</div>
              </div>
              <div>
                <div className="text-3xl font-light text-black mb-1">35+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">Apps shipped</div>
              </div>
              <div>
                <div className="text-3xl font-light text-black mb-1">1M+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">Users reached</div>
              </div>
              <div>
                <div className="text-3xl font-light text-black mb-1">15+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">MCP servers built</div>
              </div>
            </div>

            {/* The Guarantee */}
            <div className="mt-12 p-8 bg-black rounded-2xl text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-light mb-2">Don't believe us? Test us.</h3>
                  <p className="text-gray-300 font-light">
                    If we don't meet our committed timeline, <span className="text-white font-medium">we build your app for free</span>.
                    Not a discount. Not a credit. Free. Prototypes? Even faster—hours, not days.
                  </p>
                </div>
                <Link href="/contact">
                  <Button className="bg-white text-black hover:bg-gray-100 whitespace-nowrap px-8">
                    Challenge Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            {/* New Capabilities Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full">
                  NEW IN 2026
                </span>
                <span className="text-sm text-gray-600">Expanded capabilities</span>
              </div>
              <p className="text-lg text-gray-700 font-light">
                Video AI, MCP servers, predictive analytics, voice AI—the tools we've built for ourselves, now available for your projects.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.article
                  key={service.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`group relative bg-white rounded-xl p-6 border transition-all duration-300 ${
                    service.highlight
                      ? 'border-transparent ring-2 ring-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={service.highlight ? {
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
                    border: '2px solid transparent'
                  } : undefined}
                >
                  {/* Highlight badge */}
                  {service.highlight && (
                    <div className="absolute -top-3 left-6">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-medium rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xl font-light ${service.highlight ? 'text-blue-500' : 'text-gray-300'}`}>
                      {service.number}
                    </span>
                    <div className={`h-px flex-1 ${service.highlight ? 'bg-gradient-to-r from-blue-200 to-purple-200' : 'bg-gray-200'}`} />
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-light tracking-tight text-black mb-1 group-hover:text-gray-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className={`text-xs uppercase tracking-wider mb-3 ${service.highlight ? 'text-blue-600' : 'text-gray-500'}`}>
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-gray-600 font-light mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${service.highlight ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-600 font-light">{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 4 && (
                      <li className="text-xs text-gray-400 pl-6">+{service.features.length - 4} more</li>
                    )}
                  </ul>

                  {/* Pricing */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-lg font-light text-black">{service.pricing}</span>
                    <button
                      onClick={() => setIsPlanOpen(true)}
                      className={`text-xs uppercase tracking-wider transition-colors group/btn flex items-center gap-1 ${
                        service.highlight ? 'text-blue-600 hover:text-blue-800' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-white py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <div className="h-px w-16 bg-black mb-8" />
              <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-4">
                How We Work
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl">
                Transparent, fast, and collaborative.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-12">
              {[
                {
                  step: '01',
                  title: 'Discovery',
                  description: 'We dig deep into your problem, goals, and constraints. 1-hour call to align on vision.',
                  duration: '1 day'
                },
                {
                  step: '02',
                  title: 'Proposal',
                  description: 'Detailed scope, timeline, and pricing. Clear expectations on deliverables.',
                  duration: '2-3 days'
                },
                {
                  step: '03',
                  title: 'Build',
                  description: 'Weekly sprints with demos. You see progress every week and provide feedback.',
                  duration: '2-4 weeks'
                },
                {
                  step: '04',
                  title: 'Launch',
                  description: 'Production deployment, monitoring setup, and post-launch support.',
                  duration: '1 week'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-6xl font-light text-gray-200 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-light tracking-tight text-black mb-3">{item.title}</h3>
                  <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="text-sm uppercase tracking-wider text-gray-500">{item.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-6">
                Let's Build Your
                <br />
                AI Product
              </h2>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
                Book a free consultation. We'll discuss your idea and provide a clear path forward.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => setIsPlanOpen(true)}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-6 text-base font-light tracking-wide"
                >
                  Start a Project
                </Button>
                <Link href="/work">
                  <button className="text-base font-light text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1">
                    View Our Work
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
