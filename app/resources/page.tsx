"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Download, FileText, Calculator, Layers, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const guides = [
  {
    icon: CheckCircle2,
    title: 'AI Development Checklist',
    description: 'A 2-page checklist covering everything you need before, during, and after building an AI app. From model selection to deployment verification.',
    format: 'PDF • 2 pages',
    topics: ['Pre-development planning', 'Model selection criteria', 'Testing requirements', 'Deployment checklist', 'Post-launch monitoring'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'MVP Planning Guide',
    description: 'How to scope and ship an AI MVP in 2-4 weeks. The exact process we use to go from idea to production at record speed.',
    format: 'PDF • 8 pages',
    topics: ['Feature prioritization', 'Tech stack decisions', 'Timeline planning', 'Budget allocation', 'Launch strategy'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Calculator,
    title: 'AI Cost Calculator',
    description: 'Interactive spreadsheet to estimate your AI project costs. Includes API pricing, infrastructure, development, and ongoing maintenance.',
    format: 'Google Sheets',
    topics: ['API cost estimation', 'Infrastructure planning', 'Development budgeting', 'Monthly operating costs', 'ROI projections'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Layers,
    title: 'Model Selection Guide',
    description: 'When to use GPT-5 vs Claude vs Gemini. Decision framework based on task type, cost requirements, and performance needs.',
    format: 'PDF • 6 pages',
    topics: ['Model comparison matrix', 'Use case matching', 'Cost optimization tips', 'Multi-model strategies', 'Performance benchmarks'],
    color: 'from-orange-500 to-yellow-500'
  }
]

const articles = [
  {
    title: 'AI ROI: How Companies Are Saving 40% on Operations',
    category: 'Business',
    href: '/blog/ai-roi-companies-saving-40-percent-operations'
  },
  {
    title: 'The Complete Guide to Building MCP Servers',
    category: 'Technical',
    href: '/blog/complete-guide-building-mcp-servers'
  },
  {
    title: 'GPT-5 vs Claude Opus 4.5: Choosing the Right AI',
    category: 'Comparison',
    href: '/blog/gpt5-vs-claude-opus-choosing-right-ai'
  },
  {
    title: 'Building AI Apps That Scale to 100K+ Users',
    category: 'Guide',
    href: '/blog/building-ai-apps-scale-100k-users'
  },
  {
    title: 'From Idea to App Store in 1 Day',
    category: 'Case Study',
    href: '/blog/from-idea-to-app-store-in-1-day'
  },
  {
    title: 'RAG Systems Explained: Build Your Own Knowledge Base',
    category: 'Tutorial',
    href: '/blog/rag-systems-explained-build-your-own'
  }
]

export default function ResourcesPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleDownload = async (guideTitle: string) => {
    if (!email) {
      setSelectedGuide(guideTitle)
      return
    }

    setIsSubmitting(true)

    // In a real implementation, this would:
    // 1. Save the email to your newsletter list
    // 2. Send the guide via email or provide download link
    // For now, we simulate this
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setSelectedGuide(null)

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

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
              Resources
            </p>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
              Free guides
              <br />
              <span className="italic font-serif">
                & resources
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
              Everything we've learned from shipping 30+ AI products, distilled into actionable guides.
              No fluff—just the frameworks and checklists we actually use.
            </p>
          </motion.div>
        </section>

        {/* Success Message */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            Check your email for the download link!
          </motion.div>
        )}

        {/* Guides Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${guide.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <guide.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-light tracking-tight">{guide.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {guide.format}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {guide.description}
                  </p>
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2 font-medium">What's inside:</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download Form */}
                {selectedGuide === guide.title ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(guide.title)}
                        disabled={!email || isSubmitting}
                        className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl"
                      >
                        {isSubmitting ? 'Sending...' : 'Get Free Guide'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedGuide(null)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      We'll send the guide to your email. No spam, ever.
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedGuide(guide.title)}
                    className="w-full bg-black hover:bg-gray-800 text-white rounded-xl group-hover:scale-[1.02] transition-transform"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Free
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Articles */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="h-px w-16 bg-black mb-6" />
              <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
                Featured articles
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Deep dives into AI development, from architecture to scaling.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={article.href}>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 h-full">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-medium mt-2 mb-4 group-hover:text-gray-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        Read article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-black hover:bg-black hover:text-white"
                >
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
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
                Stay ahead of AI trends
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
                Weekly insights on AI development, new techniques, and industry trends.
                Join 2,000+ developers and founders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-black focus:outline-none"
                />
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-black rounded-full font-medium"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
