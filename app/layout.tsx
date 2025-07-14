import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://ai4u.space"), // Replace with your actual domain
  title: "AI 4U Labs - Transform Your Business with Cutting-Edge AI Solutions",
  description:
    "AI 4U is a leading AI consulting studio based in Naples, Florida, specializing in custom AI app development, automation, strategy, and localization. We build powerful AI tools and mobile applications that solve real business problems and drive measurable results.",
  keywords: [
    "AI consulting",
    "AI app development",
    "AI automation",
    "AI strategy",
    "machine learning",
    "LLM integration",
    "Naples Florida AI",
    "custom AI solutions",
    "mobile AI apps",
    "AI for business",
    "AI 4U",
  ],
  openGraph: {
    title: "AI 4U Labs - Transform Your Business with Cutting-Edge AI Solutions",
    description:
      "AI 4U is a leading AI consulting studio based in Naples, Florida, specializing in custom AI app development, automation, strategy, and localization. We build powerful AI tools and mobile applications that solve real business problems and drive measurable results.",
    url: "https://ai4u.space",
    siteName: "AI 4U Labs",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200", // Replace with a relevant image for Open Graph
        width: 1200,
        height: 630,
        alt: "AI 4U Labs - AI Consulting and Development",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 4U Labs - Transform Your Business with Cutting-Edge AI Solutions",
    description:
      "AI 4U is a leading AI consulting studio based in Naples, Florida, specializing in custom AI app development, automation, strategy, and localization. We build powerful AI tools and mobile applications that solve real business problems and drive measurable results.",
    images: ["/placeholder.svg?height=675&width=1200"], // Replace with a relevant image for Twitter Card
    creator: "@AI4ULabs", // Replace with your Twitter handle
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
        {children}
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
                  url: "https://ai4u.space",
                  logo: "https://ai4u.space/logo.png", // Replace with your logo URL
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+1-239-555-1234", // Replace with your phone number
                    contactType: "Customer Service",
                    email: "info@ai4u.space",
                  },
                  sameAs: [
                    "https://twitter.com/AI4ULabs", // Replace with your social media links
                    "https://linkedin.com/company/ai4ulabs",
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
      </body>
    </html>
  )
}
