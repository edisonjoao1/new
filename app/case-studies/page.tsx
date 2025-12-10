"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowRight, Clock, Users, TrendingUp, Zap, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const caseStudies = [
  {
    slug: 'biblia-ai-bible-app',
    title: 'Biblia - AI Bible Study App',
    subtitle: 'Spanish-First Religious Tech',
    category: 'Mobile AI',
    timeline: '2 weeks',
    industry: 'Religious Tech',
    description: 'Modern iOS Bible study application combining traditional scripture reading with AI-powered study tools for Spanish-speaking users.',
    results: [
      { metric: '31,000+', label: 'Verses' },
      { metric: '5', label: 'Reading Plans' },
      { metric: '8', label: 'AI Tools' },
      { metric: '2 weeks', label: 'To Launch' }
    ],
    tech: ['Swift', 'SwiftUI', 'GPT-4o-mini', 'OpenAI API'],
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'tourist-ai-audio-guide',
    title: 'Tourist - AI Audio Tour Guide',
    subtitle: 'Voice-Powered Travel Experience',
    category: 'Voice AI',
    timeline: '3 weeks',
    industry: 'Travel Tech',
    description: 'AI-powered audio tour guide providing real-time, personalized narrations as users explore cities worldwide.',
    results: [
      { metric: '8', label: 'Cities' },
      { metric: '<200ms', label: 'Latency' },
      { metric: '100+', label: 'POIs' },
      { metric: '3 weeks', label: 'Development' }
    ],
    tech: ['Swift', 'GPT-4o', 'OpenAI TTS', 'MapKit'],
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    slug: 'bias-lens-media-literacy',
    title: 'Bias Lens - Media Literacy App',
    subtitle: 'AI-Powered News Analysis',
    category: 'AI Analysis',
    timeline: '4 weeks',
    industry: 'Media Tech',
    description: 'News aggregation app using AI to detect political bias, analyze loaded language, and promote balanced media consumption.',
    results: [
      { metric: '20+', label: 'Sources' },
      { metric: '96%', label: 'Accuracy' },
      { metric: 'Real-time', label: 'Analysis' },
      { metric: '4 weeks', label: 'Development' }
    ],
    tech: ['Swift', 'SwiftData', 'GPT-4o', 'NLP'],
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    slug: 'firstagent-ai-payments',
    title: 'FirstAgent - AP2 Protocol Pioneer',
    subtitle: 'Conversational Payments Platform',
    category: 'AI + Fintech',
    timeline: '6 weeks',
    industry: 'Fintech',
    description: 'Pioneering agent-to-payments protocol enabling AI to make purchases on behalf of users with cryptographic authorization.',
    results: [
      { metric: 'First', label: 'Pre-AP2' },
      { metric: '50+', label: 'Countries' },
      { metric: 'Biometric', label: 'Security' },
      { metric: '6 weeks', label: 'To Production' }
    ],
    tech: ['Swift', 'Secure Enclave', 'Gemini AI', 'Wise API'],
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'envioplata-remittance',
    title: 'EnvioPlata - Remittance Platform',
    subtitle: 'AI-Powered Money Transfer',
    category: 'Fintech',
    timeline: '4 weeks',
    industry: 'Fintech',
    description: 'International money transfer app enabling US-to-Latin America remittances with real-time rates and minimal fees.',
    results: [
      { metric: '16', label: 'Countries' },
      { metric: '$2.99', label: 'Flat Fee' },
      { metric: 'Real-time', label: 'Rates' },
      { metric: '4 weeks', label: 'Development' }
    ],
    tech: ['Swift', 'Stripe', 'Wise API', 'Node.js'],
    gradient: 'from-green-500 to-emerald-600',
  }
]

export default function CaseStudiesPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen pt-24">
        {/* Hero Section */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-8" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Case Studies
                </p>
                <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-black">
                  How we build
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    AI products
                  </span>
                </h1>
              </div>
              <div className="flex items-end">
                <p className="text-xl leading-relaxed text-gray-600 font-light">
                  Deep dives into our development process, technical decisions, and the real-world impact
                  of our AI solutions. From concept to App Store in weeks, not months.
                </p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
              {[
                { value: '20+', label: 'Apps Shipped' },
                { value: '1M+', label: 'Users Reached' },
                { value: '6 days', label: 'Fastest MVP' },
                { value: '2-4 weeks', label: 'Typical Timeline' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                >
                  <div className="text-4xl font-light text-black mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Case Studies Grid */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="space-y-12">
              {caseStudies.map((study, index) => (
                <motion.article
                  key={study.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link href={`/case-studies/${study.slug}`}>
                    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                      <div className="grid lg:grid-cols-5 gap-0">
                        {/* Visual Side */}
                        <div className={`relative aspect-video lg:aspect-auto lg:col-span-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient}`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[120px] lg:text-[180px] font-light text-white/20">
                                {study.title.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                              {study.category}
                            </span>
                          </div>
                        </div>

                        {/* Content Side */}
                        <div className={`p-6 lg:p-10 lg:col-span-3 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs uppercase tracking-wider text-gray-500">{study.industry}</span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {study.timeline}
                            </span>
                          </div>

                          <h2 className="text-2xl lg:text-3xl font-light tracking-tight text-black mb-1 group-hover:text-gray-700 transition-colors">
                            {study.title}
                          </h2>
                          <p className="text-base text-gray-500 mb-4">{study.subtitle}</p>

                          <p className="text-gray-600 font-light leading-relaxed mb-6 text-sm lg:text-base">
                            {study.description}
                          </p>

                          {/* Results */}
                          <div className="grid grid-cols-4 gap-3 mb-6">
                            {study.results.map((result, i) => (
                              <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-lg font-light text-black">{result.metric}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{result.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Tech Stack */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {study.tech.map((tech) => (
                              <span key={tech} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-black text-sm font-medium group-hover:gap-3 transition-all">
                            Read Full Case Study
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-6">
              Ready to be our
              <br />
              next success story?
            </h2>
            <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
              We ship production AI products in 2-4 weeks. Let&apos;s discuss your idea.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-900 transition-colors"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
