import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getBlogImage } from '@/lib/blog/images'

interface LayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug

  // Try to load the post from MDX files
  let post = null
  const contentDir = path.join(process.cwd(), 'content', 'blog')

  try {
    if (fs.existsSync(contentDir)) {
      // First try direct file match (slug is filename without .mdx)
      const directPath = path.join(contentDir, `${slug}.mdx`)
      if (fs.existsSync(directPath)) {
        const fileContent = fs.readFileSync(directPath, 'utf-8')
        const { data } = matter(fileContent)
        post = data
      } else {
        // Fallback: search through all files for slug field match
        const files = fs.readdirSync(contentDir)
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = path.join(contentDir, file)
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const { data } = matter(fileContent)
            // Match by slug field OR by filename
            const fileSlug = file.replace('.mdx', '')
            if (data.slug === slug || fileSlug === slug) {
              post = data
              break
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading post for metadata:', error)
  }

  // Fallback if no post found
  if (!post) {
    return {
      title: 'Blog Post | AI 4U Labs',
      description: 'Read our latest insights on AI development, best practices, and industry trends.',
    }
  }

  const imageUrl = post.image || getBlogImage(post.category || 'Tutorial', post.keywords || [], slug)
  const canonicalUrl = `https://ai4u.space/blog/${slug}`

  return {
    title: `${post.title} | AI 4U Labs Blog`,
    description: post.excerpt || post.description,
    keywords: post.keywords?.join(', ') || post.category,
    authors: [{ name: post.author || 'AI 4U Labs' }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || post.description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      authors: [post.author || 'AI 4U Labs'],
      section: post.category,
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function BlogPostLayout({ children }: LayoutProps) {
  return <>{children}</>
}
