import { Service, Product, Testimonial, Stat } from './types'
import { Brain, Smartphone, Zap, Link, Globe, Rocket } from 'lucide-react'

export const SERVICES: Service[] = [
  {
    icon: Brain,
    title: "AI Strategy & Consulting",
    description: "Transform your business with tailored AI solutions. We analyze your workflows and implement intelligent automation.",
    features: ["Custom AI roadmaps", "Process automation", "Cost reduction analysis", "Implementation support"]
  },
  {
    icon: Smartphone,
    title: "Custom App Development",
    description: "From idea to App Store. We build beautiful, functional mobile apps that users love.",
    features: ["iOS & Android", "Cloud integration", "Real-time features", "App Store optimization"]
  },
  {
    icon: Zap,
    title: "AI Automation",
    description: "Eliminate repetitive tasks. Our AI-powered automation saves time and reduces errors.",
    features: ["Workflow automation", "Data processing", "Smart notifications", "Integration with existing tools"]
  },
  {
    icon: Link,
    title: "API Integration",
    description: "Connect your systems seamlessly. We integrate AI APIs and build custom solutions.",
    features: ["OpenAI integration", "Custom APIs", "Third-party services", "Scalable architecture"]
  },
  {
    icon: Globe,
    title: "Spanish Localization",
    description: "Reach Hispanic markets. Expert translation and cultural adaptation for your apps.",
    features: ["Native translation", "Cultural adaptation", "Market research", "Launch support"]
  },
  {
    icon: Rocket,
    title: "Rapid MVP Development",
    description: "Validate your ideas fast. Launch in weeks, not months, with our proven process.",
    features: ["2-4 week delivery", "Iterative development", "User testing", "Market-ready products"]
  }
]

export const PRODUCTS: Product[] = [
  {
    name: "Moneylyze",
    description: "AI-powered expense tracking with intelligent categorization and insights",
    image: "/placeholder.svg",
    rating: 4.8,
    downloads: "10K+",
    appStoreUrl: "https://apps.apple.com/us/app/moneylyze-ai-expense-tracker/id6738390260",
    category: "Finance"
  },
  {
    name: "Nutrivision AI",
    description: "Snap photos of your meals and get instant nutrition analysis",
    image: "/placeholder.svg",
    rating: 4.7,
    downloads: "25K+",
    appStoreUrl: "https://apps.apple.com/us/app/nutrivision-ai-calorie-counter/id6738401913",
    category: "Health"
  },
  {
    name: "Workout Planner AI",
    description: "Personalized fitness plans powered by artificial intelligence",
    image: "/placeholder.svg",
    rating: 4.9,
    downloads: "50K+",
    appStoreUrl: "https://apps.apple.com/us/app/workout-planner-ai/id6738405073",
    category: "Fitness"
  },
  {
    name: "Mealify AI",
    description: "AI meal planning based on your preferences and dietary needs",
    image: "/placeholder.svg",
    rating: 4.6,
    downloads: "15K+",
    appStoreUrl: "https://apps.apple.com/us/app/mealify-ai-meal-planner/id6738407656",
    category: "Food"
  },
  {
    name: "Fit AI",
    description: "Your AI fitness companion for smarter workouts",
    image: "/placeholder.svg",
    rating: 4.8,
    downloads: "30K+",
    appStoreUrl: "https://apps.apple.com/us/app/fit-ai-your-ai-fitness-coach/id6738411208",
    category: "Fitness"
  },
  {
    name: "Studymate AI",
    description: "AI-powered study assistant for better learning outcomes",
    image: "/placeholder.svg",
    rating: 4.7,
    downloads: "20K+",
    appStoreUrl: "https://apps.apple.com/us/app/studymate-ai-tutor/id6738415892",
    category: "Education"
  }
]

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "AI 4U Labs transformed our business processes. We're saving 40 hours per week on manual data entry.",
    author: "Sarah Johnson",
    role: "Operations Director",
    company: "TechFlow Inc",
    image: "/placeholder.svg"
  },
  {
    quote: "The mobile app they built exceeded our expectations. Our user engagement increased by 200%.",
    author: "Michael Chen",
    role: "CEO",
    company: "StartupHub",
    image: "/placeholder.svg"
  },
  {
    quote: "Professional, responsive, and incredibly talented. They delivered our MVP in just 3 weeks.",
    author: "Maria Rodriguez",
    role: "Founder",
    company: "HealthTech Solutions",
    image: "/placeholder.svg"
  }
]

export const STATS: Stat[] = [
  { value: "$25M+", label: "Client Savings Generated" },
  { value: "50+", label: "Apps Developed" },
  { value: "500K+", label: "Active Users" },
  { value: "98%", label: "Client Satisfaction" }
]

export const COMPANY_INFO = {
  name: "AI 4U Labs",
  email: "edison@ai4ulabs.com",
  phone: "+1 (239) 555-0123",
  location: "Naples, Florida",
  founded: "2023",
  description: "AI consulting and custom app development for forward-thinking businesses",
  social: {
    twitter: "https://twitter.com/ai4ulabs",
    linkedin: "https://linkedin.com/company/ai4ulabs",
    github: "https://github.com/edisonjoao1"
  }
}
