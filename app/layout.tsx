import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 4U Labs - AI Consulting & Custom App Development',
  description: 'AI 4U is a cutting-edge AI consulting studio specializing in custom AI app development, automation, API integration, and rapid MVP development. Transform your business with AI solutions that work.',
  keywords: 'AI consulting, AI app development, custom AI solutions, AI automation, iOS AI apps, AI integration, Spanish AI, AI strategy, rapid MVP development, AI 4U Labs',
  authors: [{ name: 'AI 4U Labs' }],
  creator: 'AI 4U Labs',
  publisher: 'AI 4U Labs',
  category: 'Technology',
  classification: 'Business',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    bingBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai4u.space',
    title: 'AI 4U Labs - Transform Your Business with AI',
    description: 'Leading AI consulting studio specializing in custom AI app development, automation solutions, and rapid MVP development. Serving 10,000+ users worldwide.',
    siteName: 'AI 4U Labs',
    images: [
      {
        url: 'https://ai4u.space/ai-assistant-mockup.png',
        width: 1200,
        height: 630,
        alt: 'AI 4U Labs - AI Consulting & Custom App Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 4U Labs - AI Consulting & Custom App Development',
    description: 'Transform your business with AI solutions that work. Custom AI apps, automation, and rapid MVP development.',
    images: ['https://ai4u.space/ai-assistant-mockup.png'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://ai4u.space',
    languages: {
      'en-US': 'https://ai4u.space',
      'es-ES': 'https://ai4u.space/es',
    },
  },
  other: {
    'contact:phone_number': '+1-XXX-XXX-XXXX',
    'contact:email': 'info@ai4u.space',
    'contact:country_name': 'United States',
    'contact:region': 'Florida',
    'contact:postal_code': '34102',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
