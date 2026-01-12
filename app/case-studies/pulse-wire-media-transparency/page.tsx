import { Metadata } from 'next'
import PulseWireClientPage from './PulseWireClientPage'

export const metadata: Metadata = {
  title: 'Pulse Wire Media Transparency Platform Case Study | AI News Analysis',
  description: 'How we built a media transparency platform using AI to detect propaganda, track media ownership, and expose hypocrisy in news coverage. Next.js, Gemini AI, real-time analysis.',
  keywords: [
    'media transparency platform',
    'AI news analysis',
    'propaganda detection',
    'media ownership tracking',
    'hypocrisy detection AI',
    'media literacy tool',
    'news bias detection',
    'Gemini AI integration',
    'Next.js development',
    'AI 4U Labs case study'
  ],
  openGraph: {
    title: 'Pulse Wire Media Transparency | AI 4U Labs Case Study',
    description: 'AI-powered platform exposing media manipulation, ownership networks, and narrative inconsistencies.',
    url: 'https://ai4u.space/case-studies/pulse-wire-media-transparency',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/pulse-wire-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse Wire Media Transparency Case Study',
    description: 'How we built an AI platform to expose media manipulation',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/pulse-wire-media-transparency',
  },
}

export default function PulseWirePage() {
  return <PulseWireClientPage />
}
