import { Metadata } from 'next'
import BibliaClientPage from './BibliaClientPage'

export const metadata: Metadata = {
  title: 'Biblia AI Bible Study App Case Study | iOS AI Development',
  description: 'How we built a Spanish-first AI-powered Bible study app with GPT-5.2 integration in just 2 weeks. 31,000+ verses, 8 AI tools, SwiftUI native iOS development.',
  keywords: [
    'AI Bible app',
    'iOS Bible study app',
    'GPT-5.2 Bible app',
    'Spanish Bible app',
    'SwiftUI development',
    'AI mobile app development',
    'religious app development',
    'OpenAI integration iOS',
    'AI 4U Labs case study',
    'rapid MVP development'
  ],
  openGraph: {
    title: 'Biblia AI Bible Study App | AI 4U Labs Case Study',
    description: 'Spanish-first AI-powered Bible study app built in 2 weeks with GPT-5.2 integration.',
    url: 'https://ai4u.space/case-studies/biblia-ai-bible-app',
    siteName: 'AI 4U Labs',
    images: [{ url: '/case-studies/biblia-og.png', width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biblia AI Bible App Case Study',
    description: 'How we built an AI Bible app in 2 weeks',
  },
  alternates: {
    canonical: 'https://ai4u.space/case-studies/biblia-ai-bible-app',
  },
}

export default function BibliaPage() {
  return <BibliaClientPage />
}
