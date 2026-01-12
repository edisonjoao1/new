import { Metadata } from 'next'
import PetHealthScanClientPage from './PetHealthScanClientPage'

export const metadata: Metadata = {
  title: 'Pet Health Scan Case Study | AI Video Analysis for Pet Health',
  description: 'How we built an AI-powered pet health app using video analysis to detect gait abnormalities and image analysis for teeth, eyes, and skin checks. GPT-5, Gemini 3.0, SwiftUI.',
  keywords: [
    'pet health AI app',
    'video analysis for pets',
    'AI pet health diagnostics',
    'dog health check app',
    'cat health analysis',
    'Gemini video analysis',
    'GPT-5 image analysis',
    'iOS pet app development',
    'SwiftUI pet health',
    'AI 4U Labs case study'
  ],
  openGraph: {
    title: 'Pet Health Scan | AI 4U Labs Case Study',
    description: 'AI-powered pet health monitoring using video and image analysis.',
    url: 'https://ai4u.space/case-studies/pet-health-scan',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/pet-health-scan-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Health Scan Case Study',
    description: 'How we built an AI pet health app with video analysis',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/pet-health-scan',
  },
}

export default function PetHealthScanPage() {
  return <PetHealthScanClientPage />
}
