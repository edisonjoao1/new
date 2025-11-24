"use client"

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Calendar, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

const ships = [
  {
    name: 'SheGPT',
    tagline: 'Idea to App Store in 6 days',
    description: 'AI assistant for women. Voice conversations with OpenAI Realtime API. Proved we can ship lightning-fast.',
    timeline: '6 days',
    users: '50K+',
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    icon: '👩‍💻',
    stat: { value: '6 days', label: 'Record MVP' },
    year: '2024'
  },
  {
    name: 'Conversational Payments',
    tagline: 'Money transfer via chat',
    description: 'Cross-platform payment agent working in ChatGPT, Claude, and WhatsApp. Real fintech AI.',
    timeline: '3 weeks',
    users: '$250K+ processed',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    icon: '💸',
    stat: { value: '$250K+', label: 'Transactions' },
    year: '2024'
  },
  {
    name: 'Inteligencia Artificial Gratis',
    tagline: 'Spanish-first AI for LATAM',
    description: 'Multilingual AI app designed for Latin American markets. Now serving 100K+ users across 12 countries.',
    timeline: '2 weeks',
    users: '100K+ users',
    gradient: 'from-orange-500 via-yellow-500 to-amber-500',
    icon: '🌎',
    stat: { value: '12', label: 'Countries' },
    year: '2024'
  }
]

export function ShippedShowcase() {
  return (
    <section className="relative bg-gradient-to-b from-black via-slate-950 to-black py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(99,102,241,0.03)_2px,transparent_2px)] bg-[size:80px_80px] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(34, 197, 94, 0.2)',
                '0 0 40px rgba(34, 197, 94, 0.3)',
                '0 0 20px rgba(34, 197, 94, 0.2)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-bold text-green-300 uppercase tracking-wider">
              Recently Shipped
            </span>
          </motion.div>

          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-white mb-2">Real products.</span>
            <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Real fast.
            </span>
          </h2>

          <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light">
            We shipped these in 2024. From zero to production. No prototypes.
          </p>
        </motion.div>

        {/* Ships Grid - Big Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {ships.map((ship, index) => (
            <ShipCard key={ship.name} ship={ship} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <Link href="/work">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 rounded-2xl text-white font-semibold text-lg transition-all"
            >
              <span>View all 10+ projects</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ShipCard({ ship, index }: { ship: typeof ships[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      className="group relative"
    >
      {/* Card */}
      <div className="relative h-full bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/30 transition-all duration-500">
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${ship.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          style={{ transform: 'translateZ(-10px)' }}
        />

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {/* Icon */}
          <motion.div
            className="text-7xl mb-6"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {ship.icon}
          </motion.div>

          {/* Year badge */}
          <div className="inline-block px-3 py-1 mb-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-bold text-gray-300 uppercase tracking-wider">
            {ship.year}
          </div>

          {/* Title */}
          <h3 className="text-3xl font-black mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
            {ship.name}
          </h3>

          {/* Tagline */}
          <p className={`text-xl font-bold mb-4 bg-gradient-to-r ${ship.gradient} bg-clip-text text-transparent`}>
            {ship.tagline}
          </p>

          {/* Description */}
          <p className="text-base text-gray-400 leading-relaxed mb-6">
            {ship.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-white mb-1">
                {ship.stat.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                {ship.stat.label}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{ship.timeline}</span>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${ship.gradient} opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity duration-500`} />
      </div>
    </motion.div>
  )
}
