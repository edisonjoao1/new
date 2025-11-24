import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

// In production, you'd load these from MDX files or a CMS
const blogPosts: Record<string, any> = {
  'ai-automation-business-2024': {
    title: 'How AI Automation is Transforming Small Businesses in 2024',
    date: '2024-11-20',
    readTime: '5 min read',
    author: 'Edison Espinosa',
    category: 'AI Strategy',
    content: `
This is a placeholder for the blog post content. In a production environment, you would:

1. Create MDX files in a \`content/blog\` directory
2. Use \`next-mdx-remote\` or a similar library to render the content
3. Add proper styling and components for rich content

**Example MDX Structure:**

\`\`\`
---
title: Your Blog Post Title
date: 2024-11-20
author: Edison Espinosa
category: AI Strategy
---

# Your Content Here

This is where your actual blog content would go, with full markdown support,
embedded components, code blocks, and more.
\`\`\`

For now, this serves as a template to show how individual blog posts would be displayed.
    `,
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post Not Found | AI 4U Labs',
    }
  }

  return {
    title: `${post.title} | AI 4U Labs Blog`,
    description: post.title,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 text-blue-300 hover:text-blue-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                {post.category}
              </span>
              <div className="flex items-center text-slate-400 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center text-slate-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-slate-400">
              By {post.author}
            </p>
          </header>

          <div className="prose prose-invert prose-slate max-w-none">
            <div className="text-slate-300 leading-relaxed space-y-6 whitespace-pre-line">
              {post.content}
            </div>
          </div>

          <footer className="mt-16 pt-8 border-t border-slate-700">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Business with AI?
              </h3>
              <p className="text-slate-300 mb-6">
                Let's discuss how AI automation can help your business save time and reduce costs.
              </p>
              <Link href="/#ideas">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Start Your Project
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}
