"use client"

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const caseStudies = [
  {
    client: 'SaaS Startup',
    problem: 'Manual data entry eating 6 hours daily',
    solution: 'Custom AI workflow automation',
    outcome: '$260K saved per year',
    timeline: '12 days',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-200',
  },
  {
    client: 'E-commerce Brand',
    problem: 'Zero Spanish-language AI tools',
    solution: 'Localized AI shopping assistant',
    outcome: '50K+ new users in 3 months',
    timeline: '3 weeks',
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-200',
  },
  {
    client: 'Tech Founder',
    problem: 'MVP stuck in planning for 8 months',
    solution: 'iOS app with GPT-5.1 integration',
    outcome: 'Live on App Store, 10K downloads',
    timeline: '18 days',
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-200',
  },
]

export function CompactCaseStudies() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" />
            Proven track record
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From problem to shipped
          </h2>
          <p className="text-xl text-gray-600">
            Real projects. Real outcomes. Fast delivery.
          </p>
        </motion.div>

        {/* Case studies grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className={`relative h-full bg-gradient-to-br ${study.gradient} rounded-2xl p-8 border-2 ${study.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                {/* Client badge */}
                <div className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 mb-6">
                  {study.client}
                </div>

                {/* Problem */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Problem
                  </div>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    {study.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Solution
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {study.solution}
                  </p>
                </div>

                {/* Outcome */}
                <div className="mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Outcome
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {study.outcome}
                  </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                  <span className="text-sm font-medium text-gray-600">
                    Delivered in {study.timeline}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
