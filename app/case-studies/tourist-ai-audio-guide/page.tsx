import { Metadata } from 'next'
import TouristClientPage from './TouristClientPage'

export const metadata: Metadata = {
  title: 'Tourist AI Audio Guide Case Study | Voice AI Development',
  description: 'How we built an AI-powered audio tour guide app with GPT-4 narration and OpenAI TTS in 3 weeks. Real-time voice synthesis, 8 cities, sub-200ms latency.',
  keywords: [
    'AI tour guide app',
    'voice AI development',
    'OpenAI TTS integration',
    'travel app development',
    'GPS tour guide',
    'AI narration app',
    'SwiftUI MapKit',
    'real-time voice synthesis',
    'AI 4U Labs case study',
    'audio guide app'
  ],
  openGraph: {
    title: 'Tourist AI Audio Guide | AI 4U Labs Case Study',
    description: 'AI-powered audio tour guide with real-time GPT-4 narration built in 3 weeks.',
    url: 'https://ai4u.space/case-studies/tourist-ai-audio-guide',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/tourist-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tourist AI Audio Guide Case Study',
    description: 'Voice-first AI travel companion built in 3 weeks',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/tourist-ai-audio-guide',
  },
}

export default function TouristPage() {
  return <TouristClientPage />
}
