"use client"

import { motion } from 'framer-motion'
import { ExternalLink, Star } from 'lucide-react'
import { PRODUCTS } from '@/lib/constants'

export function AppShowcase() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-light text-black mb-6">
            Live on the App Store
          </h2>
          <p className="text-xl text-gray-600">
            AI apps serving 500K+ users worldwide.
          </p>
        </motion.div>

        {/* Apps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((app, index) => (
            <motion.a
              key={app.name}
              href={app.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative block"
            >
              <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                {/* Icon placeholder */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {app.name.charAt(0)}
                  </span>
                </div>

                {/* App name */}
                <h3 className="text-xl font-medium text-black mb-2 group-hover:text-gray-600 transition-colors">
                  {app.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {app.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-700 font-medium">{app.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{app.downloads}</span>
                </div>

                {/* External link indicator */}
                <div className="absolute top-6 right-6 text-gray-400 group-hover:text-black transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
