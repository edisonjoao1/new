"use client"

import { motion } from 'framer-motion'
import { Code } from 'lucide-react'

const stack = [
  { name: 'GPT-5.1', category: 'AI Models' },
  { name: 'Claude Opus 4.5', category: 'AI Models' },
  { name: 'Gemini 3', category: 'AI Models' },
  { name: 'OpenAI Realtime', category: 'AI APIs' },
  { name: 'iOS/Swift', category: 'Mobile' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'Next.js', category: 'Web' },
  { name: 'Node.js', category: 'Backend' },
]

export function TechStack() {
  return (
    <section className="py-16 bg-white border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            Tech stack
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Built with modern AI & mobile tech
          </h2>
          <p className="text-gray-600">
            Latest models. Production-ready infrastructure.
          </p>
        </motion.div>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {stack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="group"
            >
              <div className="px-5 py-3 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tech.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {tech.category}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
