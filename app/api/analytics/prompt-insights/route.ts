import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'
import OpenAI from 'openai'
import { DEFAULT_PROMPTS, PROMPT_TYPES, PROMPT_LABELS, type PromptType } from '@/app/api/app-config/route'

// Lazy-load OpenAI client to avoid build-time errors
function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

// Cache for insights (1 hour TTL)
let insightsCache: { data: any; timestamp: number; promptType: string } | null = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: any
}

interface Conversation {
  id: string
  userId: string
  messages: Message[]
  created_at: any
  topics?: string[]
  success_score?: number
}

// Comprehensive pattern detection
interface ConversationAnalysis {
  id: string
  userId: string
  messageCount: number
  userMessageCount: number
  assistantMessageCount: number
  languages: string[]
  primaryLanguage: string
  requestTypes: string[]
  issues: string[]
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
  hasImageRequest: boolean
  hasImageEdit: boolean
  hasVoiceRequest: boolean
  hasCodeRequest: boolean
  hasTranslation: boolean
  hasEmergency: boolean
  hasSensitiveData: boolean
  hasRefusal: boolean
  hasEmptyResponse: boolean
  hasTruncation: boolean
  hasRepetition: boolean
  hasLanguageMismatch: boolean
  conversationLength: 'short' | 'medium' | 'long'
  userSatisfaction: 'satisfied' | 'frustrated' | 'neutral' | 'unknown'
  topicCategory: string
  firstUserMessage: string
  lastUserMessage: string
  notableExchanges: string[]
}

// Detect language from text
function detectLanguage(text: string): string {
  if (!text) return 'unknown'
  const lower = text.toLowerCase()

  // Spanish indicators
  const spanishWords = ['qué', 'cómo', 'está', 'gracias', 'hola', 'buenas', 'quiero', 'puedo', 'necesito', 'tengo', 'hacer', 'para', 'esto', 'eso', 'muy', 'bien', 'mal', 'sí', 'también', 'pero', 'porque', 'cuando', 'donde', 'quien', 'cual']
  const spanishCount = spanishWords.filter(w => lower.includes(w)).length

  // Portuguese indicators
  const portugueseWords = ['você', 'obrigado', 'olá', 'bom dia', 'boa tarde', 'não', 'sim', 'fazer', 'como', 'qual', 'esse', 'essa', 'muito', 'também', 'porque', 'quando', 'onde', 'quem', 'tudo', 'nada']
  const portugueseCount = portugueseWords.filter(w => lower.includes(w)).length

  // English indicators
  const englishWords = ['the', 'and', 'is', 'are', 'was', 'were', 'have', 'has', 'what', 'how', 'why', 'when', 'where', 'who', 'which', 'this', 'that', 'with', 'from', 'they', 'would', 'could', 'should', 'please', 'thank', 'hello', 'help']
  const englishCount = englishWords.filter(w => lower.includes(w)).length

  // French indicators
  const frenchWords = ['bonjour', 'merci', 'comment', 'pourquoi', 'quand', 'où', 'qui', 'quel', 'cette', 'avec', 'pour', 'dans', 'vous', 'nous', 'sont', 'était', 'faire', 'bien', 'très', 'aussi']
  const frenchCount = frenchWords.filter(w => lower.includes(w)).length

  const counts = [
    { lang: 'spanish', count: spanishCount },
    { lang: 'portuguese', count: portugueseCount },
    { lang: 'english', count: englishCount },
    { lang: 'french', count: frenchCount },
  ]

  const max = counts.reduce((a, b) => a.count > b.count ? a : b)
  return max.count >= 2 ? max.lang : 'unknown'
}

