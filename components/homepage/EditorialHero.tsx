"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface EditorialHeroProps {
  onGetStarted: () => void
}

export function EditorialHero({ onGetStarted }: EditorialHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/30 to-white pointer-events-none" />

      {/* Issue number / metadata */}
      <motion.div
        style={{ opacity }}
        className="absolute top-32 left-0 right-0 z-10"
      >
        <div className="max-w-[1600px] mx-auto px-12">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400 font-light">
            <span>AI 4U Labs</span>
            <span>Building since 2023</span>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-[1600px] mx-auto px-12 py-32 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left: Typography */}
            <motion.div
              style={{ y: y2, opacity }}
              className="lg:col-span-7"
            >
              {/* Overline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className="h-px w-16 bg-black mb-6" />
                <p className="text-sm uppercase tracking-[0.3em] text-gray-600 font-light">
                  AI Development Studio
                </p>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-10"
              >
                <span className="block text-[15vw] lg:text-[8vw] leading-[0.85] font-light tracking-tight text-black mb-4">
                  We Build
                </span>
                <span className="block text-[15vw] lg:text-[8vw] leading-[0.85] font-light tracking-tight text-black mb-4">
                  <span className="italic font-serif">Anything</span>
                </span>
                <span className="block text-[15vw] lg:text-[8vw] leading-[0.85] font-light tracking-tight text-black relative">
                  with AI
                </span>
              </motion.h1>

              {/* Deck / intro paragraph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-12 max-w-xl"
              >
                <p className="text-xl leading-relaxed text-gray-700 font-light mb-8">
                  From mobile apps to payment systems to customer support—we ship AI products fast.
                  For startups, Fortune 500s, and everyone in between. If you can imagine it, we can build it in weeks, not months.
                </p>
                <div className="flex items-center gap-8 text-sm text-gray-500">
                  <div>
                    <div className="text-2xl font-light text-black mb-1">1M+</div>
                    <div className="uppercase tracking-wider text-xs">Users</div>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div>
                    <div className="text-2xl font-light text-black mb-1">20+</div>
                    <div className="uppercase tracking-wider text-xs">Since 2023</div>
                  </div>
                  <div className="h-12 w-px bg-gray-200" />
                  <div>
                    <div className="text-2xl font-light text-black mb-1">6 Days</div>
                    <div className="uppercase tracking-wider text-xs">Record</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center gap-6"
              >
                <Button
                  onClick={onGetStarted}
                  className="group bg-black hover:bg-gray-900 text-white px-8 py-6 text-base font-light tracking-wide"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link href="/work">
                  <button className="text-base font-light text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1">
                    View Our Work
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Large feature image with flip */}
            <motion.div
              style={{ y: y1, opacity }}
              className="lg:col-span-5 relative perspective-1000"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.div
                className="relative aspect-[3/4] transition-transform duration-700 preserve-3d cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                  {/* Placeholder for hero image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-12">
                      <div className="text-9xl font-light text-gray-300 mb-4">AI</div>
                      <div className="text-sm uppercase tracking-[0.3em] text-gray-400">
                        In Production
                      </div>
                    </div>
                  </div>

                  {/* Image caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white text-sm font-light">
                      SheGPT — Shipped to App Store in 6 days
                    </p>
                  </div>

                  {/* Click to flip hint */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 flex items-center gap-1">
                      <span>Click to flip</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 backface-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative h-full flex flex-col items-center justify-center p-12 text-white text-center">
                    <div className="mb-8">
                      <div className="text-6xl font-light mb-4">20+</div>
                      <div className="text-sm uppercase tracking-[0.3em] mb-2">Apps Shipped</div>
                      <div className="text-xs text-white/80 font-light">Since 2023</div>
                    </div>

                    <div className="h-px w-16 bg-white/30 mb-8" />

                    <div className="space-y-4 mb-8">
                      <div>
                        <div className="text-3xl font-light mb-1">1M+</div>
                        <div className="text-xs uppercase tracking-wider text-white/80">Total Users</div>
                      </div>
                      <div>
                        <div className="text-3xl font-light mb-1">6 Days</div>
                        <div className="text-xs uppercase tracking-wider text-white/80">Fastest MVP</div>
                      </div>
                      <div>
                        <div className="text-3xl font-light mb-1">$500K+</div>
                        <div className="text-xs uppercase tracking-wider text-white/80">Annual Savings</div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link href="/work">
                        <button className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg flex items-center gap-2">
                          <span>View All Projects</span>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>

                    {/* Click to flip back hint */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-180" />
                        <span>Click to flip back</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating stat card - only show when not flipped */}
              {!isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -bottom-8 -left-8 bg-white p-8 shadow-2xl"
                >
                  <div className="text-5xl font-light text-black mb-2">2-4</div>
                  <div className="text-sm uppercase tracking-wider text-gray-500">
                    Weeks to MVP
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-12"
      >
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-gray-400">
          <div className="w-12 h-px bg-gray-300" />
          <span>Scroll</span>
        </div>
      </motion.div>
    </section>
  )
}
