import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog/posts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found | AI 4U Labs',
    }
  }

  return {
    title: `${post.title} | AI 4U Labs Blog`,
    description: post.excerpt,
    keywords: post.keywords,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

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
                {post.readingTime} min read
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-slate-400">
              By {post.author}
            </p>
          </header>

          <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-h2:text-3xl prose-h2:mt-8 prose-h3:text-2xl prose-p:text-slate-300 prose-strong:text-white prose-code:text-blue-300 prose-pre:bg-slate-900 prose-a:text-blue-400 hover:prose-a:text-blue-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
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
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}