// Detect request types from user message
function detectRequestTypes(text: string): string[] {
  if (!text) return []
  const lower = text.toLowerCase()
  const types: string[] = []

  // Image requests
  if (lower.match(/imagen|image|foto|photo|genera|crea|dibuja|draw|picture/)) types.push('image_generation')
  if (lower.match(/edita|edit|cambia|change|ponme|hazme|añade|quita|modifica|mejora/)) types.push('image_editing')
  if (lower.match(/analiza|describe|qué es esto|what is this|qué ves|what do you see/)) types.push('image_analysis')

  // Code/tech
  if (lower.match(/código|code|programa|script|función|function|javascript|python|html|css/)) types.push('coding')
  if (lower.match(/error|bug|fix|arregla|problema técnico|no funciona/)) types.push('tech_support')

  // Writing
  if (lower.match(/escribe|write|redacta|carta|letter|email|correo|mensaje|message/)) types.push('writing')
  if (lower.match(/resume|curriculum|cv|resumen/)) types.push('resume')
  if (lower.match(/canción|song|letra|lyrics|poema|poem/)) types.push('creative_writing')

  // Translation
  if (lower.match(/traduce|translate|traducción|translation|en inglés|en español|in english|in spanish/)) types.push('translation')

  // Information
  if (lower.match(/qué es|what is|quién es|who is|cuándo|when|dónde|where|por qué|why|cómo|how/)) types.push('question')
  if (lower.match(/receta|recipe|cocina|cook/)) types.push('recipe')
  if (lower.match(/ejercicio|exercise|workout|fitness|gym/)) types.push('fitness')
  if (lower.match(/médico|doctor|salud|health|síntoma|symptom|enferm/)) types.push('medical')
  if (lower.match(/abogado|lawyer|legal|ley|law|contrato|contract/)) types.push('legal')
  if (lower.match(/negocio|business|empresa|company|marketing|ventas|sales/)) types.push('business')

  // Voice/audio/video
  if (lower.match(/voz|voice|audio|sonido|sound/)) types.push('voice')
  if (lower.match(/video|película|movie|clip/)) types.push('video')

  // Personal
  if (lower.match(/consejo|advice|ayuda|help me|necesito|need/)) types.push('advice')
  if (lower.match(/triste|sad|deprim|ansie|anxiety|stress|estrés/)) types.push('emotional_support')

  return types.length > 0 ? types : ['general']
}

// Detect issues in a conversation
function detectIssues(messages: Message[]): string[] {
  const issues: string[] = []

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    const content = msg.content?.toLowerCase() || ''
    const prevMsg = i > 0 ? messages[i - 1] : null

    if (msg.role === 'user') {
      // User frustration indicators
      if (content.match(/no entend|no me entien|eso no|no es lo que|otra vez|again|wrong|mal|incorrecto/)) {
        issues.push('misunderstanding')
      }
      if (content.match(/no puedo|cannot|can't|no funciona|doesn't work|error/)) {
        issues.push('user_blocked')
      }
    }

    if (msg.role === 'assistant') {
      // Empty or very short responses
      if (!msg.content || msg.content.length < 10) {
        issues.push('empty_response')
      }
      // Truncated responses (ends mid-sentence)
      if (msg.content && msg.content.length > 100 && !msg.content.match(/[.!?]$/)) {
        issues.push('truncated_response')
      }
      // Repetition (same content as previous assistant message)
      const prevAssistant = messages.slice(0, i).reverse().find(m => m.role === 'assistant')
      if (prevAssistant && msg.content === prevAssistant.content) {
        issues.push('repetition')
      }
      // Language mismatch
      if (prevMsg && prevMsg.role === 'user') {
        const userLang = detectLanguage(prevMsg.content)
        const assistantLang = detectLanguage(msg.content)
        if (userLang !== 'unknown' && assistantLang !== 'unknown' && userLang !== assistantLang) {
          issues.push('language_mismatch')
        }
      }
      // Refusal without alternative
      if (content.match(/no puedo|cannot|can't|i'm unable|no es posible/) && !content.match(/pero|however|instead|alternativ/)) {
        issues.push('refusal_no_alternative')
      }
    }
  }

  return [...new Set(issues)]
}

// Detect user sentiment
function detectSentiment(messages: Message[]): 'positive' | 'negative' | 'neutral' | 'mixed' {
  let positive = 0
  let negative = 0

  for (const msg of messages) {
    if (msg.role !== 'user') continue
    const content = msg.content?.toLowerCase() || ''

    if (content.match(/gracias|thanks|genial|great|perfect|excelente|amazing|love|encanta|bien|good|ayuda|helped/)) positive++
    if (content.match(/mal|bad|wrong|no sirve|no funciona|frustrad|molest|horrible|terrible|hate|odio|no entien/)) negative++
  }

  if (positive > 0 && negative > 0) return 'mixed'
  if (positive > negative) return 'positive'
  if (negative > positive) return 'negative'
  return 'neutral'
}

