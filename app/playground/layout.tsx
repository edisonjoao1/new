import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'AI Playground | Live Demos & Interactive Apps',
  description:
    'Explore 8+ live AI applications built by AI 4U Labs. Try voice AI assistants, fintech tools, health apps, and more. Real products with real users.',
  path: '/playground',
  keywords: [
    'AI demos',
    'AI playground',
    'AI applications',
    'voice AI',
    'AI chatbot demo',
    'conversational AI demo',
    'AI fintech',
    'health AI',
  ],
})

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
