'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  Image,
  Mic,
  Volume2,
  BookOpen,
  GraduationCap,
  Zap,
  Save,
  History,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  Download,
  Upload,
  Wand2,
  ChevronRight,
  Moon,
  Sun,
  Clock,
} from 'lucide-react'

// Prompt configurations (consolidated: streaming and imageAnalysis now use 'main')
const PROMPT_CONFIGS = {
  main: { label: 'Main Chat', icon: MessageSquare, color: 'purple', description: 'All text chat: regular, streaming, and image analysis' },
  lessonChat: { label: 'Lesson Chat', icon: BookOpen, color: 'green', description: 'Educational text chat lessons' },
  lessonVoice: { label: 'Lesson Voice', icon: Volume2, color: 'teal', description: 'Voice-based lessons (text API)' },
  voiceChat: { label: 'Voice Chat', icon: Mic, color: 'red', description: 'Real-time voice conversations' },
  voiceLessons: { label: 'Voice Lessons', icon: GraduationCap, color: 'orange', description: 'Real-time voice lesson mode' },
} as const

type PromptType = keyof typeof PROMPT_CONFIGS

interface PromptVersion {
  id: string
  type: PromptType
  version: number
  prompt: string
  createdAt: string
  updatedAt: string
  notes?: string
  isActive: boolean
}

