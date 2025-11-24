"use client"

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const aiLabs = [
  {
    name: 'OpenAI',
    color: 'from-emerald-500 to-teal-500',
    description: 'GPT-4o, o1, Realtime API',
    details: 'Built SheGPT with Realtime API in 6 days. Production apps using GPT-4o, o1-preview, and DALL-E 3.'
  },
  {
    name: 'Anthropic',
    color: 'from-orange-500 to-amber-500',
    description: 'Claude 3.5 Sonnet, MCP',
    details: 'Pioneered MCP servers for conversational payments. Daily production use across multiple apps.'
  },
  {
    name: 'Google',
    color: 'from-blue-500 to-cyan-500',
    description: 'Gemini 2.5 Pro & Flash',
    details: 'Multimodal apps with vision and reasoning. High-performance production deployments with Gemini.'
  },
  {
    name: 'Meta',
    color: 'from-blue-600 to-indigo-600',
    description: 'Llama 3.2, On-device AI',
    details: 'Self-hosted solutions for privacy-first clients. On-device inference for mobile apps.'
  },
  {
    name: 'Perplexity',
    color: 'from-sky-500 to-blue-500',
    description: 'Real-time Search',
    details: 'Integrated real-time web search into conversational agents for up-to-date information.'
  },
  {
    name: 'Mistral',
    color: 'from-violet-500 to-purple-500',
    description: 'Large, EU Compliance',
    details: 'GDPR-compliant AI solutions for European clients. High-quality multilingual support.'
  },
  {
    name: 'Cohere',
    color: 'from-purple-500 to-fuchsia-500',
    description: 'Command-R+, Embeddings',
    details: 'Semantic search and RAG systems. Production embedding pipelines for knowledge bases.'
  },
  {
    name: 'Qwen',
    color: 'from-red-500 to-orange-500',
    description: 'Qwen2.5, Multilingual',
    details: 'Spanish and multilingual app support. Cost-effective alternative for LATAM markets.'
  },
  {
    name: 'DeepSeek',
    color: 'from-slate-600 to-gray-600',
    description: 'V3, Cost-effective',
    details: 'Budget-friendly production deployments without sacrificing quality. Efficient inference.'
  },
  {
    name: 'xAI',
    color: 'from-gray-700 to-slate-700',
    description: 'Grok, Real-time Data',
    details: 'Exploring Grok for real-time information access and conversational applications.'
  },
]

export function AILabsShowcase() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null)

  return (
    <section className="relative bg-white py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />

      <div className="relative max-w-[1600px] mx-auto px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="h-px w-16 bg-black mb-8" />
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                AI Partnerships
              </p>
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-black">
                Every major
                <br />
                AI lab
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-xl leading-relaxed text-gray-600 font-light">
                From OpenAI to xAI, we stay at the forefront of AI innovation since 2023.
                Building ChatGPT apps, MCP servers, voice AI, and integrating the latest models into production systems.
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Labs Grid with flip cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {aiLabs.map((lab, index) => (
            <motion.div
              key={lab.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="perspective-1000"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="relative h-[200px] transition-transform duration-700 preserve-3d cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCard === lab.name ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setFlippedCard(flippedCard === lab.name ? null : lab.name)}
              >
                {/* Front of card */}
                <div className="absolute inset-0 bg-white border border-gray-200 rounded-xl p-6 backface-hidden hover:border-gray-300 hover:shadow-sm transition-all" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="h-full flex flex-col">
                    <div className={`h-1 bg-gradient-to-r ${lab.color} rounded-full mb-4`} />

                    <h3 className="text-lg font-normal text-black mb-2 tracking-tight">
                      {lab.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-light mb-auto">
                      {lab.description}
                    </p>

                    <div className="pt-3 mt-auto">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${lab.color} rounded-xl p-6 backface-hidden`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="h-full flex flex-col text-white">
                    <h3 className="text-lg font-normal mb-3 tracking-tight">
                      {lab.name}
                    </h3>

                    <p className="text-xs leading-relaxed text-white/90 font-light flex-grow">
                      {lab.details}
                    </p>

                    <div className="pt-3 mt-auto border-t border-white/20">
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-180" />
                        <span>Back</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 pt-16 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-light text-black mb-2">10+</div>
            <div className="text-sm uppercase tracking-wider text-gray-500 font-light">AI Labs</div>
          </div>
          <div>
            <div className="text-4xl font-light text-black mb-2">25+</div>
            <div className="text-sm uppercase tracking-wider text-gray-500 font-light">Models</div>
          </div>
          <div>
            <div className="text-4xl font-light text-black mb-2">20+</div>
            <div className="text-sm uppercase tracking-wider text-gray-500 font-light">Apps Since 2023</div>
          </div>
          <div>
            <div className="text-4xl font-light text-black mb-2">1M+</div>
            <div className="text-sm uppercase tracking-wider text-gray-500 font-light">API Calls/Day</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
