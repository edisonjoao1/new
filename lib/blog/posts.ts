import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  keywords: string[]
  readingTime: number
  content: string
  author?: string
}

/**
 * Get all blog posts from the content/blog directory
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const files = await readdir(contentDir)

    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
        .map(async file => {
          const slug = file.replace(/\.mdx?$/, '')
          const post = await getPostBySlug(slug)
          return post
        })
    )

    // Sort by date, newest first
    return posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as BlogPost[]
  } catch (error) {
    console.error('Failed to load blog posts:', error)
    return []
  }
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const filePath = join(contentDir, `${slug}.mdx`)

    const fileContent = await readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || content.slice(0, 200) + '...',
      date: data.date || new Date().toISOString(),
      category: data.category || 'Uncategorized',
      keywords: data.keywords || [],
      readingTime: data.readingTime || calculateReadingTime(content),
      content,
      author: data.author || 'AI 4U Labs',
    }
  } catch (error) {
    console.error(`Failed to load post ${slug}:`, error)
    return null
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const contentDir = join(process.cwd(), 'content', 'blog')
    const files = await readdir(contentDir)

    return files
      .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
      .map(file => file.replace(/\.mdx?$/, ''))
  } catch (error) {
    console.error('Failed to load post slugs:', error)
    return []
  }
}

/**
 * Calculate reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
