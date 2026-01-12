import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Free AI Development Resources & Guides | AI 4U Labs',
  description:
    'Free guides, checklists, and resources for building AI applications. AI development checklist, MVP planning guide, cost calculator, and model selection framework.',
  path: '/resources',
  keywords: [
    'AI development guide',
    'AI checklist',
    'AI project planning',
    'AI cost calculator',
    'GPT vs Claude guide',
    'AI MVP guide',
    'AI development resources',
    'free AI guides',
  ],
})

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
