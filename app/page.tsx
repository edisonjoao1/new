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
          "text": "We ship production-ready MVPs in 2-4 weeks with 90% less people than traditional teams. Our fastest delivery was 1 day from idea to App Store approved. Prototypes can be even faster—hours, not days. Don't believe us? Test us. If we don't meet our committed timeline, we build your app for free."
        }
      },
      {
        "@type": "Question",
        "name": "What AI technologies does AI 4U Labs work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work with GPT-5.2, Claude Opus 4.5, Gemini 3.0, OpenAI Conversations API, and custom models. We've built 15+ MCP servers and specialize in video AI, voice AI, conversational agents, and multi-model orchestration."
        }
      },
      {
        "@type": "Question",
        "name": "How much does an AI MVP cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rapid MVPs are fixed-price at $15-25K for 2-4 week delivery. This includes full-stack development, production deployment, user testing, analytics setup, and scale-ready architecture. We offer 13 specialized services from $5K-$25K."
        }
      },
      {
        "@type": "Question",
        "name": "Does AI 4U Labs build mobile apps?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we build native iOS apps and cross-platform applications with AI integration. We've shipped 35+ AI apps to the App Store with 1M+ total users, including Pet Health Scan with real-time video analysis."
        }
      },
      {
        "@type": "Question",
        "name": "What makes AI 4U Labs different from other AI agencies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We build million-dollar apps with 90% less people, 10x faster. 35+ live products, 1M+ users, not just prototypes or slides. We pioneered the AP2 protocol before Google's announcement and built a 24-property analytics dashboard in one day."
        }
      },
      {
        "@type": "Question",
        "name": "Can AI 4U Labs build video AI applications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in video AI using Gemini 3.0. Pet Health Scan uses real-time video analysis to detect pet gait abnormalities. We also build image generation, object detection, and visual diagnostics systems."
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
      "url": "https://ai4u.space",
      "description": "Building million-dollar apps with 90% less people. 35+ apps shipped, 1M+ users reached."
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
            "description": "Production-ready AI MVPs in 2-4 weeks. What takes other teams months, we ship in weeks."
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
            "name": "Video & Image AI",
            "description": "Real-time video analysis with Gemini 3.0. Pet Health Scan-level capabilities: gait detection, visual diagnostics."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "MCP Server Development",
            "description": "15+ MCP servers built. Extend any AI with custom tools, databases, APIs, and business logic."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Agent Development",
            "description": "Multi-model orchestration with GPT-5.2, Claude Opus 4.5, and Gemini 3.0. Like Pulse Wire's 5-agent newsroom."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Analytics & BI Dashboards",
            "description": "AI-powered predictive intelligence. Built a 24-property analytics dashboard in one day."
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
