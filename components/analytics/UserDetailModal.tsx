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
  Hash,
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

  // Device Info
  locale: string
  device_model: string
  os_version: string
  app_version: string

  // Core Usage Stats
  total_app_opens: number
  total_messages_sent: number
  total_images_generated: number
  total_voice_sessions: number
  total_session_seconds: number

  // Dates (COMPREHENSIVE)
  first_open_date: string | null
  last_open_date: string | null
  created_at: string | null
  last_active: string | null
  days_since_first_open: number

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
  current_lesson: string | null

  // Subscription/Premium
  is_premium: boolean
  subscription_type: string | null

  // Referral/Source
  referral_source: string | null
  install_source: string | null

  // Engagement
  engagement_score: number

  // Push Notifications
  push_enabled: boolean | null
  push_token: string | null

  // Feature Usage Flags
  has_used_voice: boolean
  has_generated_images: boolean
  has_used_lessons: boolean
}

interface Conversation {
  id: string
  created_at: string | null
  message_count: number
  preview: string
  topics: string[]
  success_score: number
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
                          <Users className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              User Details
                            </h2>
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
                          <p className={`font-mono text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.device_id}
                          </p>
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
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                      { label: 'Messages', value: user.total_messages_sent, icon: MessageSquare, color: 'purple' },
                      { label: 'Images', value: user.total_images_generated, icon: Image, color: 'blue' },
                      { label: 'Voice Sessions', value: user.total_voice_sessions, icon: Mic, color: 'red' },
                      { label: 'Session Time', value: formatDuration(user.total_session_seconds), icon: Clock, color: 'green' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                      >
                        <stat.icon className={`w-5 h-5 text-${stat.color}-500 mb-2`} />
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* User Info - Row 1 */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Globe className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.locale}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.device_model} • iOS {user.os_version} • v{user.app_version}
                      </span>
                    </div>
                    {user.is_premium && (
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-500 font-medium">
                          Premium {user.subscription_type && `(${user.subscription_type})`}
                        </span>
                      </div>
                    )}
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
                  {(user.voice_failure_count > 0 || user.nsfw_attempt_count > 0) && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {user.voice_failure_count > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-500">
                            {user.voice_failure_count} voice failures
                            {user.last_voice_failure_type && ` (${user.last_voice_failure_type})`}
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
                    {user.has_used_voice && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        Voice User
                      </span>
                    )}
                    {user.has_generated_images && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        Image Generator
                      </span>
                    )}
                    {user.has_used_lessons && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        Lesson User ({user.lessons_completed}/{user.lessons_started})
                      </span>
                    )}
                    {user.push_enabled && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        Push Enabled
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
                      { id: 'voice', label: `Voice (${voiceSessions.length})`, icon: Mic },
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
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {conv.preview}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
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
                              {voiceSessions.length}
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

                      {/* Voice Sessions */}
                      <div>
                        <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Recent Voice Sessions
                        </h3>
                        {voiceSessions.length === 0 ? (
                          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No voice sessions recorded</p>
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
