export interface Service {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  features: string[]
}

export interface Product {
  name: string
  description: string
  image: string
  rating: number
  downloads: string
  appStoreUrl: string
  category: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  image: string
}

export interface Stat {
  value: string
  label: string
}

export interface BlogPost {
  title: string
  excerpt: string
  slug: string
  date: string
  readTime: string
  author: string
  category: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export interface IdeaFormData {
  name: string
  email: string
  company?: string
  idea: string
  budget?: string
}
