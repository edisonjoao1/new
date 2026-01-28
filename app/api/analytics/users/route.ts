import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb, getFirebaseStorage, STORAGE_BUCKET } from '@/lib/firebase/admin'

// GET - Fetch users list or single user detail
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const userId = searchParams.get('userId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const sortBy = searchParams.get('sortBy') || 'last_active'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const localeFilter = searchParams.get('locale')
  const deviceFilter = searchParams.get('device')
  const minMessages = parseInt(searchParams.get('minMessages') || '0')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const segment = searchParams.get('segment') // 'all' | 'today' | 'new' | 'power' | 'at_risk' | 'voice' | 'images'
  const getDashboard = searchParams.get('dashboard') === 'true'

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getFirestoreDb()

    // Dashboard overview - comprehensive stats
    if (getDashboard) {
      return await getDashboardStats(db)
    }

    // Single user detail
    if (userId) {
      return await getUserDetail(db, userId)
    }

    // User list with segments
    return await getUserList(db, {
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      localeFilter,
      deviceFilter,
      minMessages,
      dateFrom,
      dateTo,
      segment,
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Comprehensive dashboard stats
async function getDashboardStats(db: ReturnType<typeof getFirestoreDb>) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get all users for segment calculation
  const allUsersSnapshot = await db.collection('users').get()
  const allUsers = allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // Calculate segment counts
  const segmentCounts = {
    all: allUsers.length,
    today: 0,
    new: 0,
    power: 0,
    at_risk: 0,
    voice: 0,
    images: 0,
    premium: 0,
  }

  let totalMessages = 0
  let totalImages = 0
  let totalVoiceSessions = 0
  let totalSessionSeconds = 0
  let totalAppOpens = 0
  let activeToday = 0
  let activeThisWeek = 0
  let activeThisMonth = 0

  const locales: Record<string, number> = {}
  const devices: Record<string, number> = {}
  const dailySignups: Record<string, number> = {}
  const dailyActive: Record<string, number> = {}

  allUsers.forEach((user: any) => {
    const lastActive = user.last_active?.toDate?.() || (user.last_active ? new Date(user.last_active) : null)
    const createdAt = user.created_at?.toDate?.() || (user.created_at ? new Date(user.created_at) : null)
    const firstOpen = user.first_open_date?.toDate?.() || (user.first_open_date ? new Date(user.first_open_date) : null)

    // Accumulate totals
    totalMessages += user.total_messages_sent || 0
    totalImages += user.total_images_generated || 0
    totalVoiceSessions += user.total_voice_sessions || 0
    totalSessionSeconds += user.total_session_seconds || 0
    totalAppOpens += user.total_app_opens || 0

    // Active segments
    if (lastActive) {
      if (lastActive >= today) {
        segmentCounts.today++
        activeToday++
      }
      if (lastActive >= sevenDaysAgo) activeThisWeek++
      if (lastActive >= thirtyDaysAgo) activeThisMonth++
      if (lastActive < sevenDaysAgo) segmentCounts.at_risk++

      // Daily active tracking
      const dateKey = lastActive.toISOString().split('T')[0]
      dailyActive[dateKey] = (dailyActive[dateKey] || 0) + 1
    }

    // New users (registered in last 7 days)
    const registerDate = firstOpen || createdAt
    if (registerDate && registerDate >= sevenDaysAgo) {
      segmentCounts.new++
    }

    // Daily signups tracking
    if (registerDate) {
      const dateKey = registerDate.toISOString().split('T')[0]
      dailySignups[dateKey] = (dailySignups[dateKey] || 0) + 1
    }

    // Power users (50+ messages)
    if ((user.total_messages_sent || 0) >= 50) segmentCounts.power++

    // Feature users
    if ((user.total_voice_sessions || 0) > 0) segmentCounts.voice++
    if ((user.total_images_generated || 0) > 0) segmentCounts.images++
    if (user.is_premium) segmentCounts.premium++

    // Locale distribution
    if (user.locale) {
      locales[user.locale] = (locales[user.locale] || 0) + 1
    }

    // Device distribution
    if (user.device_model) {
      devices[user.device_model] = (devices[user.device_model] || 0) + 1
    }
  })

  // Sort and get top items
  const topLocales = Object.entries(locales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([locale, count]) => ({ locale, count, percentage: Math.round(count / allUsers.length * 100) }))

  const topDevices = Object.entries(devices)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([device, count]) => ({ device, count, percentage: Math.round(count / allUsers.length * 100) }))

  // Build daily timeline (last 30 days)
  const timeline: { date: string; signups: number; active: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    timeline.push({
      date: dateKey,
      signups: dailySignups[dateKey] || 0,
      active: dailyActive[dateKey] || 0,
    })
  }

  return NextResponse.json({
    overview: {
      totalUsers: allUsers.length,
      activeToday,
      activeThisWeek,
      activeThisMonth,
      totalMessages,
      totalImages,
      totalVoiceSessions,
      totalAppOpens,
      totalSessionHours: Math.round(totalSessionSeconds / 3600),
      avgMessagesPerUser: allUsers.length > 0 ? Math.round(totalMessages / allUsers.length * 10) / 10 : 0,
      avgImagesPerUser: allUsers.length > 0 ? Math.round(totalImages / allUsers.length * 10) / 10 : 0,
      avgAppOpensPerUser: allUsers.length > 0 ? Math.round(totalAppOpens / allUsers.length * 10) / 10 : 0,
    },
    segmentCounts,
    topLocales,
    topDevices,
    timeline,
    retentionRate: {
      day1: activeThisWeek > 0 ? Math.round(activeToday / activeThisWeek * 100) : 0,
      day7: activeThisMonth > 0 ? Math.round(activeThisWeek / activeThisMonth * 100) : 0,
    },
  })
}

interface UserListOptions {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  localeFilter?: string | null
  deviceFilter?: string | null
  minMessages: number
  dateFrom?: string | null
  dateTo?: string | null
  segment?: string | null
}

async function getUserList(db: ReturnType<typeof getFirestoreDb>, options: UserListOptions) {
  const { page, limit, sortBy, sortOrder, localeFilter, deviceFilter, minMessages, dateFrom, dateTo, segment } = options

  // For segment-based filtering, we need to fetch all users first then filter
  // This is because Firestore doesn't support complex date comparisons
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Build query - fetch all users then filter in-memory
  // This avoids Firestore composite index requirements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = db.collection('users')

  // Only sort by last_active to avoid index requirements
  // Other sorting will be done in-memory
  query = query.orderBy('last_active', 'desc')

  // Get all users
  const snapshot = await query.get()

  let allMatchingUsers = await Promise.all(snapshot.docs.map(async (doc: any) => {
    const data = doc.data()

    // Get conversation count
    const conversationsSnapshot = await db
      .collection('users')
      .doc(doc.id)
      .collection('conversations')
      .count()
      .get()
    const conversationCount = conversationsSnapshot.data().count

    // Calculate engagement score
    const engagementScore = calculateEngagementScore(data, conversationCount)

    const parseDate = (d: any) => d?.toDate?.() || (d ? new Date(d) : null)

    return {
      id: doc.id,
      device_id: data.device_id || doc.id,
      locale: data.locale || 'unknown',
      device_model: data.device_model || 'Unknown',
      os_version: data.os_version || 'Unknown',
      app_version: data.app_version || 'Unknown',
      total_app_opens: data.total_app_opens || 0,
      total_messages_sent: data.total_messages_sent || 0,
      total_images_generated: data.total_images_generated || 0,
      total_voice_sessions: data.total_voice_sessions || 0,
      total_session_seconds: data.total_session_seconds || 0,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at || null,
      last_active: data.last_active?.toDate?.()?.toISOString() || data.last_active || null,
      first_open_date: data.first_open_date?.toDate?.()?.toISOString() || data.first_open_date || null,
      last_open_date: data.last_open_date?.toDate?.()?.toISOString() || data.last_open_date || null,
      days_since_first_open: data.days_since_first_open || 0,
      voice_failure_count: data.voice_failure_count || 0,
      nsfw_attempt_count: data.nsfw_attempt_count || 0,
      is_premium: data.is_premium || false,
      conversation_count: conversationCount,
      engagement_score: engagementScore,
      // Internal date objects for filtering
      _lastActive: parseDate(data.last_active),
      _createdAt: parseDate(data.created_at),
      _firstOpen: parseDate(data.first_open_date),
    }
  }))

  // Calculate segment counts BEFORE filtering
  const segmentCounts = {
    all: allMatchingUsers.length,
    today: allMatchingUsers.filter(u => u._lastActive && u._lastActive >= today).length,
    new: allMatchingUsers.filter(u => {
      const registerDate = u._firstOpen || u._createdAt
      return registerDate && registerDate >= sevenDaysAgo
    }).length,
    power: allMatchingUsers.filter(u => (u.total_messages_sent || 0) >= 50).length,
    at_risk: allMatchingUsers.filter(u => u._lastActive && u._lastActive < sevenDaysAgo).length,
    voice: allMatchingUsers.filter(u => (u.total_voice_sessions || 0) > 0).length,
    images: allMatchingUsers.filter(u => (u.total_images_generated || 0) > 0).length,
  }

  // Apply segment filter
  if (segment && segment !== 'all') {
    allMatchingUsers = allMatchingUsers.filter(u => {
      switch (segment) {
        case 'today':
          return u._lastActive && u._lastActive >= today
        case 'new':
          const registerDate = u._firstOpen || u._createdAt
          return registerDate && registerDate >= sevenDaysAgo
        case 'power':
          return (u.total_messages_sent || 0) >= 50
        case 'at_risk':
          return u._lastActive && u._lastActive < sevenDaysAgo
        case 'voice':
          return (u.total_voice_sessions || 0) > 0
        case 'images':
          return (u.total_images_generated || 0) > 0
        default:
          return true
      }
    })
  }

  // Apply locale filter (in-memory)
  if (localeFilter) {
    allMatchingUsers = allMatchingUsers.filter(u => u.locale === localeFilter)
  }

  // Apply device filter (in-memory)
  if (deviceFilter) {
    allMatchingUsers = allMatchingUsers.filter(u => u.device_model === deviceFilter)
  }

  // Apply date range filter (in-memory)
  if (dateFrom) {
    const fromDate = new Date(dateFrom)
    allMatchingUsers = allMatchingUsers.filter(u => u._lastActive && u._lastActive >= fromDate)
  }
  if (dateTo) {
    const toDate = new Date(dateTo)
    toDate.setHours(23, 59, 59, 999)
    allMatchingUsers = allMatchingUsers.filter(u => u._lastActive && u._lastActive <= toDate)
  }

  // Apply minMessages filter
  if (minMessages > 0) {
    allMatchingUsers = allMatchingUsers.filter(u => (u.total_messages_sent || 0) >= minMessages)
  }

  // Apply sorting (in-memory)
  const validSortFields = ['last_active', 'created_at', 'total_messages_sent', 'total_images_generated', 'total_voice_sessions', 'total_app_opens', 'first_open_date', 'engagement_score']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'last_active'

  allMatchingUsers.sort((a: any, b: any) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    // Handle date fields
    if (sortField.includes('date') || sortField.includes('active') || sortField.includes('created')) {
      aVal = aVal ? new Date(aVal).getTime() : 0
      bVal = bVal ? new Date(bVal).getTime() : 0
    }

    // Handle null/undefined
    if (aVal == null) aVal = sortOrder === 'asc' ? Infinity : -Infinity
    if (bVal == null) bVal = sortOrder === 'asc' ? Infinity : -Infinity

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  // Get total after filtering
  const total = allMatchingUsers.length

  // Pagination
  const offset = (page - 1) * limit
  const paginatedUsers = allMatchingUsers.slice(offset, offset + limit)

  // Clean up internal fields
  const cleanUsers = paginatedUsers.map(({ _lastActive, _createdAt, _firstOpen, ...rest }) => rest)

  // Get unique locales and devices for filter dropdowns
  const locales = new Set<string>()
  const devices = new Set<string>()
  allMatchingUsers.forEach(user => {
    if (user.locale) locales.add(user.locale)
    if (user.device_model) devices.add(user.device_model)
  })

  return NextResponse.json({
    users: cleanUsers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    segmentCounts,
    filters: {
      locales: Array.from(locales).sort(),
      devices: Array.from(devices).sort(),
    },
  })
}

async function getUserDetail(db: ReturnType<typeof getFirestoreDb>, userId: string) {
  const userDoc = await db.collection('users').doc(userId).get()

  if (!userDoc.exists) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const userData = userDoc.data()!

  // Get conversations with FULL content
  const conversationsSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('conversations')
    .orderBy('created_at', 'desc')
    .limit(50)
    .get()

  const conversations = conversationsSnapshot.docs.map(doc => {
    const data = doc.data()
    const messages = data.messages || []

    // Helper to get message content - check multiple possible field names
    const getMessageContent = (m: any): string => {
      return m.content || m.text || m.message || m.body || ''
    }

    // Get first user message as preview
    const userMessages = messages.filter((m: any) => m.role === 'user')
    const firstUserContent = getMessageContent(userMessages[0] || {})
    const preview = firstUserContent.substring(0, 100) || 'No preview'

    // Detect topics
    const topics = detectTopics(messages)

    // Calculate success score
    const successScore = calculateConversationSuccess(messages)

    return {
      id: doc.id,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at || null,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at || null,
      message_count: messages.length,
      preview: preview + (preview.length >= 100 ? '...' : ''),
      topics,
      success_score: successScore,
      behavioral_signals: data.behavioral_signals || null,
      // Include full messages for detail view
      messages: messages.map((m: any) => ({
        role: m.role,
        content: getMessageContent(m),
        timestamp: m.timestamp?.toDate?.()?.toISOString() || m.timestamp || null,
      })),
    }
  })

  // Get images from Firebase Storage
  // Images are stored at: gs://inteligencia-artificial-6a543.firebasestorage.app/images/{userId}/
  let images: any[] = []

  try {
    const storage = getFirebaseStorage()
    const bucket = storage.bucket(STORAGE_BUCKET)

    // List files in the user's images folder
    const [files] = await bucket.getFiles({
      prefix: `images/${userId}/`,
      maxResults: 50,
    })

    // Get signed URLs for each image (valid for 1 hour)
    const imagePromises = files
      .filter(file => !file.name.endsWith('/')) // Skip folder entries
      .map(async (file) => {
        try {
          // Get signed URL for viewing
          const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // 1 hour
          })

          // Get file metadata
          const [metadata] = await file.getMetadata()

          // Extract filename from path
          const fileName = file.name.split('/').pop() || file.name

          // Log metadata for debugging (first few images only)
          if (images.length < 3) {
            console.log(`Image metadata for ${fileName}:`, JSON.stringify(metadata.metadata, null, 2))
          }

          // Determine source from metadata - check various fields
          // Note: Firebase metadata uses snake_case (conversation_id, not conversationId)
          const customMeta = metadata.metadata || {}
          const model = customMeta.model || customMeta.modelId || null
          const conversationId = customMeta.conversation_id || customMeta.conversationId || null
          // Check source field explicitly (new: "chat" or "generator")
          const sourceType = customMeta.source || customMeta.sourceType || customMeta.type || null
          const isFromChat = sourceType === 'chat' || Boolean(conversationId) || customMeta.fromChat === 'true'

          return {
            id: fileName,
            prompt: customMeta.prompt || 'Generated image',
            created_at: metadata.timeCreated || null,
            status: 'completed',
            url: signedUrl,
            download_url: signedUrl,
            thumbnail_url: null,
            model: model,
            size: metadata.size ? `${Math.round(parseInt(String(metadata.size)) / 1024)}KB` : null,
            revised_prompt: customMeta.revised_prompt || customMeta.revisedPrompt || null,
            source: 'firebase_storage',
            content_type: metadata.contentType || 'image/png',
            // Additional metadata for filtering - conversation_id indicates chat origin
            sourceType: sourceType,
            isFromChat: isFromChat,
            conversationId: conversationId,
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError)
          return null
        }
      })

    const imageResults = await Promise.all(imagePromises)
    images = imageResults.filter((img): img is NonNullable<typeof img> => img !== null)

    // Sort by created_at descending
    images.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateB - dateA
    })

    console.log(`Found ${images.length} images in Firebase Storage for user ${userId}`)
  } catch (storageError) {
    console.error('Error fetching images from Firebase Storage:', storageError)
  }

  // Get voice failures
  const voiceFailuresSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('voice_failures')
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get()

  const voiceFailures = voiceFailuresSnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp || null,
      error_type: data.error_type || data.type || 'unknown',
      error_message: data.error_message || data.message || null,
      session_duration: data.session_duration || 0,
      reconnect_attempts: data.reconnect_attempts || 0,
    }
  })

  // Get voice sessions
  const voiceSessionsSnapshot = await db
    .collection('users')
    .doc(userId)
    .collection('voice_sessions')
    .orderBy('started_at', 'desc')
    .limit(20)
    .get()

  const voiceSessions = voiceSessionsSnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      started_at: data.started_at?.toDate?.()?.toISOString() || data.started_at || null,
      ended_at: data.ended_at?.toDate?.()?.toISOString() || data.ended_at || null,
      duration_seconds: data.duration_seconds || data.duration || 0,
      message_count: data.message_count || 0,
      was_successful: data.was_successful ?? true,
      end_reason: data.end_reason || null,
    }
  })

  // Get activity timeline (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activityTimeline = buildActivityTimeline(conversations, images, thirtyDaysAgo)

  // Calculate engagement score
  const conversationCount = conversationsSnapshot.size
  const engagementScore = calculateEngagementScore(userData, conversationCount)

  // Parse all the dates from userData
  const parseDate = (d: any) => d?.toDate?.()?.toISOString() || d || null

  return NextResponse.json({
    user: {
      id: userDoc.id,
      device_id: userData.device_id || userDoc.id,

      // Device Info
      locale: userData.locale || 'unknown',
      device_model: userData.device_model || 'Unknown',
      os_version: userData.os_version || 'Unknown',
      app_version: userData.app_version || 'Unknown',

      // Core Usage Stats
      total_app_opens: userData.total_app_opens || 0,
      total_messages_sent: userData.total_messages_sent || 0,
      total_images_generated: userData.total_images_generated || 0,
      total_voice_sessions: userData.total_voice_sessions || 0,
      total_session_seconds: userData.total_session_seconds || 0,

      // Dates (COMPREHENSIVE)
      first_open_date: parseDate(userData.first_open_date),
      last_open_date: parseDate(userData.last_open_date),
      created_at: parseDate(userData.created_at),
      last_active: parseDate(userData.last_active),
      days_since_first_open: userData.days_since_first_open || 0,

      // Voice Failure Tracking
      voice_failure_count: userData.voice_failure_count || 0,
      last_voice_failure: parseDate(userData.last_voice_failure),
      last_voice_failure_type: userData.last_voice_failure_type || null,

      // NSFW Tracking
      nsfw_attempt_count: userData.nsfw_attempt_count || 0,
      last_nsfw_attempt: parseDate(userData.last_nsfw_attempt),

      // Lesson Progress
      lessons_completed: userData.lessons_completed || 0,
      lessons_started: userData.lessons_started || 0,
      current_lesson: userData.current_lesson || null,

      // Subscription/Premium (if tracked)
      is_premium: userData.is_premium || false,
      subscription_type: userData.subscription_type || null,

      // Referral/Source
      referral_source: userData.referral_source || null,
      install_source: userData.install_source || null,

      // Engagement
      engagement_score: engagementScore,

      // Push Notifications (if tracked)
      push_enabled: userData.push_enabled ?? null,
      push_token: userData.push_token ? '(token exists)' : null,

      // Feature Usage Flags
      has_used_voice: (userData.total_voice_sessions || 0) > 0,
      has_generated_images: (userData.total_images_generated || 0) > 0,
      has_used_lessons: (userData.lessons_started || 0) > 0,
    },
    conversations,
    images,
    voice_sessions: voiceSessions,
    voice_failures: voiceFailures,
    activity_timeline: activityTimeline,
    stats: {
      conversation_count: conversationCount,
      total_messages: conversations.reduce((sum, c) => sum + c.message_count, 0),
      avg_messages_per_conversation: conversationCount > 0
        ? Math.round(conversations.reduce((sum, c) => sum + c.message_count, 0) / conversationCount * 10) / 10
        : 0,
      total_images: images.length,
      avg_success_score: conversationCount > 0
        ? Math.round(conversations.reduce((sum, c) => sum + c.success_score, 0) / conversationCount)
        : 0,
      total_voice_failures: voiceFailures.length,
      total_voice_session_time: voiceSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0),
      avg_voice_session_duration: voiceSessions.length > 0
        ? Math.round(voiceSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / voiceSessions.length)
        : 0,
    },
  })
}

