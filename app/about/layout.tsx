import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'About AI 4U Labs | We Ship Real AI Products Fast',
  description:
    'AI 4U Labs builds production AI applications since 2023. 20+ apps shipped, 1M+ users reached. We turn AI ideas into live products in 2-4 weeks. Fast execution, clean code, real impact.',
  path: '/about',
  keywords: [
    'about AI 4U Labs',
    'AI development team',
    'AI startup',
    'AI company',
    'rapid AI development',
    'AI engineering',
    'production AI',
  ],
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