export default function PromptsPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const [selectedType, setSelectedType] = useState<PromptType>('main')
  const [currentPrompt, setCurrentPrompt] = useState<PromptVersion | null>(null)
  const [editedPrompt, setEditedPrompt] = useState('')
  const [notes, setNotes] = useState('')
  const [history, setHistory] = useState<PromptVersion[]>([])
  const [allPromptsSummary, setAllPromptsSummary] = useState<{ type: PromptType; version: number; hasCustom: boolean }[]>([])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)

  // App config (consent cutoff date, etc.)
  const [consentCutoffDate, setConsentCutoffDate] = useState('')
  const [consentDateSaving, setConsentDateSaving] = useState(false)
  const [consentDateLoaded, setConsentDateLoaded] = useState(false)

  // Check for stored auth
  useEffect(() => {
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      setPassword(storedKey)
      setAuthenticated(true)
    }
  }, [])

  // Fetch prompt when type changes or authenticated
  useEffect(() => {
    if (authenticated) {
      fetchPrompt(selectedType)
    }
  }, [selectedType, authenticated])

  // Fetch app config (consent date) when authenticated
  useEffect(() => {
    if (authenticated && !consentDateLoaded) {
      fetchAppConfig()
    }
  }, [authenticated])

  // Track changes
  useEffect(() => {
    if (currentPrompt) {
      setHasChanges(editedPrompt !== currentPrompt.prompt)
    }
  }, [editedPrompt, currentPrompt])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Test the key by fetching prompts
      const response = await fetch(`/api/analytics/system-prompt?key=${encodeURIComponent(password)}&type=main`)
      if (!response.ok) {
        throw new Error('Invalid password')
      }
      sessionStorage.setItem('analytics_key', password)
      setAuthenticated(true)
    } catch (err) {
      setError('Invalid password')
    } finally {
      setLoading(false)
    }
  }

  const fetchPrompt = async (type: PromptType) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/analytics/system-prompt?key=${encodeURIComponent(password)}&type=${type}&history=true&limit=20`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompt')
      }

      setCurrentPrompt(data.current)
      setEditedPrompt(data.current?.prompt || '')
      setHistory(data.history || [])
      setAllPromptsSummary(data.allPrompts || [])
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
          key: password,
          type: selectedType,
          prompt: editedPrompt,
          notes: notes || `Updated on ${new Date().toLocaleDateString()}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save prompt')
      }

      setSuccess(`${PROMPT_CONFIGS[selectedType].label} saved as v${data.prompt.version}`)
      setNotes('')
      await fetchPrompt(selectedType)

      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  const revertToVersion = async (versionId: string, version: number) => {
    if (!confirm(`Revert to version ${version}? This creates a new version based on that content.`)) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/analytics/system-prompt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: password,
          type: selectedType,
          versionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revert')
      }

      setSuccess(data.message)
      await fetchPrompt(selectedType)

      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = async () => {
    if (!confirm(`Reset "${PROMPT_CONFIGS[selectedType].label}" to default? This creates a new version with the default prompt.`)) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/analytics/system-prompt?key=${encodeURIComponent(password)}&type=${selectedType}`,
        { method: 'DELETE' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset')
      }

      setSuccess(data.message)
      await fetchPrompt(selectedType)

      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(editedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportPrompt = () => {
    const blob = new Blob([editedPrompt], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedType}-prompt-v${currentPrompt?.version || 1}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importPrompt = () => {
    if (importText.trim()) {
      setEditedPrompt(importText)
      setShowImport(false)
      setImportText('')
    }
  }

  const fetchAppConfig = async () => {
    try {
      const response = await fetch('/api/app-config')
      const data = await response.json()
      if (data.consentCutoffDate) {
        setConsentCutoffDate(data.consentCutoffDate)
      }
      setConsentDateLoaded(true)
    } catch (err) {
      console.error('Failed to fetch app config:', err)
    }
  }

  const saveConsentDate = async (date: string) => {
    setConsentDateSaving(true)
    try {
      const response = await fetch('/api/app-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: password,
          consentCutoffDate: date,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save')
      setConsentCutoffDate(date)
      setSuccess(`Consent cutoff date updated to ${date}`)
      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save consent date')
    } finally {
      setConsentDateSaving(false)
    }
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

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; bgLight: string }> = {
      purple: { bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-500', bgLight: 'bg-purple-500' },
      yellow: { bg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100', text: 'text-yellow-500', border: 'border-yellow-500', bgLight: 'bg-yellow-500' },
      blue: { bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-500', bgLight: 'bg-blue-500' },
      green: { bg: darkMode ? 'bg-green-900/30' : 'bg-green-100', text: 'text-green-500', border: 'border-green-500', bgLight: 'bg-green-500' },
      teal: { bg: darkMode ? 'bg-teal-900/30' : 'bg-teal-100', text: 'text-teal-500', border: 'border-teal-500', bgLight: 'bg-teal-500' },
      red: { bg: darkMode ? 'bg-red-900/30' : 'bg-red-100', text: 'text-red-500', border: 'border-red-500', bgLight: 'bg-red-500' },
      orange: { bg: darkMode ? 'bg-orange-900/30' : 'bg-orange-100', text: 'text-orange-500', border: 'border-orange-500', bgLight: 'bg-orange-500' },
    }
    return colors[color] || colors.purple
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>System Prompts</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inteligencia Artificial Gratis</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter analytics password"
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } focus:ring-2 focus:ring-purple-500 focus:outline-none`}
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Access Prompts'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const config = PROMPT_CONFIGS[selectedType]
  const colorClasses = getColorClasses(config.color)
  const Icon = config.icon

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>System Prompts</h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage all 7 prompt types</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Prompt Type Selector */}
        <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>SELECT PROMPT TYPE</h2>
          <div className="grid grid-cols-7 gap-3">
            {(Object.keys(PROMPT_CONFIGS) as PromptType[]).map((type) => {
              const typeConfig = PROMPT_CONFIGS[type]
              const TypeIcon = typeConfig.icon
              const isSelected = type === selectedType
              const promptSummary = allPromptsSummary.find(p => p.type === type)
              const typeColorClasses = getColorClasses(typeConfig.color)

              return (
                <button
                  key={type}
                  onClick={() => {
                    if (hasChanges && !confirm('You have unsaved changes. Switch anyway?')) {
                      return
                    }
                    setSelectedType(type)
                    setHasChanges(false)
                  }}
                  className={`relative p-4 rounded-xl text-center transition-all ${
                    isSelected
                      ? `${typeColorClasses.bg} border-2 ${typeColorClasses.border}`
                      : darkMode
                        ? 'bg-gray-900 border border-gray-700 hover:border-gray-600'
                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <TypeIcon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? typeColorClasses.text : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className={`text-sm font-medium ${isSelected ? (darkMode ? 'text-white' : 'text-gray-900') : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {typeConfig.label.split(' ')[0]}
                  </div>
                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {typeConfig.label.split(' ')[1]}
                  </div>
                  {promptSummary && promptSummary.version > 0 && (
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${typeColorClasses.bgLight} text-white`}>
                      {promptSummary.version}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className={`mt-4 flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Icon className={`w-5 h-5 ${colorClasses.text}`} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{config.label}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{config.description}</span>
            {currentPrompt && (
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                Version {currentPrompt.version}
              </span>
            )}
          </div>
        </div>

        {/* App Settings (Consent Date) */}
        <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>APP SETTINGS</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                <AlertTriangle className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Consent Card Cutoff</div>
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Card stops showing after this date</div>
              </div>
            </div>
            <input
              type="date"
              value={consentCutoffDate}
              onChange={(e) => {
                const newDate = e.target.value
                setConsentCutoffDate(newDate)
                if (newDate) saveConsentDate(newDate)
              }}
              className={`px-4 py-2 rounded-lg border text-sm ${
                darkMode
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            />
            {consentDateSaving && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
            )}
            {consentCutoffDate && (
              <span className={`text-xs px-3 py-1 rounded-full ${
                new Date(consentCutoffDate + 'T23:59:59') > new Date()
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {new Date(consentCutoffDate + 'T23:59:59') > new Date() ? 'Active' : 'Expired'}
              </span>
            )}
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Main Editor */}
          <div className={`flex-1 rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent mb-4" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading prompt...</span>
              </div>
            ) : (
              <div className="p-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={exportPrompt}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={() => setShowImport(true)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Import
                    </button>
                    <button
                      onClick={resetToDefault}
                      disabled={saving}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset to Default
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {editedPrompt.length} characters
                    </span>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        showHistory
                          ? 'bg-purple-500 text-white'
                          : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      History
                    </button>
                  </div>
                </div>

                {/* Editor / Preview */}
                {showPreview ? (
                  <div className={`rounded-xl p-6 min-h-[500px] max-h-[600px] overflow-y-auto whitespace-pre-wrap ${
                    darkMode ? 'bg-gray-900 text-gray-300 border border-gray-700' : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                    {editedPrompt || 'No prompt content'}
                  </div>
                ) : (
                  <textarea
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    placeholder="Enter your system prompt here..."
                    className={`w-full min-h-[500px] max-h-[600px] p-6 rounded-xl border font-mono text-sm resize-y ${
                      darkMode
                        ? 'bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500'
                        : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  />
                )}

                {/* Notes Input */}
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Version notes (optional) - e.g., 'Added image editing instructions'"
                      className={`w-full px-4 py-3 rounded-xl border text-sm ${
                        darkMode
                          ? 'bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    />
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => {
                      setEditedPrompt(currentPrompt?.prompt || '')
                      setNotes('')
                    }}
                    disabled={!hasChanges}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-colors ${
                      hasChanges
                        ? darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        : 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Discard Changes
                  </button>

                  <button
                    onClick={savePrompt}
                    disabled={!hasChanges || saving}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
                <div className={`mt-6 p-4 rounded-xl text-sm ${darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Live Updates:</strong> Changes take effect immediately for all users.
                      Your iOS app fetches prompts on launch from <code className="px-2 py-0.5 rounded bg-black/10 font-mono text-xs">/api/app-config</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className={`overflow-hidden rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="w-[380px] p-6">
                  <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Clock className="w-5 h-5 text-purple-500" />
                    {config.label} History
                  </h4>

                  {history.length === 0 ? (
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      No previous versions for this prompt type
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {history.map((version, index) => {
                        const isActive = version.isActive

                        return (
                          <div
                            key={version.id}
                            className={`p-4 rounded-xl border transition-colors ${
                              isActive
                                ? `${colorClasses.bg} border-2 ${colorClasses.border}`
                                : darkMode
                                  ? 'bg-gray-900 border-gray-700 hover:border-gray-600'
                                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Version {version.version}
                              </span>
                              {isActive && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${colorClasses.bg} ${colorClasses.text} font-medium`}>
                                  Active
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(version.createdAt)}
                            </p>
                            {version.notes && (
                              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {version.notes}
                              </p>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditedPrompt(version.prompt)}
                                className={`flex-1 text-xs px-3 py-1.5 rounded-lg ${
                                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }`}
                              >
                                View
                              </button>
                              {!isActive && (
                                <button
                                  onClick={() => revertToVersion(version.id, version.version)}
                                  disabled={saving}
                                  className={`flex-1 text-xs px-3 py-1.5 rounded-lg ${colorClasses.bg} ${colorClasses.text} hover:opacity-80`}
                                >
                                  Restore
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Upload className="w-5 h-5 text-purple-500" />
                  Import Prompt
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Paste your prompt content below
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your prompt here..."
                  className={`w-full h-64 p-4 rounded-xl border font-mono text-sm ${
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowImport(false)}
                    className={`px-4 py-2 rounded-xl ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={importPrompt}
                    disabled={!importText.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    Import
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
