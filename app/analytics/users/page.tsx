'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Image,
  Mic,
  Activity,
  TrendingUp,
  Globe,
  Smartphone,
  Sun,
  Moon,
  Lock,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import UserList from '@/components/analytics/UserList'
import UserDetailModal from '@/components/analytics/UserDetailModal'
import VoiceDiagnostics from '@/components/analytics/VoiceDiagnostics'

export default function UsersAnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'voice'>('users')
  const [overview, setOverview] = useState<{
    totalUsers: number
    activeUsers24h: number
    activeUsers7d: number
    avgMessagesPerUser: number
    topLocales: { locale: string; count: number }[]
    topDevices: { device: string; count: number }[]
  } | null>(null)
  const [loadingOverview, setLoadingOverview] = useState(false)

  // Check for stored auth
  useEffect(() => {
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      setPassword(storedKey)
      setIsAuthenticated(true)
    }
    const storedDarkMode = localStorage.getItem('analytics_dark_mode')
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOverview()
    }
  }, [isAuthenticated])

  const authenticate = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      sessionStorage.setItem('analytics_key', password)
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Please enter a password')
    }
  }

  const fetchOverview = async () => {
    setLoadingOverview(true)
    try {
      const key = password || sessionStorage.getItem('analytics_key')
      const response = await fetch(`/api/analytics/users?key=${encodeURIComponent(key || '')}&limit=1`)
      const data = await response.json()

      if (response.ok) {
        // We'll calculate overview from the filters returned
        setOverview({
          totalUsers: data.total,
          activeUsers24h: 0, // Would need separate query
          activeUsers7d: 0, // Would need separate query
          avgMessagesPerUser: 0, // Would need calculation
          topLocales: data.filters?.locales?.slice(0, 5).map((l: string) => ({ locale: l, count: 0 })) || [],
          topDevices: data.filters?.devices?.slice(0, 5).map((d: string) => ({ device: d, count: 0 })) || [],
        })
      }
    } catch (err) {
      console.error('Failed to fetch overview:', err)
    } finally {
      setLoadingOverview(false)
    }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('analytics_dark_mode', JSON.stringify(newMode))
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                User Analytics
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter password to access
              </p>
            </div>
          </div>

          <form onSubmit={authenticate} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Analytics Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                    darkMode
                      ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500'
                      : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400'
                  } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              {authError && (
                <p className="text-red-500 text-sm mt-2">{authError}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Access Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <Link
              href="/analytics/ai-evaluation"
              className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
            >
              &larr; Back to AI Evaluation
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/analytics/ai-evaluation"
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <Users className="w-7 h-7 text-purple-500" />
                  User Analytics
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Explore user behavior and conversations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} flex items-center justify-center mb-3`}>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{overview.totalUsers.toLocaleString()}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</p>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} flex items-center justify-center mb-3`}>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{overview.topLocales.length}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unique Locales</p>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center mb-3`}>
                <Smartphone className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{overview.topDevices.length}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Device Types</p>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'} flex items-center justify-center mb-3`}>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold">-</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Engagement</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'voice'
                ? 'bg-purple-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice Diagnostics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <UserList
              analyticsKey={password || sessionStorage.getItem('analytics_key') || ''}
              isDark={darkMode}
              onUserSelect={setSelectedUserId}
            />
          </div>
        )}

        {activeTab === 'voice' && (
          <VoiceDiagnostics
            analyticsKey={password || sessionStorage.getItem('analytics_key') || ''}
            isDark={darkMode}
          />
        )}
      </main>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          analyticsKey={password || sessionStorage.getItem('analytics_key') || ''}
          isDark={darkMode}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  )
}
