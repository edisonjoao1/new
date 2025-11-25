"use client"

import { motion } from 'framer-motion'
import { Rocket, Calendar, ExternalLink } from 'lucide-react'

const recentShips = [
  {
    name: 'Conversational Payments Agent',
    description: 'Cross-platform money transfer system across ChatGPT, Claude, and WhatsApp',
    timeline: '3 weeks',
    tech: ['GPT-5.1', 'Claude Opus 4.5', 'WhatsApp API'],
    badge: 'AI + Fintech',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'SheGPT',
    description: 'AI assistant for women - idea to App Store in 6 days',
    timeline: '6 days',
    tech: ['GPT-5.1', 'iOS/Swift', 'OpenAI Realtime'],
    badge: 'Mobile AI',
    color: 'from-pink-500 to-purple-500',
  },
  {
    name: 'Inteligencia Artificial Gratis',
    description: 'Spanish-first AI app for Latin American market',
    timeline: '2 weeks',
    tech: ['GPT-5.1', 'Gemini 3', 'iOS'],
    badge: 'Multilingual',
    color: 'from-orange-500 to-yellow-500',
  },
]

export function RecentlyShipped() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-full text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            Shipped recently
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What we've shipped lately
          </h2>
          <p className="text-xl text-blue-200">
            10+ AI apps launched this year. Here are the latest.
          </p>
        </motion.div>

        {/* Ships grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {recentShips.map((ship, index) => (
            <motion.div
              key={ship.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                {/* Badge */}
                <div className={`inline-block px-3 py-1 bg-gradient-to-r ${ship.color} text-white text-xs font-bold rounded-full mb-4`}>
                  {ship.badge}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                  {ship.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-blue-200 mb-4 leading-relaxed">
                  {ship.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {ship.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-blue-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-sm text-gray-400 pt-4 border-t border-white/10">
                  <Calendar className="w-4 h-4" />
                  <span>Shipped in {ship.timeline}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-blue-200">
            <span className="font-bold text-white">10+ AI apps</span> shipped in 2024 •{' '}
            <span className="font-bold text-white">1M+ users</span> across all products
          </p>
        </motion.div>
      </div>
    </section>
  )
}
