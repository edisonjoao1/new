"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Zap, Rocket, Globe, Code, Users, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '30+', label: 'Apps shipped since 2023' },
  { value: '1M+', label: 'Users reached' },
  { value: '1 day', label: 'Fastest MVP' },
  { value: '2-4 weeks', label: 'Typical delivery' }
]

const values = [
  {
    icon: Rocket,
    title: 'Ship fast',
    description: 'We launch MVPs in 2-4 weeks. No endless planning—we build, test, and iterate with real users.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Code,
    title: 'Build right',
    description: 'Production-ready code from day one. Scalable architecture, clean design, comprehensive testing.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'Think global',
    description: 'Multilingual AI products that work across markets. We specialize in Spanish-first experiences.',
    gradient: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Users,
    title: 'Focus on impact',
    description: 'We measure success by user adoption and business outcomes, not features shipped.',
    gradient: 'from-green-500 to-emerald-500'
  }
]

const journey = [
  {
    year: '2023',
    title: 'Foundation',
    description: 'Started AI 4U Labs with a mission to make AI accessible through real products, not just prototypes.'
  },
  {
    year: 'This Year',
    title: 'Rapid growth',
    description: 'Shipped 30+ AI-powered apps to production, reaching over 1M users across health, fitness, finance, and education.'
  },
  {
    year: 'Q1',
    title: 'SheGPT launch',
    description: 'Proved our rapid MVP capability by going from idea to App Store approved in just 1 day with OpenAI Realtime API.'
  },
  {
    year: 'Q2',
    title: 'Fintech expansion',
    description: 'Built conversational payment agents across ChatGPT, Claude, and WhatsApp. Processed $250K+ in transactions.'
  },
  {
    year: 'Q3',
    title: 'Global reach',
    description: 'Launched Spanish-first AI app "Inteligencia Artificial Gratis" - now serving 100K+ users across 12 countries.'
  },
  {
    year: 'Today',
    title: 'Full-stack AI studio',
    description: 'Offering end-to-end AI development: strategy, mobile apps, automation, multilingual products, and rapid MVPs.'
  }
]

export default function AboutPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white text-black min-h-screen pt-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-8 font-light">
              About us
            </p>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
              We're a studio
              <br />
              <span className="italic font-serif">
                that ships
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
              AI 4U Labs is a full-stack AI development studio based in Naples, Florida.
              We build real AI products—from conversational agents to mobile apps—and ship them to production fast.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-light mb-2 text-black">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Our story */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div>
                <div className="h-px w-16 bg-black mb-6" />
                <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                  Why we exist
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed font-light">
                  <p>
                    We started AI 4U Labs in 2023 because we were tired of seeing great AI ideas stuck in prototype hell.
                    Too many consultants selling slides. Too many "pilots" that never ship. We wanted to pioneer and build real products.
                  </p>
                  <p>
                    We believe AI products should be in the hands of real users—fast. That's why we specialize in
                    rapid development and production deployments. We've pioneered technologies like conversational payments (implementing AP2-style systems before Google announced the protocol), built MCP servers, and created AI that saves companies $500K+ annually.
                  </p>
                  <p>
                    Based in Naples, Florida, we work with founders and teams worldwide since 2023. Our sweet spot is
                    early-stage products that need to move fast and companies willing to pioneer: MCP servers, conversational payment systems, customer care AI, mobile AI apps, multilingual tools, and automation systems.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-2xl font-light mb-6 tracking-tight">Our approach</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-normal mb-1">Ship weekly</div>
                        <div className="text-sm text-gray-600 font-light">Demo progress every week. No surprises.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-normal mb-1">Test with users</div>
                        <div className="text-sm text-gray-600 font-light">Real feedback from day one.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-normal mb-1">Measure impact</div>
                        <div className="text-sm text-gray-600 font-light">Track adoption and business metrics.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="h-px w-16 bg-black mb-6" />
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
              What we believe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl font-light">
              Our principles guide every project we take on.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-light mb-3 tracking-tight">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="h-px w-16 bg-black mb-6" />
              <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
                Our journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl font-light">
                From zero to 30+ shipped products since 2023.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200" />

              <div className="space-y-12">
                {journey.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`relative grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}
                  >
                    {/* Content */}
                    <div className={index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}>
                      <div className="inline-block px-3 py-1 bg-black text-white text-xs font-normal rounded-full mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-light mb-2 tracking-tight">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed font-light">{milestone.description}</p>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 -ml-2 bg-black rounded-full border-4 border-gray-50" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-black p-12 md:p-16 text-center"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-white tracking-tight">
                Let's ship something together
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
                Have an AI product idea? We can help you ship it in 2-4 weeks.
              </p>
              <Button
                onClick={() => setIsPlanOpen(true)}
                size="lg"
                className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6 rounded-full font-light"
              >
                Get Your AI Plan
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
