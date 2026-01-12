"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { sections, navSections, Section } from './sections'

// Loading Screen
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className="text-white/60 text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// Sparkles Component
function Sparkles({ count = 30 }: { count?: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central burst effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`burst-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [0, Math.cos((i * 30 * Math.PI) / 180) * 150],
              y: [0, Math.sin((i * 30 * Math.PI) / 180) * 150],
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Floating sparkles */}
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/80">
            <path d="M6 0L6.5 4.5L11 5L6.5 5.5L6 10L5.5 5.5L1 5L5.5 4.5L6 0Z" fill="currentColor" />
          </svg>
        </motion.div>
      ))}

      {/* Glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Sidebar Component
function Sidebar({ activeSection }: { activeSection: string }) {
  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen w-[200px] z-40 hidden lg:flex flex-col justify-between py-20 px-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Top: Edition Title */}
      <div>
        <a href="#hero" className="block group">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            <h2 className="text-[13px] font-medium leading-[1.3] tracking-tight">
              <span className="block text-white/90">The</span>
              <span className="block text-white/90">
                <span className="font-serif">AI</span>
                <span className="font-serif italic text-white"> Renaissance</span>
              </span>
              <span className="block text-white/90">Edition</span>
            </h2>
          </motion.div>
        </a>
      </div>

      {/* Middle: Navigation */}
      <nav className="flex-1 flex items-center">
        <ul className="space-y-0.5 w-full">
          {navSections.map((section, index) => (
            <motion.li
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
            >
              <a
                href={`#${section.id}`}
                className={`flex items-center justify-between py-[3px] text-[13px] transition-all duration-300 group ${
                  activeSection === section.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span className={`transition-all duration-300 ${activeSection === section.id ? 'font-medium' : 'font-normal'}`}>
                  {section.title}
                </span>
                <span className="flex-1 mx-2 border-b border-dotted border-current opacity-40" />
                <span className="font-serif text-[11px] tracking-wide">{section.roman}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Bottom: Footer Links */}
      <motion.div
        className="text-[11px] text-white/30 space-y-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <p className="font-medium text-white/40">AI 4U Labs</p>
        <p>
          <Link href="/" className="hover:text-white/50 transition-colors">
            Back to Home
          </Link>
        </p>
        <p>
          <Link href="/case-studies" className="hover:text-white/50 transition-colors">
            Case Studies
          </Link>
        </p>
      </motion.div>
    </motion.aside>
  )
}

// Hero Section
function HeroSection({ section }: { section: Section }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section id="hero" ref={containerRef} className="relative h-screen w-full overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${section.image})` }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)' }}
          />
        </div>
      </motion.div>

      <Sparkles count={40} />

      {/* Title Card */}
      <motion.div className="absolute z-20 top-[15%] left-1/2 -translate-x-1/2 lg:ml-[100px]" style={{ opacity }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        >
          <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-serif font-normal leading-[1.1] tracking-tight text-white">
            <motion.span className="block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              The
            </motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <span>AI</span>
              <span className="italic"> Renaissance</span>
            </motion.span>
            <motion.span className="block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              Edition
            </motion.span>
          </h1>
        </motion.div>
      </motion.div>

      {/* Description */}
      <motion.div className="absolute z-20 top-[45%] left-8 lg:left-[200px] max-w-[280px]" style={{ opacity }}>
        <motion.p
          className="text-[13px] text-white/70 leading-relaxed mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {section.description}
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:ml-[100px] z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[11px] text-white/50 uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 to-transparent z-10" />
    </section>
  )
}

