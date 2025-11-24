import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | AI 4U Labs',
  description: 'Insights, tutorials, and updates from AI 4U Labs on AI, app development, and technology trends.',
  openGraph: {
    title: 'AI 4U Labs Blog',
    description: 'Insights on AI, app development, and technology',
  },
}

// Placeholder blog posts - in production, these would come from MDX files or a CMS
const blogPosts = [
  {
    slug: 'ai-automation-business-2024',
    title: 'How AI Automation is Transforming Small Businesses in 2024',
    excerpt: 'Discover practical ways small businesses are using AI to save time, reduce costs, and improve customer experiences.',
    date: '2024-11-20',
    readTime: '5 min read',
    author: 'Edison Espinosa',
    category: 'AI Strategy',
  },
  {
    slug: 'rapid-mvp-development-guide',
    title: 'The Complete Guide to Rapid MVP Development',
    excerpt: 'Learn our proven process for launching mobile apps in 2-4 weeks, from concept to App Store.',
    date: '2024-11-15',
    readTime: '8 min read',
    author: 'Edison Espinosa',
    category: 'Development',
  },
  {
    slug: 'spanish-localization-tips',
    title: '5 Critical Mistakes to Avoid in Spanish App Localization',
    excerpt: 'Go beyond translation. Learn how to properly adapt your app for Hispanic markets.',
    date: '2024-11-10',
    readTime: '6 min read',
    author: 'Edison Espinosa',
    category: 'Localization',
  },
  {
    slug: 'openai-api-integration-tutorial',
    title: 'Integrating OpenAI GPT into Your Mobile App: A Step-by-Step Guide',
    excerpt: 'A practical tutorial on adding AI chat capabilities to your iOS and Android applications.',
    date: '2024-11-05',
    readTime: '10 min read',
    author: 'Edison Espinosa',
    category: 'Tutorial',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-blue-300 hover:text-blue-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Blog & Insights
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            Practical advice on AI, app development, and growing your tech business
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                      {post.category}
                    </span>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-slate-300 mt-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-4">
              Want to stay updated with our latest insights?
            </p>
            <Link href="/#ideas">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Subscribe to Updates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