// Detect topic category
function detectTopicCategory(messages: Message[]): string {
  const allText = messages.map(m => m.content || '').join(' ').toLowerCase()

  if (allText.match(/imagen|image|foto|photo|genera|dibuja|edita/)) return 'images'
  if (allText.match(/código|code|programa|javascript|python|html/)) return 'coding'
  if (allText.match(/traduc|translat/)) return 'translation'
  if (allText.match(/receta|recipe|cocina|cook|comida|food/)) return 'cooking'
  if (allText.match(/ejercicio|workout|fitness|gym|salud|health/)) return 'health_fitness'
  if (allText.match(/negocio|business|marketing|ventas|empresa/)) return 'business'
  if (allText.match(/escribe|write|carta|email|mensaje|redact/)) return 'writing'
  if (allText.match(/canción|song|música|music|letra|lyrics/)) return 'music'
  if (allText.match(/legal|abogado|lawyer|contrato|ley/)) return 'legal'
  if (allText.match(/médico|doctor|síntoma|enferm|medicina/)) return 'medical'
  if (allText.match(/aprend|learn|estudi|study|clase|class|lección|lesson/)) return 'education'
  if (allText.match(/voz|voice|audio/)) return 'voice'
  if (allText.match(/video|película|movie/)) return 'video'

  return 'general_chat'
}

// Analyze a single conversation
function analyzeConversation(conv: Conversation): ConversationAnalysis {
  const userMessages = conv.messages.filter(m => m.role === 'user')
  const assistantMessages = conv.messages.filter(m => m.role === 'assistant')
  const allText = conv.messages.map(m => m.content || '').join(' ').toLowerCase()

  // Detect languages used
  const languages = [...new Set(userMessages.map(m => detectLanguage(m.content)).filter(l => l !== 'unknown'))]

  // Get all request types across messages
  const requestTypes = [...new Set(userMessages.flatMap(m => detectRequestTypes(m.content)))]

  // Detect issues
  const issues = detectIssues(conv.messages)

  // Notable exchanges (first user message that shows an issue or interesting pattern)
  const notableExchanges: string[] = []
  for (let i = 0; i < Math.min(conv.messages.length - 1, 6); i++) {
    const msg = conv.messages[i]
    const nextMsg = conv.messages[i + 1]
    if (msg.role === 'user' && nextMsg?.role === 'assistant') {
      const userContent = msg.content?.substring(0, 150) || '(empty)'
      const assistantContent = nextMsg.content?.substring(0, 150) || '(empty)'
      if (issues.length > 0 || requestTypes.includes('image_editing') || requestTypes.includes('image_generation')) {
        notableExchanges.push(`U: ${userContent}\nA: ${assistantContent}`)
      }
    }
  }

  return {
    id: conv.id,
    userId: conv.userId,
    messageCount: conv.messages.length,
    userMessageCount: userMessages.length,
    assistantMessageCount: assistantMessages.length,
    languages,
    primaryLanguage: languages[0] || 'unknown',
    requestTypes,
    issues,
    sentiment: detectSentiment(conv.messages),
    hasImageRequest: requestTypes.some(t => t.includes('image')),
    hasImageEdit: requestTypes.includes('image_editing'),
    hasVoiceRequest: requestTypes.includes('voice'),
    hasCodeRequest: requestTypes.includes('coding'),
    hasTranslation: requestTypes.includes('translation'),
    hasEmergency: allText.match(/emergencia|emergency|urgente|urgent|911|ambulancia/) !== null,
    hasSensitiveData: allText.match(/contraseña|password|tarjeta|card|rut|ssn|dni|número de cuenta/) !== null,
    hasRefusal: issues.includes('refusal_no_alternative'),
    hasEmptyResponse: issues.includes('empty_response'),
    hasTruncation: issues.includes('truncated_response'),
    hasRepetition: issues.includes('repetition'),
    hasLanguageMismatch: issues.includes('language_mismatch'),
    conversationLength: conv.messages.length <= 4 ? 'short' : conv.messages.length <= 10 ? 'medium' : 'long',
    userSatisfaction: detectSentiment(conv.messages) === 'positive' ? 'satisfied' :
                      detectSentiment(conv.messages) === 'negative' ? 'frustrated' :
                      detectSentiment(conv.messages) === 'mixed' ? 'neutral' : 'unknown',
    topicCategory: detectTopicCategory(conv.messages),
    firstUserMessage: userMessages[0]?.content?.substring(0, 200) || '',
    lastUserMessage: userMessages[userMessages.length - 1]?.content?.substring(0, 200) || '',
    notableExchanges: notableExchanges.slice(0, 2),
  }
}

