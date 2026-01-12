import { Metadata } from 'next'
import AnalyticsDashboardClientPage from './AnalyticsDashboardClientPage'

export const metadata: Metadata = {
  title: 'AI Analytics Dashboard Case Study | Predictive Intelligence for Product Teams',
  description: 'How we built an AI-powered analytics dashboard that auto-discovers properties, predicts trends, and provides actionable insights. From raw GA4 data to product decisions in real-time.',
  keywords: [
    'AI analytics dashboard',
    'predictive analytics',
    'Google Analytics AI',
    'GA4 dashboard',
    'product analytics',
    'AI-powered insights',
    'real-time analytics',
    'multi-property dashboard',
    'data visualization',
    'AI 4U Labs case study'
  ],
  openGraph: {
    title: 'AI Analytics Dashboard | AI 4U Labs Case Study',
    description: 'Predictive analytics dashboard that turns raw data into product decisions.',
    url: 'https://ai4u.space/case-studies/analytics-dashboard',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/analytics-dashboard-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Analytics Dashboard Case Study',
    description: 'How we built an AI-powered analytics dashboard with predictive intelligence',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/analytics-dashboard',
  },
}

export default function AnalyticsDashboardPage() {
  return <AnalyticsDashboardClientPage />
}
