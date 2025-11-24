import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'AI Development Services | Rapid MVPs, Mobile Apps & Automation',
  description:
    'Fixed-price AI development services. Rapid MVPs (2-4 weeks, $15-25K), mobile AI apps, automation, and payment integrations. Production-ready, scalable architecture.',
  path: '/services',
  keywords: [
    'AI development services',
    'AI MVP development',
    'AI app development pricing',
    'AI consulting services',
    'mobile AI development',
    'AI automation services',
    'fixed-price AI development',
    'AI integration services',
  ],
})

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
