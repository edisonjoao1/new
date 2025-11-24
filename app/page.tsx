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

export default function HomePage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  const handleGetStarted = () => {
    setIsPlanOpen(true)
  }

  return (
    <>
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
