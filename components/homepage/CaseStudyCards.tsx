"use client"

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'

const caseStudies = [
  {
    title: 'Automation',
    problem: '6 hours of manual data entry',
    solution: 'Custom AI workflow',
    result: '$260K saved per year',
    metric: '6h → 1h',
    timeline: 'Built in 12 days',
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    title: 'Spanish Market Entry',
    problem: 'No Spanish-language AI tools',
    solution: 'Localized AI assistant',
    result: '50K+ new users',
    metric: '0 → 50K users',
    timeline: 'Shipped in 3 weeks',
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
  {
    title: 'MVP Launch',
    problem: 'Idea stuck in planning for months',
    solution: 'iOS app with GPT-4o',
    result: 'Live on App Store',
    metric: 'Idea → Launch',
    timeline: 'Ready in 18 days',
    gradient: 'from-green-500/10 to-emerald-500/10',
  },
]

export function CaseStudyCards() {
  return (
    <section className="py-32 bg-white">
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
            Real outcomes
          </h2>
          <p className="text-xl text-gray-600">
            Not theory. Shipped products with measurable results.
          </p>
        </motion.div>

        {/* Case study cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="h-full bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    {study.title}
                  </h3>

                  {/* Problem → Solution */}
                  <div className="mb-6 space-y-2">
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium text-black">Problem:</span> {study.problem}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium text-black">Solution:</span> {study.solution}
                    </p>
                  </div>

                  {/* Big metric */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-3xl font-light text-black">{study.metric}</p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{study.result}</p>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">{study.timeline}</p>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
