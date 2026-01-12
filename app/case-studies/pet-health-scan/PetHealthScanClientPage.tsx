"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, Zap, Code2, Video, Camera, Eye, Heart, Activity, FileText, Dog } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PetHealthScanClientPage() {
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
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    Video AI
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Pet Health
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  Pet Health Scan
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  AI-Powered Pet Health Monitoring with Video Analysis
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  An iOS app that uses AI video and image analysis to help pet owners perform preliminary
                  health checks on their dogs and cats. Analyzes gait, teeth, eyes, and skin with urgency
                  levels and vet discussion questions.
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: '2 weeks', label: 'Development' },
                    { value: '4', label: 'Check Types' },
                    { value: '2', label: 'AI Models' },
                    { value: 'Real-time', label: 'Video Analysis' }
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
                <div className="aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center">
                  <Dog className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">Video Analysis</div>
                      <div className="text-xs text-gray-500">Gait Detection AI</div>
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
                    title: 'Early Detection',
                    description: 'Pet owners often miss early signs of health issues. By the time they notice problems, conditions may have progressed significantly.'
                  },
                  {
                    title: 'Video Analysis Complexity',
                    description: 'Analyzing pet movement requires real-time video processing—a technically challenging task that most apps avoid.'
                  },
                  {
                    title: 'Non-Diagnostic Guidance',
                    description: 'Provide helpful health insights while clearly communicating this is not a replacement for veterinary care.'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-emerald-600 font-light text-xl">{i + 1}</span>
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
                We built a native iOS app with multi-model AI routing—using GPT-5-mini for image analysis
                and Gemini 3.0 Flash for video analysis of pet movement and gait.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { icon: Activity, title: 'Gait Analysis', desc: 'Video-based movement check' },
                  { icon: Eye, title: 'Eye Check', desc: 'Photo-based eye analysis' },
                  { icon: Heart, title: 'Teeth Check', desc: 'Dental health imaging' },
                  { icon: Camera, title: 'Skin Check', desc: 'Coat and skin analysis' },
                  { icon: Video, title: 'Quality Scoring', desc: 'Blur & brightness detection' },
                  { icon: FileText, title: 'PDF Export', desc: 'Shareable health reports' },
                  { icon: Dog, title: 'Pet Profiles', desc: 'Dogs, cats, and more' },
                  { icon: Zap, title: 'Urgency Levels', desc: '3-tier recommendation system' }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <feature.icon className="w-8 h-8 text-emerald-600 mb-3" />
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
                    { category: 'Frontend', items: ['Swift 5.9', 'SwiftUI', 'iOS 17+', 'SwiftData'] },
                    { category: 'AI Models', items: ['GPT-5-mini (images)', 'Gemini 3.0 Flash (video)', 'Multi-model routing', 'Confidence scoring'] },
                    { category: 'Camera', items: ['AVFoundation', 'Quality analysis', 'Video compression', 'Guided capture'] },
                    { category: 'Backend', items: ['Firebase Auth', 'Firebase Analytics', 'OpenAI API', 'Gemini API'] }
                  ].map((stack, i) => (
                    <div key={i}>
                      <div className="text-emerald-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
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

        {/* Check Types Deep Dive */}
        <section className="bg-emerald-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Four Health Check Types</h2>

              <div className="space-y-8">
                {[
                  {
                    title: 'Gait Analysis (Video)',
                    description: 'The flagship feature. Pet owners record their pet walking, and Gemini 3.0 Flash analyzes the video for limping, stiffness, asymmetry, or other movement abnormalities.',
                    example: 'Dog walking video → Detects slight favoring of right rear leg → Suggests "Schedule a Vet Visit"',
                    model: 'Gemini 3.0 Flash'
                  },
                  {
                    title: 'Eye Analysis (Photo)',
                    description: 'Users take photos of their pet\'s eyes. GPT-5-mini analyzes for cloudiness, redness, discharge, or other visible concerns.',
                    example: 'Cat eye photo → Observes slight cloudiness → Provides questions for vet discussion',
                    model: 'GPT-5-mini'
                  },
                  {
                    title: 'Teeth Check (Photo)',
                    description: 'Dental health imaging that identifies tartar buildup, gum inflammation, or broken teeth. Includes guidance on dental care.',
                    example: 'Dog teeth photo → Detects tartar buildup → Recommends dental cleaning discussion',
                    model: 'GPT-5-mini'
                  },
                  {
                    title: 'Skin Analysis (Photo)',
                    description: 'Analyzes coat condition, hot spots, rashes, or parasites. Particularly useful for catching early skin conditions.',
                    example: 'Dog skin photo → Identifies potential hot spot → Suggests monitoring + hygiene tips',
                    model: 'GPT-5-mini'
                  }
                ].map((check, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-emerald-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-medium text-black">{check.title}</h3>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {check.model}
                      </span>
                    </div>
                    <p className="text-gray-600 font-light mb-4">{check.description}</p>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <code className="text-sm text-emerald-800">{check.example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Urgency System */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Three-Tier Urgency System</h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    level: 'Monitor at Home',
                    color: 'bg-green-100 text-green-800 border-green-200',
                    description: 'No immediate concerns detected. The app provides tips for ongoing monitoring and what changes to watch for.'
                  },
                  {
                    level: 'Schedule a Vet Visit',
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    description: 'Something worth professional evaluation, but not urgent. Includes specific questions to ask your veterinarian.'
                  },
                  {
                    level: 'See a Vet Soon',
                    color: 'bg-red-100 text-red-800 border-red-200',
                    description: 'Potential concern that warrants prompt attention. Clear guidance on what the vet should examine.'
                  }
                ].map((tier, i) => (
                  <div key={i} className={`p-8 rounded-2xl border ${tier.color}`}>
                    <h3 className="text-xl font-medium mb-4">{tier.level}</h3>
                    <p className="font-light">{tier.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Results & Impact</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8 lg:p-12 rounded-2xl">
                  <h3 className="text-2xl font-light mb-6">Technical Achievements</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Real-time video analysis with Gemini 3.0</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Multi-model AI routing (GPT for images, Gemini for video)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>Image quality scoring before analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>PDF export for vet visits</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-200">
                  <h3 className="text-2xl font-light text-black mb-6">Why It Matters</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span>Video AI for movement analysis is cutting-edge</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span>Demonstrates multi-model architecture in production</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span>Empowers pet owners with early health insights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Code2 className="w-5 h-5 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span>Facilitates better vet conversations with prepared questions</span>
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
                Need video analysis AI for your app?
              </h2>
              <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                We build AI apps that analyze video in real-time. Health, fitness, security, or any domain—we have the expertise.
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
