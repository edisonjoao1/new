import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb, getFirebaseMessaging } from '@/lib/firebase/admin'
import { NOTIFICATION_TEMPLATES, resolveTemplate } from '@/lib/notifications/templates'
import { FieldValue } from 'firebase-admin/firestore'
import OpenAI from 'openai'

const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD

function checkAuth(request: NextRequest, body?: Record<string, unknown>): boolean {
  const key = request.nextUrl.searchParams.get('key') ||
    request.headers.get('x-analytics-key') ||
    (body?.key as string)
  return key === ANALYTICS_PASSWORD
}

// Send a single push notification
async function sendPush(
  fcmToken: string,
  title: string,
  body: string,
  targetView: string,
  source: string
) {
  const messaging = getFirebaseMessaging()
  const message = {
    token: fcmToken,
    notification: { title, body },
    data: {
      type: 'dashboard_push',
      targetView,
      source,
      timestamp: new Date().toISOString(),
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: 'default' as const,
        },
      },
    },
  }
  return messaging.send(message)
}

// Log notification to user's notification_history subcollection
async function logNotification(
  db: FirebaseFirestore.Firestore,
  userId: string,
  title: string,
  body: string,
  source: string,
  targetView: string
) {
  await db.collection('users').doc(userId).collection('notification_history').add({
    title,
    body,
    source,
    targetView,
    sent_at: FieldValue.serverTimestamp(),
    sent_from: 'dashboard',
  })
}

