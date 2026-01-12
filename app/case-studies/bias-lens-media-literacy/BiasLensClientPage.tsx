"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, CheckCircle2, Newspaper, Search, BookOpen, BarChart3, Eye, Filter, Bookmark, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BiasLensClientPage() {
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
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Case Studies</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    AI Analysis
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Media Tech
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  Bias Lens
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  AI-Powered Media Literacy Platform
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  A news aggregation app that uses GPT-5.2 to detect political bias, identify loaded language,
                  and help users consume media more consciously—without being preachy.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: '4 weeks', label: 'Development' },
                    { value: '20+', label: 'Sources' },
                    { value: '96%', label: 'Accuracy' },
                    { value: 'Real-time', label: 'Analysis' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-black">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center">
                  <Newspaper className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">Bias Detection</div>
                      <div className="text-xs text-gray-500">Left ← Center → Right</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
                    title: 'Non-Judgmental',
                    description: 'Help users understand bias without telling them what to think. Present facts, not opinions about their media choices.'
                  },
                  {
                    title: 'Real-Time Scale',
                    description: 'Aggregate and analyze news from 20+ sources across the political spectrum. Progressive loading for fast UX.'
                  },
                  {
                    title: 'Actionable Insights',
                    description: 'Go beyond "this is biased" to show exactly which phrases are loaded and why—with educational context.'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-purple-600 font-light text-xl">{i + 1}</span>
                    </div>
                    <h3 className="text-xl font-medium text-black mb-3">{item.title}</h3>
                    <p className="text-gray-600 font-light">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bias Spectrum Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-4">News Source Coverage</h2>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-3xl">
                We aggregate from sources across the full political spectrum, scoring each from -3 (far left) to +3 (far right).
              </p>

              <div className="bg-gray-50 p-8 rounded-2xl mb-12">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-600 font-medium">Left</span>
                  <span className="text-gray-500 font-medium">Center</span>
                  <span className="text-red-600 font-medium">Right</span>
                </div>
                <div className="h-4 bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 rounded-full mb-6" />

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Left-Leaning</div>
                    <ul className="text-gray-500 space-y-1">
                      <li>NPR</li>
                      <li>New York Times</li>
                      <li>Washington Post</li>
                      <li>Vox</li>
                      <li>MSNBC</li>
                      <li>HuffPost</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Center</div>
                    <ul className="text-gray-500 space-y-1">
                      <li>BBC</li>
                      <li>AP News</li>
                      <li>Reuters</li>
                      <li>USA Today</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Right-Leaning</div>
                    <ul className="text-gray-500 space-y-1">
                      <li>Fox News</li>
                      <li>Wall Street Journal</li>
                      <li>New York Post</li>
                      <li>Daily Wire</li>
                      <li>The Blaze</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-purple-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Key Features</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Newspaper, title: 'Smart Feed', desc: 'Hero articles, For You section, time-based grouping' },
                  { icon: Eye, title: 'Bias Scoring', desc: 'Article-level analysis with confidence levels' },
                  { icon: Search, title: 'Loaded Phrases', desc: 'Highlights biased language with explanations' },
                  { icon: BarChart3, title: 'Balance Chart', desc: 'Visual breakdown of your reading habits' },
                  { icon: Filter, title: 'Explore Modes', desc: 'Topics, trending, sources, clusters' },
                  { icon: BookOpen, title: 'Learn Tab', desc: 'Media literacy education and quizzes' },
                  { icon: Bookmark, title: 'Bookmarks', desc: 'Save articles with unread badges' },
                  { icon: WifiOff, title: 'Offline Mode', desc: 'Cached articles work without internet' }
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl">
                    <feature.icon className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-medium text-black mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI Analysis Deep Dive */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">AI Analysis Pipeline</h2>

              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h3 className="text-xl font-medium text-black mb-4">1. Article Scoring</h3>
                  <p className="text-gray-600 font-light mb-4">
                    When a user taps &quot;Analyze Article,&quot; we fetch the full content and send it to GPT-5.2 with a structured prompt.
                    The response includes an article score (-3 to +3), confidence level, and human-readable explanation.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <code className="text-sm text-purple-600">
                      {`{ articleScore: -1, confidence: "high", explanation: "Article uses emotionally charged language..." }`}
                    </code>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h3 className="text-xl font-medium text-black mb-4">2. Loaded Phrase Detection</h3>
                  <p className="text-gray-600 font-light mb-4">
                    GPT-5.2 identifies specific phrases that carry implicit bias—emotional language, partisan framing,
                    or misleading characterizations—with explanations for each.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <code className="text-sm text-purple-600">
                      {`loadedPhrases: [{ phrase: "radical agenda", biasType: "partisan", explanation: "..." }]`}
                    </code>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h3 className="text-xl font-medium text-black mb-4">3. Topic Clustering</h3>
                  <p className="text-gray-600 font-light mb-4">
                    Articles covering the same story from different sources are grouped together,
                    allowing users to see how the same event is framed across the political spectrum.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <code className="text-sm text-purple-600">
                      {`topicClusters: { "Election 2024": [NYT article, Fox article, Reuters article] }`}
                    </code>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-black text-white py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light mb-12">Technical Architecture</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { category: 'Frontend', items: ['Swift 5.9', 'SwiftUI', '@Observable', 'SwiftData'] },
                  { category: 'Data Layer', items: ['RSS Parsing', 'FeedCache', 'Disk Persistence', 'NetworkMonitor'] },
                  { category: 'AI Services', items: ['GPT-5.2', 'OpenAI API', 'ArchiveService', 'NLP Analysis'] },
                  { category: 'Features', items: ['Progressive Loading', 'Offline Support', 'Haptic Feedback', 'Pull-to-Refresh'] }
                ].map((stack, i) => (
                  <div key={i}>
                    <div className="text-purple-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
                    <ul className="space-y-2">
                      {stack.items.map((item, j) => (
                        <li key={j} className="text-gray-300 font-light">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Results</h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-purple-50 rounded-2xl">
                  <div className="text-4xl font-light text-purple-600 mb-4">96%</div>
                  <h3 className="text-xl font-medium text-black mb-2">Bias Detection Accuracy</h3>
                  <p className="text-gray-600 font-light">
                    AI scoring aligns with established media bias ratings from AllSides and Media Bias/Fact Check.
                  </p>
                </div>

                <div className="p-8 bg-gray-50 rounded-2xl">
                  <div className="text-4xl font-light text-black mb-4">20+</div>
                  <h3 className="text-xl font-medium text-black mb-2">News Sources</h3>
                  <p className="text-gray-600 font-light">
                    Full spectrum coverage from NPR to Fox News, with priority loading for fast UX.
                  </p>
                </div>

                <div className="p-8 bg-gray-50 rounded-2xl">
                  <div className="text-4xl font-light text-green-600 mb-4">4 weeks</div>
                  <h3 className="text-xl font-medium text-black mb-2">Development Time</h3>
                  <p className="text-gray-600 font-light">
                    From concept to production-ready app with full AI integration and educational content.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-purple-600 to-violet-700 text-white py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-5xl font-light mb-6">
                Need AI content analysis?
              </h2>
              <p className="text-xl text-purple-200 font-light mb-10 max-w-2xl mx-auto">
                We build AI systems that analyze, categorize, and extract insights from text—news, documents, reviews, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
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
