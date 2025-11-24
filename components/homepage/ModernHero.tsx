"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface ModernHeroProps {
  onGetStarted: () => void
}

export function ModernHero({ onGetStarted }: ModernHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-black mb-8 tracking-tight">
            Simple AI for your business.
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-gray-600 font-light mb-12 leading-relaxed">
            Clear steps. Real results.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-16 text-lg text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="font-medium text-black">50+ apps live</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="font-medium text-black">500K+ users</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="font-medium text-black">$25M saved</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-6 rounded-full transition-all duration-300 hover:scale-105"
            >
              Get Your AI Plan
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Thin accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
      />
    </section>
  )
}
