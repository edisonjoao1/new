"use client"

import { motion } from 'framer-motion'
import { Zap, Rocket, DollarSign, Shield } from 'lucide-react'

const highlights = [
  {
    icon: Rocket,
    stat: '1 Day',
    label: 'Fastest MVP',
    description: 'From idea to App Store approved in 24 hours using OpenAI Realtime API',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    stat: 'Pre-AP2',
    label: 'Protocol Pioneer',
    description: 'Built conversational payment systems before Google announced the AP2 protocol',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: DollarSign,
    stat: '$500K+',
    label: 'Annual Savings',
    description: 'Customer care AI that eliminated the need for a dedicated support team',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    stat: '35+',
    label: 'Production Apps',
    description: 'MCP servers, ChatGPT apps, mobile AI, voice AI, wellness apps—all live since 2023',
    gradient: 'from-orange-500 to-amber-500'
  }
]

export function TechnicalHighlights() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-[1600px] mx-auto px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="h-px w-16 bg-black mb-8" />
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4 font-light">
            Technical Excellence
          </p>
          <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-black max-w-2xl">
            Pioneering AI before it was mainstream
          </h2>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${highlight.gradient} rounded-lg flex items-center justify-center mb-6`}>
                  <highlight.icon className="w-6 h-6 text-white" />
                </div>

                {/* Stat */}
                <div className="mb-2">
                  <div className="text-3xl font-light text-black mb-1">{highlight.stat}</div>
                  <div className="text-sm uppercase tracking-wider text-gray-500 font-light">
                    {highlight.label}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600 font-light mt-auto">
                  {highlight.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