// GET - Fetch comprehensive conversation analysis
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const promptType = (searchParams.get('type') as PromptType) || 'main'
  const days = parseInt(searchParams.get('days') || '365')
  const noCache = searchParams.get('nocache') === 'true'

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache (skip if nocache=true)
  if (!noCache && insightsCache &&
      insightsCache.promptType === promptType &&
      Date.now() - insightsCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...insightsCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Fetch ALL users (no limit)
    const usersSnapshot = await db.collection('users')
      .where('last_active', '>=', cutoffDate)
      .get()

    const conversations: Conversation[] = []

    // Collect ALL conversations
    for (const userDoc of usersSnapshot.docs) {
      const conversationsSnapshot = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('conversations')
        .orderBy('created_at', 'desc')
        .limit(50) // Get more per user
        .get()

      for (const convDoc of conversationsSnapshot.docs) {
        const data = convDoc.data()
        if (data.messages && data.messages.length > 0) {
          conversations.push({
            id: convDoc.id,
            userId: userDoc.id.substring(0, 8),
            messages: data.messages,
            created_at: data.created_at,
            topics: data.topics,
            success_score: data.success_score,
          })
        }
      }
    }

    // Analyze ALL conversations
    const analyses = conversations.map(analyzeConversation)

    // Aggregate statistics
    const stats = {
      totalConversations: analyses.length,
      totalUsers: usersSnapshot.size,
      totalMessages: analyses.reduce((sum, a) => sum + a.messageCount, 0),

      // Language distribution
      languageDistribution: {} as Record<string, number>,

      // Request type distribution
      requestTypeDistribution: {} as Record<string, number>,

      // Topic distribution
      topicDistribution: {} as Record<string, number>,

      // Issue distribution
      issueDistribution: {} as Record<string, number>,

      // Sentiment distribution
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0, mixed: 0, unknown: 0 },

      // Specific feature usage
      featureUsage: {
        imageGeneration: 0,
        imageEditing: 0,
        voiceRequests: 0,
        codeRequests: 0,
        translations: 0,
      },

      // Issue counts
      issuesCounts: {
        emptyResponses: 0,
        truncatedResponses: 0,
        repetitions: 0,
        languageMismatches: 0,
        refusalsWithoutAlternative: 0,
        misunderstandings: 0,
      },

      // Conversation length distribution
      conversationLengths: { short: 0, medium: 0, long: 0 },

      // User satisfaction
      userSatisfaction: { satisfied: 0, frustrated: 0, neutral: 0, unknown: 0 },
    }

    // Calculate distributions
    for (const analysis of analyses) {
      // Languages
      for (const lang of analysis.languages) {
        stats.languageDistribution[lang] = (stats.languageDistribution[lang] || 0) + 1
      }

      // Request types
      for (const type of analysis.requestTypes) {
        stats.requestTypeDistribution[type] = (stats.requestTypeDistribution[type] || 0) + 1
      }

      // Topics
      stats.topicDistribution[analysis.topicCategory] = (stats.topicDistribution[analysis.topicCategory] || 0) + 1

      // Issues
      for (const issue of analysis.issues) {
        stats.issueDistribution[issue] = (stats.issueDistribution[issue] || 0) + 1
      }

      // Sentiment
      stats.sentimentDistribution[analysis.sentiment]++

      // Feature usage
      if (analysis.hasImageRequest) stats.featureUsage.imageGeneration++
      if (analysis.hasImageEdit) stats.featureUsage.imageEditing++
      if (analysis.hasVoiceRequest) stats.featureUsage.voiceRequests++
      if (analysis.hasCodeRequest) stats.featureUsage.codeRequests++
      if (analysis.hasTranslation) stats.featureUsage.translations++

      // Issues
      if (analysis.hasEmptyResponse) stats.issuesCounts.emptyResponses++
      if (analysis.hasTruncation) stats.issuesCounts.truncatedResponses++
      if (analysis.hasRepetition) stats.issuesCounts.repetitions++
      if (analysis.hasLanguageMismatch) stats.issuesCounts.languageMismatches++
      if (analysis.hasRefusal) stats.issuesCounts.refusalsWithoutAlternative++
      if (analysis.issues.includes('misunderstanding')) stats.issuesCounts.misunderstandings++

      // Length
      stats.conversationLengths[analysis.conversationLength]++

      // Satisfaction
      stats.userSatisfaction[analysis.userSatisfaction]++
    }

    // Get conversations with issues for examples
    const conversationsWithIssues = analyses
      .filter(a => a.issues.length > 0)
      .slice(0, 50)
      .map(a => ({
        id: a.id,
        issues: a.issues,
        topic: a.topicCategory,
        exchanges: a.notableExchanges,
        firstMessage: a.firstUserMessage,
      }))

    // Get image-related conversations
    const imageConversations = analyses
      .filter(a => a.hasImageRequest || a.hasImageEdit)
      .slice(0, 30)
      .map(a => ({
        id: a.id,
        type: a.hasImageEdit ? 'editing' : 'generation',
        issues: a.issues,
        exchanges: a.notableExchanges,
        firstMessage: a.firstUserMessage,
      }))

    const currentPrompt = DEFAULT_PROMPTS[promptType]

    const result = {
      promptType,
      promptLabel: PROMPT_LABELS[promptType],
      dataRange: { days, from: cutoffDate.toISOString(), to: new Date().toISOString() },
      statistics: stats,
      conversationsWithIssues,
      imageConversations,
      currentPromptLength: currentPrompt.length,
      generatedAt: new Date().toISOString(),
      cached: false,
    }

    insightsCache = { data: result, timestamp: Date.now(), promptType }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Prompt insights error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze conversations' },
      { status: 500 }
    )
  }
}

