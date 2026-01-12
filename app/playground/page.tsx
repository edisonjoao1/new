"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Play, ExternalLink, Smartphone, MessageSquare, DollarSign, Camera, Utensils, Dumbbell, GraduationCap, Brain } from 'lucide-react'
import { useState } from 'react'

const demos = [
  {
    id: 'voice-ai',
    title: 'Voice AI Chat',
    description: 'Real-time voice conversation powered by OpenAI Realtime API. Natural speech recognition with context-aware responses.',
    icon: MessageSquare,
    gradient: 'from-pink-500 to-purple-500',
    category: 'Voice AI',
    url: 'https://apps.apple.com/us/app/shegpt/id6744063469',
    features: ['Natural Speech', 'Real-time Processing', 'Context Aware', 'Emotion Detection'],
    stats: { users: '50K+', rating: '4.8', speed: '< 1s response' }
  },
  {
    id: 'expense-tracker',
    title: 'AI Expense Tracking',
    description: 'Snap receipts and get instant categorization with AI. Smart budgeting insights and spending patterns.',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500',
    category: 'Fintech',
    url: 'https://apps.apple.com/us/app/moneylyze-ai-expense-tracker/id6738390260',
    features: ['Smart Categories', 'Instant Analysis', 'Budget Insights', 'Spending Patterns'],
    stats: { users: '10K+', rating: '4.8', speed: 'Instant' }
  },
  {
    id: 'nutrition',
    title: 'Nutrition Scanner',
    description: 'Photo-to-nutrition analysis in real-time. Comprehensive macro breakdown and meal tracking with AI vision.',
    icon: Camera,
    gradient: 'from-teal-500 to-cyan-500',
    category: 'Health',
    url: 'https://apps.apple.com/us/app/nutrivision-ai-calorie-counter/id6738401913',
    features: ['Photo Analysis', 'Macro Breakdown', 'Meal Tracking', '1M+ meals analyzed'],
    stats: { users: '25K+', rating: '4.7', speed: '< 2s scan' }
  },
  {
    id: 'workout',
    title: 'AI Workout Planner',
    description: 'Personalized fitness plans that adapt to your progress. AI-generated workouts with real-time adjustments.',
    icon: Dumbbell,
    gradient: 'from-red-500 to-orange-500',
    category: 'Fitness',
    url: 'https://apps.apple.com/us/app/workout-planner-ai/id6738405073',
    features: ['Custom Plans', 'Progress Tracking', 'Adaptive AI', '500K+ workouts'],
    stats: { users: '50K+', rating: '4.9', speed: 'Real-time' }
  },
  {
    id: 'meal-planner',
    title: 'AI Meal Planning',
    description: 'Custom meal plans based on preferences and dietary needs. Saves hours of planning with smart suggestions.',
    icon: Utensils,
    gradient: 'from-amber-500 to-orange-500',
    category: 'Food',
    url: 'https://apps.apple.com/us/app/mealify-ai-meal-planner/id6738407656',
    features: ['Smart Recipes', 'Dietary Preferences', 'Shopping Lists', '5 hrs saved/week'],
    stats: { users: '15K+', rating: '4.6', speed: 'Instant' }
  },
  {
    id: 'studymate',
    title: 'AI Study Assistant',
    description: 'Personalized study plans and practice questions. AI tutor that adapts to your learning style.',
    icon: GraduationCap,
    gradient: 'from-violet-500 to-purple-500',
    category: 'Education',
    url: 'https://apps.apple.com/us/app/studymate-ai-tutor/id6738415892',
    features: ['Custom Study Plans', 'Practice Questions', 'Progress Analytics', '85% grade improvement'],
    stats: { users: '20K+', rating: '4.7', speed: 'Instant' }
  },
  {
    id: 'fit-ai',
    title: 'AI Fitness Companion',
    description: 'Personalized coaching and real-time form feedback. Computer vision analyzes your movements.',
    icon: Brain,
    gradient: 'from-blue-500 to-indigo-500',
    category: 'Fitness',
    url: 'https://apps.apple.com/us/app/fit-ai-your-ai-fitness-coach/id6738411208',
    features: ['Form Analysis', 'Real-time Feedback', 'Personal Coach', '3x adherence'],
    stats: { users: '30K+', rating: '4.8', speed: 'Real-time' }
  },
  {
    id: 'multilingual',
    title: 'Spanish AI Assistant',
    description: 'Spanish-first AI experience for Latin American markets. Culturally adapted conversations and support.',
    icon: MessageSquare,
    gradient: 'from-orange-500 to-yellow-500',
    category: 'Multilingual',
    url: 'https://apps.apple.com/us/app/inteligencia-artificial/id6742691248',
    features: ['Spanish-First', 'Cultural Context', '12 Countries', '100K+ users'],
    stats: { users: '100K+', rating: '4.7', speed: 'Instant' }
  }
]

export default function PlaygroundPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(demos.map(d => d.category)))]
  const filteredDemos = selectedCategory === 'All'
    ? demos
    : demos.filter(d => d.category === selectedCategory)

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
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6 font-light">
              Interactive Demos
            </p>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
              Try Our AI
              <br />
              <span className="italic font-serif">Live</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
              These are real production apps serving thousands of users daily.
              Click any demo to experience our AI capabilities firsthand—from voice conversations to computer vision.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Demos Grid */}
        <section className="max-w-[1600px] mx-auto px-12 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDemos.map((demo, index) => (
              <motion.a
                key={demo.id}
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Gradient glow on hover */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-br ${demo.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl`}
                />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${demo.gradient} rounded-2xl flex items-center justify-center`}>
                      <demo.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      <Play className="w-3 h-3 text-gray-600" />
                      <span className="text-xs uppercase tracking-wider text-gray-600 font-light">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-light">
                    {demo.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-light tracking-tight text-black mb-3 group-hover:text-gray-700 transition-colors">
                    {demo.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                    {demo.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-6 text-xs text-gray-500">
                    <div>
                      <span className="font-normal text-black">{demo.stats.users}</span> users
                    </div>
                    <div className="h-3 w-px bg-gray-200" />
                    <div>
                      <span className="font-normal text-black">{demo.stats.rating}</span> rating
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {demo.features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-50 text-xs text-gray-600 rounded-full font-light"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-light pt-4 border-t border-gray-100">
                    <span className={`bg-gradient-to-r ${demo.gradient} bg-clip-text text-transparent font-normal`}>
                      Try it now
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[1600px] mx-auto px-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-black p-12 md:p-16 text-center"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-white tracking-tight">
                Want a custom demo?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
                We can build a working prototype in 1-2 weeks to showcase what's possible for your use case
              </p>
              <button
                onClick={() => setIsPlanOpen(true)}
                className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full text-base font-light transition-all"
              >
                Get Your Prototype
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
