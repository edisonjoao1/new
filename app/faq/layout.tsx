import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'FAQ | AI Development Questions Answered | AI 4U Labs',
  description:
    'Answers to common questions about AI app development. How much does AI development cost? How long to build an AI app? GPT vs Claude comparison and more.',
  path: '/faq',
  keywords: [
    'AI development FAQ',
    'AI app cost',
    'how long to build AI app',
    'GPT vs Claude',
    'AI development process',
    'AI agency FAQ',
    'custom AI cost',
    'AI integration',
  ],
})

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
