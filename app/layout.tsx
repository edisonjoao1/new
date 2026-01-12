import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper"
import { Suspense } from "react"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://ai4u.space"),
  title: {
    default: "AI 4U Labs | We Build Anything with AI | Custom AI Development",
    template: "%s | AI 4U Labs"
  },
  description:
    "AI 4U Labs builds million-dollar apps with 90% less people, 10x faster. 30+ shipped products, 1M+ users. From AI agents to mobile apps, we turn ideas into live products in 2-4 weeks.",
  keywords: [
    "AI development",
    "custom AI applications",
    "AI consulting",
    "AI app development",
    "AI automation",
    "GPT-5 integration",
    "Claude Opus 4.5 development",
    "Gemini 3.0 integration",
    "machine learning",
    "AI agents",
    "conversational AI",
    "AI mobile apps",
    "rapid AI prototyping",
    "AI MVP development",
    "production AI systems",
    "AI for business",
    "AI 4U Labs",
    "video AI",
    "MCP servers",
  ],
  openGraph: {
    title: "AI 4U Labs | We Build Anything with AI",
    description:
      "AI 4U Labs builds million-dollar apps with 90% less people, 10x faster. 30+ shipped products, 1M+ users. From AI agents to mobile apps, we turn ideas into live products in 2-4 weeks.",
    url: "https://ai4u.space",
    siteName: "AI 4U Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 4U Labs | We Build Anything with AI",
    description:
      "AI 4U Labs builds million-dollar apps with 90% less people. 30+ shipped products, 1M+ users. AI agents, mobile apps, video AI. 2-4 week MVP delivery.",
    creator: "@ai4ulabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // JSON-LD for Organization and WebSite schema
  alternates: {
    canonical: "https://ai4u.space",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" richColors closeButton />
        <Suspense fallback={null}>{children}</Suspense>
        {/* JSON-LD for Organization and WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://ai4u.space/#organization",
                  name: "AI 4U Labs",
                  alternateName: "AI 4U",
                  url: "https://ai4u.space",
                  logo: "https://ai4u.space/logo.png",
                  description: "AI 4U Labs builds production-ready AI applications for startups and Fortune 500s. We ship AI agents, mobile apps, and payment systems.",
                  foundingDate: "2023",
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Customer Service",
                    email: "edison@ai4u.space",
                    availableLanguage: ["English", "Spanish"]
                  },
                  areaServed: {
                    "@type": "Place",
                    name: "Worldwide"
                  },
                  slogan: "We Build Anything with AI",
                  knowsAbout: ["Artificial Intelligence", "Machine Learning", "Mobile App Development", "AI Agents", "GPT-5", "Claude Opus 4.5", "Gemini 3.0", "Video AI", "MCP Servers", "Payment Systems"],
                  sameAs: [
                    "https://twitter.com/ai4ulabs",
                    "https://linkedin.com/company/ai4ulabs",
                    "https://github.com/ai4ulabs"
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ai4u.space/#website",
                  url: "https://ai4u.space",
                  name: "AI 4U Labs",
                  publisher: {
                    "@id": "https://ai4u.space/#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://ai4u.space/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        <AnalyticsWrapper />
      </body>
    </html>
  )
}
