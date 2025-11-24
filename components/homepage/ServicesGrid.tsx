"use client"

import { motion } from 'framer-motion'
import { Brain, Smartphone, Zap, Plug, Globe, Rocket, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const services = [
  {
    icon: Brain,
    title: 'AI Strategy',
    description: 'Business-specific roadmaps and competitive analysis.',
    features: ['Custom AI integration plans', 'Competitive landscape analysis', 'Technical roadmap'],
    color: 'blue',
  },
  {
    icon: Smartphone,
    title: 'Custom Apps',
    description: 'iOS/Swift, web apps, SaaS dashboards.',
    features: ['Mobile-first AI solutions', 'LLM integrations', 'Scalable SaaS development'],
    color: 'purple',
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Email/CRM automation and document parsing.',
    features: ['Automated workflows', 'CRM synchronization', 'Intelligent document processing'],
    color: 'green',
  },
  {
    icon: Plug,
    title: 'API Integration',
    description: 'GPT-4o, Claude, Llama 3.1 with RAG pipelines.',
    features: ['Seamless API integrations', 'RAG implementation', 'Real-time AI assistants'],
    color: 'orange',
  },
  {
    icon: Globe,
    title: 'Localization',
    description: 'Spanish markets and persona-based GPTs.',
    features: ['Spanish-language tools', 'Cultural adaptation', 'Persona-based AI'],
    color: 'pink',
  },
  {
    icon: Rocket,
    title: 'Rapid MVP',
    description: 'MVPs in days, not months.',
    features: ['2-4 week delivery', 'Iterative development', 'Market-ready products'],
    color: 'cyan',
  },
]

const colorClasses = {
  blue: 'hover:border-blue-500 group-hover:text-blue-600',
  purple: 'hover:border-purple-500 group-hover:text-purple-600',
  green: 'hover:border-green-500 group-hover:text-green-600',
  orange: 'hover:border-orange-500 group-hover:text-orange-600',
  pink: 'hover:border-pink-500 group-hover:text-pink-600',
  cyan: 'hover:border-cyan-500 group-hover:text-cyan-600',
}

interface ServicesGridProps {
  onGetStarted: () => void
}

export function ServicesGrid({ onGetStarted }: ServicesGridProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

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
            What I build
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From strategy to shipped product. Pick what you need.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div
                className={`h-full bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                  colorClasses[service.color as keyof typeof colorClasses]
                }`}
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              >
                {/* Icon */}
                <div className="mb-6">
                  <service.icon className="w-10 h-10 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-medium text-black mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Expandable features */}
                <motion.div
                  initial={false}
                  animate={{ height: expandedCard === index ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 mb-4 pt-2 border-t border-gray-100">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-start">
                        <span className="mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Expand indicator */}
                <button className="text-sm font-medium text-gray-400 group-hover:text-gray-900 flex items-center transition-colors">
                  {expandedCard === index ? 'Less' : 'More'}
                  <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${expandedCard === index ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center text-lg font-medium text-black hover:text-gray-600 transition-colors group"
          >
            Get Your AI Plan
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
