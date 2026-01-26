import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'
import { PROMPT_TYPES, DEFAULT_PROMPTS, PROMPT_LABELS, type PromptType } from '@/app/api/app-config/route'

const PROMPT_COLLECTION = 'system_prompts'
const PROMPT_HISTORY_COLLECTION = 'system_prompt_history'

interface PromptVersion {
  id: string
  type: PromptType
  version: number
  prompt: string
  createdAt: Date | string
  updatedAt: Date | string
  notes?: string
  isActive: boolean
}

// GET - Fetch current prompt and history
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const history = searchParams.get('history') === 'true'
  const limit = parseInt(searchParams.get('limit') || '10')
  const promptType = (searchParams.get('type') as PromptType) || 'main'

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate prompt type
  if (!PROMPT_TYPES.includes(promptType as any)) {
    return NextResponse.json({ error: `Invalid prompt type. Valid types: ${PROMPT_TYPES.join(', ')}` }, { status: 400 })
  }

  try {
    const db = getFirestoreDb()

    let currentPrompt: PromptVersion | null = null

    // Get current active prompt for this type
    try {
      const activePromptSnapshot = await db
        .collection(PROMPT_COLLECTION)
        .where('type', '==', promptType)
        .where('isActive', '==', true)
        .limit(1)
        .get()

      if (activePromptSnapshot.empty) {
        // No prompt exists yet for this type, create the default one
        const defaultDoc = {
          type: promptType,
          version: 1,
          prompt: DEFAULT_PROMPTS[promptType],
          createdAt: new Date(),
          updatedAt: new Date(),
          notes: `Initial ${PROMPT_LABELS[promptType]} prompt`,
          isActive: true,
        }

        const docRef = await db.collection(PROMPT_COLLECTION).add(defaultDoc)
        currentPrompt = { id: docRef.id, ...defaultDoc }

        // Also save to history
        await db.collection(PROMPT_HISTORY_COLLECTION).add({
          promptId: docRef.id,
          ...defaultDoc,
        })
      } else {
        const doc = activePromptSnapshot.docs[0]
        const data = doc.data()
        currentPrompt = {
          id: doc.id,
          type: data.type || 'main',
          version: data.version,
          prompt: data.prompt,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          notes: data.notes,
          isActive: data.isActive,
        }
      }
    } catch (promptError: any) {
      // If query fails (e.g., missing index), return the default prompt
      console.warn('Failed to fetch prompt from DB, using default:', promptError?.message)
      currentPrompt = {
        id: 'default',
        type: promptType,
        version: 0,
        prompt: DEFAULT_PROMPTS[promptType],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Using default (database query failed)',
        isActive: true,
      }
    }

    // Get history if requested
    let promptHistory: PromptVersion[] = []
    let historyError: string | null = null
    if (history) {
      try {
        // Try the optimized query (requires composite index)
        const historySnapshot = await db
          .collection(PROMPT_HISTORY_COLLECTION)
          .where('type', '==', promptType)
          .orderBy('createdAt', 'desc')
          .limit(limit)
          .get()

        promptHistory = historySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            type: data.type || 'main',
            version: data.version,
            prompt: data.prompt,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            notes: data.notes,
            isActive: data.isActive,
          }
        })
      } catch (indexError: any) {
        // If index doesn't exist, fall back to simpler query
        if (indexError?.code === 9 || indexError?.message?.includes('index')) {
          console.warn('Firebase index missing for history query, using fallback')
          historyError = 'History requires Firebase index. Create it at: https://console.firebase.google.com/project/inteligencia-artificial-6a543/firestore/indexes'

          // Fallback: fetch without orderBy, sort in memory
          try {
            const fallbackSnapshot = await db
              .collection(PROMPT_HISTORY_COLLECTION)
              .where('type', '==', promptType)
              .limit(50)
              .get()

            promptHistory = fallbackSnapshot.docs
              .map(doc => {
                const data = doc.data()
                return {
                  id: doc.id,
                  type: data.type || 'main',
                  version: data.version,
                  prompt: data.prompt,
                  createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                  updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                  notes: data.notes,
                  isActive: data.isActive,
                }
              })
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, limit)
          } catch (fallbackError) {
            console.error('Fallback history query also failed:', fallbackError)
          }
        } else {
          throw indexError
        }
      }
    }

    // Also return all prompt types with their current versions for the UI
    const allPromptsSummary: { type: PromptType; version: number; hasCustom: boolean }[] = []

    for (const type of PROMPT_TYPES) {
      try {
        const typeSnapshot = await db
          .collection(PROMPT_COLLECTION)
          .where('type', '==', type)
          .where('isActive', '==', true)
          .limit(1)
          .get()

        if (!typeSnapshot.empty) {
          const data = typeSnapshot.docs[0].data()
          allPromptsSummary.push({
            type: type,
            version: data.version || 1,
            hasCustom: true,
          })
        } else {
          allPromptsSummary.push({
            type: type,
            version: 0,
            hasCustom: false,
          })
        }
      } catch (typeError) {
        // If query fails, mark as no custom prompt
        allPromptsSummary.push({
          type: type,
          version: 0,
          hasCustom: false,
        })
      }
    }

    return NextResponse.json({
      current: currentPrompt,
      history: history ? promptHistory : undefined,
      historyWarning: historyError || undefined,
      allPrompts: allPromptsSummary,
      promptTypes: PROMPT_TYPES,
      promptLabels: PROMPT_LABELS,
    })
  } catch (error) {
    console.error('Failed to fetch system prompt:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch prompt' },
      { status: 500 }
    )
  }
}

