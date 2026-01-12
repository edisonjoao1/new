"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, Zap, Code2, Eye, Brain, Network, AlertTriangle, FileSearch, DollarSign, Scale } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PulseWireClientPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen pt-24">
        {/* Hero Section */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Case Studies</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Media Tech
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    AI Analysis
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  Pulse Wire
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  AI-Powered Media Transparency Platform
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  A next-generation news analysis platform that exposes media manipulation, tracks ownership networks,
                  and detects hypocrisy in news coverage. Built with a mission: optimize for truth, never for clicks.
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: '4 weeks', label: 'Development' },
                    { value: '5', label: 'AI Agents' },
                    { value: 'Real-time', label: 'Analysis' },
                    { value: '100+', label: 'Stories Analyzed' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-black">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center">
                  <Eye className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">Propaganda Score</div>
                      <div className="text-xs text-gray-500">0-100 Detection System</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Mission Statement */}
        <section className="bg-black text-white py-16">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-2xl lg:text-4xl font-light italic">
                &ldquo;We will never optimize for clicks. We will only optimize for truth.&rdquo;
              </p>
            </motion.div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">The Challenge</h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Hidden Agendas',
                    description: 'Media outlets rarely disclose who owns them, who funds them, or what conflicts of interest drive their coverage.'
                  },
                  {
                    title: 'Narrative Manipulation',
                    description: 'Propaganda techniques—loaded language, emotional appeals, fear-mongering—are pervasive but hard to detect for average readers.'
                  },
                  {
                    title: 'Double Standards',
                    description: 'Outlets change their stance based on political convenience. Yesterday\'s "patriotic" is today\'s "dangerous"—we needed to expose this.'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-red-600 font-light text-xl">{i + 1}</span>
                    </div>
                    <h3 className="text-xl font-medium text-black mb-3">{item.title}</h3>
                    <p className="text-gray-600 font-light">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-4">Our Solution</h2>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-3xl">
                We built a comprehensive media analysis platform with multi-agent AI architecture,
                combining web scraping, LLM analysis, and data visualization.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { icon: AlertTriangle, title: 'BS Detector', desc: 'Propaganda score 0-100' },
                  { icon: Scale, title: 'Hypocrisy Engine', desc: '"This you?" methodology' },
                  { icon: DollarSign, title: 'Follow The Money', desc: 'Ownership & funding maps' },
                  { icon: Network, title: 'Network Graphs', desc: 'Influence visualization' },
                  { icon: FileSearch, title: 'Story Analysis', desc: 'Loaded language detection' },
                  { icon: Eye, title: 'Newsstand', desc: 'Multiple view modes' },
                  { icon: Brain, title: 'AI Agents', desc: '5-agent pipeline' },
                  { icon: Zap, title: 'Real-time', desc: 'Live news processing' }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <feature.icon className="w-8 h-8 text-red-600 mb-3" />
                    <h3 className="font-medium text-black mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <div className="bg-black text-white rounded-2xl p-8 lg:p-12">
                <h3 className="text-2xl font-light mb-8">Tech Stack</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { category: 'Frontend', items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS'] },
                    { category: 'AI/Analysis', items: ['Gemini 3.0', 'Multi-Agent System', 'Web Scraping', 'NLP Pipeline'] },
                    { category: 'Visualization', items: ['Framer Motion', 'Network Graphs', 'Interactive Cards', 'Theme System'] },
                    { category: 'Data', items: ['RSS Parser', 'Cheerio', 'JSON Database', 'Real-time Feeds'] }
                  ].map((stack, i) => (
                    <div key={i}>
                      <div className="text-red-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
                      <ul className="space-y-2">
                        {stack.items.map((item, j) => (
                          <li key={j} className="text-gray-300 font-light">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Features Deep Dive */}
        <section className="bg-red-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Core Features in Detail</h2>

              <div className="space-y-8">
                {[
                  {
                    title: 'BS Detector (Propaganda Analyzer)',
                    description: 'Every story gets a propaganda score from 0-100. The system identifies loaded language, emotional manipulation, high-fear keywords, and rage-bait tactics. Visual indicator: RED for propaganda, GREEN for neutral fact-based reporting.',
                    example: 'Story headline with fear-mongering language → Score: 78/100 (High Propaganda)'
                  },
                  {
                    title: 'Hypocrisy Detection Engine',
                    description: 'Compares outlets\' current coverage against their historical stances using the "This you?" methodology. Exposes when outlets flip their position based on political convenience.',
                    example: 'NYT 2016: "Electoral college challenges are patriotic" vs NYT 2024: "Electoral college challenges are dangerous" → Hypocrisy Detected'
                  },
                  {
                    title: 'Follow The Money',
                    description: 'Interactive network graphs showing media ownership structures, funding sources, lobbying connections, and political ties. Traces ownership to ultimate shareholders (e.g., "BlackRock via Disney").',
                    example: 'CNN → Warner Bros Discovery → Major shareholders → Political connections → Lobbying activity'
                  },
                  {
                    title: 'Multi-Agent AI Pipeline',
                    description: 'Five specialized AI agents working together: Scout Agent finds leads, Investigator scrapes content, Analyst performs forensic analysis, Editor refines output, and Publisher formats for display.',
                    example: 'News article → Scout finds → Investigator fetches → Analyst scores → Editor polishes → Published with full transparency'
                  }
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-red-200">
                    <h3 className="text-xl font-medium text-black mb-3">{feature.title}</h3>
                    <p className="text-gray-600 font-light mb-4">{feature.description}</p>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <code className="text-sm text-red-800">{feature.example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">The Three Pillars</h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: FileSearch,
                    title: 'Review The Code',
                    description: 'Forensic analysis traces story lineage—who wrote it, who edited it, where the narrative originated, and how it spread.'
                  },
                  {
                    icon: DollarSign,
                    title: 'Follow The Money',
                    description: 'Map networks of influence—ownership chains, funding sources, political donations, and conflicts of interest.'
                  },
                  {
                    icon: Scale,
                    title: 'Hypocrisy Detection',
                    description: 'Expose double standards by comparing current coverage to historical stances on the same issues.'
                  }
                ].map((pillar, i) => (
                  <div key={i} className="text-center p-8 bg-gray-50 rounded-2xl">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <pillar.icon className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-medium text-black mb-4">{pillar.title}</h3>
                    <p className="text-gray-600 font-light">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Results & Impact</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white p-8 lg:p-12 rounded-2xl">
                  <h3 className="text-2xl font-light mb-6">Platform Capabilities</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Real-time analysis of breaking news stories</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Network visualization of media ownership</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Historical archive for hypocrisy detection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Politician funding tracker with voting records</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-8 lg:p-12 rounded-2xl">
                  <h3 className="text-2xl font-light text-black mb-6">Technical Achievements</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                      <span>5-agent AI pipeline for comprehensive analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                      <span>Gemini 3.0 integration for deep reasoning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                      <span>Multiple theme support (Dark, Paper, Zine)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                      <span>Interactive flip cards with detailed analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-5xl font-light mb-6">
                Need media analysis or AI transparency tools?
              </h2>
              <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                We build AI-powered analysis platforms that expose hidden patterns. From media transparency to data forensics—we can build it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
                >
                  View More Case Studies
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
