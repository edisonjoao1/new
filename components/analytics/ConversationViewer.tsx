'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare,
  User,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string | null
}

interface ConversationViewerProps {
  userId: string
  conversationId: string
  analyticsKey: string
  isDark: boolean
}

export default function ConversationViewer({
  userId,
  conversationId,
  analyticsKey,
  isDark,
}: ConversationViewerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationData, setConversationData] = useState<{
    id: string
    created_at: string | null
    behavioral_signals: any
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchConversation()
  }, [userId, conversationId])

  const fetchConversation = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analytics/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: analyticsKey,
          userId,
          conversationId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch conversation')
      }

      setMessages(data.messages)
      setConversationData({
        id: data.id,
        created_at: data.created_at,
        behavioral_signals: data.behavioral_signals,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversation')
    } finally {
      setLoading(false)
    }
  }

  const copyConversation = async () => {
    const text = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border`}>
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <Button onClick={fetchConversation} className="mt-4" size="sm">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Header */}
      <div className={`p-4 flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Conversation
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Clock className="w-3 h-3 inline mr-1" />
              {formatDate(conversationData?.created_at || null)} • {messages.length} messages
            </p>
          </div>
        </div>
        <Button
          onClick={copyConversation}
          variant="outline"
          size="sm"
          className={isDark ? 'border-gray-700' : ''}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Messages */}
      <div className={`p-4 space-y-4 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {messages.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No messages in this conversation
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                    : isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}
              >
                {message.role === 'user' ? (
                  <User className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                ) : (
                  <Bot className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                )}
              </div>
              <div
                className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                  } ${message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {/* Only show timestamp if it's valid and not null */}
                {message.timestamp && message.timestamp !== 'null' && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Behavioral Signals */}
      {conversationData?.behavioral_signals && (
        <div className={`p-4 border-t ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Behavioral Signals
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(conversationData.behavioral_signals).map(([key, value]) => (
              <span
                key={key}
                className={`px-2 py-1 rounded text-xs ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
