'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save,
  RotateCcw,
  History,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Wand2,
} from 'lucide-react'

interface PromptVersion {
  id: string
  version: number
  prompt: string
  createdAt: string
  updatedAt: string
  notes?: string
  isActive: boolean
}

interface SystemPromptEditorProps {
  analyticsKey: string
  isDark: boolean
}

export default function SystemPromptEditor({ analyticsKey, isDark }: SystemPromptEditorProps) {
  const [currentPrompt, setCurrentPrompt] = useState<PromptVersion | null>(null)
  const [editedPrompt, setEditedPrompt] = useState('')
  const [notes, setNotes] = useState('')
  const [history, setHistory] = useState<PromptVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchPrompt()
  }, [])

  useEffect(() => {
    if (currentPrompt) {
      setHasChanges(editedPrompt !== currentPrompt.prompt)
    }
  }, [editedPrompt, currentPrompt])

  const fetchPrompt = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/analytics/system-prompt?key=${encodeURIComponent(analyticsKey)}&history=true&limit=20`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompt')
      }

      setCurrentPrompt(data.current)
      setEditedPrompt(data.current?.prompt || '')
      setHistory(data.history || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompt')
    } finally {
      setLoading(false)
    }
  }

  const savePrompt = async () => {
    if (!editedPrompt.trim()) {
      setError('Prompt cannot be empty')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/analytics/system-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: analyticsKey,
          prompt: editedPrompt,
          notes: notes || `Updated on ${new Date().toLocaleDateString()}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save prompt')
      }

      setSuccess(data.message)
      setNotes('')
      await fetchPrompt() // Refresh to get updated data

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  const revertToVersion = async (versionId: string) => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/analytics/system-prompt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: analyticsKey,
          versionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revert')
      }

      setSuccess(data.message)
      await fetchPrompt()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(editedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
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
      <div className={`rounded-xl border p-8 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading system prompt...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <Wand2 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                System Prompt Editor
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentPrompt ? `Version ${currentPrompt.version} • Updated ${formatDate(currentPrompt.updatedAt)}` : 'Configure your AI\'s behavior'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showHistory
                  ? 'bg-purple-500 text-white'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border-b border-red-500/20 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-500/10 border-b border-green-500/20 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-green-500">
              <Check className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Main Editor */}
        <div className={`flex-1 p-4 ${showHistory ? 'border-r' : ''} ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {editedPrompt.length} characters
            </div>
          </div>

          {/* Editor / Preview */}
          {showPreview ? (
            <div className={`rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto whitespace-pre-wrap ${
              isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
            }`}>
              {editedPrompt || 'No prompt content'}
            </div>
          ) : (
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              placeholder="Enter your system prompt here..."
              className={`w-full min-h-[400px] max-h-[600px] p-4 rounded-lg border font-mono text-sm resize-y ${
                isDark
                  ? 'bg-gray-900 border-gray-600 text-gray-200 placeholder-gray-500 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-purple-500'
              } focus:outline-none focus:ring-1 focus:ring-purple-500`}
            />
          )}

          {/* Notes Input */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Version notes (optional) - e.g., 'Added image editing instructions'"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? 'bg-gray-900 border-gray-600 text-gray-200 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                } focus:outline-none focus:ring-1 focus:ring-purple-500`}
              />
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => {
                setEditedPrompt(currentPrompt?.prompt || '')
                setNotes('')
              }}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                hasChanges
                  ? isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  : 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Discard Changes
            </button>

            <button
              onClick={savePrompt}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                hasChanges && !saving
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25'
                  : 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Deploy
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className={`mt-4 p-3 rounded-lg text-sm ${isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Live Updates:</strong> Changes take effect immediately for all users.
                Your iOS app fetches the latest prompt on launch from <code className="px-1 py-0.5 rounded bg-black/10">/api/app-config</code>
              </div>
            </div>
          </div>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`overflow-hidden ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}
            >
              <div className="w-80 p-4">
                <h4 className={`font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className="w-4 h-4" />
                  Version History
                </h4>

                {history.length === 0 ? (
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No previous versions
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {history.map((version, index) => (
                      <div
                        key={version.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          version.isActive
                            ? isDark
                              ? 'bg-purple-900/30 border-purple-700'
                              : 'bg-purple-50 border-purple-200'
                            : isDark
                              ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            v{version.version}
                            {version.isActive && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-purple-500 text-white">
                                Active
                              </span>
                            )}
                          </span>
                        </div>
                        <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(version.createdAt)}
                        </p>
                        {version.notes && (
                          <p className={`text-xs mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {version.notes}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditedPrompt(version.prompt)}
                            className={`text-xs px-2 py-1 rounded ${
                              isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            View
                          </button>
                          {!version.isActive && (
                            <button
                              onClick={() => revertToVersion(version.id)}
                              disabled={saving}
                              className={`text-xs px-2 py-1 rounded ${
                                isDark ? 'bg-purple-900/50 hover:bg-purple-800 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                              }`}
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
