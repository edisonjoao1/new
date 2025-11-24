import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service | AI 4U Labs',
  description: 'Terms of Service for AI 4U Labs. Read our terms and conditions for using our website and services.',
}

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-slate-400 mb-8">Last updated: {lastUpdated}</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using the {COMPANY_INFO.name} website and services, you accept and agree to be bound
                by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Services Description</h2>
              <p className="leading-relaxed mb-3">
                {COMPANY_INFO.name} provides:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>AI consulting and strategy services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Custom mobile application development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>AI automation implementation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>API integration and development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Software localization services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Rapid MVP development</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Use of Website</h2>
              <p className="leading-relaxed mb-3">
                You agree to use our website only for lawful purposes and in a way that does not infringe the rights
                of others or restrict their use of the website. Prohibited behavior includes:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Attempting to gain unauthorized access to our systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Transmitting malicious code or viruses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Scraping or harvesting data from our website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Using automated systems to access the website without permission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Impersonating another person or entity</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
              <p className="leading-relaxed mb-3">
                All content on this website, including but not limited to text, graphics, logos, images, and software,
                is the property of {COMPANY_INFO.name} and is protected by copyright, trademark, and other intellectual
                property laws.
              </p>
              <p className="leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works from our content without explicit
                written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Service Agreements</h2>
              <p className="leading-relaxed mb-3">
                For custom development and consulting services:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Projects are defined through separate written agreements or statements of work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Pricing, timelines, and deliverables are specified in project agreements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Payment terms are outlined in individual contracts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Intellectual property ownership is defined per project agreement</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. AI Chat Disclaimer</h2>
              <p className="leading-relaxed">
                Our AI chat assistant is powered by third-party AI services (OpenAI). While we strive for accuracy,
                the AI may occasionally provide incomplete or incorrect information. The chat is for informational
                purposes only and should not be considered professional advice. Always verify important information
                through direct communication with our team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p className="leading-relaxed mb-3">
                To the fullest extent permitted by law, {COMPANY_INFO.name} shall not be liable for:
              </p>
              <ul className="space-y-2 ml-6 mb-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Indirect, incidental, or consequential damages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Loss of profits, data, or business opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Damages arising from website downtime or technical issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Third-party content or services accessed through our website</span>
                </li>
              </ul>
              <p className="leading-relaxed">
                Our total liability in any matter arising from these terms shall not exceed the amount paid by you
                for our services in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Warranties</h2>
              <p className="leading-relaxed">
                Our website and services are provided "as is" without warranties of any kind, either express or implied.
                We do not warrant that our services will be uninterrupted, error-free, or completely secure. However,
                we commit to delivering quality work according to project agreements and industry standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Confidentiality</h2>
              <p className="leading-relaxed">
                We respect the confidentiality of information shared through project inquiries and service engagements.
                Details regarding confidentiality obligations are specified in individual project agreements or
                non-disclosure agreements (NDAs).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
              <p className="leading-relaxed">
                We reserve the right to terminate or suspend access to our website and services at our discretion,
                without notice, for conduct that we believe violates these Terms of Service or is harmful to other
                users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p className="leading-relaxed">
                We may modify these Terms of Service at any time. Changes will be effective when posted on this page
                with an updated "Last updated" date. Your continued use of our services after changes are posted
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of
                Florida, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Dispute Resolution</h2>
              <p className="leading-relaxed">
                Any disputes arising from these terms or our services shall first be addressed through good faith
                negotiation. If negotiation fails, disputes may be resolved through binding arbitration in accordance
                with the American Arbitration Association rules.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Severability</h2>
              <p className="leading-relaxed">
                If any provision of these Terms of Service is found to be unenforceable or invalid, that provision
                shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall
                remain in full force and effect.
              </p>
            </section>

            <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
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
