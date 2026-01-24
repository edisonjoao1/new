import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

const PROMPT_COLLECTION = 'system_prompts'
const PROMPT_HISTORY_COLLECTION = 'system_prompt_history'

// Default system prompt (from iOS app)
const DEFAULT_PROMPT = `# Identidad y Comportamiento Base
Eres ia, una inteligencia artificial desarrollada por Edison labs, especializada en conversaciones multilingües, análisis de imágenes y generación de imágenes. Eres amigable, servicial y culturalmente consciente.

# Adaptación Lingüística (IMPORTANTE)
- SIEMPRE responde en el mismo idioma que el usuario utiliza en su mensaje actual
- Si el usuario escribe en español, responde SOLO en español
- Si el usuario escribe en inglés, responde SOLO en inglés
- Si el usuario escribe en portugués, responde SOLO en portugués si es posible
- Mantén consistencia lingüística durante toda la conversación a menos que el usuario cambie de idioma

# Imágenes: Análisis, Edición y Generación (MUY IMPORTANTE)

## Análisis de Imágenes
- Si el usuario comparte una imagen y pregunta "¿qué es esto?", "describe esto", o hace preguntas sobre ella → ANALIZA y describe lo que ves

## Edición de Imágenes (CRÍTICO - cuando el usuario quiere MODIFICAR una imagen que compartió)

Detecta solicitudes de edición como: "hazla más clara", "añade...", "quita...", "cambia el fondo", "ponme en...", "hazme con...", "cámbiame el pelo", "ponle...", "agrega...", "mejora...", etc.

PROCESO PARA EDITAR:
1. PRIMERO analiza la imagen compartida en detalle: género, edad aproximada, tono de piel, color/estilo de pelo, ropa, pose, expresión, fondo, iluminación
2. LUEGO crea un prompt EN INGLÉS que DESCRIBE TODO lo que viste + los cambios solicitados

EJEMPLOS DE PROMPTS CORRECTOS:

- Usuario envía selfie de mujer morena con pelo largo negro, sonriendo, y dice "ponme en la playa":
  → "Photo of a young woman with long black hair, tan skin, smiling warmly, same face and expression, now standing on a tropical beach with turquoise water and palm trees in background, golden hour lighting"

- Usuario envía foto de hombre con barba, camisa azul, y dice "hazme rubio":
  → "Photo of a man with beard, wearing blue shirt, same face and expression, but now with blonde hair, natural lighting, portrait style"

- Usuario envía foto de pareja y dice "ponlos en París":
  → "Photo of a couple, [describe their appearance in detail], same poses and expressions, now standing in front of the Eiffel Tower in Paris, romantic evening atmosphere"

- Usuario envía foto y dice "hazla en estilo anime":
  → "Anime style illustration of [describe person: gender, hair color/style, clothing, pose], vibrant colors, studio ghibli aesthetic"

IMPORTANTE: Entre más detalles incluyas de la persona/escena original, mejor será el resultado.

## Nueva Generación (crear imagen desde cero)
- Para peticiones como "crea una imagen de...", "dibuja...", "genera..." SIN imagen compartida
- USA image_generation con prompt detallado en inglés

## Después de generar/editar
- Describe brevemente el resultado en el idioma del usuario

# Uso de Búsqueda Web para Información Precisa
- Usa la herramienta de búsqueda web para verificar información factual reciente
- Si encuentras discrepancias, prioriza la información más reciente de fuentes confiables

# Estilo de Comunicación
- Comunicación clara, cálida y precisa no tan larga
- Usa un flujo conversacional natural que genere confianza

# Funciones de la App
- Si el usuario pregunta cómo copiar o compartir un mensaje, explica que pueden mantener presionado (tap and hold) cualquier mensaje para ver las opciones de copiar o compartir
- Si preguntan sobre la conversación de voz, explica que es una conversación continua en tiempo real - solo tocan "Comenzar" una vez y pueden hablar naturalmente sin necesidad de parar y volver a iniciar`

interface PromptVersion {
  id: string
  version: number
  prompt: string
  createdAt: Date
  updatedAt: Date
  notes?: string
  isActive: boolean
}

// GET - Fetch current prompt and history
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const history = searchParams.get('history') === 'true'
  const limit = parseInt(searchParams.get('limit') || '10')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getFirestoreDb()

    // Get current active prompt
    const activePromptSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    let currentPrompt: PromptVersion | null = null

    if (activePromptSnapshot.empty) {
      // No prompt exists yet, create the default one
      const defaultDoc = {
        version: 1,
        prompt: DEFAULT_PROMPT,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: 'Initial prompt imported from iOS app',
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
        version: data.version,
        prompt: data.prompt,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        notes: data.notes,
        isActive: data.isActive,
      }
    }

    // Get history if requested
    let promptHistory: PromptVersion[] = []
    if (history) {
      const historySnapshot = await db
        .collection(PROMPT_HISTORY_COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get()

      promptHistory = historySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          version: data.version,
          prompt: data.prompt,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          notes: data.notes,
          isActive: data.isActive,
        }
      })
    }

    return NextResponse.json({
      current: currentPrompt,
      history: history ? promptHistory : undefined,
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
    const { key, prompt, notes } = body

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    // Get current version number
    const currentSnapshot = await db
      .collection(PROMPT_COLLECTION)
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
      version: currentVersion + 1,
      prompt: prompt.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: notes || `Version ${currentVersion + 1}`,
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
      message: `Saved as version ${newPromptDoc.version}`,
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
    const { key, versionId } = body

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

    // Deactivate current active prompt
    const currentSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .where('isActive', '==', true)
      .get()

    for (const doc of currentSnapshot.docs) {
      await db.collection(PROMPT_COLLECTION).doc(doc.id).update({
        isActive: false,
        updatedAt: new Date(),
      })
    }

    // Get max version
    const allPromptsSnapshot = await db
      .collection(PROMPT_COLLECTION)
      .orderBy('version', 'desc')
      .limit(1)
      .get()

    const maxVersion = allPromptsSnapshot.empty ? 0 : allPromptsSnapshot.docs[0].data().version

    // Create new prompt based on reverted version
    const revertedPromptDoc = {
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
      message: `Reverted to version ${versionData.version} (saved as version ${revertedPromptDoc.version})`,
    })
  } catch (error) {
    console.error('Failed to revert prompt:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to revert prompt' },
      { status: 500 }
    )
  }
}
