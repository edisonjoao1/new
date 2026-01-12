"use client"

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ArrowLeft, Calendar, Clock, ArrowRight, Share2, Bookmark, Copy, Check, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { getBlogImage, getCategoryGradient } from '@/lib/blog/images'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  readingTime: number
  author: string
  keywords?: string[]
  featured?: boolean
  image?: string
}

// Code block with copy button and language label
function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])

  const displayLanguage = language?.replace(/^language-/, '') || 'code'

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
      {/* Language Label & Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          {displayLanguage}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={displayLanguage}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          background: '#1a1a2e',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          borderRadius: 0,
        }}
        showLineNumbers={value.split('\n').length > 5}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#4a5568',
          borderRight: '1px solid #2d3748',
          marginRight: '1em',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

// Inline code styling
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-zinc-100 text-zinc-800 text-sm font-mono rounded border border-zinc-200">
      {children}
    </code>
  )
}

// Beautiful table component
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  )
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-zinc-900 text-white">
      {children}
    </thead>
  )
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-zinc-100">{children}</tbody>
}

function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      {children}
    </tr>
  )
}

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-300 whitespace-nowrap">
      {children}
    </th>
  )
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3.5 text-zinc-700 font-light whitespace-nowrap">
      {children}
    </td>
  )
}

// Custom heading with anchor links
function Heading({ level, children, id }: { level: number; children: React.ReactNode; id?: string }) {
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined)

  const baseClasses = "font-medium tracking-tight text-zinc-900 scroll-mt-24"
  const levelClasses: Record<number, string> = {
    1: "text-4xl mt-0 mb-6",
    2: "text-2xl md:text-3xl mt-16 mb-6 pt-8 border-t border-zinc-100",
    3: "text-xl md:text-2xl mt-10 mb-4",
    4: "text-lg md:text-xl mt-8 mb-3",
    5: "text-base mt-6 mb-2",
    6: "text-sm mt-4 mb-2 uppercase tracking-wider text-zinc-500",
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag id={headingId} className={`${baseClasses} ${levelClasses[level]} group`}>
      {children}
      {headingId && (
        <a
          href={`#${headingId}`}
          className="ml-2 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Link to ${children}`}
        >
          #
        </a>
      )}
    </Tag>
  )
}

// Blockquote styling
function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-zinc-900 bg-zinc-50 py-4 pr-4 rounded-r-lg italic text-zinc-600">
      {children}
    </blockquote>
  )
}

// List styling
function UnorderedList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="my-6 space-y-3 list-none">
      {children}
    </ul>
  )
}

function OrderedList({ children }: { children: React.ReactNode }) {
  return (
    <ol className="my-6 space-y-3 list-decimal list-inside marker:text-zinc-400 marker:font-medium">
      {children}
    </ol>
  )
}

function ListItem({ children, ordered }: { children: React.ReactNode; ordered?: boolean }) {
  if (ordered) {
    return (
      <li className="text-zinc-700 font-light leading-relaxed pl-2">
        {children}
      </li>
    )
  }
  return (
    <li className="flex gap-3 text-zinc-700 font-light leading-relaxed">
      <span className="text-zinc-400 mt-1.5 flex-shrink-0">
        <svg className="w-1.5 h-1.5 fill-current" viewBox="0 0 6 6">
          <circle cx="3" cy="3" r="3" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  )
}

// Link styling
function CustomLink({ href, children }: { href?: string; children: React.ReactNode }) {
  const isExternal = href?.startsWith('http')
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-400 transition-colors inline-flex items-center gap-1"
    >
      {children}
      {isExternal && <ExternalLink className="w-3 h-3" />}
    </a>
  )
}

// Paragraph styling
function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-zinc-700 font-light leading-[1.8] my-5 text-base md:text-lg">
      {children}
    </p>
  )
}

// Strong text
function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-zinc-900">{children}</strong>
}

// Horizontal rule
function HorizontalRule() {
  return (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
  )
}

// Image with caption
function CustomImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="my-10">
      <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-100">
        <img src={src} alt={alt} className="w-full h-auto" />
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-sm text-zinc-500 font-light italic">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlanOpen, setIsPlanOpen] = useState(false)

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/blog/posts/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        }
      } catch (error) {
        console.error('Failed to load post:', error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      loadPost()
    }
  }, [slug])

  // Set document title dynamically - must be before conditional returns
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | AI 4U Labs Blog`
    }
  }, [post?.title])

  if (loading) {
    return (
      <>
        <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />
        <main className="bg-white min-h-screen pt-24">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20">
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-12 w-3/4 bg-gray-200 rounded mb-4" />
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </main>
        <EditorialFooter />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />
        <main className="bg-white min-h-screen pt-24">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-9xl font-light text-gray-200 mb-8">404</div>
              <h1 className="text-4xl font-light tracking-tight mb-4">Post Not Found</h1>
              <p className="text-gray-600 font-light mb-8">
                The article you're looking for doesn't exist or has been moved.
              </p>
              <Link href="/blog">
                <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full text-base font-light transition-all inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </button>
              </Link>
            </motion.div>
          </div>
        </main>
        <EditorialFooter />
      </>
    )
  }

  const gradient = getCategoryGradient(post.category)
  const canonicalUrl = `https://ai4u.space/blog/${post.slug}`
  const imageUrl = post.image || getBlogImage(post.category, post.keywords || [], post.slug)

  // Schema.org structured data for AI agents and SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": imageUrl,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author || "AI 4U Labs",
      "url": "https://ai4u.space"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI 4U Labs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ai4u.space/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": post.keywords?.join(", ") || post.category,
    "articleSection": post.category,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": `PT${post.readingTime}M`
  }

  return (
    <>
      {/* Schema.org JSON-LD for AI agents and SEO */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen" itemScope itemType="https://schema.org/Article">
        {/* Hero Image Section */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden"
        >
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            itemProp="image"
          />

          {/* Multi-layer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} opacity-20 mix-blend-overlay`} />

          {/* Back Link - Floating */}
          <nav className="absolute top-28 left-6 md:left-12 z-20" aria-label="Breadcrumb">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm text-white/90 hover:bg-white/20 transition-all font-light"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blog</span>
              </Link>
            </motion.div>
          </nav>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Category & Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    className={`px-4 py-1.5 ${gradient.accent} text-white text-xs uppercase tracking-wider rounded-full font-medium shadow-lg`}
                    itemProp="articleSection"
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time
                        dateTime={post.date}
                        itemProp="datePublished"
                        className="font-light"
                      >
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span className="font-light">{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white mb-6 leading-tight max-w-4xl"
                  itemProp="headline"
                >
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p
                  className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl"
                  itemProp="description"
                >
                  {post.excerpt}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b ${gradient.from} ${gradient.to} opacity-60`} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.header>

        {/* Article Content */}
        <article className="max-w-[800px] mx-auto px-6 md:px-12 py-12" itemProp="articleBody">
          {/* Author & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between pb-8 mb-8 border-b border-gray-100"
          >
            <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Organization">
              <div className={`w-12 h-12 ${gradient.accent} rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-sm font-medium text-white">
                  {post.author?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-black" itemProp="name">{post.author || 'AI 4U Labs'}</div>
                <div className="text-xs text-gray-500 font-light">AI Development Studio</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Share">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Bookmark">
                <Bookmark className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </motion.div>

          {/* Markdown Content with Custom Components */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="article-content"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Code blocks
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const value = String(children).replace(/\n$/, '')

                  if (!inline && (match || value.includes('\n'))) {
                    return <CodeBlock language={match?.[1] || ''} value={value} />
                  }
                  return <InlineCode>{children}</InlineCode>
                },
                // Tables
                table: ({ children }) => <Table>{children}</Table>,
                thead: ({ children }) => <TableHead>{children}</TableHead>,
                tbody: ({ children }) => <TableBody>{children}</TableBody>,
                tr: ({ children }) => <TableRow>{children}</TableRow>,
                th: ({ children }) => <TableHeaderCell>{children}</TableHeaderCell>,
                td: ({ children }) => <TableCell>{children}</TableCell>,
                // Headings
                h1: ({ children }) => <Heading level={1}>{children}</Heading>,
                h2: ({ children }) => <Heading level={2}>{children}</Heading>,
                h3: ({ children }) => <Heading level={3}>{children}</Heading>,
                h4: ({ children }) => <Heading level={4}>{children}</Heading>,
                h5: ({ children }) => <Heading level={5}>{children}</Heading>,
                h6: ({ children }) => <Heading level={6}>{children}</Heading>,
                // Text elements
                p: ({ children }) => <Paragraph>{children}</Paragraph>,
                strong: ({ children }) => <Strong>{children}</Strong>,
                blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
                // Lists
                ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
                ol: ({ children }) => <OrderedList>{children}</OrderedList>,
                li: ({ children, ordered }: any) => <ListItem ordered={ordered}>{children}</ListItem>,
                // Links & Media
                a: ({ href, children }) => <CustomLink href={href}>{children}</CustomLink>,
                img: ({ src, alt }) => <CustomImage src={src} alt={alt} />,
                // Misc
                hr: () => <HorizontalRule />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Tags */}
          {post.keywords && post.keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-8 border-t border-gray-100"
            >
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm rounded-full font-light transition-colors cursor-pointer"
                    itemProp="keywords"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black p-10 md:p-12">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
                  Ready to build your
                  <br />
                  <span className="italic font-serif">AI product?</span>
                </h3>
                <p className="text-gray-300 font-light mb-8 max-w-lg">
                  From concept to production in days, not months. Let's discuss how AI can transform your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsPlanOpen(true)}
                    className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full text-base font-light transition-all inline-flex items-center justify-center gap-2"
                  >
                    Start a Project
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link href="/case-studies">
                    <button className="border border-white/30 hover:border-white text-white px-8 py-4 rounded-full text-base font-light transition-all w-full sm:w-auto">
                      View Case Studies
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.footer>
        </article>

        {/* Related Posts Section */}
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 border-t border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="h-px w-12 bg-black mb-4" />
                <h2 className="text-3xl font-light tracking-tight">More Articles</h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-light text-gray-600 hover:text-black transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
