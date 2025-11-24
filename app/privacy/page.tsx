import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy | AI 4U Labs',
  description: 'Privacy Policy for AI 4U Labs. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  const lastUpdated = 'November 23, 2024'

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-blue-300 hover:text-blue-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-8">Last updated: {lastUpdated}</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="leading-relaxed">
                At {COMPANY_INFO.name}, we take your privacy seriously. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">Personal Information</h3>
              <p className="leading-relaxed mb-3">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="space-y-2 ml-6 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Fill out contact forms or submit project ideas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Communicate with our AI chat assistant</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Subscribe to our newsletter or updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Request a quote or consultation</span>
                </li>
              </ul>
              <p className="leading-relaxed mb-3">
                This information may include: name, email address, company name, phone number, and project details.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">Automatically Collected Information</h3>
              <p className="leading-relaxed mb-3">
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>IP address and browser type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Operating system and device information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Pages visited and time spent on pages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Referring website and navigation patterns</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Respond to your inquiries and provide customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Process project requests and deliver our services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Improve our website, products, and services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Send you marketing communications (with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Analyze website usage and optimize user experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Comply with legal obligations and protect our rights</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">AI Chat Data</h2>
              <p className="leading-relaxed">
                Conversations with our AI chat assistant are processed through OpenAI's API. We do not store chat
                histories permanently, but OpenAI may retain data according to their own privacy policy. We recommend
                not sharing sensitive personal information in the chat.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Sharing and Disclosure</h2>
              <p className="leading-relaxed mb-3">
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information with:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Service providers who assist in operating our website and business (e.g., email services, analytics)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Professional advisors (lawyers, accountants) when necessary</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Law enforcement or regulatory authorities when required by law</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However, no method
                of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="leading-relaxed mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Access the personal information we hold about you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Request correction of inaccurate information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Request deletion of your personal information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Opt-out of marketing communications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Lodge a complaint with a data protection authority</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our website. You can
                control cookie preferences through your browser settings. We use Vercel Analytics for basic usage
                statistics, which respects Do Not Track signals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links</h2>
              <p className="leading-relaxed">
                Our website may contain links to third-party websites (e.g., our apps on the App Store). We are not
                responsible for the privacy practices of these external sites. We encourage you to review their
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <p className="leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect
                personal information from children. If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new policy on this page and updating the "Last updated" date. We encourage you to review this
                policy periodically.
              </p>
            </section>

            <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="text-blue-400">
                Email: <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline">{COMPANY_INFO.email}</a>
              </p>
              <p className="text-slate-400 mt-2">
                Location: {COMPANY_INFO.location}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
