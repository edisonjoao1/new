"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, ArrowRight, CheckCircle2, DollarSign, Globe, CreditCard, Smartphone, Building, ArrowRightLeft, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EnvioPlataClientPage() {
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
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Fintech
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    Remittance
                  </span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-black mb-4">
                  EnvioPlata
                </h1>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-6">
                  US-to-Latin America Money Transfers
                </p>

                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  A seamless remittance platform enabling the Hispanic community in the US to send money home
                  with transparent fees, real-time exchange rates, and Apple Pay support.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: '16', label: 'Countries' },
                    { value: '$2.99', label: 'Flat Fee' },
                    { value: 'Real-time', label: 'Rates' },
                    { value: '4 weeks', label: 'Development' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-black">{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center">
                  <DollarSign className="w-32 h-32 text-white/30" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowRightLeft className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">Wise + Stripe</div>
                      <div className="text-xs text-gray-500">Powered By</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Transfer Flow */}
        <section className="bg-green-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">How It Works</h2>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Enter Amount',
                    desc: 'Real-time exchange rate from Wise API, transparent fee breakdown',
                    icon: DollarSign
                  },
                  {
                    step: '2',
                    title: 'Add Recipient',
                    desc: 'Country-specific bank fields with validation',
                    icon: Building
                  },
                  {
                    step: '3',
                    title: 'Pay Instantly',
                    desc: 'Apple Pay, credit/debit cards via Stripe',
                    icon: CreditCard
                  },
                  {
                    step: '4',
                    title: 'Money Arrives',
                    desc: 'Wise handles the international transfer',
                    icon: CheckCircle2
                  }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="bg-white p-6 rounded-xl h-full">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-green-600 font-medium">{item.step}</span>
                      </div>
                      <item.icon className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-medium text-black mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {i < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-green-300" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Supported Countries */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-4">16 Countries Supported</h2>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-3xl">
                Each country has specific bank field requirements handled dynamically by our validation system.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                  { flag: '🇲🇽', name: 'Mexico', code: 'MX' },
                  { flag: '🇨🇴', name: 'Colombia', code: 'CO' },
                  { flag: '🇧🇷', name: 'Brazil', code: 'BR' },
                  { flag: '🇬🇹', name: 'Guatemala', code: 'GT' },
                  { flag: '🇵🇪', name: 'Peru', code: 'PE' },
                  { flag: '🇦🇷', name: 'Argentina', code: 'AR' },
                  { flag: '🇨🇱', name: 'Chile', code: 'CL' },
                  { flag: '🇪🇨', name: 'Ecuador', code: 'EC' },
                  { flag: '🇩🇴', name: 'Dom. Rep.', code: 'DO' },
                  { flag: '🇭🇳', name: 'Honduras', code: 'HN' },
                  { flag: '🇸🇻', name: 'El Salvador', code: 'SV' },
                  { flag: '🇳🇮', name: 'Nicaragua', code: 'NI' },
                  { flag: '🇨🇷', name: 'Costa Rica', code: 'CR' },
                  { flag: '🇵🇦', name: 'Panama', code: 'PA' },
                  { flag: '🇺🇾', name: 'Uruguay', code: 'UY' },
                  { flag: '🇵🇾', name: 'Paraguay', code: 'PY' }
                ].map((country, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                    <div className="text-3xl mb-2">{country.flag}</div>
                    <div className="text-sm font-medium text-black">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.code}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Technical Architecture</h2>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8">
                <pre className="text-sm text-gray-600 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────┐
│                        iOS App (SwiftUI)                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ TransferView  │  │ PaymentManager│  │   APIService      │   │
│  │  ViewModel    │  │  (Stripe SDK) │  │  (REST Client)    │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Backend (Express)                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │   server.js   │  │  wise.js      │  │  bank-fields.js   │   │
│  │  (Routes)     │  │  (Transfers)  │  │  (Validation)     │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │                    │
          ▼                    ▼
   ┌─────────────┐      ┌─────────────┐
   │  Stripe API │      │  Wise API   │
   │  (Payments) │      │ (Transfers) │
   └─────────────┘      └─────────────┘`}
                </pre>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <CreditCard className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-medium text-black mb-3">Stripe Integration</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Apple Pay support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      PaymentSheet for cards
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Webhook-driven flow
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Transfer metadata
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200">
                  <Globe className="w-10 h-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-medium text-black mb-3">Wise Integration</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Real-time quotes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Recipient creation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Transfer execution
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Status tracking
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Fee Structure */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Transparent Fee Structure</h2>

              <div className="bg-green-50 p-8 lg:p-12 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-light text-black mb-6">Example: $100 to Colombia</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-gray-600">Send Amount</span>
                        <span className="text-black font-medium">$100.00</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-gray-600">EnvioPlata Fee</span>
                        <span className="text-black font-medium">$2.99</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-gray-600">Wise Fee (variable)</span>
                        <span className="text-black font-medium">~$3.00</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-gray-700 font-medium">Total Charged</span>
                        <span className="text-black font-bold">$105.99</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-green-100 px-4 rounded-lg">
                        <span className="text-green-700 font-medium">Recipient Gets</span>
                        <span className="text-green-700 font-bold">~415,000 COP</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-light text-black mb-6">Why This Pricing?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">Flat $2.99 Fee</div>
                          <div className="text-sm text-gray-600">Break-even pricing to serve the community</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">Wise&apos;s Mid-Market Rate</div>
                          <div className="text-sm text-gray-600">No hidden exchange rate markups</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">Full Transparency</div>
                          <div className="text-sm text-gray-600">All fees shown upfront before payment</div>
                        </div>
                      </div>
                    </div>
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
                  { category: 'iOS App', items: ['Swift 5.9', 'SwiftUI', 'Stripe SDK', 'Apple Pay'] },
                  { category: 'Backend', items: ['Node.js', 'Express', 'Zod Validation', 'Webhooks'] },
                  { category: 'Payments', items: ['Stripe Connect', 'PaymentSheet', 'PaymentIntent', 'Webhook Events'] },
                  { category: 'Transfers', items: ['Wise API', 'Quote API', 'Recipient API', 'Transfer API'] }
                ].map((stack, i) => (
                  <div key={i}>
                    <div className="text-green-400 text-sm uppercase tracking-wider mb-3">{stack.category}</div>
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

        {/* Key Challenges Solved */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-black mb-12">Technical Challenges Solved</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Country-Specific Bank Fields',
                    problem: 'Each country requires different bank details (CLABE for Mexico, NIT for Colombia, etc.)',
                    solution: 'Dynamic form generation based on country selection with Zod validation schemas per country'
                  },
                  {
                    title: 'Nested vs Flat Data Transform',
                    problem: 'iOS sends flat keys (address.city), Wise expects nested objects ({address: {city}})',
                    solution: 'transformBankDetails() function converts formats and auto-injects legalType'
                  },
                  {
                    title: 'Payment → Transfer Flow',
                    problem: 'Need to wait for Stripe payment confirmation before creating Wise transfer',
                    solution: 'Webhook-driven architecture: payment_intent.succeeded triggers transfer creation'
                  },
                  {
                    title: 'Real-Time Rate Display',
                    problem: 'Exchange rates change frequently, users need current rates while entering amount',
                    solution: '0.5s debounced rate fetching with loading states and cached quotes'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-2xl">
                    <h3 className="text-xl font-medium text-black mb-3">{item.title}</h3>
                    <div className="mb-4">
                      <div className="text-sm text-red-600 font-medium mb-1">Problem:</div>
                      <p className="text-gray-600 text-sm">{item.problem}</p>
                    </div>
                    <div>
                      <div className="text-sm text-green-600 font-medium mb-1">Solution:</div>
                      <p className="text-gray-600 text-sm">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-5xl font-light mb-6">
                Building a fintech product?
              </h2>
              <p className="text-xl text-green-200 font-light mb-10 max-w-2xl mx-auto">
                We specialize in payment integrations, money transfer systems, and financial applications. Stripe, Wise, banking APIs—we&apos;ve done it all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
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
