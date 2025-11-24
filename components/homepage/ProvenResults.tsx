"use client"

import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react'

const results = [
  {
    icon: Zap,
    value: '$25M+',
    label: 'Client savings delivered',
    subtext: 'Through automation & AI',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    value: '500K+',
    label: 'Active users worldwide',
    subtext: 'Across all our apps',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    value: '50+',
    label: 'Apps shipped & live',
    subtext: 'On the App Store',
    color: 'from-purple-500 to-pink-500',
  },
]

export function ProvenResults() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_black_1px,_transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Numbers that matter
          </h2>
          <p className="text-xl text-gray-600">
            Real impact. Measured results.
          </p>
        </motion.div>

        {/* Results grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${result.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <result.icon className="w-7 h-7 text-white" />
                </div>

                {/* Value */}
                <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                  {result.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {result.label}
                </div>

                {/* Subtext */}
                <p className="text-sm text-gray-600">
                  {result.subtext}
                </p>

                {/* Progress indicator */}
                <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 1, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${result.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
