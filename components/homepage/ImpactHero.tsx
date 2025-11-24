"use client"

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface ImpactHeroProps {
  onGetStarted: () => void
}

export function ImpactHero({ onGetStarted }: ImpactHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = (e.clientX - centerX) / rect.width
        const deltaY = (e.clientY - centerY) / rect.height

        mouseX.set(deltaX * 50)
        mouseY.set(deltaY * 50)

        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Dynamic gradient that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.3) 25%, rgba(59, 130, 246, 0.2) 50%, transparent 80%)`,
        }}
      />

      {/* Animated grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(99,102,241,0.03)_2px,transparent_2px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_40%,transparent)]" />
      </div>

      {/* Floating shapes that respond to mouse */}
      <motion.div
        style={{ x, y }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-[120px]"
      />
      <motion.div
        style={{
          x: useTransform(x, v => -v * 0.5),
          y: useTransform(y, v => -v * 0.5)
        }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-[120px]"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge with animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full relative overflow-hidden group cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-base font-semibold text-white relative z-10">
              10+ products shipped • 1M+ users • 6 days record
            </span>
          </motion.div>
        </motion.div>

        {/* Main headline - HUGE and bold */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[8vw] md:text-[7vw] lg:text-[6.5vw] font-black mb-8 leading-[0.85] tracking-tighter">
            <motion.span
              className="block text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We don't
            </motion.span>
            <motion.span
              className="block text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              just build AI
            </motion.span>
            <motion.span
              className="block relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 blur-3xl opacity-50" />
                <span className="relative bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  We ship it
                </span>
              </span>
              <motion.span
                className="inline-block ml-4 text-green-400"
                animate={{
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1]
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.2,
                  ease: "easeInOut"
                }}
              >
                ✦
              </motion.span>
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline with typing effect feel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-400 font-light leading-relaxed max-w-5xl mx-auto">
            <span className="text-white font-medium">SheGPT in 6 days.</span> Conversational payments in 3 weeks.
            <br />
            <span className="text-gray-500">We build AI products that actually work. Fast.</span>
          </p>
        </motion.div>

        {/* CTAs with magnetic effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="group relative bg-white hover:bg-gray-100 text-black text-xl px-12 py-8 rounded-2xl font-bold shadow-2xl shadow-white/20 overflow-hidden"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100"
                initial={false}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                Let's build something
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          <Link href="/work">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 rounded-2xl border-2 border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white font-semibold"
              >
                See what we've shipped
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Animated stats ticker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-x-16 gap-y-8"
        >
          {[
            { value: "6 days", label: "Fastest ship", icon: "🚀" },
            { value: "1M+", label: "Users", icon: "👥" },
            { value: "3 weeks", label: "Avg MVP", icon: "⚡" },
            { value: "10+", label: "Apps in 2024", icon: "✨" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex flex-col items-center group cursor-default"
            >
              <motion.div
                className="text-4xl mb-2"
                animate={{
                  rotate: [0, 10, -10, 10, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 2 + i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-4xl md:text-5xl font-black mb-1 bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-500">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll hint with bouncing animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-gray-500 cursor-pointer hover:text-white transition-colors"
          >
            <span className="text-sm font-medium uppercase tracking-widest">Scroll</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
