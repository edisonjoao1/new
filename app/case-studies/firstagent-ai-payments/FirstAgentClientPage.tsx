"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Fingerprint, Zap, Globe, Lock, CreditCard, Bot, FileCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function FirstAgentClientPage() {
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
                  <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-medium">
                    AI + Fintech
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    Pioneer
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  FirstAgent
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  Pioneering AI-to-Payments Protocol
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  We built a production conversational payments system <strong>before</strong> Google announced the AP2 (Agent-to-Payments) protocol.
                  AI agents can make purchases on behalf of users with cryptographically-signed authorization mandates.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: 'First', label: 'Pre-AP2' },
                    { value: '50+', label: 'Countries' },
                    { value: 'Biometric', label: 'Security' },
                    { value: '6 weeks', label: 'To Production' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-black">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <Bot className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">Secure Enclave</div>
                      <div className="text-xs text-gray-500">Cryptographic Auth</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pioneer Banner */}
        <section className="bg-gradient-to-r from-violet-600 to-purple-700 text-white py-12">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-light mb-2">Built Before AP2 Was Announced</h3>
                <p className="text-violet-200 font-light">
                  Google announced the Agent-to-Payments protocol in September 2025. We had a working system months earlier.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Pioneer Status</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-4">How Agent Payments Work</h2>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-3xl">
                Users describe what they want in natural language. AI extracts rules. Cryptographic mandates authorize agent actions.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Describe Mission',
                    desc: 'User: "Find me AirPods under $200 this week"',
                    icon: Bot
                  },
                  {
                    step: '2',
                    title: 'AI Extracts Rules',
                    desc: 'Gemini parses: product, max price, timeline, quantity',
                    icon: FileCheck
                  },
                  {
                    step: '3',
                    title: 'Sign Mandate',
                    desc: 'Secure Enclave + Face ID creates cryptographic auth',
                    icon: Fingerprint
                  },
                  {
                    step: '4',
                    title: 'Agent Executes',
                    desc: 'Agent monitors deals, proposes cart, completes purchase',
                    icon: CreditCard
                  }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="bg-gray-50 p-6 rounded-xl h-full">
                      <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-violet-600 font-medium">{item.step}</span>
                      </div>
                      <item.icon className="w-8 h-8 text-violet-600 mb-3" />
                      <h3 className="font-medium text-black mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {i < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Security Architecture</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <Shield className="w-12 h-12 text-green-600 mb-6" />
                  <h3 className="text-2xl font-light text-black mb-4">Cryptographic Mandates</h3>
                  <p className="text-gray-600 font-light mb-6">
                    Every agent action requires a cryptographically-signed mandate. Two types:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <strong className="text-black">Intent Mandate:</strong>
                        <span className="text-gray-600"> Authorizes agent to search and propose carts within rules</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <strong className="text-black">Cart Mandate:</strong>
                        <span className="text-gray-600"> Authorizes specific purchase execution (auto or manual)</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <Lock className="w-12 h-12 text-violet-600 mb-6" />
                  <h3 className="text-2xl font-light text-black mb-4">Secure Enclave Signing</h3>
                  <p className="text-gray-600 font-light mb-6">
                    Private keys never leave the iPhone&apos;s Secure Enclave hardware. Signatures require biometric authentication.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm text-gray-700">
                      {`SigningService.sign(data: Data, with: SecKey) → ECDSA P-256 Signature`}
                    </code>
                  </div>
                </div>
              </div>

              {/* Mandate Structure */}
              <div className="mt-8 bg-black text-white p-8 rounded-2xl">
                <h3 className="text-xl font-light mb-6">Mandate Data Structure</h3>
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`struct IntentMandate {
  let id: UUID
  let missionId: UUID
  let rules: MissionRules        // maxPrice, dates, merchants
  let mode: ExecutionMode        // .ask or .auto
  let signature: Data            // ECDSA P-256
  let publicKey: Data            // Verification key
  let createdAt: Date
  let expiresAt: Date
  var isRevoked: Bool
}`}
                </pre>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Execution Modes */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Execution Modes</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-violet-50 p-8 rounded-2xl border border-violet-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-2xl font-light text-black">Ask Mode</h3>
                  </div>
                  <p className="text-gray-600 font-light mb-4">
                    Agent proposes carts for user approval. Each purchase requires explicit consent via Face ID.
                    Safer for high-value or unfamiliar purchases.
                  </p>
                  <div className="text-sm text-violet-700 bg-violet-100 px-4 py-2 rounded-lg inline-block">
                    User approves every transaction
                  </div>
                </div>

                <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-light text-black">Auto Mode</h3>
                  </div>
                  <p className="text-gray-600 font-light mb-4">
                    Agent executes purchases automatically within mandate rules. Great for routine purchases
                    or time-sensitive deals that match strict criteria.
                  </p>
                  <div className="text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg inline-block">
                    Autonomous within constraints
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
              <h2 className="text-3xl lg:text-4xl font-light mb-12">Technical Stack</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { category: 'iOS App', items: ['Swift 5.9', 'SwiftUI', 'Secure Enclave', 'LocalAuthentication'] },
                  { category: 'AI Services', items: ['Gemini 1.5 Flash', 'JSON Mode', 'Rule Extraction', 'Mission Summary'] },
                  { category: 'Payments', items: ['Wise API', 'International Transfers', '50+ Countries', 'Multi-currency'] },
                  { category: 'Security', items: ['ECDSA P-256', 'Face ID / Touch ID', 'Mandate System', 'Audit Trail'] }
                ].map((stack, i) => (
                  <div key={i}>
                    <div className="text-violet-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
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

        {/* Impact */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Impact & Significance</h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-violet-50 rounded-2xl">
                  <Globe className="w-10 h-10 text-violet-600 mb-4" />
                  <h3 className="text-xl font-medium text-black mb-2">First of Its Kind</h3>
                  <p className="text-gray-600 font-light">
                    Built production conversational payments before billion-dollar companies, proving agent-to-payments viability.
                  </p>
                </div>

                <div className="p-8 bg-gray-50 rounded-2xl">
                  <Shield className="w-10 h-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-medium text-black mb-2">Bank-Grade Security</h3>
                  <p className="text-gray-600 font-light">
                    Cryptographic mandates and hardware-backed signing ensure only authorized transactions execute.
                  </p>
                </div>

                <div className="p-8 bg-gray-50 rounded-2xl">
                  <CreditCard className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-medium text-black mb-2">Real Transactions</h3>
                  <p className="text-gray-600 font-light">
                    Not a prototype. Real Wise API integration enabling actual international transfers across 50+ countries.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-violet-600 to-purple-700 text-white py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-5xl font-light mb-6">
                Building the future of AI payments?
              </h2>
              <p className="text-xl text-violet-200 font-light mb-10 max-w-2xl mx-auto">
                We&apos;re experts in AI agents, fintech integration, and secure transaction systems. Let&apos;s build something groundbreaking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
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
