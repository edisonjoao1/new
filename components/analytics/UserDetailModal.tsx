'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Users,
  MessageSquare,
  Image,
  Mic,
  Clock,
  Globe,
  Smartphone,
  Calendar,
  Activity,
  TrendingUp,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Brain,
  AlertTriangle,
  Shield,
  Crown,
  Download,
  ExternalLink,
  BookOpen,
  Zap,
  Bell,
  BellRing,
  BellOff,
  Hash,
  Video,
  Search,
  Star,
  User,
  Heart,
  Target,
  Sparkles,
  MapPin,
  Briefcase,
  ThumbsUp,
  MessageCircle,
  CircleAlert,
  Flame,
  BarChart3,
  DollarSign,
  UserX,
  CheckCircle2,
  Circle,
  Footprints,
  CreditCard,
  Send,
  Loader2,
  Wand2,
  FileText,
  PenLine,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import ConversationViewer from './ConversationViewer'

interface UserDetail {
  id: string
  device_id: string

  // Profile
  user_name: string | null
  about_me: string | null
  occupation: string | null
  interests: string[]
  goals: string[]
  assistant_name: string | null
  communication_style: string | null
  timezone: string | null

  // Device Info
  locale: string
  device_model: string
  os_version: string
  app_version: string
  previous_version: string | null

  // Core Usage Stats
  total_app_opens: number
  total_messages_sent: number
  total_images_generated: number
  total_videos_generated: number
  total_voice_sessions: number
  total_web_searches: number
  total_learn_lessons_viewed: number
  total_session_seconds: number

  // Dates
  first_open_date: string | null
  last_open_date: string | null
  created_at: string | null
  last_active: string | null
  days_since_first_open: number

  // Subscription
  is_subscribed: boolean
  was_previously_premium: boolean
  is_in_billing_retry: boolean
  subscription_updated_at: string | null
  subscription_status_override: string | null
  subscription_status_override_at: string | null

  // Notifications
  notification_granted: boolean
  notifications_enabled: boolean
  notification_prompted: boolean
  notification_frequency: string | null
  preferred_notification_time: string | null
  notification_preferences_updated_at: string | null

  // AI Memory
  ai_memory_count: number
  ai_memories_sample: string[]
  ai_memory_at_free_limit: boolean

  // Personalization
  personalization_score: number
  personalization_fields: Record<string, boolean> | null
  has_basic_personalization: boolean
  missing_personalizations: string[]

  // Rating & Feedback
  has_rated: boolean
  rating_response: string | null
  rating_prompt_count: number
  last_rating_event: string | null
  last_rating_event_at: string | null
  feedback_count: number
  last_feedback: string | null
  last_feedback_trigger: string | null

  // Error Tracking
  error_count: number
  last_error: string | null
  last_error_category: string | null
  last_error_code: number | null
  image_failure_count: number
  last_image_failure: string | null
  last_image_failure_type: string | null

  // Voice Failure Tracking
  voice_failure_count: number
  last_voice_failure: string | null
  last_voice_failure_type: string | null

  // NSFW Tracking
  nsfw_attempt_count: number
  last_nsfw_attempt: string | null

  // Lesson Progress
  lessons_completed: number
  lessons_started: number
  completed_lesson_ids: string[]
  viewed_lesson_ids: string[]
  current_lesson: string | null

  // Engagement
  engagement_score: number
  engagement_level: string | null

  // Activity Patterns
  active_dates: string[]
  activity_hours: number[]
  current_streak: number
  longest_streak: number

  // Referral/Source
  referral_source: string | null
  install_source: string | null

  // Push Token
  has_push_token: boolean

  // Estimated API Costs
  estimated_cost: {
    images: number
    voice: number
    webSearches: number
    chat: number
    total: number
  }

  // Feature Usage Flags
  has_used_voice: boolean
  has_generated_images: boolean
  has_generated_videos: boolean
  has_used_web_search: boolean
  has_used_lessons: boolean
}

interface Conversation {
  id: string
  created_at: string | null
  message_count: number
  preview: string
  topics: string[]
  success_score: number
  is_voice?: boolean
  title?: string | null
}

interface ImageItem {
  id: string
  prompt: string
  created_at: string | null
  status: string
  url: string | null
  download_url: string | null
  thumbnail_url: string | null
  model: string | null
  size: string | null
  revised_prompt: string | null
  sourceType: string | null
  isFromChat: boolean
  conversationId: string | null
}

interface VoiceSession {
  id: string
  started_at: string | null
  ended_at: string | null
  duration_seconds: number
  message_count: number
  was_successful: boolean
  end_reason: string | null
}

interface VoiceFailure {
  id: string
  timestamp: string | null
  error_type: string
  error_message: string | null
  session_duration: number
  reconnect_attempts: number
}

interface Stats {
  conversation_count: number
  total_messages: number
  avg_messages_per_conversation: number
  total_images: number
  avg_success_score: number
  total_voice_failures: number
  total_voice_session_time: number
  avg_voice_session_duration: number
}

interface UserDetailModalProps {
  userId: string | null
  analyticsKey: string
  isDark: boolean
  onClose: () => void
}

