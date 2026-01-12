"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Search,
  Sparkles,
  FileText,
  TrendingUp,
  Clock,
  Check,
  X,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
} from 'lucide-react'

interface TrendingTopic {
  topic: string
  description: string
  searchVolume: 'high' | 'medium' | 'low'
  competition: 'high' | 'medium' | 'low'
  relevanceScore: number
  suggestedTitle: string
  keywords: string[]
  targetAudience: string
  contentAngle: string
}

interface GeneratedPost {
  title: string
  slug: string
  excerpt: string
  content: string
  keywords: string[]
  category: string
  readingTime: number
}

interface BlogIdea {
  title: string
  description: string
  keywords: string[]
  targetAudience: string
  searchIntent: string
}

export default function BlogAdminPage() {
  // State
  const [activeTab, setActiveTab] = useState<'research' | 'generate' | 'queue'>('research')
  const [isResearching, setIsResearching] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [ideas, setIdeas] = useState<BlogIdea[]>([])
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [researchCategory, setResearchCategory] = useState('all')

  // Research trending topics
  const researchTopics = async () => {
    setIsResearching(true)
    try {
      const res = await fetch(`/api/blog/research?category=${researchCategory}&count=5`)
      const data = await res.json()
      if (data.success) {
        setTopics(data.topics)
      }
    } catch (error) {
      console.error('Research failed:', error)
    } finally {
      setIsResearching(false)
    }
  }

  // Generate blog post ideas
  const generateIdeas = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/blog/generate?count=10')
      const data = await res.json()
      if (data.success) {
        setIdeas(data.ideas)
      }
    } catch (error) {
      console.error('Idea generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate a blog post from topic or idea
  const generatePost = async (topic: TrendingTopic | BlogIdea) => {
    setIsGenerating(true)
    try {
      const idea = {
        title: 'suggestedTitle' in topic ? topic.suggestedTitle : topic.title,
        description: 'contentAngle' in topic ? topic.contentAngle : topic.description,
        keywords: topic.keywords,
        targetAudience: topic.targetAudience,
        searchIntent: 'searchIntent' in topic ? topic.searchIntent : 'informational',
      }

      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, autoSave: false }),
      })

      const data = await res.json()
      if (data.success) {
        setGeneratedPosts((prev) => [data.post, ...prev])
        setActiveTab('queue')
      }
    } catch (error) {
      console.error('Post generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Save post to file system
  const savePost = async (post: GeneratedPost) => {
    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: {
            title: post.title,
            description: post.excerpt,
            keywords: post.keywords,
            targetAudience: 'General',
            searchIntent: 'informational',
          },
          autoSave: true,
        }),
      })

      const data = await res.json()
      if (data.saved) {
        alert(`Post saved to ${data.path}`)
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-black mb-2">AI Blog Agent</h1>
          <p className="text-gray-600">
            Research trends, generate ideas, and create SEO-optimized blog posts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'research', label: 'Trend Research', icon: TrendingUp },
            { id: 'generate', label: 'Generate Ideas', icon: Sparkles },
            { id: 'queue', label: 'Post Queue', icon: FileText, count: generatedPosts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* Research Tab */}
          {activeTab === 'research' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <select
                    value={researchCategory}
                    onChange={(e) => setResearchCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="all">All Topics</option>
                    <option value="technical">Technical</option>
                    <option value="business">Business</option>
                    <option value="news">News</option>
                    <option value="models">AI Models</option>
                  </select>
                </div>
                <Button
                  onClick={researchTopics}
                  disabled={isResearching}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Research Trends
                    </>
                  )}
                </Button>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Research Trends" to find trending AI topics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{topic.topic}</h3>
                          <p className="text-gray-600 mb-3">{topic.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {topic.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                topic.searchVolume === 'high'
                                  ? 'bg-green-100 text-green-700'
                                  : topic.searchVolume === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {topic.searchVolume} volume
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded ${
                                topic.competition === 'low'
                                  ? 'bg-green-100 text-green-700'
                                  : topic.competition === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {topic.competition} competition
                            </span>
                            <span className="text-gray-400">
                              Relevance: {topic.relevanceScore}/10
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => generatePost(topic)}
                          disabled={isGenerating}
                          className="ml-4 bg-black hover:bg-gray-800 text-white"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          <strong>Suggested title:</strong> {topic.suggestedTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Angle:</strong> {topic.contentAngle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Generate Ideas Tab */}
          {activeTab === 'generate' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">Generate AI-powered blog post ideas</p>
                <Button
                  onClick={generateIdeas}
                  disabled={isGenerating}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Ideas
                    </>
                  )}
                </Button>
              </div>

              {ideas.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Generate Ideas" to get AI-powered blog suggestions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{idea.title}</h3>
                          <p className="text-gray-600 mb-3">{idea.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {idea.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Audience: {idea.targetAudience}</span>
                            <span>Intent: {idea.searchIntent}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => generatePost(idea)}
                          disabled={isGenerating}
                          className="ml-4 bg-black hover:bg-gray-800 text-white"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Queue Tab */}
          {activeTab === 'queue' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {generatedPosts.length} posts ready for review
                </p>
              </div>

              {generatedPosts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No posts in queue. Generate some from trends or ideas!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedPosts.map((post, index) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          setExpandedPost(expandedPost === post.slug ? null : post.slug)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-lg">{post.title}</h3>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {post.category}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readingTime} min read
                              </span>
                              <span>Slug: {post.slug}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                savePost(post)
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            {expandedPost === post.slug ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedPost === post.slug && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                          <div className="prose prose-gray max-w-none">
                            <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded-lg border border-gray-200 max-h-96 overflow-auto">
                              {post.content}
                            </pre>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {post.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
