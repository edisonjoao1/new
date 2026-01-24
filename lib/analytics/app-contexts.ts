// App context structure for AI analysis
export interface AppContext {
  propertyId: string
  appName: string
  displayName: string
  description: string
  category: 'ai-assistant' | 'health' | 'relationships' | 'productivity' | 'lifestyle' | 'finance' | 'education' | 'entertainment' | 'utility' | 'other'
  targetAudience: string
  monetization: 'freemium' | 'subscription' | 'iap' | 'ads' | 'paid' | 'hybrid'
  platforms: ('ios' | 'android' | 'web')[]
  keyFeatures: string[]
  kpiTargets?: {
    dauMau?: number      // Target DAU/MAU ratio percentage
    d1Retention?: number // Target D1 retention percentage
    d7Retention?: number // Target D7 retention percentage
    d30Retention?: number // Target D30 retention percentage
  }
}

export interface AppContextsConfig {
  properties: Record<string, AppContext>
  categoryBenchmarks: Record<string, {
    avgDauMau: number
    avgD1Retention: number
    avgD7Retention: number
  }>
}

// Import app contexts from JSON
import appContextsData from './app-contexts.json'

export function getAppContext(propertyId: string): AppContext | null {
  const config = appContextsData as AppContextsConfig
  return config.properties[propertyId] || null
}

export function getAllAppContexts(): Record<string, AppContext> {
  const config = appContextsData as AppContextsConfig
  return config.properties
}

export function getCategoryBenchmark(category: string) {
  const config = appContextsData as AppContextsConfig
  return config.categoryBenchmarks[category] || config.categoryBenchmarks['other']
}

export function getPortfolioSummary(): string {
  const config = appContextsData as AppContextsConfig
  const apps = Object.values(config.properties)
  const categories = [...new Set(apps.map(a => a.category))]

  return `Portfolio of ${apps.length} apps across ${categories.length} categories: ${categories.join(', ')}`
}