// POST - Save new prompt version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, prompt, notes, type: promptType = 'main' } = body

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Validate prompt type
    if (!PROMPT_TYPES.includes(promptType as any)) {
      return NextResponse.json({ error: `Invalid prompt type. Valid types: ${PROMPT_TYPES.join(', ')}` }, { status: 400 })
    }

    const db = getFirestoreDb()

    // Get current version number for this type
    const currentSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('type', '==', promptType)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    let currentVersion = 0
    if (!currentSnapshot.empty) {
      const currentData = currentSnapshot.docs[0].data()
      currentVersion = currentData.version || 0

      // Deactivate current prompt
      await db.collection(PROMPT_COLLECTION).doc(currentSnapshot.docs[0].id).update({
        isActive: false,
        updatedAt: new Date(),
      })
    }

    // Create new prompt version
    const newPromptDoc = {
      type: promptType,
      version: currentVersion + 1,
      prompt: prompt.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: notes || `${PROMPT_LABELS[promptType as PromptType]} v${currentVersion + 1}`,
      isActive: true,
    }

    const docRef = await db.collection(PROMPT_COLLECTION).add(newPromptDoc)

    // Save to history
    await db.collection(PROMPT_HISTORY_COLLECTION).add({
      promptId: docRef.id,
      ...newPromptDoc,
    })

    return NextResponse.json({
      success: true,
      prompt: { id: docRef.id, ...newPromptDoc },
      message: `Saved ${PROMPT_LABELS[promptType as PromptType]} as version ${newPromptDoc.version}`,
    })
  } catch (error) {
    console.error('Failed to save system prompt:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save prompt' },
      { status: 500 }
    )
  }
}

// PUT - Revert to a previous version
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, versionId, type: promptType = 'main' } = body

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!versionId) {
      return NextResponse.json({ error: 'Version ID is required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    // Get the version to revert to
    const versionDoc = await db.collection(PROMPT_HISTORY_COLLECTION).doc(versionId).get()
    if (!versionDoc.exists) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    const versionData = versionDoc.data()!
    const revertType = versionData.type || promptType

    // Deactivate current active prompt for this type
    const currentSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('type', '==', revertType)
      .where('isActive', '==', true)
      .get()

    for (const doc of currentSnapshot.docs) {
      await db.collection(PROMPT_COLLECTION).doc(doc.id).update({
        isActive: false,
        updatedAt: new Date(),
      })
    }

    // Get max version for this type
    const allPromptsSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('type', '==', revertType)
      .orderBy('version', 'desc')
      .limit(1)
      .get()

    const maxVersion = allPromptsSnapshot.empty ? 0 : allPromptsSnapshot.docs[0].data().version

    // Create new prompt based on reverted version
    const revertedPromptDoc = {
      type: revertType,
      version: maxVersion + 1,
      prompt: versionData.prompt,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: `Reverted to version ${versionData.version}`,
      isActive: true,
    }

    const docRef = await db.collection(PROMPT_COLLECTION).add(revertedPromptDoc)

    // Save to history
    await db.collection(PROMPT_HISTORY_COLLECTION).add({
      promptId: docRef.id,
      ...revertedPromptDoc,
    })

    return NextResponse.json({
      success: true,
      prompt: { id: docRef.id, ...revertedPromptDoc },
      message: `Reverted ${PROMPT_LABELS[revertType as PromptType]} to version ${versionData.version} (saved as version ${revertedPromptDoc.version})`,
    })
  } catch (error) {
    console.error('Failed to revert prompt:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to revert prompt' },
      { status: 500 }
    )
  }
}

// DELETE - Reset a prompt type to default
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')
    const promptType = (searchParams.get('type') as PromptType) || 'main'

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate prompt type
    if (!PROMPT_TYPES.includes(promptType as any)) {
      return NextResponse.json({ error: `Invalid prompt type. Valid types: ${PROMPT_TYPES.join(', ')}` }, { status: 400 })
    }

    const db = getFirestoreDb()

    // Deactivate all prompts for this type
    const currentSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('type', '==', promptType)
      .where('isActive', '==', true)
      .get()

    for (const doc of currentSnapshot.docs) {
      await db.collection(PROMPT_COLLECTION).doc(doc.id).update({
        isActive: false,
        updatedAt: new Date(),
      })
    }

    // Get max version for this type
    const allPromptsSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('type', '==', promptType)
      .orderBy('version', 'desc')
      .limit(1)
      .get()

    const maxVersion = allPromptsSnapshot.empty ? 0 : allPromptsSnapshot.docs[0].data().version

    // Create new prompt with default content
    const defaultPromptDoc = {
      type: promptType,
      version: maxVersion + 1,
      prompt: DEFAULT_PROMPTS[promptType],
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: `Reset to default`,
      isActive: true,
    }

    const docRef = await db.collection(PROMPT_COLLECTION).add(defaultPromptDoc)

    // Save to history
    await db.collection(PROMPT_HISTORY_COLLECTION).add({
      promptId: docRef.id,
      ...defaultPromptDoc,
    })

    return NextResponse.json({
      success: true,
      prompt: { id: docRef.id, ...defaultPromptDoc },
      message: `Reset ${PROMPT_LABELS[promptType]} to default (saved as version ${defaultPromptDoc.version})`,
    })
  } catch (error) {
    console.error('Failed to reset prompt:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset prompt' },
      { status: 500 }
    )
  }
}
