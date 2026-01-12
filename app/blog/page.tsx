"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getBlogImage, getCategoryGradient, getPlaceholderColor } from '@/lib/blog/images'
import { NewsletterSignup } from '@/components/NewsletterSignup'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readingTime: number
  keywords?: string[]
  featured?: boolean
  image?: string
}

export default function BlogPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/blog/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory)

  const featuredPost = posts.find(p => p.featured) || posts[0]
  const remainingPosts = filteredPosts.filter(p => p.slug !== featuredPost?.slug)

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
              Insights & Ideas
            </p>

            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
                  Blog &
                  <br />
                  <span className="italic font-serif">Insights</span>
                </h1>
              </div>
              <div className="flex items-end">
                <p className="text-xl text-gray-600 font-light leading-relaxed">
                  Practical advice on AI development, app architecture, and building products that ship.
                  From our experience shipping 35+ apps to 1M+ users.
                </p>
              </div>
            </div>
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

        {loading ? (
          <section className="max-w-[1600px] mx-auto px-12 pb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 h-64 rounded-2xl mb-4" />
                  <div className="bg-gray-100 h-4 w-24 rounded mb-3" />
                  <div className="bg-gray-100 h-6 w-3/4 rounded mb-2" />
                  <div className="bg-gray-100 h-4 w-full rounded" />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && selectedCategory === 'All' && (
              <section className="max-w-[1600px] mx-auto px-12 pb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <article className="group relative grid lg:grid-cols-2 gap-0 bg-black rounded-3xl overflow-hidden">
                      {/* Left: Content */}
                      <div className="flex flex-col justify-center p-12 lg:p-16 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="px-4 py-1.5 bg-white text-black text-xs uppercase tracking-wider rounded-full font-medium">
                            Featured
                          </span>
                          <span className="text-xs uppercase tracking-wider text-gray-400 font-light">
                            {featuredPost.category}
                          </span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white mb-6 group-hover:text-gray-200 transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>

                        <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-light">
                              {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-light">{featuredPost.readingTime} min read</span>
                          </div>
                        </div>

                        {/* Read More Button */}
                        <div className="mt-8 flex items-center gap-3 text-white group/btn">
                          <span className="text-sm font-light tracking-wide group-hover:underline underline-offset-4">
                            Read Article
                          </span>
                          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Right: Image */}
                      <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                        {/* Main Image */}
                        <div className="absolute inset-0">
                          <Image
                            src={featuredPost.image || getBlogImage(featuredPost.category, featuredPost.keywords || [], featuredPost.slug)}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                          />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent lg:opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category Accent Line */}
                        <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${getCategoryGradient(featuredPost.category).from} ${getCategoryGradient(featuredPost.category).to}`} />

                        {/* Floating Category Badge */}
                        <div className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
                          <span className="text-xs text-white font-light uppercase tracking-wider">
                            {featuredPost.category}
                          </span>
                        </div>

                        {/* Corner Decoration */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
                          <div className="absolute bottom-4 right-4 w-full h-full border-r-2 border-b-2 border-white/30 rounded-br-3xl" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              </section>
            )}

            {/* Posts Grid */}
            <section className="max-w-[1600px] mx-auto px-12 pb-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post, index) => {
                  const gradient = getCategoryGradient(post.category)
                  return (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <article className="group h-full flex flex-col">
                          {/* Image Container */}
                          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 group-hover:shadow-xl transition-all duration-500">
                            {/* Background Image */}
                            <Image
                              src={post.image || getBlogImage(post.category, post.keywords || [], post.slug)}
                              alt={post.title}
                              fill
                              className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Multi-layer Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity duration-500`} />

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                              {/* Category badge */}
                              <span className={`px-3 py-1.5 ${gradient.accent} text-white text-xs uppercase tracking-wider rounded-full font-medium shadow-lg`}>
                                {post.category}
                              </span>

                              {/* Reading time */}
                              <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white/90 text-xs rounded-full font-light flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                {post.readingTime} min
                              </span>
                            </div>

                            {/* Bottom Hover Reveal */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                              <div className="flex items-center justify-between">
                                <span className="text-white/80 text-xs font-light">
                                  {new Date(post.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                                <div className="flex items-center gap-2 text-white text-sm">
                                  <span className="font-light">Read</span>
                                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Accent Line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient.from} ${gradient.to} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col">
                            <h3 className="text-xl font-light tracking-tight text-black mb-3 group-hover:text-gray-600 transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4 flex-1 line-clamp-3">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span className="font-light">
                                  {new Date(post.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>

                              <span className="text-sm font-light text-black flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </>
        )}

        {/* Newsletter Section */}
        <section className="max-w-[1600px] mx-auto px-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <NewsletterSignup />
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[1600px] mx-auto px-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-black p-12 md:p-16"
          >
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-light mb-4 text-white tracking-tight">
                  Want us to build
                  <br />
                  <span className="italic font-serif">your AI product?</span>
                </h2>
                <p className="text-xl text-gray-300 font-light">
                  From concept to production in days, not months.
                  If we miss our timeline, it's free.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <button
                  onClick={() => setIsPlanOpen(true)}
                  className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full text-base font-light transition-all"
                >
                  Start a Project
                </button>
                <Link href="/case-studies">
                  <button className="border border-white/30 hover:border-white text-white px-8 py-4 rounded-full text-base font-light transition-all">
                    View Case Studies
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
