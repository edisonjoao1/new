"use client"

import { motion } from 'framer-motion'
import { Play, ExternalLink, Smartphone, MessageSquare, DollarSign, Camera } from 'lucide-react'
import { useState } from 'react'

const demos = [
  {
    id: 'voice-ai',
    title: 'Voice AI Chat',
    description: 'Real-time voice conversation powered by OpenAI Realtime API',
    icon: MessageSquare,
    gradient: 'from-pink-500 to-purple-500',
    type: 'Live Demo',
    url: 'https://apps.apple.com/us/app/shegpt-ai-assistant-for-women/id6738421847',
    features: ['Natural Speech', 'Real-time Processing', 'Context Aware']
  },
  {
    id: 'expense-tracker',
    title: 'AI Expense Tracking',
    description: 'Snap receipts and get instant categorization with AI',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500',
    type: 'Try App',
    url: 'https://apps.apple.com/us/app/moneylyze-ai-expense-tracker/id6738390260',
    features: ['Smart Categories', 'Instant Analysis', 'Budget Insights']
  },
  {
    id: 'nutrition',
    title: 'Nutrition Scanner',
    description: 'Photo-to-nutrition analysis in real-time',
    icon: Camera,
    gradient: 'from-teal-500 to-cyan-500',
    type: 'Try App',
    url: 'https://apps.apple.com/us/app/nutrivision-ai-calorie-counter/id6738401913',
    features: ['Photo Analysis', 'Macro Breakdown', 'Meal Tracking']
  },
  {
    id: 'workout',
    title: 'AI Workout Planner',
    description: 'Personalized fitness plans that adapt to your progress',
    icon: Smartphone,
    gradient: 'from-red-500 to-orange-500',
    type: 'Try App',
    url: 'https://apps.apple.com/us/app/workout-planner-ai/id6738405073',
    features: ['Custom Plans', 'Progress Tracking', 'Adaptive AI']
  }
]

export function PlaygroundSection() {
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null)

  return (
    <section className="bg-white py-32">
      <div className="max-w-[1600px] mx-auto px-12">
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
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6 font-light">
                Try It Yourself
              </p>
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-black">
                Live Demos
                <br />
                & Playground
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-xl leading-relaxed text-gray-600 font-light">
                Experience our AI products firsthand. These are real production apps serving thousands of users daily.
                Click to try them out.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demos Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {demos.map((demo, index) => (
            <motion.a
              key={demo.id}
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredDemo(demo.id)}
              onMouseLeave={() => setHoveredDemo(null)}
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Gradient glow on hover */}
              <motion.div
                className={`absolute -inset-1 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl`}
              />

              <div className="relative">
                {/* Icon and Type Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${demo.gradient} rounded-2xl flex items-center justify-center`}>
                    <demo.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <Play className="w-3 h-3 text-gray-600" />
                    <span className="text-xs uppercase tracking-wider text-gray-600 font-light">
                      {demo.type}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-light tracking-tight text-black mb-3 group-hover:text-gray-700 transition-colors">
                  {demo.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-600 font-light leading-relaxed mb-6">
                  {demo.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {demo.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-50 text-xs text-gray-600 rounded-full font-light"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-light">
                  <span className={`bg-gradient-to-r ${demo.gradient} bg-clip-text text-transparent font-normal`}>
                    Try it now
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                className={`absolute inset-0 rounded-3xl`}
                style={{
                  background: hoveredDemo === demo.id
                    ? `linear-gradient(90deg, transparent, ${demo.gradient.split(' ').slice(-1)[0]}, transparent)`
                    : 'transparent',
                  opacity: hoveredDemo === demo.id ? 0.5 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 pt-16 border-t border-gray-200 text-center"
        >
          <p className="text-lg text-gray-600 font-light mb-4">
            Want a custom demo for your use case?
          </p>
          <p className="text-sm text-gray-500 font-light">
            We can build a prototype in <span className="text-black font-normal">1-2 weeks</span> to showcase what's possible
          </p>
        </motion.div>
      </div>
    </section>
  )
}