// POST - Generate AI-powered prompt improvements based on FULL conversation analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, promptType = 'main', days = 365, focus } = body

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!PROMPT_TYPES.includes(promptType)) {
      return NextResponse.json({ error: 'Invalid prompt type' }, { status: 400 })
    }

    const db = getFirestoreDb()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Fetch ALL users (no limit)
    const usersSnapshot = await db.collection('users')
      .where('last_active', '>=', cutoffDate)
      .get()

    const conversations: Conversation[] = []

    for (const userDoc of usersSnapshot.docs) {
      const conversationsSnapshot = await db
        .collection('users')
        .doc(userDoc.id)
        .collection('conversations')
        .orderBy('created_at', 'desc')
        .limit(50)
        .get()

      for (const convDoc of conversationsSnapshot.docs) {
        const data = convDoc.data()
        if (data.messages && data.messages.length >= 2) {
          conversations.push({
            id: convDoc.id,
            userId: userDoc.id.substring(0, 8),
            messages: data.messages,
            created_at: data.created_at,
            topics: data.topics,
            success_score: data.success_score,
          })
        }
      }
    }

    // Analyze ALL conversations
    const analyses = conversations.map(analyzeConversation)

    // Build comprehensive statistics
    const totalConversations = analyses.length
    const languageCounts: Record<string, number> = {}
    const requestTypeCounts: Record<string, number> = {}
    const topicCounts: Record<string, number> = {}
    const issueCounts: Record<string, number> = {}

    let positiveCount = 0, negativeCount = 0, mixedCount = 0
    let imageGenCount = 0, imageEditCount = 0, voiceCount = 0, codeCount = 0
    let emptyResponseCount = 0, truncationCount = 0, languageMismatchCount = 0, misunderstandingCount = 0

    for (const a of analyses) {
      for (const lang of a.languages) languageCounts[lang] = (languageCounts[lang] || 0) + 1
      for (const type of a.requestTypes) requestTypeCounts[type] = (requestTypeCounts[type] || 0) + 1
      topicCounts[a.topicCategory] = (topicCounts[a.topicCategory] || 0) + 1
      for (const issue of a.issues) issueCounts[issue] = (issueCounts[issue] || 0) + 1

      if (a.sentiment === 'positive') positiveCount++
      if (a.sentiment === 'negative') negativeCount++
      if (a.sentiment === 'mixed') mixedCount++

      if (a.hasImageRequest) imageGenCount++
      if (a.hasImageEdit) imageEditCount++
      if (a.hasVoiceRequest) voiceCount++
      if (a.hasCodeRequest) codeCount++

      if (a.hasEmptyResponse) emptyResponseCount++
      if (a.hasTruncation) truncationCount++
      if (a.hasLanguageMismatch) languageMismatchCount++
      if (a.issues.includes('misunderstanding')) misunderstandingCount++
    }

    // Get representative examples for each issue type
    const issueExamples: Record<string, string[]> = {}
    for (const a of analyses) {
      for (const issue of a.issues) {
        if (!issueExamples[issue]) issueExamples[issue] = []
        if (issueExamples[issue].length < 5 && a.notableExchanges.length > 0) {
          issueExamples[issue].push(`Conv ${a.id}: ${a.notableExchanges[0]}`)
        }
      }
    }

    // Get examples of different request types
    const requestExamples: Record<string, string[]> = {}
    for (const a of analyses) {
      for (const type of a.requestTypes) {
        if (!requestExamples[type]) requestExamples[type] = []
        if (requestExamples[type].length < 3) {
          requestExamples[type].push(`${a.firstUserMessage.substring(0, 100)}`)
        }
      }
    }

    // Sort and format statistics
    const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])
    const sortedRequestTypes = Object.entries(requestTypeCounts).sort((a, b) => b[1] - a[1])
    const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])
    const sortedIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1])

    // Get current prompt
    const currentPrompt = DEFAULT_PROMPTS[promptType as PromptType]

    // Build comprehensive analysis prompt for AI
    const analysisPrompt = `You are a world-class prompt engineer analyzing COMPLETE user conversation data from an AI assistant app called "ia" (by Edison Labs).

## FULL DATASET STATISTICS (${totalConversations} conversations from ${usersSnapshot.size} users)

### Language Distribution:
${sortedLanguages.map(([lang, count]) => `- ${lang}: ${count} conversations (${((count/totalConversations)*100).toFixed(1)}%)`).join('\n')}

### Request Type Distribution:
${sortedRequestTypes.slice(0, 15).map(([type, count]) => `- ${type}: ${count} occurrences (${((count/totalConversations)*100).toFixed(1)}%)`).join('\n')}

### Topic Categories:
${sortedTopics.map(([topic, count]) => `- ${topic}: ${count} conversations (${((count/totalConversations)*100).toFixed(1)}%)`).join('\n')}

### User Sentiment:
- Positive: ${positiveCount} (${((positiveCount/totalConversations)*100).toFixed(1)}%)
- Negative: ${negativeCount} (${((negativeCount/totalConversations)*100).toFixed(1)}%)
- Mixed: ${mixedCount} (${((mixedCount/totalConversations)*100).toFixed(1)}%)

### Feature Usage:
- Image Generation requests: ${imageGenCount} (${((imageGenCount/totalConversations)*100).toFixed(1)}%)
- Image Editing requests: ${imageEditCount} (${((imageEditCount/totalConversations)*100).toFixed(1)}%)
- Voice requests: ${voiceCount} (${((voiceCount/totalConversations)*100).toFixed(1)}%)
- Code requests: ${codeCount} (${((codeCount/totalConversations)*100).toFixed(1)}%)

### Issues Detected (from ALL ${totalConversations} conversations):
${sortedIssues.map(([issue, count]) => `- ${issue}: ${count} occurrences (${((count/totalConversations)*100).toFixed(1)}%)`).join('\n')}

### Issue Examples (Real conversation excerpts):
${Object.entries(issueExamples).slice(0, 8).map(([issue, examples]) => `
**${issue}:**
${examples.slice(0, 2).map(e => `  - ${e.substring(0, 300)}`).join('\n')}`).join('\n')}

### Common Request Examples:
${Object.entries(requestExamples).slice(0, 10).map(([type, examples]) => `
**${type}:** "${examples[0]}"`).join('\n')}

## Current System Prompt Being Analyzed (${PROMPT_LABELS[promptType as PromptType]}):
\`\`\`
${currentPrompt}
\`\`\`

${focus ? `## Specific Focus Area: ${focus}` : ''}

