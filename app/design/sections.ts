export interface Section {
  id: string
  title: string
  roman: string
  description: string
  tagline?: string
  image: string
  imageAlt: string
  features?: {
    title: string
    description: string
    url?: string
    urlType?: 'app' | 'external' | 'email'
  }[]
}

const imageBase = '/images/design'

export const sections: Section[] = [
  {
    id: 'hero',
    title: 'The AI Renaissance',
    roman: '',
    description: 'Building million-dollar apps with 90% less people. 30+ apps. 1M+ users. Weeks, not years.',
    image: `${imageBase}/calling-of-saint-matthew.jpg`,
    imageAlt: 'The Calling of Saint Matthew by Caravaggio',
  },
  {
    id: 'revolution',
    title: 'The Revolution',
    roman: 'I',
    tagline: '90% less. 10x faster.',
    description: 'What used to take teams of 100 engineers and years to build, we ship in weeks. AI-augmented development isn\'t the future—it\'s how we work today.',
    image: `${imageBase}/judith-beheading.jpg`,
    imageAlt: 'Judith Beheading Holofernes by Caravaggio',
    features: [
      {
        title: 'EnvioPlata — Xoom in 4 Weeks',
        description: 'Full remittance platform with 16-country coverage. What took Xoom, Remitly, and Wise years to build.',
        url: '/case-studies/envioplata-remittance',
        urlType: 'external',
      },
      {
        title: 'Pulse Wire — Media Intelligence',
        description: 'Multi-agent newsroom AI that tracks ownership, detects hypocrisy, and scores propaganda. 4 weeks.',
        url: '/case-studies/pulse-wire-media-transparency',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'workshop',
    title: 'The Workshop',
    roman: 'II',
    tagline: 'Where intelligence is forged',
    description: 'AI 4U Labs is the modern bottega. A studio where artificial minds and human vision converge to build products that matter.',
    image: `${imageBase}/boy-with-basket.jpg`,
    imageAlt: 'Boy with a Basket of Fruit by Caravaggio',
    features: [
      {
        title: 'Full-Stack AI Development',
        description: 'iOS, web, backend, AI integration. One team, complete execution. No handoffs, no delays.',
        url: 'https://ai4u.space',
        urlType: 'external',
      },
      {
        title: 'World-Class Design',
        description: 'Beautiful interfaces that people actually use. Product design thinking in every pixel.',
        url: 'https://ai4u.space',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'velocity',
    title: 'The Velocity',
    roman: 'III',
    tagline: 'Speed as a feature',
    description: 'Michelangelo painted the Sistine Chapel in four years. Your MVP ships in four weeks. Some in one day. The Renaissance, accelerated.',
    image: `${imageBase}/taking-of-christ.jpg`,
    imageAlt: 'The Taking of Christ by Caravaggio',
    features: [
      {
        title: '1 Day — Fastest MVP',
        description: 'Concept to App Store approved in 24 hours. When the vision is clear, execution is swift.',
        url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
        urlType: 'app',
      },
      {
        title: '2-4 Weeks — Typical Timeline',
        description: 'Production-ready apps with AI integration, beautiful design, and scalable architecture.',
        url: '/case-studies',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'intelligence',
    title: 'The Guild',
    roman: 'IV',
    tagline: 'Collective intelligence',
    description: 'Renaissance workshops had masters and apprentices. Our guild: GPT-5, Claude Opus 4.5, Gemini 3.0. Each with its genius, orchestrated as one.',
    image: `${imageBase}/narcissus.jpg`,
    imageAlt: 'Narcissus by Caravaggio',
    features: [
      {
        title: 'Multi-Model Architecture',
        description: 'GPT for conversation and analysis. Gemini for video and image generation. Claude for reasoning. The right model for every task.',
        url: '/services',
        urlType: 'external',
      },
      {
        title: '15+ MCP Servers Built',
        description: 'Custom Model Context Protocol servers for specialized AI workflows. Extend any AI with your tools.',
        url: '/services',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'gallery',
    title: 'The Gallery',
    roman: 'V',
    tagline: 'The collection',
    description: 'Health AI. Finance. Media analysis. Voice assistants. Bible study. Pet diagnostics. Every app a canvas, every user an audience.',
    image: `${imageBase}/denial-of-peter.jpg`,
    imageAlt: 'The Denial of Saint Peter by Caravaggio',
    features: [
      {
        title: '30+ Apps Shipped',
        description: 'Across wellness, fintech, media, religious tech, pet care, and more. All live. All serving users daily.',
        url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
        urlType: 'app',
      },
      {
        title: 'Pet Health Scan',
        description: 'Video analysis for pet health. AI that watches your pet walk and detects gait abnormalities. That\'s the future, shipping today.',
        url: '/case-studies/pet-health-scan',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'reach',
    title: 'The Piazza',
    roman: 'VI',
    tagline: 'Where people gather',
    description: 'Renaissance Florence had its public squares. We\'ve reached over a million users across 12+ countries. Spanish-first AI apps dominating LATAM.',
    image: `${imageBase}/cardsharps.jpg`,
    imageAlt: 'The Cardsharps by Caravaggio',
    features: [
      {
        title: 'Inteligencia Artificial Gratis',
        description: '100K+ users across 12 countries. Spanish-language AI that truly understands the culture.',
        url: 'https://apps.apple.com/us/app/inteligencia-artificial/id6742691248',
        urlType: 'app',
      },
      {
        title: '1M+ Users Reached',
        description: 'Real people. Real problems solved. Real impact across wellness, productivity, and connection.',
        url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
        urlType: 'app',
      },
    ],
  },
  {
    id: 'palette',
    title: 'The Palette',
    roman: 'VII',
    tagline: 'Every color, every tool',
    description: 'Caravaggio revolutionized chiaroscuro. Our palette: Swift, SwiftUI, Next.js, Node.js, OpenAI, Gemini, Firebase, PostgreSQL, AWS.',
    image: `${imageBase}/saint-jerome.jpg`,
    imageAlt: 'Saint Jerome Writing by Caravaggio',
    features: [
      {
        title: 'iOS Excellence',
        description: '10+ years in Swift. SwiftUI, UIKit, the entire Apple ecosystem. Native performance, native feel.',
        url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
        urlType: 'app',
      },
      {
        title: 'Modern Web',
        description: 'Next.js, React, TypeScript. Server components, edge functions, real-time capabilities.',
        url: 'https://ai4u.space',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'The Oracle',
    roman: 'VIII',
    tagline: 'Data that thinks ahead',
    description: 'We don\'t just build products—we predict what they need. AI-powered analytics that forecasts trends and surfaces insights before you ask.',
    image: `${imageBase}/fortune-teller.jpg`,
    imageAlt: 'The Fortune Teller by Caravaggio',
    features: [
      {
        title: 'Predictive Intelligence',
        description: 'AI analytics dashboard that auto-discovers properties, predicts user behavior, and recommends actions. Built in 1 day.',
        url: '/case-studies/analytics-dashboard',
        urlType: 'external',
      },
      {
        title: 'Data-Driven Development',
        description: 'Every feature decision backed by real user data. No guessing. No wasted effort.',
        url: '/case-studies/analytics-dashboard',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'trial',
    title: 'The Trial',
    roman: 'IX',
    tagline: 'Tested by fire',
    description: 'Caravaggio fled Rome after killing a man. We\'ve faced our own trials. Some lessons only devastation can teach. We emerged with absolute intent.',
    image: `${imageBase}/supper-at-emmaus.jpg`,
    imageAlt: 'The Supper at Emmaus by Caravaggio',
    features: [
      {
        title: 'Absolute Intent',
        description: 'No more art for art\'s sake. Every creation solves a problem. Every product leaves a legacy.',
        url: 'https://ai4u.space',
        urlType: 'external',
      },
    ],
  },
  {
    id: 'opus',
    title: 'The Opus',
    roman: 'X',
    tagline: 'The body of work',
    description: 'A Renaissance studio is measured by its works. Three years. Thirty apps. One million users. The ledger speaks.',
    image: `${imageBase}/inspiration-of-matthew.jpg`,
    imageAlt: 'The Inspiration of Saint Matthew by Caravaggio',
    features: [
      {
        title: 'Living Creations',
        description: 'Not museum pieces. Living, breathing products generating revenue, solving problems, touching lives daily.',
        url: 'https://apps.apple.com/us/developer/edison-espinosa/id1368707952',
        urlType: 'app',
      },
    ],
  },
  {
    id: 'commission',
    title: 'The Commission',
    roman: 'XI',
    tagline: 'Your masterpiece awaits',
    description: 'Every Renaissance master needed a patron with vision. Every patron needed a master who could execute. Let\'s create something timeless.',
    image: `${imageBase}/david-with-goliath.jpg`,
    imageAlt: 'David with the Head of Goliath by Caravaggio',
    features: [
      {
        title: 'Start Your Project',
        description: 'The workshop is ready. The guild stands by. What shall we build together?',
        url: 'mailto:edison@ai4u.space',
        urlType: 'email',
      },
      {
        title: 'View Case Studies',
        description: 'See how we\'ve helped others build million-dollar apps in weeks.',
        url: '/case-studies',
        urlType: 'external',
      },
    ],
  },
]

export const navSections = sections.filter((s) => s.roman !== '')
