"use client"

import { motion } from 'framer-motion'
import { ExternalLink, Users, Star, TrendingUp, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const products = [
  {
    name: 'SheGPT',
    tagline: 'AI assistant for women',
    description: 'Voice-powered AI featuring OpenAI Realtime API. Shipped in 6 days from concept to App Store.',
    users: '50K+',
    rating: 4.8,
    category: 'Mobile AI',
    gradient: 'from-pink-500 to-purple-500',
    appStore: 'https://apps.apple.com',
    highlight: '6 days to ship'
  },
  {
    name: 'Inteligencia Artificial Gratis',
    tagline: 'Spanish-first AI for LATAM',
    description: 'Multilingual AI app serving 100K+ users across 12 Latin American countries.',
    users: '100K+',
    rating: 4.7,
    category: 'Multilingual',
    gradient: 'from-orange-500 to-yellow-500',
    appStore: 'https://apps.apple.com',
    highlight: '12 countries'
  },
  {
    name: 'Moneylyze',
    tagline: 'AI expense tracking',
    description: 'Intelligent categorization and insights. Helping users save $250/month on average.',
    users: '10K+',
    rating: 4.8,
    category: 'Fintech',
    gradient: 'from-green-500 to-emerald-500',
    appStore: 'https://apps.apple.com/us/app/moneylyze-ai-expense-tracker/id6738390260',
    highlight: '$250/mo avg savings'
  },
  {
    name: 'Nutrivision AI',
    tagline: 'Nutrition from photos',
    description: 'Snap your meals, get instant nutrition analysis. 1M+ meals analyzed with 94% accuracy.',
    users: '25K+',
    rating: 4.7,
    category: 'Health',
    gradient: 'from-teal-500 to-cyan-500',
    appStore: 'https://apps.apple.com/us/app/nutrivision-ai-calorie-counter/id6738401913',
    highlight: '1M+ meals analyzed'
  },
  {
    name: 'Workout Planner AI',
    tagline: 'Personalized fitness plans',
    description: 'AI-generated workout plans that adapt to your progress. 78% completion rate.',
    users: '50K+',
    rating: 4.9,
    category: 'Fitness',
    gradient: 'from-red-500 to-orange-500',
    appStore: 'https://apps.apple.com/us/app/workout-planner-ai/id6738405073',
    highlight: '500K+ workouts'
  },
  {
    name: 'Mealify AI',
    tagline: 'AI meal planning',
    description: 'Custom meal plans based on preferences and dietary needs. Saves 5 hours/week.',
    users: '15K+',
    rating: 4.6,
    category: 'Food',
    gradient: 'from-amber-500 to-orange-500',
    appStore: 'https://apps.apple.com/us/app/mealify-ai-meal-planner/id6738407656',
    highlight: '5 hrs saved/week'
  },
  {
    name: 'Fit AI',
    tagline: 'AI fitness companion',
    description: 'Personalized coaching and real-time form feedback. 3x better adherence than traditional apps.',
    users: '30K+',
    rating: 4.8,
    category: 'Fitness',
    gradient: 'from-blue-500 to-indigo-500',
    appStore: 'https://apps.apple.com/us/app/fit-ai-your-ai-fitness-coach/id6738411208',
    highlight: '3x adherence'
  },
  {
    name: 'Studymate AI',
    tagline: 'AI study assistant',
    description: 'Personalized study plans and practice questions. Improved grades for 85% of users.',
    users: '20K+',
    rating: 4.7,
    category: 'Education',
    gradient: 'from-violet-500 to-purple-500',
    appStore: 'https://apps.apple.com/us/app/studymate-ai-tutor/id6738415892',
    highlight: '85% grade improvement'
  },
  {
    name: 'Conversational Payments',
    tagline: 'Money transfer via chat',
    description: 'Cross-platform payment system in ChatGPT, Claude, and WhatsApp. $250K+ processed.',
    users: 'B2B',
    rating: null,
    category: 'AI + Fintech',
    gradient: 'from-blue-500 to-cyan-500',
    appStore: null,
    highlight: '$250K+ processed'
  }
]

export function ProductGrid() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null)

  return (
    <section className="bg-gray-50 py-32">
      <div className="max-w-[1600px] mx-auto px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="h-px w-16 bg-black mb-8" />
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                Our Products
              </p>
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-black">
                10+ Apps
                <br />
                in Production
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-xl leading-relaxed text-gray-600 font-light">
                From health and fitness to finance and education.
                All powered by AI. MCP servers, conversational payments, mobile apps, and more.
                <span className="block mt-4 text-black font-normal">1M+ total users · Pioneering since 2023</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group relative h-[420px] perspective-1000"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCard === product.name ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setFlippedCard(flippedCard === product.name ? null : product.name)}
              >
                {/* Front of card */}
                <div className="absolute inset-0 bg-white rounded-2xl p-8 shadow-lg backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient} rounded-t-2xl`} />

                  {/* Content */}
                  <div className="relative h-full flex flex-col">
                    {/* Category badge */}
                    <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs uppercase tracking-wider text-gray-600 mb-4 self-start">
                      {product.category}
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-light tracking-tight text-black mb-2">
                      {product.name}
                    </h3>

                    {/* Tagline */}
                    <p className={`text-sm font-semibold mb-3 bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                      {product.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-base text-gray-600 leading-relaxed mb-6 font-light">
                      {product.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 font-medium">{product.users}</span>
                      </div>
                      {product.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-700 font-medium">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Highlight */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                      <TrendingUp className="w-4 h-4" />
                      <span>{product.highlight}</span>
                    </div>

                    {/* Click to flip hint */}
                    <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                      <span className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <span>Click to flip</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl backface-hidden border-2"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderColor: `${product.gradient.includes('pink') ? '#ec4899' : product.gradient.includes('purple') ? '#a855f7' : product.gradient.includes('blue') ? '#3b82f6' : '#10b981'}`
                  }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient} rounded-t-2xl`} />

                  <div className="h-full flex flex-col">
                    <div className={`inline-block px-3 py-1 mb-4 bg-gradient-to-r ${product.gradient} text-white text-xs font-bold rounded-full self-start`}>
                      {product.category}
                    </div>

                    <h3 className="text-2xl font-normal text-black mb-3 tracking-tight">
                      {product.name}
                    </h3>

                    <p className="text-base text-gray-700 leading-relaxed mb-6 font-light flex-grow">
                      {product.description}
                    </p>

                    {/* Detailed stats on back */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Users</span>
                        <span className="font-semibold text-black">{product.users}</span>
                      </div>
                      {product.rating && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-semibold text-black flex items-center gap-1">
                            {product.rating} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Impact</span>
                        <span className="font-semibold text-black">{product.highlight}</span>
                      </div>
                    </div>

                    {/* Link on back */}
                    {product.appStore && (
                      <a
                        href={product.appStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full py-3 px-4 bg-gradient-to-r ${product.gradient} text-white rounded-xl font-medium text-center hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        <span>View in App Store</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Click to flip back hint */}
                    <div className="mt-4 text-center">
                      <span className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <ArrowRight className="w-3 h-3 rotate-180" />
                        <span>Click to flip back</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 pt-16 border-t border-gray-200 text-center"
        >
          <p className="text-lg text-gray-600 font-light">
            All products built and shipped <span className="text-black font-normal">since the beginning</span>
            {' '}• Average time to market: <span className="text-black font-normal">2-4 weeks</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
