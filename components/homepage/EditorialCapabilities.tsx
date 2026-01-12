"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Smartphone, DollarSign, Globe, Sparkles, ArrowRight } from 'lucide-react'

const capabilities = [
  {
    number: '01',
    title: 'Mobile AI',
    description: 'Native iOS and cross-platform apps. Integrated with GPT-5.1, Claude Opus 4.5, and Gemini 3.',
    icon: Smartphone,
    gradient: 'from-blue-500 to-cyan-500',
    details: 'SheGPT shipped in 1 day using OpenAI Realtime API. 100K+ users across health, fitness, and productivity apps.',
    examples: ['Voice AI', 'Image Recognition', 'Real-time Processing']
  },
  {
    number: '02',
    title: 'Fintech x AI',
    description: 'ChatGPT apps, MCP servers, Claude integrations, WhatsApp bots. Latest AI tech in production.',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500',
    details: 'Pioneered AP2-style conversational payments before Google announcement. $250K+ processed through natural language.',
    examples: ['Payment Agents', 'Expense Tracking', 'Financial Analysis']
  },
  {
    number: '03',
    title: 'Multilingual',
    description: 'Spanish-first AI products for Latin American markets. Cultural adaptation and localization.',
    icon: Globe,
    gradient: 'from-orange-500 to-yellow-500',
    details: 'Serving 100K+ users across 12 countries with culturally adapted AI experiences in Spanish and English.',
    examples: ['Spanish-First Apps', 'LATAM Markets', 'Cultural Adaptation']
  },
  {
    number: '04',
    title: 'Multimodal',
    description: 'Vision, voice, and text combined. Image analysis, speech recognition, and real-time AI interactions.',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    details: 'Built nutrition tracking from photos, voice AI assistants, and chat systems processing text, images, and audio simultaneously.',
    examples: ['Vision + Voice', 'Photo Analysis', 'Real-time Audio']
  },
]

export function EditorialCapabilities() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null)

  return (
    <section className="bg-gray-50 py-32">
      <div className="max-w-[1600px] mx-auto px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="h-px w-16 bg-black mb-8" />
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                What We Do
              </p>
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-black">
                Our Capabilities
              </h2>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-xl leading-relaxed text-gray-600 font-light mb-4">
                  We specialize in shipping AI products to production.
                  From strategy to deployment, we handle the full stack. AI coding agents power our speed.
                </p>
                <p className="text-base text-indigo-600 font-medium">
                  Don't believe our 1-day record? Test us—if we miss our timeline, it's free.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capabilities grid with flip cards */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="perspective-1000"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="relative w-full h-[350px] transition-transform duration-700 preserve-3d cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCard === capability.title ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setFlippedCard(flippedCard === capability.title ? null : capability.title)}
              >
                {/* Front of card */}
                <div className="absolute inset-0 bg-white rounded-xl p-8 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="h-full flex flex-col">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="text-lg font-light text-gray-300">{capability.number}</span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className={`w-12 h-12 bg-gradient-to-br ${capability.gradient} rounded-lg flex items-center justify-center mb-6`}>
                      <capability.icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-3xl font-light tracking-tight text-black mb-4">
                      {capability.title}
                    </h3>

                    <p className="text-base leading-relaxed text-gray-600 font-light flex-grow">
                      {capability.description}
                    </p>

                    {/* Click to flip hint */}
                    <div className="pt-4 mt-auto">
                      <span className="text-xs text-gray-400 flex items-center gap-2">
                        <span>Click for examples</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 bg-black rounded-xl p-8 backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="h-full flex flex-col text-white">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="text-lg font-light text-white/40">{capability.number}</span>
                      <div className="h-px flex-1 bg-white/20" />
                    </div>

                    <h3 className="text-2xl font-light tracking-tight mb-4">
                      {capability.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-300 font-light mb-6">
                      {capability.details}
                    </p>

                    <div className="mt-auto">
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">Examples</div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {capability.examples.map((example, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-light">
                            {example}
                          </span>
                        ))}
                      </div>

                      {/* Click to flip back hint */}
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-xs text-gray-400 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 rotate-180" />
                          <span>Click to flip back</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-16 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h3 className="text-4xl font-light tracking-tight text-black mb-4">
                Full service AI development
              </h3>
              <p className="text-lg text-gray-600 font-light">
                From initial strategy to production deployment and beyond.
              </p>
            </div>
            <Link href="/services">
              <button className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1 whitespace-nowrap">
                View All Services
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