// GET conversation messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, userId, conversationId } = body

    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!userId || !conversationId) {
      return NextResponse.json({ error: 'userId and conversationId required' }, { status: 400 })
    }

    const db = getFirestoreDb()

    const conversationDoc = await db
      .collection('users')
      .doc(userId)
      .collection('conversations')
      .doc(conversationId)
      .get()

    if (!conversationDoc.exists) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const data = conversationDoc.data()!

    // Helper to get message content - check multiple possible field names
    const getMessageContent = (m: any): string => {
      return m.content || m.text || m.message || m.body || ''
    }

    const messages = (data.messages || []).map((m: any) => ({
      role: m.role,
      content: getMessageContent(m),
      timestamp: m.timestamp?.toDate?.()?.toISOString() || m.timestamp || null,
    }))

    return NextResponse.json({
      id: conversationDoc.id,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      messages,
      behavioral_signals: data.behavioral_signals || null,
    })
  } catch (error) {
    console.error('Failed to fetch conversation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}

// Helper functions

function calculateEngagementScore(userData: any, conversationCount: number): number {
  let score = 0

  // Messages (up to 40 points)
  const messages = userData.total_messages_sent || 0
  score += Math.min(40, Math.floor(messages / 5))

  // Conversations (up to 20 points)
  score += Math.min(20, conversationCount * 2)

  // Images (up to 15 points)
  const images = userData.total_images_generated || 0
  score += Math.min(15, images * 3)

  // Voice sessions (up to 15 points)
  const voice = userData.total_voice_sessions || 0
  score += Math.min(15, voice * 5)

  // Session time (up to 10 points)
  const sessionMinutes = (userData.total_session_seconds || 0) / 60
  score += Math.min(10, Math.floor(sessionMinutes / 10))

  return Math.min(100, score)
}

function detectTopics(messages: any[]): string[] {
  const topics: Set<string> = new Set()

  const content = messages.map((m: any) => m.content?.toLowerCase() || '').join(' ')

  // Simple keyword-based topic detection
  if (/\b(how|what|why|when|where|who|can you|could you|please explain)\b/.test(content)) {
    topics.add('questions')
  }
  if (/\b(write|create|generate|make|compose|story|poem|essay)\b/.test(content)) {
    topics.add('creative')
  }
  if (/\b(code|programming|function|bug|error|javascript|python|swift)\b/.test(content)) {
    topics.add('coding')
  }
  if (/\b(translate|spanish|english|french|german|idioma|traducir)\b/.test(content)) {
    topics.add('translation')
  }
  if (/\b(image|photo|picture|draw|imagen|foto)\b/.test(content)) {
    topics.add('images')
  }
  if (/\b(learn|study|teach|lesson|english|grammar|vocabulary)\b/.test(content)) {
    topics.add('learning')
  }
  if (/\b(math|calculate|equation|number|formula)\b/.test(content)) {
    topics.add('math')
  }
  if (/\b(business|marketing|sales|strategy|plan)\b/.test(content)) {
    topics.add('business')
  }

  return Array.from(topics)
}

function calculateConversationSuccess(messages: any[]): number {
  if (messages.length === 0) return 0

  let score = 50 // Base score

  // Longer conversations are generally more successful
  if (messages.length >= 4) score += 10
  if (messages.length >= 8) score += 10

  // Check for positive signals in last messages
  const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()
  const content = lastUserMessage?.content?.toLowerCase() || ''

  if (/\b(gracias|thank|thanks|perfect|great|excellent|awesome|genial|increible)\b/.test(content)) {
    score += 20
  }

  if (/\b(help|ayuda|no entiendo|confused|wrong)\b/.test(content)) {
    score -= 10
  }

  // Check assistant responses
  const assistantMessages = messages.filter((m: any) => m.role === 'assistant')
  const avgResponseLength = assistantMessages.reduce((sum: number, m: any) => sum + (m.content?.length || 0), 0) / (assistantMessages.length || 1)

  if (avgResponseLength > 200) score += 10
  if (avgResponseLength < 50) score -= 10

  return Math.max(0, Math.min(100, score))
}

function buildActivityTimeline(conversations: any[], images: any[], startDate: Date): any[] {
  const timeline: { [date: string]: { messages: number; images: number; conversations: number } } = {}

  // Initialize all dates
  const current = new Date(startDate)
  const today = new Date()
  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0]
    timeline[dateStr] = { messages: 0, images: 0, conversations: 0 }
    current.setDate(current.getDate() + 1)
  }

  // Add conversation data
  conversations.forEach(conv => {
    if (!conv.created_at) return
    const dateStr = conv.created_at.split('T')[0]
    if (timeline[dateStr]) {
      timeline[dateStr].conversations += 1
      timeline[dateStr].messages += conv.message_count
    }
  })

  // Add image data
  images.forEach(img => {
    if (!img.created_at) return
    const dateStr = img.created_at.split('T')[0]
    if (timeline[dateStr]) {
      timeline[dateStr].images += 1
    }
  })

  return Object.entries(timeline).map(([date, data]) => ({
    date,
    ...data,
  })).sort((a, b) => a.date.localeCompare(b.date))
}
