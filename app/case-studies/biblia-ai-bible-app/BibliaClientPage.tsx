"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, Zap, Code2, Smartphone, Brain, MessageSquare, BookOpen, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BibliaClientPage() {
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
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    Mobile AI
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Religious Tech
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  Biblia
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  AI-Powered Bible Study App for Spanish Speakers
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  A modern iOS application combining the complete Reina-Valera 1960 Bible with GPT-4 powered
                  study tools, making scripture accessible and engaging for Spanish-speaking Christians worldwide.
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: '2 weeks', label: 'Development' },
                    { value: '31,000+', label: 'Verses' },
                    { value: '8', label: 'AI Tools' },
                    { value: '5', label: 'Reading Plans' }
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
                <div className="aspect-square bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center">
                  <BookOpen className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">GPT-4 Powered</div>
                      <div className="text-xs text-gray-500">AI Bible Assistant</div>
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
                    title: 'Cultural Sensitivity',
                    description: 'Create an AI experience that respects religious traditions while providing modern study tools for Spanish-speaking Christians.'
                  },
                  {
                    title: 'Complete Bible Access',
                    description: 'Integrate the full Reina-Valera 1960 translation (31,000+ verses) with fast search and navigation on mobile.'
                  },
                  {
                    title: 'Engaging AI Tools',
                    description: 'Build AI features that enhance Bible study without feeling gimmicky—verse explanations, devotionals, and prayer generation.'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-amber-600 font-light text-xl">{i + 1}</span>
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
                We built a native iOS app using SwiftUI with GPT-4o-mini integration, combining beautiful design
                with powerful AI capabilities.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { icon: BookOpen, title: 'Complete Bible', desc: 'Full RVR1960 with fast search' },
                  { icon: MessageSquare, title: 'AI Chat', desc: 'Scripture-based Q&A assistant' },
                  { icon: Heart, title: 'Favorites', desc: 'Save verses with auto-explanations' },
                  { icon: Share2, title: 'Share Cards', desc: '4 beautiful card styles' },
                  { icon: Zap, title: 'Daily Devotional', desc: 'AI-generated reflections' },
                  { icon: Brain, title: 'Mood Verses', desc: 'Find verses by emotion' },
                  { icon: Clock, title: 'Reading Plans', desc: '5 structured study plans' },
                  { icon: CheckCircle2, title: 'Streak System', desc: 'Daily engagement tracking' }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <feature.icon className="w-8 h-8 text-amber-600 mb-3" />
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
                    { category: 'Frontend', items: ['Swift 5.9', 'SwiftUI', 'iOS 17+', 'Combine'] },
                    { category: 'AI/Backend', items: ['GPT-4o-mini', 'OpenAI API', 'Streaming', 'JSON Mode'] },
                    { category: 'Data', items: ['UserDefaults', 'JSON (5MB)', '31K verses', 'Local-first'] },
                    { category: 'Features', items: ['Haptics', 'Share Sheet', 'Notifications', 'Dark Mode'] }
                  ].map((stack, i) => (
                    <div key={i}>
                      <div className="text-amber-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
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

        {/* AI Features Deep Dive */}
        <section className="bg-amber-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">AI Features in Detail</h2>

              <div className="space-y-8">
                {[
                  {
                    title: 'AI Bible Study Assistant',
                    description: 'Users can ask questions in natural language and receive scripture-based responses with verse references. The system prompt ensures all answers are grounded in biblical text.',
                    example: '¿Cómo puedo tener más fe? → Returns relevant verses with contextual explanation'
                  },
                  {
                    title: 'Verse Explanations',
                    description: 'When users tap on any verse, GPT-4 generates a concise explanation covering historical context, theological meaning, and practical application.',
                    example: 'Juan 3:16 → Explains God\'s love, eternal life, and what it means to "believe"'
                  },
                  {
                    title: 'Daily Devotional Generator',
                    description: 'Creates personalized devotionals with: verse selection, reflection, prayer, and action item for the day.',
                    example: 'Generates fresh devotional content based on reading plan progress'
                  },
                  {
                    title: 'Mood-Based Verse Finder',
                    description: '8 emotion categories (happy, sad, anxious, etc.) that return 3-4 relevant verses with explanations of why each helps.',
                    example: 'Feeling anxious → Returns Philippians 4:6-7, Psalm 23, Matthew 6:34'
                  }
                ].map((feature, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-amber-200">
                    <h3 className="text-xl font-medium text-black mb-3">{feature.title}</h3>
                    <p className="text-gray-600 font-light mb-4">{feature.description}</p>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <code className="text-sm text-amber-800">{feature.example}</code>
                    </div>
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
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 lg:p-12 rounded-2xl">
                  <h3 className="text-2xl font-light mb-6">Development Speed</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Complete app from concept to App Store in 2 weeks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>8 AI-powered features fully functional</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>iPad support with share sheet fixes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Production-ready code, not prototype</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-8 lg:p-12 rounded-2xl">
                  <h3 className="text-2xl font-light text-black mb-6">Technical Achievements</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>5MB Bible database with instant search</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>Streaming AI responses for smooth UX</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>Share sheet pre-warming for instant sharing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>Debug logging hidden in production builds</span>
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
                Ready to build your AI app?
              </h2>
              <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                We build production-ready AI applications in 2-4 weeks. Religious apps, consumer apps, enterprise solutions—we&apos;ve done it all.
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
