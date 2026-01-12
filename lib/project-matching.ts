// Project categories and their matching case studies/projects

export interface ProjectCategory {
  id: string
  label: string
  description: string
}

export interface MatchedProject {
  title: string
  description: string
  url: string
  stats?: string
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'chat-ai',
    label: 'Chat & Conversation AI',
    description: 'AI chatbots, assistants, customer service automation',
  },
  {
    id: 'video-analysis',
    label: 'Video & Image Analysis',
    description: 'Computer vision, video processing, image recognition',
  },
  {
    id: 'voice-ai',
    label: 'Voice AI & Audio',
    description: 'Voice assistants, TTS, audio processing',
  },
  {
    id: 'analytics',
    label: 'Analytics & BI',
    description: 'Dashboards, data visualization, business intelligence',
  },
  {
    id: 'mobile-app',
    label: 'Mobile AI App',
    description: 'iOS/Android apps with AI integration',
  },
  {
    id: 'media-analysis',
    label: 'Media & Content AI',
    description: 'Content analysis, media monitoring, bias detection',
  },
  {
    id: 'fintech',
    label: 'Payments & Fintech',
    description: 'Payment systems, remittance, financial tools',
  },
  {
    id: 'multilingual',
    label: 'Multi-language AI',
    description: 'Spanish, Portuguese, French language AI apps',
  },
]

export const projectMatches: Record<string, MatchedProject[]> = {
  'chat-ai': [
    {
      title: 'Inteligencia Artificial Gratis',
      description: 'Spanish-first AI assistant with 100K+ users across 12 countries',
      url: 'https://apps.apple.com/us/app/inteligencia-artificial/id6742691248',
      stats: '100K+ users',
    },
    {
      title: 'World AI',
      description: 'Multi-language AI chat assistant with conversational memory',
      url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
    },
  ],
  'video-analysis': [
    {
      title: 'Pet Health Scan',
      description: 'Real-time video AI for pet health diagnostics with gait analysis',
      url: '/case-studies/pet-health-scan',
      stats: 'Gemini 3.0 powered',
    },
    {
      title: 'Pulse Wire',
      description: 'Media analysis platform with video content processing',
      url: '/case-studies/pulse-wire-media-transparency',
    },
  ],
  'voice-ai': [
    {
      title: 'Voz 2.0',
      description: 'Voice-first AI assistant with sub-200ms response latency',
      url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
    },
    {
      title: 'Tourist AI Audio Guide',
      description: 'Location-aware audio tour guide with natural voice narration',
      url: '/case-studies/tourist-ai-audio-guide',
    },
  ],
  analytics: [
    {
      title: 'Analytics Dashboard',
      description: 'Multi-property GA4 dashboard with predictive insights—built in 1 day',
      url: '/case-studies/analytics-dashboard',
      stats: '24 properties',
    },
  ],
  'mobile-app': [
    {
      title: '30+ iOS Apps Shipped',
      description: '10+ years of Swift experience, from concept to App Store',
      url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
      stats: '1M+ users',
    },
    {
      title: 'Pet Health Scan',
      description: 'Native iOS app with real-time video AI integration',
      url: '/case-studies/pet-health-scan',
    },
  ],
  'media-analysis': [
    {
      title: 'Pulse Wire',
      description: 'Media transparency platform with ownership tracking, hypocrisy detection, and propaganda scoring',
      url: '/case-studies/pulse-wire-media-transparency',
      stats: '5 AI agents',
    },
    {
      title: 'Bias Lens',
      description: 'Media literacy tool for detecting bias in news coverage',
      url: '/case-studies/bias-lens-media-literacy',
    },
  ],
  fintech: [
    {
      title: 'EnvioPlata',
      description: 'Full remittance platform with 16-country coverage—built in 4 weeks',
      url: '/case-studies/envioplata-remittance',
      stats: '16 countries',
    },
    {
      title: 'FirstAgent',
      description: 'AP2 payment protocol pioneer—built before Google announced theirs',
      url: '/case-studies/firstagent-ai-payments',
    },
  ],
  multilingual: [
    {
      title: 'Inteligencia Artificial Gratis',
      description: 'Spanish-first AI dominating LATAM markets',
      url: 'https://apps.apple.com/us/app/inteligencia-artificial/id6742691248',
      stats: '100K+ users, 12 countries',
    },
    {
      title: 'Portuguese IA / Intelligenca Artificiel',
      description: 'Portuguese and French language AI assistants',
      url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
    },
  ],
}

export function getMatchedProjects(selectedCategories: string[]): MatchedProject[] {
  const matches = new Map<string, MatchedProject>()

  for (const category of selectedCategories) {
    const categoryProjects = projectMatches[category] || []
    for (const project of categoryProjects) {
      // Use title as key to avoid duplicates
      if (!matches.has(project.title)) {
        matches.set(project.title, project)
      }
    }
  }

  return Array.from(matches.values())
}
