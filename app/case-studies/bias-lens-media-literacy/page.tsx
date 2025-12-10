import { Metadata } from 'next'
import BiasLensClientPage from './BiasLensClientPage'

export const metadata: Metadata = {
  title: 'Bias Lens Media Literacy App Case Study | AI News Analysis',
  description: 'How we built an AI-powered news aggregation app that detects political bias and analyzes loaded language. 20+ sources, 96% accuracy, real-time analysis.',
  keywords: [
    'AI news analysis',
    'media bias detection',
    'political bias AI',
    'news aggregation app',
    'NLP news app',
    'loaded language detection',
    'media literacy app',
    'SwiftData development',
    'AI 4U Labs case study',
    'fact checking AI'
  ],
  openGraph: {
    title: 'Bias Lens Media Literacy App | AI 4U Labs Case Study',
    description: 'AI-powered news bias detection with 96% accuracy built in 4 weeks.',
    url: 'https://ai4u.space/case-studies/bias-lens-media-literacy',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/bias-lens-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bias Lens Case Study',
    description: 'AI-powered media bias detection app',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/bias-lens-media-literacy',
  },
}

export default function BiasLensPage() {
  return <BiasLensClientPage />
}
