import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Our Work | 10+ AI Products Shipped, 1M+ Users',
  description:
    'Case studies of production AI applications built by AI 4U Labs. Pioneered AP2 payments protocol, shipped AI apps in 6 days, served 1M+ users. Real products, real impact.',
  path: '/work',
  keywords: [
    'AI portfolio',
    'AI case studies',
    'AI products',
    'conversational payments',
    'AP2 protocol',
    'AI app development',
    'production AI',
    'AI success stories',
  ],
})

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
