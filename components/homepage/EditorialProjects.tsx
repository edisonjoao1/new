"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const projects = [
  {
    number: '01',
    title: 'SheGPT',
    category: 'Mobile AI',
    stat: '1 Day',
    statLabel: 'Idea to App Store',
    description: 'AI assistant for women featuring OpenAI Realtime voice conversations. A demonstration of our rapid MVP capability.',
    image: 'from-pink-100 to-purple-100',
  },
  {
    number: '02',
    title: 'Conversational Payments',
    category: 'Fintech × AI',
    stat: '$250K+',
    statLabel: 'Processed',
    description: 'Cross-platform payment system working seamlessly across ChatGPT, Claude, and WhatsApp. Production fintech AI.',
    image: 'from-blue-100 to-cyan-100',
  },
  {
    number: '03',
    title: 'Inteligencia Artificial',
    category: 'Multilingual',
    stat: '100K+',
    statLabel: 'Users',
    description: 'Spanish-first AI application for Latin American markets. Serving users across 12 countries with localized experiences.',
    image: 'from-orange-100 to-amber-100',
  },
]

export function EditorialProjects() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-[1600px] mx-auto px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="h-px w-16 bg-black mb-8" />
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                Recent Work
              </p>
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-black">
                Featured Projects
              </h2>
            </div>
            <Link href="/work">
              <button className="group hidden lg:flex items-center gap-2 text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors">
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Projects list */}
        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                {/* Image */}
                <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[16/10] bg-gradient-to-br overflow-hidden">
                    {/* Placeholder - would be a striking project image */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.image} flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}>
                      <div className="text-center p-12">
                        <div className="text-8xl font-light text-gray-400/50 mb-4">
                          {project.number}
                        </div>
                        <div className="text-sm uppercase tracking-[0.3em] text-gray-500">
                          {project.category}
                        </div>
                      </div>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-6">
                    {/* Meta */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="text-2xl font-light text-gray-300">{project.number}</span>
                      <span className="uppercase tracking-wider">{project.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-5xl lg:text-6xl font-light tracking-tight text-black group-hover:text-gray-700 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg leading-relaxed text-gray-600 font-light max-w-md">
                      {project.description}
                    </p>

                    {/* Stat */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-end gap-4">
                        <div className="text-4xl font-light text-black">{project.stat}</div>
                        <div className="text-sm uppercase tracking-wider text-gray-500 pb-1">
                          {project.statLabel}
                        </div>
                      </div>
                    </div>

                    {/* Read more link */}
                    <button className="group/link inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors pt-4">
                      <span>View Case Study</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < projects.length - 1 && (
                <div className="h-px bg-gray-200 mt-24" />
              )}
            </motion.article>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden mt-16 text-center">
          <Link href="/work">
            <button className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1">
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
