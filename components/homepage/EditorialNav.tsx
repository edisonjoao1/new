"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EditorialNavProps {
  onGetStarted: () => void
}

export function EditorialNav({ onGetStarted }: EditorialNavProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-[1600px] mx-auto px-12 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Stacked bars logo - minimalist with magical glow */}
            <div className="relative flex flex-col gap-[3px] w-7">
              {/* Magical glow effect behind */}
              <motion.div
                className="absolute inset-0 blur-md opacity-40"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-0" />
                <div className="h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-[3px]" />
                <div className="h-[2px] bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mt-[3px]" />
                <div className="h-[2px] bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mt-[3px]" />
              </motion.div>

              {/* Main bars with shimmer */}
              <motion.div
                className="relative h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                animate={{
                  width: ['100%', '60%', '100%'],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 rounded-full"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                />
              </motion.div>

              <motion.div
                className="relative h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                animate={{
                  width: ['80%', '100%', '80%'],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 rounded-full"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                    delay: 0.3
                  }}
                />
              </motion.div>

              <motion.div
                className="relative h-[2px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                animate={{
                  width: ['70%', '90%', '70%'],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 rounded-full"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                    delay: 0.6
                  }}
                />
              </motion.div>

              <motion.div
                className="relative h-[2px] bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                animate={{
                  width: ['90%', '70%', '90%'],
                  opacity: [0.9, 0.7, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 rounded-full"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                    delay: 0.9
                  }}
                />
              </motion.div>
            </div>

            {/* Divider - gradient by default */}
            <div className="h-6 w-px bg-gradient-to-b from-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Text */}
            <span className="text-xl font-light tracking-tight text-black group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300">
              AI 4U
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-12">
          <Link
            href="/work"
            className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
          >
            Work
          </Link>
          <Link
            href="/playground"
            className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
          >
            Playground
          </Link>
          <Link
            href="/services"
            className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* CTA */}
        <Button
          onClick={onGetStarted}
          className="bg-black hover:bg-gray-900 text-white px-6 py-2 text-sm font-light tracking-wide"
        >
          Start a Project
        </Button>
      </div>
    </motion.nav>
  )
}
