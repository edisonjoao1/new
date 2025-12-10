import { Metadata } from 'next'
import FirstAgentClientPage from './FirstAgentClientPage'

export const metadata: Metadata = {
  title: 'FirstAgent AP2 Protocol Case Study | AI Payments Development',
  description: 'How we pioneered conversational payments with AI agents before Google AP2 announcement. Secure Enclave cryptography, biometric auth, 50+ countries.',
  keywords: [
    'AP2 protocol',
    'agent payments',
    'AI payments',
    'conversational payments',
    'fintech AI development',
    'Secure Enclave iOS',
    'biometric authentication',
    'Wise API integration',
    'AI 4U Labs case study',
    'crypto payments AI'
  ],
  openGraph: {
    title: 'FirstAgent - Pioneering AP2 Protocol | AI 4U Labs Case Study',
    description: 'Built conversational payments before Google announced AP2. Secure AI-initiated transactions.',
    url: 'https://ai4u.space/case-studies/firstagent-ai-payments',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/firstagent-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FirstAgent AP2 Protocol Case Study',
    description: 'Pioneering AI-initiated payments',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/firstagent-ai-payments',
  },
}

export default function FirstAgentPage() {
  return <FirstAgentClientPage />
}
