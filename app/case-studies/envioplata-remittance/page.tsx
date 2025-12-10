import { Metadata } from 'next'
import EnvioPlataClientPage from './EnvioPlataClientPage'

export const metadata: Metadata = {
  title: 'EnvioPlata Remittance App Case Study | Fintech Development',
  description: 'How we built a US-to-Latin America money transfer app with Stripe, Wise API, and Apple Pay in 4 weeks. 16 countries, $2.99 flat fee, real-time rates.',
  keywords: [
    'remittance app development',
    'money transfer app',
    'Wise API integration',
    'Stripe payments iOS',
    'Apple Pay development',
    'fintech app development',
    'Latin America remittance',
    'international transfers',
    'AI 4U Labs case study',
    'Hispanic market fintech'
  ],
  openGraph: {
    title: 'EnvioPlata Remittance Platform | AI 4U Labs Case Study',
    description: 'US-to-LATAM money transfer app built in 4 weeks with Stripe + Wise.',
    url: 'https://ai4u.space/case-studies/envioplata-remittance',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/envioplata-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnvioPlata Remittance Case Study',
    description: 'Building fintech for LATAM remittances',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/envioplata-remittance',
  },
}

export default function EnvioPlataPage() {
  return <EnvioPlataClientPage />
}
