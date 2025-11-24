"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Check, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const services = [
  {
    number: '01',
    title: 'Rapid MVPs',
    tagline: '2-4 weeks, idea to production',
    description: 'We build, test, and ship with real users. No prototypes, no endless iterations. Production-ready from day one.',
    features: [
      'Full-stack development',
      'Production deployment',
      'User testing & feedback',
      'Analytics setup',
      'Scale-ready architecture'
    ],
    pricing: 'Fixed: $15-25K'
  },
  {
    number: '02',
    title: 'Mobile AI Apps',
    tagline: 'Native iOS & cross-platform',
    description: 'Beautiful apps with AI at the core. Integrated with GPT-4o, Claude, and custom models. App Store ready.',
    features: [
      'Native iOS (Swift/SwiftUI)',
      'React Native cross-platform',
      'AI model integration',
      'Backend & API development',
      'App Store optimization'
    ],
    pricing: 'From $20K'
  },
  {
    number: '03',
    title: 'Conversational Agents',
    tagline: 'ChatGPT, Claude, WhatsApp',
    description: 'Production AI systems that work across platforms. Real fintech integrations, automation, and user support.',
    features: [
      'Multi-platform deployment',
      'Payment integration',
      'Natural language processing',
      'Context management',
      'Analytics & monitoring'
    ],
    pricing: 'From $15K'
  },
  {
    number: '04',
    title: 'Multilingual AI',
    tagline: 'Spanish-first for LATAM',
    description: 'Native Spanish AI experiences with cultural adaptation. We understand Latin American markets.',
    features: [
      'Spanish language fine-tuning',
      'Cultural adaptation',
      'LATAM payment integration',
      'Regional content moderation',
      'Market research'
    ],
    pricing: 'From $12K'
  },
  {
    number: '05',
    title: 'AI Strategy',
    tagline: 'Roadmap to execution',
    description: 'Identify high-impact opportunities and build a plan that ships. Not slides—real implementation.',
    features: [
      'Opportunity assessment',
      'Technical architecture',
      'Model selection',
      'Cost & ROI analysis',
      'Implementation roadmap'
    ],
    pricing: 'From $5K'
  },
  {
    number: '06',
    title: 'API Integration',
    tagline: 'Connect AI to your systems',
    description: 'Seamless integration of GPT-4o, Claude, Llama into your workflows. RAG pipelines and custom solutions.',
    features: [
      'OpenAI, Anthropic, Meta',
      'Custom API development',
      'RAG implementation',
      'Vector database setup',
      'Cost optimization'
    ],
    pricing: 'From $8K'
  }
]

export default function ServicesPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen pt-24">
        {/* Header */}
        <section className="max-w-[1600px] mx-auto px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-8" />

            <div className="grid lg:grid-cols-2 gap-16 mb-16">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Services
                </p>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight text-black mb-6">
                  Full-stack
                  <br />
                  AI Development
                </h1>
              </div>
              <div className="flex items-end">
                <p className="text-xl leading-relaxed text-gray-600 font-light">
                  From strategy to deployment, we handle everything.
                  No consulting theater—just real products with real users.
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-12 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-light text-black mb-1">2-4 weeks</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">Typical MVP</div>
              </div>
              <div>
                <div className="text-3xl font-light text-black mb-1">20+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">Apps since 2023</div>
              </div>
              <div>
                <div className="text-3xl font-light text-black mb-1">1M+</div>
                <div className="text-sm uppercase tracking-wider text-gray-500">Total users</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
              {services.map((service, index) => (
                <motion.article
                  key={service.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  {/* Number */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-light text-gray-300">{service.number}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-4xl font-light tracking-tight text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-lg leading-relaxed text-gray-600 font-light mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-base text-gray-600 font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing */}
                  <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xl font-light text-black">{service.pricing}</span>
                    <button
                      onClick={() => setIsPlanOpen(true)}
                      className="text-sm uppercase tracking-wider text-gray-600 hover:text-black transition-colors group/btn flex items-center gap-2"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-white py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <div className="h-px w-16 bg-black mb-8" />
              <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-4">
                How We Work
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl">
                Transparent, fast, and collaborative.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-12">
              {[
                {
                  step: '01',
                  title: 'Discovery',
                  description: 'We dig deep into your problem, goals, and constraints. 1-hour call to align on vision.',
                  duration: '1 day'
                },
                {
                  step: '02',
                  title: 'Proposal',
                  description: 'Detailed scope, timeline, and pricing. Clear expectations on deliverables.',
                  duration: '2-3 days'
                },
                {
                  step: '03',
                  title: 'Build',
                  description: 'Weekly sprints with demos. You see progress every week and provide feedback.',
                  duration: '2-4 weeks'
                },
                {
                  step: '04',
                  title: 'Launch',
                  description: 'Production deployment, monitoring setup, and post-launch support.',
                  duration: '1 week'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-6xl font-light text-gray-200 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-light tracking-tight text-black mb-3">{item.title}</h3>
                  <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="text-sm uppercase tracking-wider text-gray-500">{item.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-6">
                Let's Build Your
                <br />
                AI Product
              </h2>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
                Book a free consultation. We'll discuss your idea and provide a clear path forward.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => setIsPlanOpen(true)}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-6 text-base font-light tracking-wide"
                >
                  Start a Project
                </Button>
                <Link href="/work">
                  <button className="text-base font-light text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-1">
                    View Our Work
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
