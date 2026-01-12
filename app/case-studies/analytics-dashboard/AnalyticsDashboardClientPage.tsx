"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowRight, BarChart3, Brain, Zap, TrendingUp, Eye, Sparkles, Target, LineChart, PieChart, Activity } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AnalyticsDashboardClientPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

          {/* Animated data visualization background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <motion.div
              className="absolute top-20 left-10 w-64 h-64 border border-white/30 rounded-lg"
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-40 right-20 w-48 h-48 border border-white/30 rounded-lg"
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-1/4 w-32 h-32 border border-white/30 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  AI Analytics
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  Predictive Intelligence
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  1 Day Build
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-white mb-6">
                AI Analytics Dashboard
                <br />
                <span className="text-white/80">Predict. Decide. Ship.</span>
              </h1>

              <p className="text-xl text-white/80 font-light max-w-2xl mb-12">
                Enterprise analytics teams spend months building dashboards. We built an AI-powered
                analytics platform with auto-discovery, predictive insights, and real-time intelligence—in one day.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '24', label: 'Properties Auto-Discovered' },
                  { value: '1 day', label: 'Development Time' },
                  { value: 'Real-time', label: 'Data Sync' },
                  { value: 'AI', label: 'Predictive Insights' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="text-3xl font-light text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Vision Section */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-8" />
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">The Vision</p>
                <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-black mb-6">
                  Data that thinks
                  <br />
                  <span className="text-indigo-600">ahead of you</span>
                </h2>
              </div>
              <div className="flex items-center">
                <p className="text-xl leading-relaxed text-gray-600 font-light">
                  Most analytics dashboards show you what happened. Ours tells you what&apos;s about to happen.
                  We built an AI layer that doesn&apos;t just aggregate data—it interprets patterns, predicts trends,
                  and recommends actions. The difference between reporting and intelligence.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* The Challenge */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">The Challenge</p>
              <h2 className="text-4xl font-light tracking-tight text-black mb-12">
                What enterprise teams struggle with
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: PieChart,
                    title: 'Fragmented Data',
                    description: 'Multiple GA4 properties across apps, websites, and products—each requiring separate logins and manual aggregation.'
                  },
                  {
                    icon: Activity,
                    title: 'Reactive Insights',
                    description: 'Traditional dashboards show historical data. By the time you see a trend, it\'s already too late to act.'
                  },
                  {
                    icon: Target,
                    title: 'Decision Paralysis',
                    description: 'Drowning in metrics but starving for actionable intelligence. Data scientists spend 80% of time on prep, not insights.'
                  }
                ].map((challenge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="bg-white p-8 rounded-2xl border border-gray-200"
                  >
                    <challenge.icon className="w-10 h-10 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-medium text-black mb-3">{challenge.title}</h3>
                    <p className="text-gray-600 font-light">{challenge.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Solution */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">The Solution</p>
            <h2 className="text-4xl font-light tracking-tight text-black mb-6">
              AI-powered analytics that works for you
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl mb-16">
              We built a unified command center for all your analytics—with AI that automatically
              discovers properties, surfaces insights, and predicts what&apos;s coming next.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'Auto-Discovery Engine',
                  description: 'Connect once. Our AI scans your Google Analytics account and automatically discovers all properties—24 in our case. No manual setup, no missed data sources.',
                  highlight: '24 properties found instantly'
                },
                {
                  icon: Brain,
                  title: 'Predictive Intelligence',
                  description: 'Machine learning models analyze your historical data to forecast traffic, conversions, and user behavior. Know what\'s coming before it happens.',
                  highlight: 'Trend prediction + anomaly detection'
                },
                {
                  icon: TrendingUp,
                  title: 'Smart Comparisons',
                  description: 'Automatically compare performance across properties, time periods, and user segments. AI highlights what matters and why.',
                  highlight: 'Cross-property benchmarking'
                },
                {
                  icon: Zap,
                  title: 'Real-Time Intelligence',
                  description: 'Live data feeds with AI-powered alerts. Get notified when metrics deviate from predicted ranges—not just arbitrary thresholds.',
                  highlight: 'Intelligent alerting'
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <feature.icon className="w-10 h-10 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-medium text-black mb-3">{feature.title}</h3>
                    <p className="text-gray-600 font-light mb-4">{feature.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      {feature.highlight}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* The AI Advantage */}
        <section className="bg-black text-white py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">The AI Advantage</p>
              <h2 className="text-4xl lg:text-5xl font-light tracking-tight mb-16">
                From data to decisions
                <br />
                <span className="text-indigo-400">in seconds, not weeks</span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800 rounded-2xl overflow-hidden">
                {[
                  {
                    title: 'Predict User Churn',
                    description: 'AI identifies users likely to churn before they leave. Intervene with targeted campaigns while there\'s still time.',
                    icon: Eye
                  },
                  {
                    title: 'Forecast Traffic',
                    description: 'Machine learning models predict traffic patterns, helping you prepare infrastructure and marketing for demand spikes.',
                    icon: LineChart
                  },
                  {
                    title: 'Optimize Features',
                    description: 'Correlate feature usage with retention and revenue. Know which features to double down on and which to sunset.',
                    icon: Target
                  },
                  {
                    title: 'Detect Anomalies',
                    description: 'AI monitors for unusual patterns—traffic drops, conversion spikes, bot activity—and alerts you immediately.',
                    icon: Activity
                  },
                  {
                    title: 'Segment Intelligence',
                    description: 'Automatically discover high-value user segments based on behavior patterns humans would never find manually.',
                    icon: PieChart
                  },
                  {
                    title: 'Revenue Attribution',
                    description: 'Multi-touch attribution powered by AI. Understand which channels and touchpoints actually drive conversions.',
                    icon: BarChart3
                  }
                ].map((capability, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="bg-black p-8 hover:bg-gray-900 transition-colors"
                  >
                    <capability.icon className="w-8 h-8 text-indigo-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">{capability.title}</h3>
                    <p className="text-gray-400 font-light text-sm">{capability.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Design Excellence */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Design Excellence</p>
                <h2 className="text-4xl font-light tracking-tight text-black mb-6">
                  Beautiful analytics
                  <br />
                  that people actually use
                </h2>
                <p className="text-xl text-gray-600 font-light mb-8">
                  Most dashboards are built by engineers for engineers. We bring product design
                  thinking to data visualization—creating interfaces that are intuitive, beautiful,
                  and actionable.
                </p>
                <ul className="space-y-4">
                  {[
                    'Dark mode optimized for long analysis sessions',
                    'Responsive design—full functionality on any device',
                    'Accessibility-first with keyboard navigation',
                    'Data density without visual clutter'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl overflow-hidden">
                  <div className="absolute inset-4 bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                    {/* Mock dashboard UI */}
                    <div className="h-12 bg-gray-800 flex items-center gap-2 px-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-3">
                      <div className="col-span-2 h-32 bg-gray-800 rounded-lg" />
                      <div className="h-32 bg-gray-800 rounded-lg" />
                      <div className="h-24 bg-gray-800 rounded-lg" />
                      <div className="h-24 bg-gray-800 rounded-lg" />
                      <div className="h-24 bg-gray-800 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tech Stack */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Tech Stack</p>
              <h2 className="text-4xl font-light tracking-tight text-black mb-12">
                Built with modern tools
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Next.js 15', category: 'Framework' },
                  { name: 'TypeScript', category: 'Language' },
                  { name: 'GA4 Data API', category: 'Analytics' },
                  { name: 'Recharts', category: 'Visualization' },
                  { name: 'Tailwind CSS', category: 'Styling' },
                  { name: 'Framer Motion', category: 'Animation' },
                  { name: 'GPT-5-mini', category: 'AI Insights' },
                  { name: 'Vercel', category: 'Deployment' },
                  { name: 'React Query', category: 'Data Fetching' },
                  { name: 'OAuth 2.0', category: 'Auth' },
                  { name: 'shadcn/ui', category: 'Components' },
                  { name: 'date-fns', category: 'Date Handling' }
                ].map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white p-4 rounded-xl border border-gray-200 text-center"
                  >
                    <div className="font-medium text-black">{tech.name}</div>
                    <div className="text-xs text-gray-500">{tech.category}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">The Impact</p>
            <h2 className="text-4xl font-light tracking-tight text-black mb-16">
              What enterprise teams spend months building,
              <br />
              <span className="text-indigo-600">we shipped in one day</span>
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '1 day', label: 'Development Time', sublabel: 'vs. 3-6 months typical' },
                { value: '24', label: 'Properties Unified', sublabel: 'Auto-discovered' },
                { value: '100%', label: 'Real-time Data', sublabel: 'No batch delays' },
                { value: '$0', label: 'Additional Tools', sublabel: 'All-in-one solution' }
              ].map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-light text-indigo-600 mb-2">{result.value}</div>
                  <div className="text-lg font-medium text-black mb-1">{result.label}</div>
                  <div className="text-sm text-gray-500">{result.sublabel}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Why This Matters */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Why This Matters</p>
              <h2 className="text-4xl lg:text-5xl font-light tracking-tight mb-8">
                Build better products
                <br />
                with better data
              </h2>
              <p className="text-xl text-white/80 font-light mb-8">
                This isn&apos;t just a dashboard—it&apos;s how we build products. Every app we ship
                is informed by AI-powered analytics. We know what users want before they ask for it.
                We predict issues before they become problems. We optimize based on data, not hunches.
              </p>
              <p className="text-xl text-white/80 font-light">
                When you work with AI 4U Labs, you get the same intelligence infrastructure
                powering your product from day one.
              </p>
            </motion.div>
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
              Ready for AI-powered
              <br />
              analytics?
            </h2>
            <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
              Whether you need a custom analytics solution or want to add predictive
              intelligence to your existing product—we can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-900 transition-colors"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-black px-8 py-4 rounded-full hover:bg-gray-50 transition-colors"
              >
                View More Case Studies
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
