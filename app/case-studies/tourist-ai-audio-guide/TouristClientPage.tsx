"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, MapPin, Mic, Navigation, Globe, Volume2, Compass, Map, Headphones } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function TouristClientPage() {
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
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Voice AI
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Travel Tech
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  Tourist
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  AI-Powered Audio Tour Guide
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  A voice-first travel companion that generates personalized audio narrations in real-time
                  as users explore cities worldwide. Virtual tours and live GPS-triggered experiences.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: '3 weeks', label: 'Development' },
                    { value: '8', label: 'Cities' },
                    { value: '<200ms', label: 'Latency' },
                    { value: '100+', label: 'POIs' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-black">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center">
                  <Compass className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Headphones className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">OpenAI TTS</div>
                      <div className="text-xs text-gray-500">Real-time Voice</div>
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
                    title: 'Real-Time Voice',
                    description: 'Generate and play AI narrations with sub-200ms latency. Users expect instant audio when they arrive at a point of interest.'
                  },
                  {
                    title: 'Dual Experience',
                    description: 'Support both virtual tours (explore from home) and live walks (GPS-triggered narrations when physically present).'
                  },
                  {
                    title: 'Engaging Content',
                    description: 'Create narrations that feel like a knowledgeable local guide—not generic Wikipedia summaries. Multiple voice styles and depth levels.'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-blue-600 font-light text-xl">{i + 1}</span>
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
                A native iOS app with MVVM architecture, combining GPT-4o for dynamic narration and
                OpenAI TTS for natural voice synthesis over immersive 3D maps.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  { icon: Map, title: 'Virtual Tours', desc: 'Pre-built routes through major cities' },
                  { icon: Navigation, title: 'Live Walks', desc: 'GPS-triggered POI discovery' },
                  { icon: Mic, title: 'AI Narration', desc: 'GPT-4 generated stories' },
                  { icon: Volume2, title: 'Natural Voice', desc: 'OpenAI TTS synthesis' },
                  { icon: Globe, title: '8 Cities', desc: 'NYC, Paris, London, Rome...' },
                  { icon: MapPin, title: '100+ POIs', desc: 'Curated points of interest' },
                  { icon: Compass, title: '3D Maps', desc: 'Hybrid realistic elevation' },
                  { icon: Headphones, title: 'Voice Styles', desc: 'Multiple narrator personas' }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <feature.icon className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-medium text-black mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Architecture */}
              <div className="bg-black text-white rounded-2xl p-8 lg:p-12">
                <h3 className="text-2xl font-light mb-8">Architecture Overview</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { category: 'UI Layer', items: ['SwiftUI Views', 'MapKit 3D', 'AVFoundation', 'Framer Motion'] },
                    { category: 'State Management', items: ['SessionManager', 'LocationService', 'ProfileManager', 'AudioEngine'] },
                    { category: 'AI Services', items: ['GPT-4o-mini', 'OpenAI TTS', 'AIClient', 'Streaming'] },
                    { category: 'Data', items: ['POIRepository', 'Wikipedia Images', 'UserDefaults', 'JSON Tours'] }
                  ].map((stack, i) => (
                    <div key={i}>
                      <div className="text-blue-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
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

        {/* Tour Modes Section */}
        <section className="bg-blue-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Two Tour Experiences</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 lg:p-10 rounded-2xl border border-blue-200">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <Map className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-light text-black mb-4">Virtual Tours</h3>
                  <p className="text-gray-600 font-light mb-6">
                    Explore cities from anywhere. Pre-built walking routes guide users through curated POIs
                    with auto-advancing narrations and beautiful 3D map animations.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Classic or Minimal view modes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Auto-advance after narration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Image carousel per POI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Progress tracking & completion</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 lg:p-10 rounded-2xl border border-blue-200">
                  <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                    <Navigation className="w-7 h-7 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-light text-black mb-4">Live Walks</h3>
                  <p className="text-gray-600 font-light mb-6">
                    Real-time discovery using GPS. As users physically approach points of interest,
                    the app automatically triggers relevant narrations.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                      <span>Background location tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                      <span>Proximity-based triggers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                      <span>NowPlaying card with controls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                      <span>Frequency customization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Supported Cities</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { city: 'New York', country: 'USA', pois: 'Empire State, Flatiron...' },
                  { city: 'Paris', country: 'France', pois: 'Eiffel Tower, Louvre...' },
                  { city: 'London', country: 'UK', pois: 'Big Ben, Tower Bridge...' },
                  { city: 'Rome', country: 'Italy', pois: 'Colosseum, Vatican...' },
                  { city: 'Tokyo', country: 'Japan', pois: 'Shibuya, Senso-ji...' },
                  { city: 'San Francisco', country: 'USA', pois: 'Golden Gate, Alcatraz...' },
                  { city: 'Barcelona', country: 'Spain', pois: 'Sagrada Familia...' },
                  { city: 'Amsterdam', country: 'Netherlands', pois: 'Anne Frank, Van Gogh...' }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-xl">
                    <div className="text-lg font-medium text-black">{item.city}</div>
                    <div className="text-sm text-gray-500 mb-2">{item.country}</div>
                    <div className="text-xs text-gray-400">{item.pois}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Technical Achievements</h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <div className="text-4xl font-light text-blue-600 mb-4">&lt;200ms</div>
                  <h3 className="text-xl font-medium text-black mb-2">Voice Latency</h3>
                  <p className="text-gray-600 font-light">
                    From user action to audio playback. GPT-4 generates text, TTS converts to speech,
                    AudioEngine plays—all in under 200ms perceived latency.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <div className="text-4xl font-light text-cyan-600 mb-4">A/B</div>
                  <h3 className="text-xl font-medium text-black mb-2">View Modes</h3>
                  <p className="text-gray-600 font-light">
                    Classic (full-featured with mini-map) and Minimal (clean, focused) views.
                    User preference persisted via ProfileManager.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <div className="text-4xl font-light text-green-600 mb-4">99.9%</div>
                  <h3 className="text-xl font-medium text-black mb-2">Uptime</h3>
                  <p className="text-gray-600 font-light">
                    Robust error handling with fallbacks. Location permission flows handle all edge cases.
                    Share sheet iPad fixes applied.
                  </p>
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
                Need voice AI for your app?
              </h2>
              <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                We specialize in voice-first AI experiences—from tour guides to customer support to accessibility tools.
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
