import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

// OpenAI Responses API call for AI-powered analysis
async function callOpenAI(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  console.log('Calling OpenAI Responses API with gpt-5-mini...')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      instructions: systemPrompt,
      input: prompt,
      text: {
        format: {
          type: 'json_object'
        }
      }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI Responses API error:', response.status, errorText)
    throw new Error(`OpenAI Responses API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // Extract text from Responses API format
  // The output array can have multiple items (reasoning, message, etc.)
  // Structure: { output: [{ type: "message", content: [{ type: "output_text", text: "..." }] }] }
  let content = ''

  if (data.output && Array.isArray(data.output)) {
    for (const outputItem of data.output) {
      if (outputItem.type === 'message' && Array.isArray(outputItem.content)) {
        for (const contentItem of outputItem.content) {
          if (contentItem.type === 'output_text' && contentItem.text) {
            content += contentItem.text
          }
        }
      }
    }
  }

  if (!content) {
    console.error('Could not extract text from response:', JSON.stringify(data).substring(0, 500))
    throw new Error('No valid text content in OpenAI response')
  }

  console.log('OpenAI response received, length:', content.length)
  return content
}

// AI-powered conversation quality analysis
interface AIAnalysisResult {
  overallQuality: number // 0-100
  summary: string
  issuesFound: {
    severity: 'critical' | 'high' | 'medium' | 'low'
    issue: string
    example?: string
    affectedUsers?: string
    recommendation: string
    expectedImpact?: string
  }[]
  successPatterns: {
    pattern: string
    example?: string
    frequency: 'common' | 'occasional' | 'rare'
    impact: string
  }[]
  promptRecommendations: {
    priority: 'high' | 'medium' | 'low'
    currentBehavior: string
    suggestedChange: string
    expectedImpact: string
    risk?: string
  }[]
  quickWins?: string[] // Simple changes for immediate impact
  conversationBreakdown: {
    category: string
    count: number
    avgQuality: number
    bestExample?: string
    worstExample?: string
    notes: string
  }[]
  // User journey analysis
  userJourneyInsights?: {
    returnUserQuality: string
    firstImpressionScore?: number
    firstImpressionIssues: string[]
    loyalUserPatterns?: string[] // deprecated, use retentionDrivers
    retentionDrivers?: string[]
    churnRisks?: string[]
    churnSignals?: string[]
    recommendedJourneyFixes?: string[]
  }
  // Device/locale specific insights
  segmentInsights?: {
    segment: string
    quality: number
    strengths?: string[]
    specificIssues: string[]
    recommendation?: string
  }[]
  // Competitive positioning
  competitivePosition?: string
}

// Extended conversation data for AI analysis
interface ConversationForAI {
  messages: Message[]
  success: ConversationSuccess
  language: string
  userId: string
  conversationId: string
  createdAt: Date | null
  userMeta?: {
    locale?: string
    device?: string
    appVersion?: string
  }
}

async function analyzeConversationsWithAI(
  conversations: ConversationForAI[],
  currentSystemPrompt?: string
): Promise<AIAnalysisResult | null> {
  try {
    // Group conversations by user for user-centric analysis
    const userMap = new Map<string, ConversationForAI[]>()
    for (const conv of conversations) {
      const existing = userMap.get(conv.userId) || []
      existing.push(conv)
      userMap.set(conv.userId, existing)
    }

    // Sample users (max 10 users for cost control)
    const userIds = Array.from(userMap.keys())
    const sampledUserIds = userIds
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)

    // Build user-centric data structure
    const userCentricData = sampledUserIds.map((userId, idx) => {
      const userConvs = userMap.get(userId) || []
      const firstConv = userConvs[0]

      return {
        userNumber: idx + 1,
        totalConversations: userConvs.length,
        userMeta: firstConv?.userMeta || {},
        languages: [...new Set(userConvs.map(c => c.language))],
        avgSuccessScore: Math.round(userConvs.reduce((sum, c) => sum + c.success.score, 0) / userConvs.length),
        // Include up to 3 conversations per user
        conversations: userConvs.slice(0, 3).map((conv, convIdx) => ({
          conversationNumber: convIdx + 1,
          language: conv.language,
          messageCount: conv.messages.length,
          successScore: conv.success.score,
          successClass: conv.success.classification,
          // First 8 messages, truncated
          transcript: conv.messages.slice(0, 8).map(m => ({
            role: m.role,
            content: m.content.substring(0, 250)
          }))
        }))
      }
    })

    // Also include flat conversation samples for variety (different from user-centric)
    const flatSamples = conversations
      .filter(c => !sampledUserIds.includes(c.userId)) // Don't duplicate
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((conv, i) => ({
        id: i + 1,
        language: conv.language,
        messageCount: conv.messages.length,
        successScore: conv.success.score,
        successClass: conv.success.classification,
        transcript: conv.messages.slice(0, 6).map(m => ({
          role: m.role,
          content: m.content.substring(0, 200)
        }))
      }))

    const systemPromptSection = currentSystemPrompt
      ? `\n\nCURRENT SYSTEM PROMPT:\n${currentSystemPrompt.substring(0, 2000)}`
      : ''

    const systemMessage = `You are a senior AI Quality Analyst specializing in conversational AI evaluation. You're reviewing an AI assistant mobile app.

APP CONTEXT:
- Multilingual app (Spanish, English, French, Portuguese)
- Features: Q&A, creative writing, image analysis/generation, voice conversations
- Goal: Help users get value quickly while encouraging engagement
${systemPromptSection}

EVALUATION FRAMEWORK (use this scoring):

**Quality Score (0-100):**
- 90-100: Exceptional - User clearly got value, natural conversation, perfect language match
- 80-89: Very Good - Helpful response, minor imperfections okay
- 70-79: Good - Got the job done but room for improvement
- 60-69: Acceptable - Somewhat helpful but noticeable issues
- 50-59: Below Average - Significant issues affecting user experience
- <50: Poor - Failed to help user or major problems

**Issue Severity Classification:**
- CRITICAL: Data loss, crashes, completely wrong information, safety issues
- HIGH: User clearly didn't get what they needed, wrong language, very short/dismissive
- MEDIUM: Suboptimal but functional - verbose responses, missed nuances, tone issues
- LOW: Minor polish issues - could be slightly better but acceptable

EVALUATION PRIORITIES:
1. **Did the user get ACTUAL value?** - Not just a response, but was their need met?
2. **First impression quality** - Single-message conversations are critical for retention
3. **Conversation abandonment** - Why did users stop? Too long? Off-topic? Wrong language?
4. **Language fidelity** - MUST respond in user's language (critical for international users)
5. **Response efficiency** - Quality over quantity. Short + helpful > Long + verbose
6. **Emotional intelligence** - Tone matching, empathy when needed, appropriate humor

CRITICAL ANALYSIS AREAS:
- Look for "dead end" conversations where user got no value
- Identify when AI misunderstood intent vs. gave wrong answer
- Note cultural/language-specific issues (formal vs informal, idioms)
- Flag any potentially harmful or incorrect advice
- Highlight unexpectedly successful interactions (learn from wins)

Be ruthlessly honest. Quote specific examples. Focus on actionable fixes.
Respond with valid JSON only, no markdown.`

    const userPrompt = `EVALUATION DATA:

=== USER-CENTRIC VIEW (${userCentricData.length} users sampled) ===
Shows same users across multiple conversations to evaluate user journey and retention.

${JSON.stringify(userCentricData, null, 2)}

=== ADDITIONAL CONVERSATION SAMPLES (${flatSamples.length} random) ===
Additional variety of conversations from other users.

${JSON.stringify(flatSamples, null, 2)}

=== REQUIRED OUTPUT FORMAT (strict JSON) ===
{
  "overallQuality": 75,
  "summary": "2-3 sentences: What's working, what's broken, one key fix needed. Be direct.",

  "issuesFound": [
    {
      "severity": "critical|high|medium|low",
      "issue": "Clear, specific problem statement",
      "example": "EXACT quote from conversation showing the issue",
      "affectedUsers": "approximate % or description (e.g., 'Spanish speakers', 'first-time users')",
      "recommendation": "Specific, implementable fix - not vague advice",
      "expectedImpact": "What improves if fixed (e.g., '+15% retention for new users')"
    }
  ],

  "successPatterns": [
    {
      "pattern": "What the AI does well - be specific",
      "example": "Quote showing this in action",
      "frequency": "common|occasional|rare",
      "impact": "Measurable benefit (e.g., 'Users send 3x more messages')"
    }
  ],

  "promptRecommendations": [
    {
      "priority": "high|medium|low",
      "currentBehavior": "What the AI currently does wrong",
      "suggestedChange": "EXACT text to add/change in system prompt. Be specific.",
      "expectedImpact": "Specific improvement expected",
      "risk": "Any potential downside of this change"
    }
  ],

  "quickWins": [
    "List 2-3 simple changes that can be implemented TODAY with big impact"
  ],

  "conversationBreakdown": [
    {
      "category": "greeting/question/creative/image/troubleshooting/chitchat",
      "count": 5,
      "avgQuality": 80,
      "bestExample": "Brief quote from a good conversation",
      "worstExample": "Brief quote from a bad conversation",
      "notes": "What makes this category succeed or fail"
    }
  ],

  "userJourneyInsights": {
    "returnUserQuality": "Are returning users getting better experiences? Why/why not?",
    "firstImpressionScore": 75,
    "firstImpressionIssues": ["Specific issues hurting first interactions"],
    "retentionDrivers": ["What keeps users coming back - be specific"],
    "churnSignals": ["Warning signs that predict user leaving"],
    "recommendedJourneyFixes": ["Specific fixes for the user journey"]
  },

  "segmentInsights": [
    {
      "segment": "e.g., Spanish speakers",
      "quality": 75,
      "strengths": ["What works well for this segment"],
      "specificIssues": ["Issues unique to this segment"],
      "recommendation": "Specific fix for this segment"
    }
  ],

  "competitivePosition": "How does this AI compare to alternatives? What's unique? What's missing?"
}

REQUIREMENTS:
- Include 3-6 issues, prioritize CRITICAL and HIGH severity
- Every issue MUST have an exact quote as example
- Prompt recommendations must be copy-paste ready (specific text changes)
- Be brutally honest - the goal is improvement, not praise
- Quick wins should be implementable within hours, not weeks
- If you see something dangerous or harmful, mark it CRITICAL immediately`

    const aiResponse = await callOpenAI(userPrompt, systemMessage)

    // With JSON mode enabled, response should be clean JSON
    // But still handle potential markdown wrapping just in case
    let cleanedResponse = aiResponse.trim()
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    console.log('Parsing AI response, length:', cleanedResponse.length)
    const parsed = JSON.parse(cleanedResponse) as AIAnalysisResult

    // Validate required fields
    if (typeof parsed.overallQuality !== 'number' || !parsed.summary) {
      console.error('AI response missing required fields')
      return null
    }

    return parsed
  } catch (error) {
    console.error('AI analysis failed:', error)
    return null
  }
}

// Cache for evaluation results (1 hour TTL)
const evaluationCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// Collection name for storing evaluation history
const EVALUATION_HISTORY_COLLECTION = 'ai_evaluation_history'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: any
}

interface ConversationData {
  id: string
  userId: string
  messages: Message[]
  messageCount: number
  userMessageCount: number
  assistantMessageCount: number
  createdAt: Date | null
  lastMessageAt: Date | null
  avgResponseLength: number
  topics: string[]
  success: ConversationSuccess
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown'
}

interface ConversationSuccess {
  score: number // 0-100
  classification: 'successful' | 'partial' | 'failed' | 'abandoned'
  reasons: string[]
  indicators: {
    userReturned: boolean
    expressedThanks: boolean
    gotAnswer: boolean
    hadFollowUp: boolean
    endedPositively: boolean
  }
}

interface FullConversation {
  id: string
  visibleId?: string  // For display only, not real ID
  visibleUserId?: string // For display only
  userId: string
  messages: Message[]
  messageCount: number
  createdAt: Date | null
  lastMessageAt: Date | null
  topics: string[]
  topicDetails: { topic: string; confidence: number; examples: string[] }[]
  success: ConversationSuccess
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown'
  language: string
  avgResponseTime?: number
  userEngagementScore: number // 0-100
  userMeta?: {
    locale?: string
    device?: string
    appVersion?: string
  }
}

interface UserMetrics {
  totalUsers: number
  activeUsers24h: number
  activeUsers7d: number
  avgConversationsPerUser: number
  avgMessagesPerConversation: number
  topLocales: { locale: string; count: number }[]
  topDevices: { device: string; count: number }[]
  appVersions: { version: string; count: number }[]
}

interface AIMetrics {
  totalConversations: number
  totalMessages: number
  avgConversationLength: number
  avgResponseLength: number
  topTopics: { topic: string; count: number }[]
  responseQuality: {
    tooShort: number      // < 50 chars
    appropriate: number   // 50-500 chars
    tooLong: number       // > 500 chars
  }
  conversationDepth: {
    shallow: number       // 1-2 exchanges
    moderate: number      // 3-5 exchanges
    deep: number          // 6+ exchanges
  }
  timeOfDayDistribution: { hour: number; count: number }[]
}

interface EvaluationResult {
  userMetrics: UserMetrics
  aiMetrics: AIMetrics
  recentConversations: {
    id: string
    preview: string
    messageCount: number
    timestamp: Date | null
  }[]
  // Full conversation data for explorer
  fullConversations: FullConversation[]
  // Success metrics summary
  successMetrics: {
    successful: number
    partial: number
    failed: number
    abandoned: number
    avgSuccessScore: number
    topSuccessIndicators: string[]
    topFailureReasons: string[]
  }
  // Topic breakdown
  topicBreakdown: {
    topic: string
    count: number
    avgSuccessScore: number
    avgEngagement: number
    examples: string[]
  }[]
  insights: {
    type: 'positive' | 'negative' | 'neutral'
    category: string
    finding: string
    recommendation?: string
  }[]
  // AI-powered analysis (optional - only when runAIAnalysis=true)
  aiAnalysis?: AIAnalysisResult | null
  // Date-based analysis
  analysisDate: string  // YYYY-MM-DD format
  generatedAt: string
  cached: boolean
  sampleSize: number
  conversationsAnalyzed: number
}

function extractTopics(messages: Message[]): string[] {
  const topics: string[] = []
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase())

  // Simple keyword-based topic detection
  const topicKeywords: Record<string, string[]> = {
    'greeting': ['hola', 'hello', 'hi', 'hey', 'buenos', 'bonjour', 'salut'],
    'question': ['?', 'qué', 'cómo', 'por qué', 'what', 'how', 'why', 'quand', 'pourquoi'],
    'help': ['ayuda', 'help', 'necesito', 'need', 'aide', 'besoin'],
    'thanks': ['gracias', 'thank', 'merci'],
    'coding': ['code', 'programa', 'función', 'function', 'error', 'bug'],
    'creative': ['escribe', 'write', 'historia', 'story', 'poem', 'poema', 'écris'],
    'explanation': ['explica', 'explain', 'qué es', 'what is', 'explique'],
    'translation': ['traduce', 'translate', 'traduire'],
    'conversation': ['cuéntame', 'tell me', 'habla', 'talk', 'parle'],
  }

  for (const msg of userMessages) {
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => msg.includes(kw))) {
        if (!topics.includes(topic)) {
          topics.push(topic)
        }
      }
    }
  }

  return topics.length > 0 ? topics : ['general']
}

function extractTopicDetails(messages: Message[]): { topic: string; confidence: number; examples: string[] }[] {
  const topicDetails: { topic: string; confidence: number; examples: string[] }[] = []
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content)

  const topicPatterns: Record<string, { keywords: string[]; weight: number }> = {
    'greeting': { keywords: ['hola', 'hello', 'hi', 'hey', 'buenos días', 'buenas', 'bonjour', 'salut', 'oi'], weight: 0.3 },
    'question': { keywords: ['?', 'qué', 'cómo', 'por qué', 'what', 'how', 'why', 'quand', 'pourquoi', 'cuando'], weight: 0.8 },
    'help_request': { keywords: ['ayuda', 'ayúdame', 'help', 'necesito', 'need', 'aide', 'besoin', 'problema'], weight: 0.9 },
    'gratitude': { keywords: ['gracias', 'thank', 'merci', 'obrigado', 'thanks'], weight: 0.5 },
    'coding': { keywords: ['code', 'programa', 'función', 'function', 'error', 'bug', 'python', 'javascript', 'html'], weight: 0.95 },
    'creative_writing': { keywords: ['escribe', 'write', 'historia', 'story', 'poem', 'poema', 'écris', 'cuento', 'canción'], weight: 0.9 },
    'explanation': { keywords: ['explica', 'explain', 'qué es', 'what is', 'explique', 'define', 'significa'], weight: 0.85 },
    'translation': { keywords: ['traduce', 'translate', 'traduire', 'traducir', 'inglés', 'español'], weight: 0.9 },
    'casual_chat': { keywords: ['cuéntame', 'tell me', 'habla', 'talk', 'parle', 'cómo estás', 'how are you'], weight: 0.4 },
    'advice': { keywords: ['consejo', 'advice', 'sugieres', 'recomiendas', 'suggest', 'recommend', 'debería'], weight: 0.85 },
    'information': { keywords: ['información', 'info', 'datos', 'cuánto', 'cuándo', 'dónde', 'where', 'when'], weight: 0.8 },
    'task_completion': { keywords: ['hazme', 'haz', 'genera', 'create', 'make', 'do', 'write me', 'dame'], weight: 0.9 },
  }

  for (const [topic, { keywords, weight }] of Object.entries(topicPatterns)) {
    const matchingMessages: string[] = []
    for (const msg of userMessages) {
      const lowerMsg = msg.toLowerCase()
      if (keywords.some(kw => lowerMsg.includes(kw))) {
        matchingMessages.push(msg.substring(0, 80))
      }
    }

    if (matchingMessages.length > 0) {
      const confidence = Math.min(1, (matchingMessages.length / userMessages.length) * weight + 0.2)
      topicDetails.push({
        topic,
        confidence: Math.round(confidence * 100) / 100,
        examples: matchingMessages.slice(0, 3),
      })
    }
  }

  return topicDetails.sort((a, b) => b.confidence - a.confidence)
}

function detectLanguage(messages: Message[]): string {
  const text = messages.map(m => m.content).join(' ').toLowerCase()

  const languagePatterns: Record<string, string[]> = {
    'es': ['hola', 'gracias', 'cómo', 'qué', 'por favor', 'bueno', 'está', 'tengo', 'puedo', 'quiero'],
    'en': ['hello', 'thank', 'please', 'what', 'how', 'good', 'can', 'want', 'need', 'the'],
    'fr': ['bonjour', 'merci', 'comment', 'pourquoi', 's\'il vous plaît', 'bien', 'avoir', 'pouvoir'],
    'pt': ['olá', 'obrigado', 'como', 'o que', 'por favor', 'bom', 'tenho', 'posso', 'quero'],
  }

  let maxScore = 0
  let detectedLang = 'unknown'

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    const score = patterns.filter(p => text.includes(p)).length
    if (score > maxScore) {
      maxScore = score
      detectedLang = lang
    }
  }

  return detectedLang
}

function classifyConversationSuccess(messages: Message[]): ConversationSuccess {
  const reasons: string[] = []
  const indicators = {
    userReturned: false,
    expressedThanks: false,
    gotAnswer: false,
    hadFollowUp: false,
    endedPositively: false,
  }

  const userMessages = messages.filter(m => m.role === 'user')
  const assistantMessages = messages.filter(m => m.role === 'assistant')
  const lastMessage = messages[messages.length - 1]
  const lastUserMessage = userMessages[userMessages.length - 1]

  // Check for thanks/gratitude
  const thankPatterns = ['gracias', 'thank', 'merci', 'obrigado', 'perfect', 'perfecto', 'genial', 'excellent', 'great', 'awesome', 'increíble']
  const negativePatterns = ['no entiendo', 'don\'t understand', 'wrong', 'mal', 'error', 'no funciona', 'doesn\'t work', 'not what', 'no es lo que']

  for (const msg of userMessages) {
    const lower = msg.content.toLowerCase()
    if (thankPatterns.some(p => lower.includes(p))) {
      indicators.expressedThanks = true
      reasons.push('User expressed gratitude')
    }
  }

  // Check for follow-up questions (indicates engagement)
  const questionCount = userMessages.filter(m => m.content.includes('?')).length
  if (questionCount > 1) {
    indicators.hadFollowUp = true
    reasons.push('User asked follow-up questions')
  }

  // Check if conversation ended positively
  if (lastUserMessage) {
    const lower = lastUserMessage.content.toLowerCase()
    if (thankPatterns.some(p => lower.includes(p))) {
      indicators.endedPositively = true
      reasons.push('Conversation ended positively')
    }
    if (negativePatterns.some(p => lower.includes(p))) {
      reasons.push('User expressed confusion or dissatisfaction')
    }
  }

  // Check if assistant provided substantive answers
  const avgAssistantLength = assistantMessages.length > 0
    ? assistantMessages.reduce((sum, m) => sum + m.content.length, 0) / assistantMessages.length
    : 0

  if (avgAssistantLength > 100) {
    indicators.gotAnswer = true
    reasons.push('Assistant provided detailed responses')
  }

  // Check conversation length (engagement indicator)
  if (messages.length >= 4) {
    indicators.userReturned = true
    reasons.push('Multi-turn conversation')
  }

  // Calculate success score
  let score = 20 // Base score
  if (indicators.expressedThanks) score += 30
  if (indicators.hadFollowUp) score += 15
  if (indicators.endedPositively) score += 25
  if (indicators.gotAnswer) score += 10
  if (indicators.userReturned) score += 10

  // Deduct for negative signals
  if (messages.length === 1) score -= 20
  if (messages.length === 2 && !indicators.expressedThanks) score -= 10

  // Classify
  let classification: ConversationSuccess['classification']
  if (score >= 70) classification = 'successful'
  else if (score >= 45) classification = 'partial'
  else if (messages.length <= 2) classification = 'abandoned'
  else classification = 'failed'

  return {
    score: Math.max(0, Math.min(100, score)),
    classification,
    reasons,
    indicators,
  }
}

function detectSentiment(messages: Message[]): 'positive' | 'neutral' | 'negative' | 'unknown' {
  const userMessages = messages.filter(m => m.role === 'user')
  if (userMessages.length === 0) return 'unknown'

  const text = userMessages.map(m => m.content.toLowerCase()).join(' ')

  const positivePatterns = ['gracias', 'thank', 'genial', 'great', 'awesome', 'perfect', 'love', 'amazing', 'excellent', 'increíble', 'maravilloso', 'fantástico', '👍', '❤️', '😊', '🎉']
  const negativePatterns = ['mal', 'bad', 'wrong', 'terrible', 'hate', 'awful', 'horrible', 'no funciona', 'doesn\'t work', 'frustrat', '😠', '😡', '👎', 'stupid', 'useless']

  const positiveCount = positivePatterns.filter(p => text.includes(p)).length
  const negativeCount = negativePatterns.filter(p => text.includes(p)).length

  if (positiveCount > negativeCount + 1) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function calculateEngagementScore(messages: Message[]): number {
  let score = 0
  const userMessages = messages.filter(m => m.role === 'user')

  // Message count factor
  score += Math.min(30, messages.length * 3)

  // Question depth
  const questionCount = userMessages.filter(m => m.content.includes('?')).length
  score += Math.min(20, questionCount * 5)

  // Message length variety
  const avgUserMsgLength = userMessages.length > 0
    ? userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length
    : 0
  if (avgUserMsgLength > 50) score += 15
  if (avgUserMsgLength > 100) score += 10

  // Follow-ups
  if (userMessages.length > 2) score += 15

  // Engagement signals
  const text = userMessages.map(m => m.content.toLowerCase()).join(' ')
  if (text.includes('more') || text.includes('más') || text.includes('another') || text.includes('otro')) score += 10

  return Math.min(100, score)
}

function generateInsights(userMetrics: UserMetrics, aiMetrics: AIMetrics, successMetrics?: EvaluationResult['successMetrics']): EvaluationResult['insights'] {
  const insights: EvaluationResult['insights'] = []

  // Conversation depth analysis
  const totalConvs = aiMetrics.conversationDepth.shallow + aiMetrics.conversationDepth.moderate + aiMetrics.conversationDepth.deep
  const deepRatio = totalConvs > 0 ? aiMetrics.conversationDepth.deep / totalConvs : 0

  if (deepRatio > 0.3) {
    insights.push({
      type: 'positive',
      category: 'engagement',
      finding: `${(deepRatio * 100).toFixed(0)}% of conversations have 6+ exchanges, indicating high engagement`,
    })
  } else if (deepRatio < 0.1) {
    insights.push({
      type: 'negative',
      category: 'engagement',
      finding: `Only ${(deepRatio * 100).toFixed(0)}% of conversations have deep engagement (6+ exchanges)`,
      recommendation: 'Consider adding follow-up prompts to encourage longer conversations',
    })
  }

  // Response length analysis
  const totalResponses = aiMetrics.responseQuality.tooShort + aiMetrics.responseQuality.appropriate + aiMetrics.responseQuality.tooLong
  const tooShortRatio = totalResponses > 0 ? aiMetrics.responseQuality.tooShort / totalResponses : 0
  const tooLongRatio = totalResponses > 0 ? aiMetrics.responseQuality.tooLong / totalResponses : 0

  if (tooShortRatio > 0.3) {
    insights.push({
      type: 'negative',
      category: 'response_quality',
      finding: `${(tooShortRatio * 100).toFixed(0)}% of AI responses are too short (<50 chars)`,
      recommendation: 'Adjust system prompt to encourage more detailed responses',
    })
  }

  if (tooLongRatio > 0.4) {
    insights.push({
      type: 'neutral',
      category: 'response_quality',
      finding: `${(tooLongRatio * 100).toFixed(0)}% of AI responses are long (>500 chars)`,
      recommendation: 'Consider adding conciseness instructions to system prompt for mobile users',
    })
  }

  // User retention insight
  if (userMetrics.activeUsers24h > 0 && userMetrics.totalUsers > 0) {
    const dau = userMetrics.activeUsers24h / userMetrics.totalUsers
    if (dau > 0.1) {
      insights.push({
        type: 'positive',
        category: 'retention',
        finding: `${(dau * 100).toFixed(1)}% daily active rate among registered users`,
      })
    }
  }

  // Avg messages per conversation
  if (aiMetrics.avgConversationLength < 3) {
    insights.push({
      type: 'negative',
      category: 'engagement',
      finding: `Average conversation length is only ${aiMetrics.avgConversationLength.toFixed(1)} messages`,
      recommendation: 'AI responses may not be compelling enough - consider A/B testing different personalities',
    })
  } else if (aiMetrics.avgConversationLength > 8) {
    insights.push({
      type: 'positive',
      category: 'engagement',
      finding: `Strong conversation engagement with ${aiMetrics.avgConversationLength.toFixed(1)} messages per session`,
    })
  }

  // Top topics insight
  if (aiMetrics.topTopics.length > 0) {
    const topTopic = aiMetrics.topTopics[0]
    insights.push({
      type: 'neutral',
      category: 'usage_patterns',
      finding: `Most common conversation type: "${topTopic.topic}" (${topTopic.count} conversations)`,
      recommendation: `Consider optimizing the AI's ${topTopic.topic} capabilities`,
    })
  }

  // Success metrics insights
  if (successMetrics) {
    const totalClassified = successMetrics.successful + successMetrics.partial + successMetrics.failed + successMetrics.abandoned
    if (totalClassified > 0) {
      const successRate = ((successMetrics.successful + successMetrics.partial * 0.5) / totalClassified) * 100

      if (successRate >= 70) {
        insights.push({
          type: 'positive',
          category: 'success_rate',
          finding: `${successRate.toFixed(0)}% of conversations are successful or partially successful`,
        })
      } else if (successRate < 40) {
        insights.push({
          type: 'negative',
          category: 'success_rate',
          finding: `Only ${successRate.toFixed(0)}% of conversations achieve user goals`,
          recommendation: 'Review failed conversations to identify common issues',
        })
      }

      const abandonRate = (successMetrics.abandoned / totalClassified) * 100
      if (abandonRate > 30) {
        insights.push({
          type: 'negative',
          category: 'abandonment',
          finding: `${abandonRate.toFixed(0)}% of conversations are abandoned after 1-2 messages`,
          recommendation: 'Consider improving initial AI greeting or response relevance',
        })
      }
    }
  }

  return insights
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, date, sampleSize = 500, runAIAnalysis = false, systemPrompt } = body

    // Validate auth key
    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse date - if not provided (null), this is historical/all-time analysis
    const isHistorical = date === null || date === undefined
    const analysisDate = isHistorical ? null : new Date(date)
    const dateStr = isHistorical ? 'historical' : (analysisDate as Date).toISOString().split('T')[0] // YYYY-MM-DD or 'historical'

    // Set date boundaries for filtering conversations (only if not historical)
    const dayStart = analysisDate ? new Date(dateStr + 'T00:00:00.000Z') : null
    const dayEnd = analysisDate ? new Date(dateStr + 'T23:59:59.999Z') : null

    // Check cache (keyed by date)
    const cacheKey = `evaluation_${dateStr}`
    const cached = evaluationCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ ...cached.data, cached: true })
    }

    // Get Firestore
    let db
    try {
      db = getFirestoreDb()
    } catch (error) {
      return NextResponse.json({
        error: 'Firebase not configured',
        message: 'Please add FIREBASE_SERVICE_ACCOUNT to your environment variables',
        setup: {
          step1: 'Go to Firebase Console > Project Settings > Service Accounts',
          step2: 'Click "Generate new private key"',
          step3: 'Copy the JSON content and add to .env.local as FIREBASE_SERVICE_ACCOUNT=\'{"type":"service_account",...}\'',
        }
      }, { status: 500 })
    }

    // Fetch users (we'll filter conversations by date)
    const usersSnapshot = await db.collection('users').limit(sampleSize).get()

    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Initialize metrics
    const userMetrics: UserMetrics = {
      totalUsers: usersSnapshot.size,
      activeUsers24h: 0,
      activeUsers7d: 0,
      avgConversationsPerUser: 0,
      avgMessagesPerConversation: 0,
      topLocales: [],
      topDevices: [],
      appVersions: [],
    }

    const aiMetrics: AIMetrics = {
      totalConversations: 0,
      totalMessages: 0,
      avgConversationLength: 0,
      avgResponseLength: 0,
      topTopics: [],
      responseQuality: { tooShort: 0, appropriate: 0, tooLong: 0 },
      conversationDepth: { shallow: 0, moderate: 0, deep: 0 },
      timeOfDayDistribution: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
    }

    const localeCounts: Record<string, number> = {}
    const deviceCounts: Record<string, number> = {}
    const versionCounts: Record<string, number> = {}
    const topicCounts: Record<string, number> = {}
    const recentConversations: EvaluationResult['recentConversations'] = []
    const fullConversations: FullConversation[] = []

    // Success metrics tracking
    const successMetrics = {
      successful: 0,
      partial: 0,
      failed: 0,
      abandoned: 0,
      totalSuccessScore: 0,
      successReasons: {} as Record<string, number>,
      failureReasons: {} as Record<string, number>,
    }

    // Topic breakdown tracking
    const topicBreakdownMap: Record<string, {
      count: number
      totalSuccessScore: number
      totalEngagement: number
      examples: string[]
    }> = {}

    let totalConversationCount = 0
    let totalMessageCount = 0
    let totalResponseLength = 0
    let responseCount = 0

    // Process users and their conversations
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()

      // Track user activity
      const lastActive = userData.last_active?.toDate?.() || userData.last_active
      if (lastActive) {
        if (lastActive >= oneDayAgo) userMetrics.activeUsers24h++
        if (lastActive >= sevenDaysAgo) userMetrics.activeUsers7d++
      }

      // Track locale
      if (userData.locale) {
        localeCounts[userData.locale] = (localeCounts[userData.locale] || 0) + 1
      }

      // Track device
      if (userData.device_model) {
        deviceCounts[userData.device_model] = (deviceCounts[userData.device_model] || 0) + 1
      }

      // Track app version
      if (userData.app_version) {
        versionCounts[userData.app_version] = (versionCounts[userData.app_version] || 0) + 1
      }

      // Fetch conversations for this user - filter by date (unless historical mode)
      try {
        let conversationsSnapshot
        let filteredDocs

        if (isHistorical) {
          // Historical mode: get all conversations (up to limit)
          conversationsSnapshot = await db
            .collection('users')
            .doc(userDoc.id)
            .collection('conversations')
            .orderBy('created_at', 'desc')
            .limit(100)  // Get more for historical analysis
            .get()
          filteredDocs = conversationsSnapshot.docs
        } else {
          // Date-specific mode: try to query with date filter
          try {
            conversationsSnapshot = await db
              .collection('users')
              .doc(userDoc.id)
              .collection('conversations')
              .where('created_at', '>=', dayStart)
              .where('created_at', '<=', dayEnd)
              .orderBy('created_at', 'desc')
              .limit(50)
              .get()
            filteredDocs = conversationsSnapshot.docs
          } catch (queryError) {
            // If date query fails (maybe no index), fall back to recent conversations
            conversationsSnapshot = await db
              .collection('users')
              .doc(userDoc.id)
              .collection('conversations')
              .orderBy('created_at', 'desc')
              .limit(50)
              .get()

            // Filter by date range in memory
            filteredDocs = conversationsSnapshot.docs.filter(doc => {
              const convData = doc.data()
              const createdAt = convData.created_at?.toDate?.() || convData.created_at
              if (!createdAt) return false // Exclude if no date for daily analysis
              const convDate = new Date(createdAt)
              return dayStart && dayEnd && convDate >= dayStart && convDate <= dayEnd
            })
          }
        }

        totalConversationCount += filteredDocs.length

        for (const convDoc of filteredDocs) {
          const convData = convDoc.data()

          // Get messages - they might be in the document or in a subcollection
          let messages: Message[] = convData.messages || []

          // If no messages array, try to fetch from messages subcollection
          if (messages.length === 0) {
            try {
              const messagesSnapshot = await db
                .collection('users')
                .doc(userDoc.id)
                .collection('conversations')
                .doc(convDoc.id)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .limit(50)
                .get()

              messages = messagesSnapshot.docs.map(msgDoc => {
                const msgData = msgDoc.data()
                return {
                  role: msgData.role || msgData.sender || 'user',
                  content: msgData.content || msgData.text || msgData.message || '',
                  timestamp: msgData.timestamp,
                }
              })
            } catch (e) {
              // Messages might be stored differently
            }
          }

          if (messages.length === 0) continue

          totalMessageCount += messages.length
          aiMetrics.totalConversations++

          // Analyze conversation depth
          const exchangeCount = Math.floor(messages.length / 2)
          if (exchangeCount <= 2) aiMetrics.conversationDepth.shallow++
          else if (exchangeCount <= 5) aiMetrics.conversationDepth.moderate++
          else aiMetrics.conversationDepth.deep++

          // Analyze response lengths
          const assistantMessages = messages.filter(m => m.role === 'assistant')
          for (const msg of assistantMessages) {
            const len = msg.content?.length || 0
            totalResponseLength += len
            responseCount++

            if (len < 50) aiMetrics.responseQuality.tooShort++
            else if (len > 500) aiMetrics.responseQuality.tooLong++
            else aiMetrics.responseQuality.appropriate++
          }

          // Extract topics
          const topics = extractTopics(messages)
          for (const topic of topics) {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1
          }

          // Track time of day
          const createdAt = convData.created_at?.toDate?.() || convData.created_at
          if (createdAt) {
            const hour = new Date(createdAt).getHours()
            aiMetrics.timeOfDayDistribution[hour].count++
          }

          // Add to recent conversations (limit to 10)
          if (recentConversations.length < 10) {
            const firstUserMessage = messages.find(m => m.role === 'user')
            recentConversations.push({
              id: convDoc.id,
              preview: firstUserMessage?.content?.substring(0, 100) || 'No preview',
              messageCount: messages.length,
              timestamp: createdAt || null,
            })
          }

          // Classify conversation success
          const success = classifyConversationSuccess(messages)
          successMetrics[success.classification]++
          successMetrics.totalSuccessScore += success.score

          // Track success/failure reasons
          for (const reason of success.reasons) {
            if (success.score >= 50) {
              successMetrics.successReasons[reason] = (successMetrics.successReasons[reason] || 0) + 1
            } else {
              successMetrics.failureReasons[reason] = (successMetrics.failureReasons[reason] || 0) + 1
            }
          }

          // Detect sentiment and language
          const sentiment = detectSentiment(messages)
          const language = detectLanguage(messages)
          const engagementScore = calculateEngagementScore(messages)
          const topicDetails = extractTopicDetails(messages)

          // Track topic breakdown
          for (const td of topicDetails) {
            if (!topicBreakdownMap[td.topic]) {
              topicBreakdownMap[td.topic] = { count: 0, totalSuccessScore: 0, totalEngagement: 0, examples: [] }
            }
            topicBreakdownMap[td.topic].count++
            topicBreakdownMap[td.topic].totalSuccessScore += success.score
            topicBreakdownMap[td.topic].totalEngagement += engagementScore
            if (topicBreakdownMap[td.topic].examples.length < 3) {
              const example = messages.find(m => m.role === 'user')?.content.substring(0, 60)
              if (example && !topicBreakdownMap[td.topic].examples.includes(example)) {
                topicBreakdownMap[td.topic].examples.push(example)
              }
            }
          }

          // Store full conversation (limit to 50 for performance)
          if (fullConversations.length < 50) {
            const lastMessageAt = messages[messages.length - 1]?.timestamp?.toDate?.()
              || messages[messages.length - 1]?.timestamp
              || createdAt

            fullConversations.push({
              id: convDoc.id,
              userId: userDoc.id,
              messages,
              messageCount: messages.length,
              createdAt: createdAt || null,
              lastMessageAt: lastMessageAt || null,
              topics,
              topicDetails,
              success,
              sentiment,
              language,
              userEngagementScore: engagementScore,
              userMeta: {
                locale: userData.locale,
                device: userData.device_model,
                appVersion: userData.app_version,
              },
            })
          }
        }
      } catch (e) {
        // Skip users with no conversations access
      }
    }

    // Calculate averages
    userMetrics.avgConversationsPerUser = userMetrics.totalUsers > 0
      ? totalConversationCount / userMetrics.totalUsers
      : 0

    aiMetrics.totalMessages = totalMessageCount
    aiMetrics.avgConversationLength = aiMetrics.totalConversations > 0
      ? totalMessageCount / aiMetrics.totalConversations
      : 0
    aiMetrics.avgResponseLength = responseCount > 0
      ? totalResponseLength / responseCount
      : 0

    // Sort and limit counts
    userMetrics.topLocales = Object.entries(localeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([locale, count]) => ({ locale, count }))

    userMetrics.topDevices = Object.entries(deviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([device, count]) => ({ device, count }))

    userMetrics.appVersions = Object.entries(versionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([version, count]) => ({ version, count }))

    aiMetrics.topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }))

    // Build success metrics summary
    const totalClassified = successMetrics.successful + successMetrics.partial + successMetrics.failed + successMetrics.abandoned
    const successMetricsSummary: EvaluationResult['successMetrics'] = {
      successful: successMetrics.successful,
      partial: successMetrics.partial,
      failed: successMetrics.failed,
      abandoned: successMetrics.abandoned,
      avgSuccessScore: totalClassified > 0 ? Math.round(successMetrics.totalSuccessScore / totalClassified) : 0,
      topSuccessIndicators: Object.entries(successMetrics.successReasons)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason]) => reason),
      topFailureReasons: Object.entries(successMetrics.failureReasons)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason]) => reason),
    }

    // Build topic breakdown
    const topicBreakdown: EvaluationResult['topicBreakdown'] = Object.entries(topicBreakdownMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 15)
      .map(([topic, data]) => ({
        topic,
        count: data.count,
        avgSuccessScore: data.count > 0 ? Math.round(data.totalSuccessScore / data.count) : 0,
        avgEngagement: data.count > 0 ? Math.round(data.totalEngagement / data.count) : 0,
        examples: data.examples,
      }))

    // Sort full conversations by most recent first
    fullConversations.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bTime - aTime
    })

    // Generate insights with success metrics
    const insights = generateInsights(userMetrics, aiMetrics, successMetricsSummary)

    // Run AI-powered analysis if requested
    let aiAnalysis: AIAnalysisResult | null = null
    if (runAIAnalysis && fullConversations.length > 0) {
      console.log(`Running AI analysis on ${fullConversations.length} conversations...`)
      aiAnalysis = await analyzeConversationsWithAI(
        fullConversations.map(c => ({
          messages: c.messages,
          success: c.success,
          language: c.language,
          userId: c.userId,
          conversationId: c.id,
          createdAt: c.createdAt,
          userMeta: c.userMeta,
        })),
        systemPrompt
      )
      if (aiAnalysis) {
        console.log(`AI analysis complete. Quality score: ${aiAnalysis.overallQuality}`)
      }
    }

    const result: EvaluationResult = {
      userMetrics,
      aiMetrics,
      recentConversations,
      fullConversations,
      successMetrics: successMetricsSummary,
      topicBreakdown,
      insights,
      aiAnalysis,
      analysisDate: dateStr,
      generatedAt: new Date().toISOString(),
      cached: false,
      sampleSize: usersSnapshot.size,
      conversationsAnalyzed: aiMetrics.totalConversations,
    }

    // Cache result
    evaluationCache.set(cacheKey, { data: result, timestamp: Date.now() })

    // Save to Firestore history - use date as document ID to avoid duplicates
    try {
      const historyDoc = {
        ...result,
        id: `eval_${dateStr}`,
        date: dateStr,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      // Remove full conversations from history to save space (keep summaries)
      delete (historyDoc as any).recentConversations
      delete (historyDoc as any).fullConversations

      // Use date as document ID - this will overwrite if run multiple times for same day
      await db.collection(EVALUATION_HISTORY_COLLECTION).doc(`daily_${dateStr}`).set(historyDoc, { merge: true })
    } catch (historyError) {
      console.error('Failed to save evaluation history:', historyError)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Evaluation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to evaluate AI' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const history = searchParams.get('history')
  const limit = parseInt(searchParams.get('limit') || '10')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // If requesting history, fetch from Firestore
  if (history === 'true') {
    try {
      const db = getFirestoreDb()
      const historySnapshot = await db
        .collection(EVALUATION_HISTORY_COLLECTION)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get()

      const historyItems = historySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        }
      })

      return NextResponse.json({ history: historyItems, count: historyItems.length })
    } catch (error) {
      console.error('Failed to fetch history:', error)
      return NextResponse.json({
        error: 'Failed to fetch history',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  }

  // Return cached data if available
  const cached = evaluationCache.get('evaluation_100')
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...cached.data, cached: true })
  }

  return NextResponse.json({ cached: false, message: 'No cached evaluation available. Use POST to generate.' })
}
