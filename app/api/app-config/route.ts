import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

const PROMPT_COLLECTION = 'system_prompts'
const CONFIG_COLLECTION = 'app_config'

// Default system prompt (fallback if Firebase fails)
const DEFAULT_PROMPT = `You are a helpful AI assistant. Respond in the same language the user writes in.`

interface AppConfig {
  systemPrompt: string
  promptVersion: number
  updatedAt: string
  // Add more config options as needed
  features?: {
    imageGeneration?: boolean
    voiceChat?: boolean
    webSearch?: boolean
  }
  announcements?: {
    message: string
    type: 'info' | 'warning' | 'promo'
    dismissible: boolean
    expiresAt?: string
  }[]
}

// GET - Public endpoint for iOS app to fetch current config
// No authentication required - this is called by the app on launch
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const appId = searchParams.get('app') || 'default'
  const includePrompt = searchParams.get('prompt') !== 'false'

  // Cache control - allow CDN caching for 5 minutes
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  }

  try {
    const db = getFirestoreDb()

    // Try to get app-specific config first
    let configDoc = await db.collection(CONFIG_COLLECTION).doc(appId).get()

    // Fall back to default config if app-specific doesn't exist
    if (!configDoc.exists && appId !== 'default') {
      configDoc = await db.collection(CONFIG_COLLECTION).doc('default').get()
    }

    let systemPrompt = DEFAULT_PROMPT
    let promptVersion = 0
    let updatedAt = new Date().toISOString()

    // Get the active system prompt
    if (includePrompt) {
      const promptSnapshot = await db
        .collection(PROMPT_COLLECTION)
        .where('isActive', '==', true)
        .limit(1)
        .get()

      if (!promptSnapshot.empty) {
        const promptData = promptSnapshot.docs[0].data()
        systemPrompt = promptData.prompt
        promptVersion = promptData.version
        updatedAt = promptData.updatedAt?.toDate?.()?.toISOString() || updatedAt
      }
    }

    // Build response
    const config: AppConfig = {
      systemPrompt: includePrompt ? systemPrompt : '',
      promptVersion,
      updatedAt,
    }

    // Merge with stored config if it exists
    if (configDoc.exists) {
      const storedConfig = configDoc.data()
      config.features = storedConfig?.features
      config.announcements = storedConfig?.announcements?.filter((a: any) => {
        if (!a.expiresAt) return true
        return new Date(a.expiresAt) > new Date()
      })
    }

    return NextResponse.json(config, { headers })
  } catch (error) {
    console.error('Failed to fetch app config:', error)

    // Return minimal fallback config so app doesn't break
    return NextResponse.json({
      systemPrompt: includePrompt ? DEFAULT_PROMPT : '',
      promptVersion: 0,
      updatedAt: new Date().toISOString(),
      error: 'Using fallback config',
    }, { headers, status: 200 }) // Still return 200 so app works
  }
}

// POST - Update app config (requires auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, appId = 'default', features, announcements } = body

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getFirestoreDb()

    const configUpdate: any = {
      updatedAt: new Date(),
    }

    if (features !== undefined) {
      configUpdate.features = features
    }

    if (announcements !== undefined) {
      configUpdate.announcements = announcements
    }

    await db.collection(CONFIG_COLLECTION).doc(appId).set(configUpdate, { merge: true })

    return NextResponse.json({
      success: true,
      message: `Config updated for app: ${appId}`,
    })
  } catch (error) {
    console.error('Failed to update app config:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update config' },
      { status: 500 }
    )
  }
}
