import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Contact AI 4U Labs | Start Your AI Project',
  description:
    'Get in touch to discuss your AI project. Free consultation. Typical response time: 24 hours. Email edison@ai4ulabs.com or fill out the form.',
  path: '/contact',
  keywords: [
    'contact AI 4U Labs',
    'AI consultation',
    'hire AI developers',
    'AI project inquiry',
    'AI development quote',
  ],
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
