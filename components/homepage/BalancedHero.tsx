"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Rocket } from 'lucide-react'

interface BalancedHeroProps {
  onGetStarted: () => void
}

export function BalancedHero({ onGetStarted }: BalancedHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Logo/Brand - Animated */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-4 group cursor-pointer">
            {/* Animated 4-square grid */}
            <div className="grid grid-cols-2 gap-1 relative transform group-hover:scale-110 transition-all duration-300">
              <div className="w-3 h-3 bg-gray-900 rounded-sm group-hover:bg-gradient-to-br from-blue-500 to-purple-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125" />
              <div className="w-3 h-3 bg-gray-700 rounded-sm group-hover:bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-300 delay-75 group-hover:-rotate-12 group-hover:scale-125" />
              <div className="w-3 h-3 bg-gray-500 rounded-sm group-hover:bg-gradient-to-br from-pink-500 to-orange-500 transition-all duration-300 delay-150 group-hover:rotate-6 group-hover:scale-125" />
              <div className="w-3 h-3 bg-gray-300 rounded-sm group-hover:bg-gradient-to-br from-orange-500 to-yellow-500 transition-all duration-300 delay-200 group-hover:-rotate-6 group-hover:scale-125" />
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300 group-hover:bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300" />

            {/* AI 4U Text */}
            <span className="text-3xl font-medium text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300">
              AI 4U
            </span>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300 group-hover:bg-gradient-to-b from-purple-500 to-pink-500 transition-all duration-300" />

            {/* Labs Text */}
            <span className="text-lg text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
              Labs
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Main headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            We build & ship
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              real AI products
            </span>
          </h1>

          {/* Sub-identity line */}
          <p className="text-xl md:text-2xl text-gray-600 font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
            AI agents. Mobile apps. Payment systems. Multilingual tools.
            <br />
            <span className="text-gray-500">End-to-end. Fast. 10+ apps shipped.</span>
          </p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-12 text-lg"
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">10+</span>
              <span className="text-gray-600">apps shipped this year</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900">1M+</span>
              <span className="text-gray-600">users</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50">
              <Rocket className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-900">6 days</span>
              <span className="text-gray-600">fastest ship</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Your AI Plan
            </Button>
            <Button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-50"
            >
              See Our Work
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
