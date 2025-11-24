"use client"

import { motion } from 'framer-motion'
import { Zap, Globe, Code, Rocket } from 'lucide-react'

const reasons = [
  {
    icon: Zap,
    title: 'We actually ship',
    description: '10+ live apps with 1M+ users. Not slides.',
  },
  {
    icon: Rocket,
    title: '2-4 week MVPs',
    description: 'From idea to App Store. Fast execution.',
  },
  {
    icon: Globe,
    title: 'Multilingual AI',
    description: 'Spanish-first. We understand global markets.',
  },
  {
    icon: Code,
    title: 'Full-stack team',
    description: 'AI + mobile + payments. End-to-end.',
  },
]

export function WhyMeStrip() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-px bg-white animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-white animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Why founders choose us
          </h2>
          <p className="text-blue-100">
            We remove complexity and deliver real products. Quickly.
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <reason.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-blue-100">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