## Your Task:
Based on this COMPLETE analysis of ${totalConversations} real conversations, provide:

1. **Comprehensive Analysis**: What patterns emerge from the full dataset?
2. **Priority Issues**: Which issues affect the most users and need immediate attention?
3. **Missing Capabilities**: What do users frequently request that isn't well-handled?
4. **Specific Prompt Changes**: Exact text to add/modify, with clear rationale based on the statistics
5. **Improved Full Prompt**: A complete rewritten prompt incorporating all high-priority fixes

Be extremely SPECIFIC and ACTIONABLE. Reference the actual statistics and percentages. Your improvements must be grounded in this real data.

Output as JSON:
{
  "dataAnalysis": {
    "totalConversationsAnalyzed": ${totalConversations},
    "keyFindings": ["..."],
    "userBehaviorPatterns": ["..."],
    "mostCommonRequests": ["..."],
    "biggestPainPoints": ["..."]
  },
  "analysis": {
    "strengths": ["..."],
    "issues": [
      { "issue": "...", "frequency": "X% of conversations", "impact": "high/medium/low", "examples": ["..."] }
    ],
    "missingCapabilities": ["..."]
  },
  "recommendations": [
    {
      "priority": "high/medium/low",
      "category": "language/behavior/capability/tone/safety",
      "change": "description of change",
      "affectedConversations": "X%",
      "currentText": "text to find/replace or 'NEW'",
      "suggestedText": "new/modified text",
      "rationale": "why this helps based on the statistics"
    }
  ],
  "improvedPrompt": "Full rewritten prompt incorporating all high-priority changes",
  "expectedImpact": {
    "issuesAddressed": ["..."],
    "estimatedImprovement": "X% of conversations would benefit"
  }
}`

    const response = await getOpenAI().responses.create({
      model: 'gpt-5-mini',
      input: analysisPrompt,
    })

    // Parse AI response
    let insights
    try {
      const content = response.output_text || ''
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0])
      } else {
        insights = { rawAnalysis: content }
      }
    } catch {
      insights = { rawAnalysis: response.output_text }
    }

    return NextResponse.json({
      promptType,
      promptLabel: PROMPT_LABELS[promptType as PromptType],
      fullDatasetStats: {
        totalConversations,
        totalUsers: usersSnapshot.size,
        languageDistribution: Object.fromEntries(sortedLanguages),
        requestTypeDistribution: Object.fromEntries(sortedRequestTypes),
        topicDistribution: Object.fromEntries(sortedTopics),
        issueDistribution: Object.fromEntries(sortedIssues),
        sentimentBreakdown: { positive: positiveCount, negative: negativeCount, mixed: mixedCount },
        featureUsage: { imageGeneration: imageGenCount, imageEditing: imageEditCount, voice: voiceCount, code: codeCount },
        issueBreakdown: { emptyResponses: emptyResponseCount, truncations: truncationCount, languageMismatches: languageMismatchCount, misunderstandings: misunderstandingCount },
      },
      dateRange: { days, from: cutoffDate.toISOString(), to: new Date().toISOString() },
      insights,
      currentPromptLength: currentPrompt.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Prompt improvement error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate improvements' },
      { status: 500 }
    )
  }
}