// Content Section
function ContentSection({ section, index }: { section: Section; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05])
  const titleY = useTransform(scrollYProgress, [0.2, 0.5], ['20%', '0%'])
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])

  return (
    <section id={section.id} ref={containerRef} className="relative min-h-screen" style={{ scrollSnapAlign: 'start' }}>
      {/* Dark Hero Part */}
      <div className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${section.image})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%),
                linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)
              `,
            }}
          />
        </motion.div>

        <Sparkles count={20} />

        {/* Section Title */}
        <div className="relative z-10 h-full flex items-center justify-center lg:pl-[200px]">
          <motion.div className="text-center px-4" style={{ y: titleY, opacity: titleOpacity }}>
            <motion.h2
              className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-serif font-normal leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {section.title}
            </motion.h2>
            {section.tagline && (
              <motion.p
                className="text-lg md:text-xl text-white/60 mt-4 font-light tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {section.tagline}
              </motion.p>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#f5f1eb] to-transparent z-10" />
      </div>

      {/* Cream Content Part */}
      <div ref={contentRef} className="bg-[#f5f1eb] text-[#1a1a1a] py-20 md:py-32 px-6 md:px-12 lg:pl-[200px]">
        <div className="max-w-4xl mx-auto">
          {/* Large Description with drop cap */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-serif leading-[1.3] tracking-tight">
              <span className="float-left text-[4rem] md:text-[5rem] leading-[0.8] mr-3 mt-1 font-serif">
                {section.description.charAt(0)}
              </span>
              {section.description.slice(1)}
            </p>
          </motion.div>

          {/* Features Grid */}
          {section.features && (
            <div className="grid md:grid-cols-2 gap-8">
              {section.features.map((feature, i) => (
                <motion.article
                  key={i}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  whileHover={{ y: -4 }}
                >
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-[#1a1a1a] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-4 flex-grow">{feature.description}</p>

                  {feature.url && (
                    <Link
                      href={feature.url}
                      target={feature.url.startsWith('mailto:') ? undefined : feature.url.startsWith('/') ? undefined : '_blank'}
                      className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-[#1a1a1a]/20 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 w-fit"
                    >
                      {feature.urlType === 'app' ? (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          App Store
                        </>
                      ) : feature.urlType === 'email' ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Get in Touch
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Learn More
                        </>
                      )}
                    </Link>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function DesignClientPage() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')
  const heroSection = sections[0]

  useEffect(() => {
    // Override body styles
    document.body.style.background = '#0a0a0a'
    document.body.style.color = '#ffffff'
    document.body.style.overflowX = 'hidden'
    document.documentElement.style.scrollBehavior = 'smooth'
    document.documentElement.style.scrollSnapType = 'y proximity'

    return () => {
      document.body.style.background = ''
      document.body.style.color = ''
      document.body.style.overflowX = ''
      document.documentElement.style.scrollBehavior = ''
      document.documentElement.style.scrollSnapType = ''
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [loading])

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <AnimatePresence mode="wait">{loading && <LoadingScreen onComplete={() => setLoading(false)} />}</AnimatePresence>

      <motion.main
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Sidebar activeSection={activeSection} />

        <HeroSection section={heroSection} />

        {navSections.map((section, index) => (
          <ContentSection key={section.id} section={section} index={index} />
        ))}

        {/* Footer CTA Section */}
        <section className="bg-[#0a0a0a] py-32 px-8 lg:pl-[200px]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Let&apos;s build <span className="italic">something great</span>
            </motion.h2>
            <motion.p
              className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Million-dollar apps. 90% less resources. Shipped in weeks. Ready to start your project?
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.a
                href="mailto:edison@ai4u.space"
                className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-white/90 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </motion.a>
              <Link
                href="/case-studies"
                className="border border-white/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/5 transition-all duration-300 text-white"
              >
                View Case Studies
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 px-8 lg:pl-[200px]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <span className="text-black text-xs font-bold">AI</span>
              </div>
              <span className="font-medium text-sm text-white">AI 4U Labs</span>
            </div>
            <div className="flex gap-8 text-sm text-white/40">
              <Link href="/" className="hover:text-white/70 transition-colors duration-200">
                Home
              </Link>
              <Link href="/case-studies" className="hover:text-white/70 transition-colors duration-200">
                Case Studies
              </Link>
              <Link href="/services" className="hover:text-white/70 transition-colors duration-200">
                Services
              </Link>
              <a
                href="https://apps.apple.com/us/developer/edison-espinosa/id1368707952"
                target="_blank"
                className="hover:text-white/70 transition-colors duration-200"
              >
                App Store
              </a>
            </div>
            <p className="text-sm text-white/30">AI Development Studio • Naples, FL</p>
          </div>
        </footer>
      </motion.main>
    </>
  )
}
