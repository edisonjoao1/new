import { Metadata } from 'next'

export interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.png',
  noIndex = false,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: SEOProps): Metadata {
  const baseUrl = 'https://ai4u.space'
  const url = `${baseUrl}${path}`

  const metadata: Metadata = {
    title,
    description,
    keywords: [
      'AI development',
      'custom AI applications',
      'AI consulting',
      ...keywords,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'AI 4U Labs',
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
      creator: '@ai4ulabs',
    },
    alternates: {
      canonical: url,
    },
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

// Common SEO content for reuse
export const seoContent = {
  tagline: 'We Build Anything with AI',
  description:
    'AI 4U Labs builds production-ready AI applications for startups and Fortune 500s. 10+ shipped products, 1M+ users. From AI agents to mobile apps, we turn ideas into live products in 2-4 weeks.',
  keywords: [
    'AI development',
    'custom AI applications',
    'AI consulting',
    'AI app development',
    'AI automation',
    'GPT-4 integration',
    'Claude AI development',
    'machine learning',
    'AI agents',
    'conversational AI',
    'AI mobile apps',
    'rapid AI prototyping',
    'AI MVP development',
  ],
}
