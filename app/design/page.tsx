import { Metadata } from 'next'
import DesignClientPage from './DesignClientPage'

export const metadata: Metadata = {
  title: 'The AI Renaissance | AI 4U Labs Design Showcase',
  description: 'Building million-dollar apps with 90% less people. A visual journey through AI-augmented development—30+ apps, 1M+ users, shipped in weeks not years.',
  keywords: [
    'AI 4U Labs',
    'AI app development',
    'design showcase',
    'product design',
    'iOS development',
    'AI products',
    'startup studio',
    'rapid development',
    'AI augmented development'
  ],
  openGraph: {
    title: 'The AI Renaissance | AI 4U Labs',
    description: 'Building million-dollar apps with 90% less people.',
    url: 'https://ai4u.space/design',
    siteName: 'AI 4U Labs',
    images: [{ url: '/images/design/og-design.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Renaissance | AI 4U Labs',
    description: 'Building million-dollar apps with 90% less people.',
  },
  alternates: {
    canonical: 'https://ai4u.space/design',
  },
}

export default function DesignPage() {
  return <DesignClientPage />
}
