"use client"

import { useState } from 'react'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialHero } from '@/components/homepage/EditorialHero'
import { TechnicalHighlights } from '@/components/homepage/TechnicalHighlights'
import { EditorialProjects } from '@/components/homepage/EditorialProjects'
import { ProductGrid } from '@/components/homepage/ProductGrid'
import { AILabsShowcase } from '@/components/homepage/AILabsShowcase'
import { EditorialCapabilities } from '@/components/homepage/EditorialCapabilities'
import { GuidedAIPlan } from '@/components/homepage/GuidedAIPlan'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { AIChat } from '@/components/chat/AIChat'
import Script from 'next/script'

export default function HomePage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  const handleGetStarted = () => {
    setIsPlanOpen(true)
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast can AI 4U Labs ship an AI product?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We ship production-ready MVPs in 2-4 weeks. Our fastest delivery was 6 days from idea to App Store. We focus on rapid iteration with real users rather than endless planning."
        }
      },
      {
        "@type": "Question",
        "name": "What AI technologies does AI 4U Labs work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work with GPT-5.1, Claude Opus 4.5, Gemini 3, OpenAI Realtime API, and custom models. We specialize in conversational AI, AI agents, and integrating LLMs into production applications."
        }
      },
      {
        "@type": "Question",
        "name": "How much does an AI MVP cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rapid MVPs are fixed-price at $15-25K for 2-4 week delivery. This includes full-stack development, production deployment, user testing, analytics setup, and scale-ready architecture."
        }
      },
      {
        "@type": "Question",
        "name": "Does AI 4U Labs build mobile apps?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we build native iOS apps and cross-platform applications with AI integration. We've shipped 10+ AI mobile apps to the App Store with 1M+ total users."
        }
      },
      {
        "@type": "Question",
        "name": "What makes AI 4U Labs different from other AI agencies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We actually ship. 10+ live products, 1M+ users, not just prototypes or slides. We pioneered the AP2 protocol implementation before Google's announcement. Fast execution, production-ready code, real impact."
        }
      }
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Development and Consulting",
    "provider": {
      "@type": "Organization",
      "name": "AI 4U Labs",
      "url": "https://ai4u.space"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Rapid AI MVP Development",
            "description": "Production-ready AI MVPs in 2-4 weeks. Full-stack development, deployment, and testing."
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": "15000-25000",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile AI App Development",
            "description": "Native iOS and cross-platform AI applications with GPT-4, Claude, and custom models."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Automation & Integration",
            "description": "Workflow automation, document processing, and AI API integration for existing systems."
          }
        }
      ]
    }
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <EditorialNav onGetStarted={handleGetStarted} />

      <main>
        <EditorialHero onGetStarted={handleGetStarted} />
        <TechnicalHighlights />
        <EditorialProjects />
        <ProductGrid />
        <AILabsShowcase />
        <EditorialCapabilities />
      </main>

      <EditorialFooter />

      {/* Guided AI Plan Panel */}
      <GuidedAIPlan isOpen={isPlanOpen} onClose={() => setIsPlanOpen(false)} />

      {/* AI Chat Widget */}
      <AIChat />
    </>
  )
}
