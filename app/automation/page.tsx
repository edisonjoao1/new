"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2, Mail, FileText, Search, Send } from 'lucide-react'

export default function AutomationDashboard() {
  const [isProcessing, setIsProcessing] = useState(false)

  // Outreach state
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [outreachResult, setOutreachResult] = useState<any>(null)

  // Blog state
  const [blogIdeas, setBlogIdeas] = useState<any[]>([])
  const [selectedIdea, setSelectedIdea] = useState<any>(null)
  const [generatedPost, setGeneratedPost] = useState<any>(null)

  // Research company and send outreach
  const handleOutreach = async () => {
    if (!website) {
      toast.error('Please enter a website')
      return
    }

    setIsProcessing(true)
    setOutreachResult(null)

    try {
      const response = await fetch('/api/outreach/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website,
          recipientEmail: email || undefined,
          options: {
            tone: 'professional',
            length: 'medium',
            focusArea: 'general',
            callToAction: 'meeting',
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOutreachResult(data)
        toast.success('Research completed!')
      } else {
        toast.error(data.error || 'Research failed')
      }
    } catch (error) {
      console.error('Outreach error:', error)
      toast.error('Failed to process outreach')
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate blog post ideas
  const handleGenerateIdeas = async () => {
    setIsProcessing(true)
    setBlogIdeas([])

    try {
      const response = await fetch('/api/blog/generate?count=10')
      const data = await response.json()

      if (data.success) {
        setBlogIdeas(data.ideas)
        toast.success(`Generated ${data.count} blog ideas!`)
      } else {
        toast.error('Failed to generate ideas')
      }
    } catch (error) {
      console.error('Ideas error:', error)
      toast.error('Failed to generate ideas')
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate full blog post
  const handleGeneratePost = async (idea: any) => {
    setIsProcessing(true)
    setGeneratedPost(null)
    setSelectedIdea(idea)

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          autoSave: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedPost(data.post)
        toast.success('Blog post generated!')
      } else {
        toast.error('Failed to generate post')
      }
    } catch (error) {
      console.error('Post generation error:', error)
      toast.error('Failed to generate post')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">AI Automation Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Automated outreach and content generation powered by AI
          </p>
        </div>

        <Tabs defaultValue="outreach" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="outreach">
              <Mail className="w-4 h-4 mr-2" />
              Outreach Agent
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="w-4 h-4 mr-2" />
              Blog Generator
            </TabsTrigger>
          </TabsList>

          {/* Outreach Tab */}
          <TabsContent value="outreach" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Company Research & Outreach</h2>
              <p className="text-gray-600 mb-6">
                Enter a company website to research and generate personalized outreach
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Website</label>
                  <Input
                    placeholder="example.com or https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recipient Email (optional - for sending)
                  </label>
                  <Input
                    type="email"
                    placeholder="contact@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleOutreach}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Research & Generate Proposal
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Results */}
            {outreachResult && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Company Intel</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {outreachResult.company.name}
                    </div>
                    <div>
                      <span className="font-medium">Industry:</span>{' '}
                      {outreachResult.company.industry}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{' '}
                      {outreachResult.company.description}
                    </div>
                    {outreachResult.company.painPoints.length > 0 && (
                      <div>
                        <span className="font-medium">Pain Points:</span>
                        <ul className="list-disc list-inside mt-1 text-gray-600">
                          {outreachResult.company.painPoints.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Generated Proposal</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-sm">Subject:</span>
                      <p className="mt-1">{outreachResult.proposal.subject}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Email Body:</span>
                      <Textarea
                        value={outreachResult.proposal.body}
                        readOnly
                        className="mt-1 h-64 font-mono text-xs"
                      />
                    </div>
                    {outreachResult.email && (
                      <div className="text-sm">
                        {outreachResult.email.success ? (
                          <div className="text-green-600 flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            Email sent successfully!
                          </div>
                        ) : (
                          <div className="text-red-600">Email failed: {outreachResult.email.error}</div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Blog Generator Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">AI Blog Content Generator</h2>
              <p className="text-gray-600 mb-6">
                Generate SEO-optimized blog post ideas and full articles
              </p>

              <Button
                onClick={handleGenerateIdeas}
                disabled={isProcessing}
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate 10 Blog Ideas
                  </>
                )}
              </Button>
            </Card>

            {/* Blog Ideas */}
            {blogIdeas.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {blogIdeas.map((idea, index) => (
                  <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold mb-2">{idea.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {idea.keywords.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleGeneratePost(idea)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Generate Full Post
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {/* Generated Post */}
            {generatedPost && (
              <Card className="p-6">
                <h3 className="text-2xl font-semibold mb-4">{generatedPost.title}</h3>
                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <span className="font-medium">Category:</span> {generatedPost.category}
                  </div>
                  <div>
                    <span className="font-medium">Reading Time:</span> {generatedPost.readingTime}{' '}
                    min
                  </div>
                  <div>
                    <span className="font-medium">Meta Description:</span>{' '}
                    {generatedPost.metaDescription}
                  </div>
                  <div>
                    <span className="font-medium">Slug:</span> /blog/{generatedPost.slug}
                  </div>
                </div>
                <Textarea
                  value={generatedPost.content}
                  readOnly
                  className="h-96 font-mono text-xs"
                />
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
