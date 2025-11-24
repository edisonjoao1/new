"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ModernNavProps {
  onGetStarted: () => void
}

export function ModernNav({ onGetStarted }: ModernNavProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - Animated */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Animated 4-square grid */}
          <div className="grid grid-cols-2 gap-0.5 relative transform group-hover:scale-110 transition-all duration-300">
            <div className="w-2 h-2 bg-gray-900 rounded-sm group-hover:bg-gradient-to-br from-blue-500 to-purple-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125" />
            <div className="w-2 h-2 bg-gray-700 rounded-sm group-hover:bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-300 delay-75 group-hover:-rotate-12 group-hover:scale-125" />
            <div className="w-2 h-2 bg-gray-500 rounded-sm group-hover:bg-gradient-to-br from-pink-500 to-orange-500 transition-all duration-300 delay-150 group-hover:rotate-6 group-hover:scale-125" />
            <div className="w-2 h-2 bg-gray-300 rounded-sm group-hover:bg-gradient-to-br from-orange-500 to-yellow-500 transition-all duration-300 delay-200 group-hover:-rotate-6 group-hover:scale-125" />
          </div>

          {/* Text */}
          <span className="text-xl font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300">
            AI 4U
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/work" className="text-sm text-gray-400 hover:text-white transition-colors">
            Work
          </Link>
          <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        {/* CTA */}
        <Button
          onClick={onGetStarted}
          size="sm"
          className="bg-white text-black hover:bg-gray-200 rounded-full"
        >
          Get Started
        </Button>
      </div>
    </motion.nav>
  )
}