export default function UserDetailModal({ userId, analyticsKey, isDark, onClose }: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [images, setImages] = useState<ImageItem[]>([])
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([])
  const [voiceFailures, setVoiceFailures] = useState<VoiceFailure[]>([])
  const [activityTimeline, setActivityTimeline] = useState<any[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'conversations' | 'images' | 'voice'>('overview')
  const [imageFilter, setImageFilter] = useState<'all' | 'chat' | 'generator'>('all')
  const [copied, setCopied] = useState(false)
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [churnData, setChurnData] = useState<any>(null)

  // Push notification state
  const [notifMode, setNotifMode] = useState<'ai' | 'template' | 'custom'>('ai')
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [notifTargetView, setNotifTargetView] = useState('chat')
  const [notifTemplateId, setNotifTemplateId] = useState('')
  const [notifTemplates, setNotifTemplates] = useState<{ id: string; label: string; title: string; body: string; targetView: string }[]>([])
  const [notifSending, setNotifSending] = useState(false)
  const [notifResult, setNotifResult] = useState<{ success: boolean; message: string } | null>(null)
  const [notifHistory, setNotifHistory] = useState<any[]>([])
  const [notifHistoryLoading, setNotifHistoryLoading] = useState(false)
  const [notifPreview, setNotifPreview] = useState<{ title: string; body: string; targetView: string } | null>(null)

  // Filter images by source - check multiple indicators
  const getImageSource = (img: ImageItem): 'chat' | 'generator' => {
    // If we have explicit metadata about source, use it
    if (img.isFromChat || img.conversationId) return 'chat'
    if (img.sourceType === 'chat') return 'chat'
    if (img.sourceType === 'generator' || img.sourceType === 'standalone') return 'generator'

    // Fall back to model-based detection
    const model = img.model?.toLowerCase() || ''

    // Chat uses gpt-image-1 (NOT 1.5), dall-e-2, or image-1
    // These models are typically used in chat flow
    if (model === 'gpt-image-1' || model === 'image-1') return 'chat'
    if (model === 'dall-e-2' || model === 'dalle-2') return 'chat'

    // Generator uses gpt-image-1.5, dall-e-3, etc - the newer/better models
    if (model.includes('1.5') || model.includes('dall-e-3') || model.includes('dalle-3')) return 'generator'

    // If model is null/unknown, default to chat (most common case)
    // since many older images might not have model metadata
    if (!model) return 'chat'

    // Default to generator for any other model
    return 'generator'
  }

  const filteredImages = images.filter(img => {
    if (imageFilter === 'all') return true
    return getImageSource(img) === imageFilter
  })

  const imageCounts = {
    all: images.length,
    chat: images.filter(img => getImageSource(img) === 'chat').length,
    generator: images.filter(img => getImageSource(img) === 'generator').length,
  }

  useEffect(() => {
    if (userId) {
      fetchUserDetail()
    }
  }, [userId])

  const fetchUserDetail = async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/analytics/users?key=${encodeURIComponent(analyticsKey)}&userId=${encodeURIComponent(userId)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user')
      }

      setUser(data.user)
      setConversations(data.conversations)
      setImages(data.images)
      setVoiceSessions(data.voice_sessions || [])
      setVoiceFailures(data.voice_failures || [])
      setActivityTimeline(data.activity_timeline)
      setStats(data.stats)

      // Fetch GA4 onboarding and churn data in parallel
      const deviceId = data.user?.device_id
      if (deviceId) {
        fetch(`/api/analytics/onboarding?key=${encodeURIComponent(analyticsKey)}&mode=user&deviceId=${encodeURIComponent(deviceId)}`)
          .then(res => res.json())
          .then(d => setOnboardingData(d))
          .catch(() => setOnboardingData(null))

        // Only fetch churn data if user is churned
        if (data.user?.was_previously_premium && !data.user?.is_subscribed) {
          fetch(`/api/analytics/onboarding?key=${encodeURIComponent(analyticsKey)}&mode=churn&deviceId=${encodeURIComponent(deviceId)}`)
            .then(res => res.json())
            .then(d => setChurnData(d))
            .catch(() => setChurnData(null))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const copyUserId = async () => {
    if (user) {
      await navigator.clipboard.writeText(user.device_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Push notification functions
  const fetchNotifTemplates = async () => {
    try {
      const res = await fetch(`/api/analytics/push-notifications?key=${encodeURIComponent(analyticsKey)}&action=templates`)
      const data = await res.json()
      if (data.templates) {
        setNotifTemplates(data.templates)
        if (data.templates.length > 0) setNotifTemplateId(data.templates[0].id)
      }
    } catch { /* ignore */ }
  }

  const fetchNotifHistory = async () => {
    if (!userId) return
    setNotifHistoryLoading(true)
    try {
      const res = await fetch(`/api/analytics/push-notifications?key=${encodeURIComponent(analyticsKey)}&action=history&userId=${encodeURIComponent(userId)}`)
      const data = await res.json()
      setNotifHistory(data.history || [])
    } catch { /* ignore */ }
    setNotifHistoryLoading(false)
  }

  // AI preview: generate notification without sending
  const previewAINotification = async () => {
    if (!userId || notifSending) return
    setNotifSending(true)
    setNotifResult(null)
    setNotifPreview(null)

    try {
      const res = await fetch('/api/analytics/push-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: analyticsKey, userId, mode: 'ai', preview: true }),
      })
      const data = await res.json()
      if (data.notification) {
        setNotifPreview(data.notification)
      } else {
        setNotifResult({ success: false, message: data.error || 'AI generation failed' })
      }
    } catch (err) {
      setNotifResult({ success: false, message: err instanceof Error ? err.message : 'Network error' })
    }
    setNotifSending(false)
  }

  // Confirm and send a previewed AI notification (or send template/custom directly)
  const sendNotification = async (confirmedPreview?: { title: string; body: string; targetView: string }) => {
    if (!userId || notifSending) return
    setNotifSending(true)
    setNotifResult(null)

    try {
      let payload: Record<string, unknown> = { key: analyticsKey, userId }

      if (confirmedPreview) {
        // Sending a confirmed AI preview
        payload.mode = 'ai_send'
        payload.title = confirmedPreview.title
        payload.body = confirmedPreview.body
        payload.targetView = confirmedPreview.targetView
      } else if (notifMode === 'template') {
        payload.mode = 'template'
        payload.templateId = notifTemplateId
      } else {
        payload.mode = 'individual'
        payload.title = notifTitle
        payload.body = notifBody
        payload.targetView = notifTargetView
      }

      const res = await fetch('/api/analytics/push-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.sent) {
        const notif = data.notification || { title: notifTitle, body: notifBody }
        setNotifResult({ success: true, message: `Sent: "${notif.title}"` })
        setNotifTitle('')
        setNotifBody('')
        setNotifPreview(null)
        fetchNotifHistory()
      } else {
        setNotifResult({ success: false, message: data.error || 'Failed to send' })
      }
    } catch (err) {
      setNotifResult({ success: false, message: err instanceof Error ? err.message : 'Network error' })
    }
    setNotifSending(false)
  }

  // Fetch templates on mount
  useEffect(() => {
    fetchNotifTemplates()
    fetchNotifHistory()
  }, [])

  const getEngagementColor = (score: number) => {
    if (score >= 70) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSuccessColor = (score: number) => {
    if (score >= 70) return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
    if (score >= 40) return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
    return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
  }

  if (!userId) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
              isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="h-full overflow-y-auto max-h-[90vh]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchUserDetail} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : user ? (
              <>
                {/* Header */}
                <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                          <User className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {user.user_name || 'Unnamed User'}
                            </h2>
                            {user.is_in_billing_retry && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-500 font-medium flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                Billing Retry
                              </span>
                            )}
                            {user.is_subscribed && !user.is_in_billing_retry && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-500 font-medium">
                                Subscribed
                              </span>
                            )}
                            {user.was_previously_premium && !user.is_subscribed && !user.is_in_billing_retry && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-500 font-medium flex items-center gap-1">
                                <UserX className="w-3 h-3" />
                                Churned
                              </span>
                            )}
                            <button
                              onClick={copyUserId}
                              className={`p-1 rounded transition-colors ${
                                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                              }`}
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                              )}
                            </button>
                          </div>
                          <p className={`font-mono text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {user.device_id}
                          </p>
                          {(user.occupation || user.about_me) && (
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user.occupation || user.about_me}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-4xl font-bold ${getEngagementColor(user.engagement_score)}`}>
                        {user.engagement_score}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Engagement Score
                      </p>
                      {user.engagement_level && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {user.engagement_level}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
                    {[
                      { label: 'Messages', value: user.total_messages_sent, icon: MessageSquare, color: 'purple' },
                      { label: 'Images', value: user.total_images_generated, icon: Image, color: 'blue' },
                      { label: 'Videos', value: user.total_videos_generated, icon: Video, color: 'cyan' },
                      { label: 'Voice', value: user.total_voice_sessions, icon: Mic, color: 'red' },
                      { label: 'Web Searches', value: user.total_web_searches, icon: Search, color: 'indigo' },
                      { label: 'Session Time', value: formatDuration(user.total_session_seconds), icon: Clock, color: 'green' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                      >
                        <stat.icon className={`w-4 h-4 text-${stat.color}-500 mb-1`} />
                        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Estimated Cost */}
                  {user.estimated_cost && user.estimated_cost.total > 0 && (
                    <div className={`flex items-center gap-4 mt-3 px-4 py-2.5 rounded-xl ${isDark ? 'bg-green-900/20 border border-green-800/50' : 'bg-green-50 border border-green-200'}`}>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                          Est. Cost: ${user.estimated_cost.total.toFixed(2)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.estimated_cost.images > 0 && <span>Images: ${user.estimated_cost.images.toFixed(2)}</span>}
                        {user.estimated_cost.voice > 0 && <span>Voice: ${user.estimated_cost.voice.toFixed(2)}</span>}
                        {user.estimated_cost.webSearches > 0 && <span>Search: ${user.estimated_cost.webSearches.toFixed(2)}</span>}
                        {user.estimated_cost.chat > 0 && <span>Chat: ${user.estimated_cost.chat.toFixed(2)}</span>}
                      </div>
                    </div>
                  )}

                  {/* User Info - Row 1: Device & Location */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Globe className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.locale}
                      </span>
                    </div>
                    {user.timezone && (
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.timezone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Smartphone className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.device_model} • iOS {user.os_version} • v{user.app_version}
                        {user.previous_version && ` (prev: v${user.previous_version})`}
                      </span>
                    </div>
                  </div>

                  {/* User Info - Row 2: Dates */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        First open: {formatDate(user.first_open_date || user.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last active: {formatDate(user.last_active || user.last_open_date)}
                      </span>
                    </div>
                    {user.days_since_first_open > 0 && (
                      <div className="flex items-center gap-2">
                        <Hash className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.days_since_first_open} days since install
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.total_app_opens} app opens
                      </span>
                    </div>
                  </div>

                  {/* User Info - Row 3: Warnings/Alerts */}
                  {(user.voice_failure_count > 0 || user.nsfw_attempt_count > 0 || user.error_count > 0 || user.image_failure_count > 0) && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {user.error_count > 0 && (
                        <div className="flex items-center gap-2">
                          <CircleAlert className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">
                            {user.error_count} errors
                            {user.last_error_category && ` (${user.last_error_category})`}
                            {user.last_error_code && ` - ${user.last_error_code}`}
                          </span>
                        </div>
                      )}
                      {user.voice_failure_count > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-500">
                            {user.voice_failure_count} voice failures
                            {user.last_voice_failure_type && ` (${user.last_voice_failure_type})`}
                          </span>
                        </div>
                      )}
                      {user.image_failure_count > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-500">
                            {user.image_failure_count} image failures
                            {user.last_image_failure_type && ` (${user.last_image_failure_type})`}
                          </span>
                        </div>
                      )}
                      {user.nsfw_attempt_count > 0 && (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">
                            {user.nsfw_attempt_count} NSFW attempts
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feature Usage Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.is_in_billing_retry && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                        Billing Retry
                      </span>
                    )}
                    {user.is_subscribed && !user.is_in_billing_retry && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                        Subscribed
                      </span>
                    )}
                    {user.was_previously_premium && !user.is_subscribed && !user.is_in_billing_retry && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        Previously Subscribed
                      </span>
                    )}
                    {user.notification_granted ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        Notifications Granted
                      </span>
                    ) : user.notification_prompted ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        Notifications Denied
                      </span>
                    ) : null}
                    {user.has_rated && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-700'}`}>
                        Rated: {user.rating_response || 'Yes'}
                      </span>
                    )}
                    {user.has_used_voice && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        Voice User
                      </span>
                    )}
                    {user.has_generated_images && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        Image Creator
                      </span>
                    )}
                    {user.has_generated_videos && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                        Video Creator
                      </span>
                    )}
                    {user.has_used_web_search && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                        Web Search User
                      </span>
                    )}
                    {user.has_used_lessons && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        Lessons ({user.lessons_completed}/{user.lessons_started})
                      </span>
                    )}
                    {user.assistant_name && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        Assistant: {user.assistant_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <nav className="flex gap-1 px-6 overflow-x-auto">
                    {[
                      { id: 'overview', label: 'Overview', icon: Activity },
                      { id: 'conversations', label: `Conversations (${stats?.conversation_count || 0})`, icon: MessageSquare },
                      { id: 'images', label: `Images (${images.length})`, icon: Image },
                      { id: 'voice', label: `Voice (${user?.total_voice_sessions || voiceSessions.length})`, icon: Mic },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-purple-500 text-purple-500'
                            : `border-transparent ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Profile Section */}
                      {(user.interests.length > 0 || user.goals.length > 0 || user.about_me || user.occupation) && (
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <User className="w-4 h-4" />
                            Profile
                          </h3>
                          <div className="space-y-3">
                            {user.about_me && (
                              <div>
                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>About</p>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.about_me}</p>
                              </div>
                            )}
                            {user.occupation && (
                              <div>
                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Occupation</p>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.occupation}</p>
                              </div>
                            )}
                            {user.interests.length > 0 && (
                              <div>
                                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Interests</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {user.interests.map((interest) => (
                                    <span key={interest} className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {user.goals.length > 0 && (
                              <div>
                                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Goals</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {user.goals.map((goal) => (
                                    <span key={goal} className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                      {goal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {user.communication_style && (
                              <div>
                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Style</p>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.communication_style}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Profile Completeness */}
                      {(() => {
                        const fields = [
                          { label: 'Name', set: !!user.user_name },
                          { label: 'Assistant Name', set: !!user.assistant_name },
                          { label: 'Interests', set: user.interests.length > 0 },
                          { label: 'Occupation', set: !!user.occupation },
                          { label: 'Goals', set: user.goals.length > 0 },
                          { label: 'Style', set: !!user.communication_style },
                          { label: 'About Me', set: !!user.about_me },
                          { label: 'Timezone', set: !!user.timezone },
                        ]
                        const setCount = fields.filter(f => f.set).length
                        const progressColor = setCount >= 6 ? 'green' : setCount >= 3 ? 'yellow' : 'red'
                        return (
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <Target className="w-4 h-4 text-blue-500" />
                              Profile Completeness
                              <span className={`text-xs font-bold ${
                                progressColor === 'green' ? 'text-green-500' : progressColor === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                              }`}>
                                {setCount}/8
                              </span>
                            </h3>
                            <div className={`h-1.5 rounded-full mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div
                                className={`h-full rounded-full transition-all ${
                                  progressColor === 'green' ? 'bg-green-500' : progressColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(setCount / 8) * 100}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {fields.map((field) => (
                                <div key={field.label} className="flex items-center gap-1.5">
                                  {field.set ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                                  )}
                                  <span className={`text-xs ${field.set ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-600' : 'text-gray-400')}`}>
                                    {field.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })()}

                      {/* AI Memories */}
                      {user.ai_memory_count > 0 && (
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Brain className="w-4 h-4 text-purple-500" />
                            AI Memories
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                              {user.ai_memory_count}
                            </span>
                            {user.ai_memory_at_free_limit && (
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                                At Free Limit (10)
                              </span>
                            )}
                          </h3>
                          {user.ai_memories_sample.length > 0 ? (
                            <div className="space-y-2">
                              {user.ai_memories_sample.map((memory, idx) => (
                                <div key={idx} className={`p-2.5 rounded-lg text-sm ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                  {memory}
                                </div>
                              ))}
                              {user.ai_memory_count > user.ai_memories_sample.length && (
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  ... and {user.ai_memory_count - user.ai_memories_sample.length} more memories
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {user.ai_memory_count} memories stored (samples not available)
                            </p>
                          )}
                        </div>
                      )}

                      {/* Subscription & Notifications */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${user.is_in_billing_retry ? (isDark ? 'bg-orange-900/20 border border-orange-900/30' : 'bg-orange-50 border border-orange-200') : (isDark ? 'bg-gray-800' : 'bg-gray-50')}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.is_in_billing_retry ? <CreditCard className="w-4 h-4 text-orange-500" /> : <Crown className="w-4 h-4 text-yellow-500" />}
                            Subscription
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
                              <span className={`text-sm font-medium ${
                                user.is_in_billing_retry ? 'text-orange-500' :
                                user.is_subscribed ? 'text-yellow-500' :
                                user.was_previously_premium ? 'text-red-500' :
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {user.is_in_billing_retry ? 'Billing Retry' :
                                 user.is_subscribed ? 'Subscribed' :
                                 user.was_previously_premium ? 'Churned' : 'Free'}
                              </span>
                            </div>
                            {user.is_in_billing_retry && (
                              <p className={`text-xs ${isDark ? 'text-orange-400/70' : 'text-orange-600'}`}>
                                Apple is retrying payment — subscription may recover within 60 days
                              </p>
                            )}
                            {user.subscription_updated_at && (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Updated</span>
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(user.subscription_updated_at)}</span>
                              </div>
                            )}
                            {user.subscription_status_override && (
                              <div className="flex items-center justify-between">
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Manual override</span>
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {user.subscription_status_override_at ? formatDate(user.subscription_status_override_at) : ''}
                                </span>
                              </div>
                            )}
                            {/* Manual Override Buttons */}
                            <div className="pt-2 border-t border-dashed ${isDark ? 'border-gray-700' : 'border-gray-200'}">
                              <p className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Set status from ASC:</p>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { status: 'billing_retry', label: 'Billing Retry', color: 'orange' },
                                  { status: 'churned', label: 'Churned', color: 'red' },
                                  { status: 'subscribed', label: 'Subscribed', color: 'yellow' },
                                  { status: 'free', label: 'Free', color: 'gray' },
                                ].map(({ status: s, label, color }) => (
                                  <button
                                    key={s}
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      if (!confirm(`Set ${user.user_name || user.device_id} to "${label}"?`)) return
                                      try {
                                        const res = await fetch('/api/analytics/users', {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ key: analyticsKey, userId: user.id, status: s }),
                                        })
                                        if (res.ok) {
                                          // Refresh user detail
                                          fetchUserDetail()
                                        }
                                      } catch (err) {
                                        console.error('Failed to update status:', err)
                                      }
                                    }}
                                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                                      (s === 'billing_retry' && user.is_in_billing_retry) ||
                                      (s === 'churned' && user.was_previously_premium && !user.is_subscribed && !user.is_in_billing_retry) ||
                                      (s === 'subscribed' && user.is_subscribed && !user.is_in_billing_retry) ||
                                      (s === 'free' && !user.is_subscribed && !user.was_previously_premium && !user.is_in_billing_retry)
                                        ? `bg-${color}-500/30 text-${color}-400 ring-1 ring-${color}-500/50`
                                        : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.notification_granted ? <BellRing className="w-4 h-4 text-green-500" /> : <BellOff className="w-4 h-4 text-red-500" />}
                            Notifications
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Permission</span>
                              <span className={`text-sm font-medium ${user.notification_granted ? 'text-green-500' : 'text-red-500'}`}>
                                {user.notification_granted ? 'Granted' : user.notification_prompted ? 'Denied' : 'Not Asked'}
                              </span>
                            </div>
                            {user.notification_frequency && (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Frequency</span>
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.notification_frequency}</span>
                              </div>
                            )}
                            {user.preferred_notification_time && (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Preferred Time</span>
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.preferred_notification_time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Send Push Notification */}
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Send className="w-4 h-4 text-purple-500" />
                          Send Push Notification
                        </h3>

                        {!user.has_push_token ? (
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            No FCM token — user hasn&apos;t enabled push notifications
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {/* Mode Tabs */}
                            <div className="flex gap-1">
                              {[
                                { mode: 'ai' as const, label: 'AI', icon: Wand2, desc: 'AI-generated from conversations' },
                                { mode: 'template' as const, label: 'Template', icon: FileText, desc: 'Use a template' },
                                { mode: 'custom' as const, label: 'Custom', icon: PenLine, desc: 'Write your own' },
                              ].map(({ mode, label, icon: Icon }) => (
                                <button
                                  key={mode}
                                  onClick={() => { setNotifMode(mode); setNotifResult(null); setNotifPreview(null) }}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    notifMode === mode
                                      ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40'
                                      : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                >
                                  <Icon className="w-3 h-3" />
                                  {label}
                                </button>
                              ))}
                            </div>

                            {/* AI Mode */}
                            {notifMode === 'ai' && !notifPreview && (
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                AI reads this user&apos;s conversations, memories, and interests to craft a personalized message. You&apos;ll preview before sending.
                              </p>
                            )}

                            {/* AI Preview Card */}
                            {notifMode === 'ai' && notifPreview && (
                              <div className={`rounded-xl p-3 space-y-2 border ${isDark ? 'bg-gray-700/50 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Eye className="w-3 h-3 text-purple-400" />
                                  <span className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Preview</span>
                                </div>
                                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{notifPreview.title}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{notifPreview.body}</p>
                                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {notifPreview.title.length} chars title · {notifPreview.body.length} chars body · opens {notifPreview.targetView}
                                </p>
                                <div className="flex gap-2 pt-1">
                                  <button
                                    onClick={() => sendNotification(notifPreview)}
                                    disabled={notifSending}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-colors"
                                  >
                                    {notifSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                    {notifSending ? 'Sending...' : 'Send This'}
                                  </button>
                                  <button
                                    onClick={previewAINotification}
                                    disabled={notifSending}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} disabled:opacity-40`}
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Regenerate
                                  </button>
                                  <button
                                    onClick={() => setNotifPreview(null)}
                                    className={`px-2 py-1.5 rounded-lg text-xs transition-colors ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Template Mode */}
                            {notifMode === 'template' && (
                              <select
                                value={notifTemplateId}
                                onChange={(e) => setNotifTemplateId(e.target.value)}
                                className={`w-full text-xs rounded-lg px-3 py-2 ${
                                  isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                                } border`}
                              >
                                {notifTemplates.map(t => (
                                  <option key={t.id} value={t.id}>{t.label} — {t.title}</option>
                                ))}
                              </select>
                            )}

                            {/* Custom Mode */}
                            {notifMode === 'custom' && (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Title (max 25 chars)"
                                  maxLength={25}
                                  value={notifTitle}
                                  onChange={(e) => setNotifTitle(e.target.value)}
                                  className={`w-full text-xs rounded-lg px-3 py-2 ${
                                    isDark ? 'bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500' : 'bg-white text-gray-700 border-gray-300 placeholder-gray-400'
                                  } border`}
                                />
                                <input
                                  type="text"
                                  placeholder="Body (max 65 chars)"
                                  maxLength={65}
                                  value={notifBody}
                                  onChange={(e) => setNotifBody(e.target.value)}
                                  className={`w-full text-xs rounded-lg px-3 py-2 ${
                                    isDark ? 'bg-gray-700 text-gray-300 border-gray-600 placeholder-gray-500' : 'bg-white text-gray-700 border-gray-300 placeholder-gray-400'
                                  } border`}
                                />
                                <select
                                  value={notifTargetView}
                                  onChange={(e) => setNotifTargetView(e.target.value)}
                                  className={`w-full text-xs rounded-lg px-3 py-2 ${
                                    isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'
                                  } border`}
                                >
                                  <option value="chat">Open → Chat</option>
                                  <option value="images">Open → Images</option>
                                  <option value="voice">Open → Voice</option>
                                  <option value="learn">Open → Learn</option>
                                  <option value="settings">Open → Settings</option>
                                </select>
                              </div>
                            )}

                            {/* Send / Preview Button — hidden when AI preview is showing (buttons are in the preview card) */}
                            {!(notifMode === 'ai' && notifPreview) && (
                              <button
                                onClick={notifMode === 'ai' ? previewAINotification : () => sendNotification()}
                                disabled={notifSending || (notifMode === 'custom' && (!notifTitle || !notifBody))}
                                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                  notifSending
                                    ? 'bg-purple-500/20 text-purple-400 cursor-wait'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {notifSending ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    {notifMode === 'ai' ? 'Generating Preview...' : 'Sending...'}
                                  </>
                                ) : (
                                  <>
                                    {notifMode === 'ai' ? <Eye className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                                    {notifMode === 'ai' ? 'Generate Preview' : notifMode === 'template' ? 'Send Template' : 'Send Notification'}
                                  </>
                                )}
                              </button>
                            )}

                            {/* Result */}
                            {notifResult && (
                              <div className={`text-xs px-3 py-2 rounded-lg ${
                                notifResult.success
                                  ? isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
                                  : isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'
                              }`}>
                                {notifResult.message}
                              </div>
                            )}

                            {/* History Toggle */}
                            <button
                              onClick={fetchNotifHistory}
                              className={`text-xs ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                            >
                              {notifHistoryLoading ? 'Loading...' : `View sent history →`}
                            </button>

                            {notifHistory.length > 0 && (
                              <div className="space-y-1.5">
                                {notifHistory.map((h: any, i: number) => (
                                  <div key={h.id || i} className={`text-xs rounded-lg px-2.5 py-1.5 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                    <div className="flex items-center gap-2">
                                      <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{h.title}</div>
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                        h.source === 'smart_reengagement' || h.sent_from === 'cloud_functions'
                                          ? 'bg-blue-500/20 text-blue-400'
                                          : h.source === 'ai_generated'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                      }`}>
                                        {h.source === 'smart_reengagement' || h.sent_from === 'cloud_functions' ? 'Auto' : h.source === 'ai_generated' ? 'AI' : h.source?.startsWith('template:') ? 'Template' : 'Manual'}
                                      </span>
                                    </div>
                                    <div className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                                      {h.body} · {h.sent_at ? new Date(h.sent_at).toLocaleDateString() : ''}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Onboarding Journey */}
                      {onboardingData?.available && (
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Footprints className="w-4 h-4 text-purple-500" />
                            Onboarding Journey
                            {onboardingData.completed && (
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                Completed
                              </span>
                            )}
                            {onboardingData.skipped && !onboardingData.completed && (
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                                Skipped
                              </span>
                            )}
                            {!onboardingData.completed && !onboardingData.skipped && onboardingData.started && (
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
                                Incomplete
                              </span>
                            )}
                          </h3>
                          <div className="space-y-3">
                            {/* Step Progress Bar */}
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                  key={step}
                                  className={`h-2 flex-1 rounded-full ${
                                    step <= onboardingData.stepsReached
                                      ? 'bg-purple-500'
                                      : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              Reached step {onboardingData.stepsReached} of 5
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Name</p>
                                <p className={`text-sm font-medium ${onboardingData.nameEntered ? 'text-green-500' : 'text-red-500'}`}>
                                  {onboardingData.nameEntered ? 'Entered' : onboardingData.nameSkipped ? 'Skipped' : '—'}
                                </p>
                              </div>
                              <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Chat</p>
                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {onboardingData.chatExchanges} exchanges
                                </p>
                              </div>
                              <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Trial</p>
                                <p className={`text-sm font-medium ${onboardingData.trialTapped ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {onboardingData.trialTapped ? 'Tapped' : 'No'}
                                </p>
                              </div>
                              <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Status</p>
                                <p className={`text-sm font-medium ${
                                  onboardingData.completed ? 'text-green-500' : onboardingData.skipped ? 'text-orange-500' : 'text-yellow-500'
                                }`}>
                                  {onboardingData.completed ? 'Done' : onboardingData.skipped ? 'Skipped' : 'Partial'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {onboardingData && !onboardingData.available && (
                        <div className={`p-3 rounded-lg text-xs ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                          Onboarding data unavailable — device_id may not be registered as a GA4 custom dimension
                        </div>
                      )}

                      {/* Churn & Win-back Events */}
                      {churnData?.available && user.was_previously_premium && !user.is_subscribed && (
                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-200'}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                            <UserX className="w-4 h-4" />
                            Churn & Win-back
                            {churnData.resubscribed && (
                              <span className={`px-1.5 py-0.5 rounded-full text-xs ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                Resubscribed
                              </span>
                            )}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {churnData.winback?.bannerShown || 0}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Banner Shown</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {churnData.winback?.bannerTapped || 0}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Banner Tapped</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {churnData.winback?.bannerDismissed || 0}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Dismissed</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${churnData.resubscribed ? (isDark ? 'bg-green-900/20' : 'bg-green-50') : (isDark ? 'bg-gray-900' : 'bg-white')}`}>
                              <p className={`text-lg font-bold ${churnData.resubscribed ? 'text-green-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                                {churnData.winback?.resubscribed || 0}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Resubscribed</p>
                            </div>
                          </div>
                          {churnData.churnCount > 1 && (
                            <p className={`text-xs mt-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                              Churned {churnData.churnCount} times
                            </p>
                          )}
                        </div>
                      )}

                      {/* Rating & Feedback */}
                      {(user.has_rated || user.feedback_count > 0) && (
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <ThumbsUp className="w-4 h-4" />
                            Rating & Feedback
                          </h3>
                          <div className="flex flex-wrap gap-6">
                            {user.has_rated && (
                              <div>
                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>App Rating</p>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {user.rating_response || 'Rated'} (prompted {user.rating_prompt_count}x)
                                </p>
                              </div>
                            )}
                            {user.feedback_count > 0 && (
                              <div>
                                <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Feedback</p>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {user.feedback_count} feedback{user.feedback_count > 1 ? 's' : ''}
                                  {user.last_feedback_trigger && ` (${user.last_feedback_trigger})`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Activity Streaks & Patterns */}
                      {(user.current_streak > 0 || user.longest_streak > 0 || user.active_dates.length > 0 || user.activity_hours.length > 0) && (
                        <div className="space-y-4">
                          {/* Streak Cards */}
                          {(user.current_streak > 0 || user.longest_streak > 0) && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Flame className="w-4 h-4 text-orange-500" />
                                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
                                </div>
                                <p className={`text-2xl font-bold ${user.current_streak > 0 ? 'text-orange-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {user.current_streak} <span className="text-sm font-normal">day{user.current_streak !== 1 ? 's' : ''}</span>
                                </p>
                              </div>
                              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <TrendingUp className="w-4 h-4 text-purple-500" />
                                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Longest Streak</p>
                                </div>
                                <p className={`text-2xl font-bold text-purple-500`}>
                                  {user.longest_streak} <span className="text-sm font-normal">day{user.longest_streak !== 1 ? 's' : ''}</span>
                                </p>
                              </div>
                              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Active Days</p>
                                </div>
                                <p className={`text-2xl font-bold text-blue-500`}>
                                  {user.active_dates.length} <span className="text-sm font-normal">day{user.active_dates.length !== 1 ? 's' : ''}</span>
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Activity Calendar (last 90 days heatmap) */}
                          {user.active_dates.length > 0 && (
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                              <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <Calendar className="w-4 h-4" />
                                Activity Calendar (Last 90 Days)
                              </h3>
                              <div className="flex flex-wrap gap-[3px]">
                                {(() => {
                                  const activeDateSet = new Set(user.active_dates)
                                  const days = []
                                  for (let i = 89; i >= 0; i--) {
                                    const d = new Date()
                                    d.setDate(d.getDate() - i)
                                    const dateStr = d.toISOString().split('T')[0]
                                    const isActive = activeDateSet.has(dateStr)
                                    days.push(
                                      <div
                                        key={dateStr}
                                        title={`${dateStr}${isActive ? ' - Active' : ''}`}
                                        className={`w-3 h-3 rounded-sm ${
                                          isActive
                                            ? 'bg-purple-500'
                                            : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                        }`}
                                      />
                                    )
                                  }
                                  return days
                                })()}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Less</span>
                                <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                <div className="w-3 h-3 rounded-sm bg-purple-500" />
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>More</span>
                              </div>
                            </div>
                          )}

                          {/* Peak Hours */}
                          {user.activity_hours.length > 0 && (
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                              <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <BarChart3 className="w-4 h-4" />
                                Peak Usage Hours
                              </h3>
                              <div className="flex items-end gap-[3px] h-16">
                                {(() => {
                                  // Count frequency of each hour
                                  const hourCounts: Record<number, number> = {}
                                  user.activity_hours.forEach(h => {
                                    hourCounts[h] = (hourCounts[h] || 0) + 1
                                  })
                                  const maxCount = Math.max(...Object.values(hourCounts), 1)
                                  const bars = []
                                  for (let h = 0; h < 24; h++) {
                                    const count = hourCounts[h] || 0
                                    const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
                                    const label = h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`
                                    bars.push(
                                      <div key={h} className="flex-1 flex flex-col items-center" title={`${label}: ${count} sessions`}>
                                        <div
                                          className={`w-full rounded-t-sm transition-all ${
                                            count > 0
                                              ? heightPct > 66 ? 'bg-purple-500' : heightPct > 33 ? 'bg-purple-400' : 'bg-purple-300'
                                              : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                          }`}
                                          style={{ height: `${Math.max(heightPct, 4)}%` }}
                                        />
                                      </div>
                                    )
                                  }
                                  return bars
                                })()}
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>12am</span>
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>6am</span>
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>12pm</span>
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>6pm</span>
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>12am</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Activity Chart */}
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Activity (Last 30 Days)
                        </h3>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityTimeline}>
                              <defs>
                                <linearGradient id="messages" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                              <XAxis
                                dataKey="date"
                                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                                tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              />
                              <YAxis tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                  border: 'none',
                                  borderRadius: '8px',
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="messages"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#messages)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Summary Stats */}
                      {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {stats.conversation_count}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Total Conversations
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {stats.avg_messages_per_conversation}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Avg Messages/Conv
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {stats.total_images}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Images Generated
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${getEngagementColor(stats.avg_success_score)}`}>
                              {stats.avg_success_score}%
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Avg Success Score
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'conversations' && (
                    <div className="space-y-3">
                      {selectedConversation ? (
                        <div>
                          <Button
                            onClick={() => setSelectedConversation(null)}
                            variant="ghost"
                            size="sm"
                            className="mb-4"
                          >
                            &larr; Back to list
                          </Button>
                          <ConversationViewer
                            userId={userId!}
                            conversationId={selectedConversation}
                            analyticsKey={analyticsKey}
                            isDark={isDark}
                          />
                        </div>
                      ) : conversations.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No conversations found</p>
                        </div>
                      ) : (
                        conversations.map((conv) => (
                          <div
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-colors ${
                              isDark
                                ? 'bg-gray-800 hover:bg-gray-750'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {conv.title && (
                                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {conv.title}
                                  </p>
                                )}
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {conv.preview}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  {conv.is_voice && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                                      <Mic className="w-3 h-3" /> Voice
                                    </span>
                                  )}
                                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {conv.message_count} messages
                                  </span>
                                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {formatDate(conv.created_at)}
                                  </span>
                                  {conv.topics.length > 0 && (
                                    <div className="flex gap-1">
                                      {conv.topics.slice(0, 3).map((topic) => (
                                        <span
                                          key={topic}
                                          className={`px-2 py-0.5 rounded text-xs ${
                                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                                          }`}
                                        >
                                          {topic}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getSuccessColor(conv.success_score)}`}>
                                  {conv.success_score}%
                                </span>
                                <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'images' && (
                    <div>
                      {/* Image Preview Modal */}
                      {selectedImage && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                          <div
                            className="absolute inset-0 bg-black/80"
                            onClick={() => setSelectedImage(null)}
                          />
                          <div className={`relative max-w-4xl w-full rounded-2xl overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                            <button
                              onClick={() => setSelectedImage(null)}
                              className={`absolute top-4 right-4 p-2 rounded-full z-10 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                              <X className="w-5 h-5" />
                            </button>
                            {(selectedImage.download_url || selectedImage.url) && (
                              <img
                                src={selectedImage.download_url || selectedImage.url!}
                                alt={selectedImage.prompt}
                                className="w-full max-h-[60vh] object-contain bg-black"
                              />
                            )}
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  Prompt
                                </h4>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  getImageSource(selectedImage) === 'chat'
                                    ? isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                                    : isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {getImageSource(selectedImage) === 'chat' ? 'Chat' : 'Generator'}
                                </span>
                              </div>
                              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {selectedImage.prompt}
                              </p>
                              {selectedImage.revised_prompt && selectedImage.revised_prompt !== selectedImage.prompt && (
                                <>
                                  <h4 className={`font-medium mb-2 mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Revised Prompt (AI)
                                  </h4>
                                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {selectedImage.revised_prompt}
                                  </p>
                                </>
                              )}
                              <div className="flex items-center gap-4 mt-4">
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {formatDate(selectedImage.created_at)}
                                </span>
                                {selectedImage.model && (
                                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Model: {selectedImage.model}
                                  </span>
                                )}
                                {selectedImage.size && (
                                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Size: {selectedImage.size}
                                  </span>
                                )}
                                {(selectedImage.download_url || selectedImage.url) && (
                                  <a
                                    href={selectedImage.download_url || selectedImage.url!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-400"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Open Full Size
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Filter Tabs */}
                      {images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {[
                            { id: 'all', label: 'All', count: imageCounts.all },
                            { id: 'chat', label: 'Chat', count: imageCounts.chat },
                            { id: 'generator', label: 'Generator', count: imageCounts.generator },
                          ].map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => setImageFilter(filter.id as any)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                imageFilter === filter.id
                                  ? 'bg-purple-500 text-white'
                                  : isDark
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {filter.label}
                              <span className={`ml-1.5 ${imageFilter === filter.id ? 'text-purple-200' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {filter.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {images.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          {user && user.total_images_generated > 0 ? (
                            <>
                              <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {user.total_images_generated} Images Generated
                              </p>
                              <p className="text-sm max-w-md mx-auto">
                                This user has generated {user.total_images_generated} images using DALL-E.
                                Images are created on-demand and displayed in the app, but not stored in Firebase
                                to save storage costs.
                              </p>
                              <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} max-w-md mx-auto`}>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  💡 To persist images, the iOS app would need to save image URLs or upload to Firebase Storage
                                </p>
                              </div>
                            </>
                          ) : (
                            <p>No images generated</p>
                          )}
                        </div>
                      ) : filteredImages.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No {imageFilter === 'chat' ? 'chat' : 'generator'} images found</p>
                          <p className="text-sm mt-2">
                            Try selecting a different filter
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {filteredImages.map((img) => (
                            <div
                              key={img.id}
                              onClick={() => setSelectedImage(img)}
                              className={`rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                              }`}
                            >
                              {/* Image Preview */}
                              {(img.download_url || img.url || img.thumbnail_url) ? (
                                <div className="aspect-square relative">
                                  <img
                                    src={img.thumbnail_url || img.download_url || img.url!}
                                    alt={img.prompt}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none'
                                      const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                                      if (placeholder) placeholder.style.display = 'flex'
                                    }}
                                  />
                                  <div className="hidden w-full h-full items-center justify-center bg-gray-700">
                                    <Image className="w-12 h-12 text-gray-500" />
                                  </div>
                                  {/* Source Badge */}
                                  <div className="absolute top-2 right-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm ${
                                      getImageSource(img) === 'chat'
                                        ? 'bg-blue-500/80 text-white'
                                        : 'bg-purple-500/80 text-white'
                                    }`}>
                                      {getImageSource(img) === 'chat' ? 'Chat' : 'Gen'}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className={`aspect-square flex items-center justify-center relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                  <Image className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                  {/* Source Badge */}
                                  <div className="absolute top-2 right-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                      getImageSource(img) === 'chat'
                                        ? 'bg-blue-500/80 text-white'
                                        : 'bg-purple-500/80 text-white'
                                    }`}>
                                      {getImageSource(img) === 'chat' ? 'Chat' : 'Gen'}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {/* Prompt & Date */}
                              <div className="p-3">
                                <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {img.prompt}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {formatDate(img.created_at)}
                                  </p>
                                  {img.model && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                                      {img.model}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'voice' && (
                    <div className="space-y-6">
                      {/* Voice Stats Summary */}
                      {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {user?.total_voice_sessions || voiceSessions.length}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Voice Sessions
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatDuration(stats.total_voice_session_time)}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Total Time
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatDuration(stats.avg_voice_session_duration)}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Avg Duration
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className={`text-2xl font-bold ${voiceFailures.length > 0 ? 'text-orange-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                              {voiceFailures.length}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Failures
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Voice Conversations (from conversations with is_voice flag) */}
                      {voiceSessions.length === 0 && conversations.filter(c => c.is_voice).length > 0 && (
                        <div>
                          <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Voice Conversations
                          </h3>
                          <div className="space-y-2">
                            {conversations.filter(c => c.is_voice).map((conv) => (
                              <div key={conv.id} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                    <Mic className="w-4 h-4 text-purple-500" />
                                  </div>
                                  <div className="flex-1">
                                    {conv.title && (
                                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{conv.title}</p>
                                    )}
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{conv.preview}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{conv.message_count} messages</span>
                                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(conv.created_at)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Voice Sessions (from voice_sessions subcollection) */}
                      <div>
                        <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {voiceSessions.length > 0 ? 'Recent Voice Sessions' : conversations.filter(c => c.is_voice).length > 0 ? 'Dedicated Voice Sessions' : 'Voice Sessions'}
                        </h3>
                        {voiceSessions.length === 0 && conversations.filter(c => c.is_voice).length === 0 ? (
                          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No voice sessions recorded</p>
                            {(user?.total_voice_sessions || 0) > 0 && (
                              <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {user.total_voice_sessions} sessions tracked in analytics
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {voiceSessions.map((session) => (
                              <div
                                key={session.id}
                                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                      session.was_successful
                                        ? isDark ? 'bg-green-900/30' : 'bg-green-100'
                                        : isDark ? 'bg-red-900/30' : 'bg-red-100'
                                    }`}>
                                      <Mic className={`w-4 h-4 ${
                                        session.was_successful ? 'text-green-500' : 'text-red-500'
                                      }`} />
                                    </div>
                                    <div>
                                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {formatDuration(session.duration_seconds)} session
                                      </p>
                                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {formatDate(session.started_at)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {session.message_count > 0 && (
                                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {session.message_count} messages
                                      </p>
                                    )}
                                    {session.end_reason && (
                                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {session.end_reason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Voice Failures */}
                      {voiceFailures.length > 0 && (
                        <div>
                          <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            Voice Failures
                          </h3>
                          <div className="space-y-2">
                            {voiceFailures.map((failure) => (
                              <div
                                key={failure.id}
                                className={`p-4 rounded-xl border ${
                                  isDark ? 'bg-orange-900/10 border-orange-900/30' : 'bg-orange-50 border-orange-200'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className={`font-medium ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                                      {failure.error_type}
                                    </p>
                                    {failure.error_message && (
                                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {failure.error_message}
                                      </p>
                                    )}
                                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatDate(failure.timestamp)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    {failure.session_duration > 0 && (
                                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        After {formatDuration(failure.session_duration)}
                                      </p>
                                    )}
                                    {failure.reconnect_attempts > 0 && (
                                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {failure.reconnect_attempts} reconnect attempts
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