// Generate an AI-powered notification using conversation context
async function generateAINotification(
  db: FirebaseFirestore.Firestore,
  userId: string
): Promise<{ title: string; body: string; targetView: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  // Read user data
  const userDoc = await db.collection('users').doc(userId).get()
  if (!userDoc.exists) throw new Error('User not found')
  const user = userDoc.data()!

  // Read last 3 conversations
  const convSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('conversations')
    .orderBy('created_at', 'desc')
    .limit(3)
    .get()

  const conversations = convSnapshot.docs.map(doc => {
    const data = doc.data()
    const messages = data.messages || []
    const firstUserMessage = messages.find((m: { role: string }) => m.role === 'user')
    return {
      title: data.title || 'Sin titulo',
      firstMessage: firstUserMessage?.content?.substring(0, 200) || '',
      messageCount: data.total_message_count || messages.length,
    }
  })

  // Build context
  const userName = user.user_name || ''
  const assistantName = user.assistant_name || 'IA'
  const interests = (user.interests || []).join(', ')
  const memories = (user.ai_memories_sample || []).slice(0, 5).join('; ')
  const recentTopics = (user.recent_conversation_topics || []).join(', ')
  const totalMessages = user.total_messages_sent || 0
  const locale = user.locale || 'es'

  const conversationContext = conversations
    .map(c => `- "${c.title}" (${c.messageCount} msgs): "${c.firstMessage}"`)
    .join('\n')

  const prompt = `You ARE the user's personal AI assistant from the app "Inteligencia Artificial Gratis".
${assistantName !== 'la IA' ? `The user named you "${assistantName}". Write as ${assistantName}.` : ''}
You're reaching out to someone you've been having real conversations with.
Your job is to write a SHORT push notification (like a quick text from a friend) that provides GENUINE VALUE.

USER CONTEXT:
- Name: ${userName || 'Unknown'}
- Interests: ${interests || 'Not set'}
- Total messages: ${totalMessages}
- Things you remember about them: ${memories || 'None yet'}
- Recent conversation topics: ${recentTopics || 'None'}
- Last conversations:
${conversationContext || '(No conversations yet)'}

CRITICAL RULES:
- Write in Spanish
- Title: STRICTLY max 25 characters. Body: STRICTLY 55-65 characters MAX.
- NEVER mention "la IA", "AI", "inteligencia artificial", or "la app" in third person. YOU are the assistant — speak in FIRST PERSON. Instead of "IA tiene consejos..." say "Tengo algo que contarte...". Instead of "Pídele a la IA..." say "¿Quieres que te ayude con...?". You're a friend texting, not an app advertising itself.
- NEVER be generic. Every notification must feel like it was written specifically for THIS user.
- NEVER say "vuelve", "te extrañamos", "come back" — that's pushy and generic.
- NEVER use vague phrases like "Descubre algo nuevo", "Hay cosas nuevas", "Explora más" — be SPECIFIC.
- BANNED words/patterns: "truco", "tip", "dato", "consejo", "prueba esto", "descubre", "¿Sabías que", "funcionalidades", "herramientas". Just talk like a real person texting.
- Reference something SPECIFIC from their conversations/memories/interests
- If they have conversations, pick up where you left off — reference a topic naturally
- Be warm, clever, and specific — not cheesy or corporate
- Include 1 relevant emoji max
- The ENTIRE message must be a complete thought — never end mid-sentence
- Title examples (use as inspiration, NOT literally): "Oye, pensé en algo 💭", "¿Y si hacemos esto?", "Para tu novia 💬", "Se me ocurrió algo", "Tengo una idea ✨"

FINAL CHECK: Count your characters. Title must be ≤25. Body must be 55-65 chars. A complete short message beats a truncated long one.

Return ONLY a JSON object: {"title": "...", "body": "...", "targetView": "chat"}`

  const openai = new OpenAI({ apiKey })
  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    store: true,
  })

  try {
    const text = response.output_text || ''
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in AI response')
    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: (parsed.title || '').substring(0, 25),
      body: (parsed.body || '').substring(0, 65),
      targetView: parsed.targetView || 'chat',
    }
  } catch {
    // Fallback if AI response can't be parsed
    return {
      title: userName ? `Oye ${userName.substring(0, 18)} 💭` : 'Pensé en algo 💭',
      body: memories ? `Me acordé de algo: ${memories.substring(0, 45)}` : '¿Seguimos con lo de la otra vez?',
      targetView: 'chat',
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!checkAuth(request, body)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mode } = body
    const db = getFirestoreDb()

    // === INDIVIDUAL MODE ===
    if (mode === 'individual') {
      const { userId, title, body: msgBody, targetView = 'chat' } = body
      if (!userId || !title || !msgBody) {
        return NextResponse.json({ error: 'Missing userId, title, or body' }, { status: 400 })
      }

      const userDoc = await db.collection('users').doc(userId).get()
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const fcmToken = userDoc.data()?.fcm_token
      if (!fcmToken) {
        return NextResponse.json({ error: 'User has no FCM token', sent: false }, { status: 400 })
      }

      try {
        await sendPush(fcmToken, title, msgBody, targetView, 'manual')
        await logNotification(db, userId, title, msgBody, 'manual', targetView)
        return NextResponse.json({ sent: true, userId })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ sent: false, error: errorMsg }, { status: 500 })
      }
    }

    // === AI-GENERATED MODE (preview or send) ===
    if (mode === 'ai') {
      const { userId, preview: previewOnly } = body
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
      }

      const notification = await generateAINotification(db, userId as string)

      // Preview mode — just return the generated notification without sending
      if (previewOnly) {
        return NextResponse.json({ preview: true, notification })
      }

      const userDoc = await db.collection('users').doc(userId as string).get()
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const fcmToken = userDoc.data()?.fcm_token
      if (!fcmToken) {
        return NextResponse.json({ error: 'User has no FCM token', sent: false }, { status: 400 })
      }

      try {
        await sendPush(fcmToken, notification.title, notification.body, notification.targetView, 'ai_generated')
        await logNotification(db, userId as string, notification.title, notification.body, 'ai_generated', notification.targetView)
        return NextResponse.json({ sent: true, userId, notification })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ sent: false, error: errorMsg, notification }, { status: 500 })
      }
    }

    // === AI SEND (confirmed after preview) ===
    if (mode === 'ai_send') {
      const { userId, title, body: msgBody, targetView } = body
      if (!userId || !title || !msgBody) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
      }

      const userDoc = await db.collection('users').doc(userId as string).get()
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const fcmToken = userDoc.data()?.fcm_token
      if (!fcmToken) {
        return NextResponse.json({ error: 'User has no FCM token', sent: false }, { status: 400 })
      }

      try {
        await sendPush(fcmToken, title as string, msgBody as string, (targetView as string) || 'chat', 'ai_generated')
        await logNotification(db, userId as string, title as string, msgBody as string, 'ai_generated', (targetView as string) || 'chat')
        return NextResponse.json({ sent: true, userId, notification: { title, body: msgBody, targetView } })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ sent: false, error: errorMsg }, { status: 500 })
      }
    }

    // === TEMPLATE MODE ===
    if (mode === 'template') {
      const { userId, templateId } = body
      if (!userId || !templateId) {
        return NextResponse.json({ error: 'Missing userId or templateId' }, { status: 400 })
      }

      const template = NOTIFICATION_TEMPLATES.find(t => t.id === templateId)
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }

      const userDoc = await db.collection('users').doc(userId).get()
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const userData = userDoc.data()!
      const fcmToken = userData.fcm_token
      if (!fcmToken) {
        return NextResponse.json({ error: 'User has no FCM token', sent: false }, { status: 400 })
      }

      const resolved = resolveTemplate(template, {
        name: userData.user_name,
        assistant_name: userData.assistant_name,
        messages: userData.total_messages_sent,
        memory_topic: (userData.ai_memories_sample || [])[0],
      })

      try {
        await sendPush(fcmToken, resolved.title, resolved.body, resolved.targetView, `template:${templateId}`)
        await logNotification(db, userId, resolved.title, resolved.body, `template:${templateId}`, resolved.targetView)
        return NextResponse.json({ sent: true, userId, notification: resolved })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ sent: false, error: errorMsg }, { status: 500 })
      }
    }

    // === SEGMENT MODE ===
    if (mode === 'segment') {
      const { segment, title, body: msgBody, targetView = 'chat' } = body
      if (!segment || !title || !msgBody) {
        return NextResponse.json({ error: 'Missing segment, title, or body' }, { status: 400 })
      }

      // Query users with FCM tokens matching the segment
      let query: FirebaseFirestore.Query = db.collection('users').where('fcm_token', '!=', '')

      // Apply segment filters
      switch (segment) {
        case 'churned':
          query = query.where('was_previously_premium', '==', true).where('is_subscribed', '==', false)
          break
        case 'subscribed':
          query = query.where('is_subscribed', '==', true)
          break
        case 'billing_retry':
          query = query.where('is_in_billing_retry', '==', true)
          break
        case 'at_risk':
          // Users inactive for 7+ days — can't query directly with Firestore
          // Fall through to fetch all and filter
          break
        default:
          // For other segments, fetch all and filter client-side
          break
      }

      const snapshot = await query.limit(500).get()
      let sent = 0
      let failed = 0
      let noToken = 0

      const messaging = getFirebaseMessaging()
      const batch: Promise<void>[] = []

      for (const doc of snapshot.docs) {
        const userData = doc.data()
        const fcmToken = userData.fcm_token

        if (!fcmToken) {
          noToken++
          continue
        }

        // Additional client-side segment filtering for segments that can't be queried
        if (segment === 'at_risk') {
          const lastActive = userData.last_active?.toDate?.() || userData.last_open_date?.toDate?.()
          if (lastActive) {
            const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
            if (daysSinceActive < 7) continue
          }
        }

        batch.push(
          sendPush(fcmToken, title, msgBody, targetView, `segment:${segment}`)
            .then(() => {
              sent++
              return logNotification(db, doc.id, title, msgBody, `segment:${segment}`, targetView)
            })
            .catch(() => { failed++ })
        )
      }

      await Promise.all(batch)

      return NextResponse.json({
        segment,
        sent,
        failed,
        noToken,
        total: snapshot.size,
      })
    }

    return NextResponse.json({ error: 'Invalid mode. Use: individual, ai, template, or segment' }, { status: 400 })
  } catch (error) {
    console.error('Push notification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    )
  }
}

// GET — notification history or templates
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const action = request.nextUrl.searchParams.get('action')

  if (action === 'templates') {
    return NextResponse.json({ templates: NOTIFICATION_TEMPLATES })
  }

  if (action === 'history') {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const db = getFirestoreDb()
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notification_history')
      .orderBy('sent_at', 'desc')
      .limit(10)
      .get()

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      sent_at: doc.data().sent_at?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ history })
  }

  return NextResponse.json({ error: 'Use ?action=templates or ?action=history&userId=...' }, { status: 400 })
}
