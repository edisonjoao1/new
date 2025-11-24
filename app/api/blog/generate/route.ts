import { NextRequest, NextResponse } from 'next/server'
import { BlogContentGenerator, BlogPostIdea } from '@/lib/blog/content-generator'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { idea, autoSave } = body

    if (!idea || !idea.title) {
      return NextResponse.json(
        { error: 'Blog post idea is required' },
        { status: 400 }
      )
    }

    const generator = new BlogContentGenerator()
    const blogPost = await generator.generatePost(idea as BlogPostIdea)

    // Optionally save to file system
    if (autoSave) {
      try {
        const contentDir = join(process.cwd(), 'content', 'blog')
        await mkdir(contentDir, { recursive: true })

        const filePath = join(contentDir, `${blogPost.slug}.mdx`)
        const frontmatter = `---
title: "${blogPost.title}"
excerpt: "${blogPost.excerpt}"
date: "${new Date().toISOString()}"
category: "${blogPost.category}"
keywords: ${JSON.stringify(blogPost.keywords)}
readingTime: ${blogPost.readingTime}
---

${blogPost.content}`

        await writeFile(filePath, frontmatter, 'utf-8')

        return NextResponse.json({
          success: true,
          post: blogPost,
          saved: true,
          path: filePath,
        })
      } catch (saveError) {
        console.error('Failed to save blog post:', saveError)
        return NextResponse.json({
          success: true,
          post: blogPost,
          saved: false,
          error: 'Failed to save file',
        })
      }
    }

    return NextResponse.json({
      success: true,
      post: blogPost,
    })
  } catch (error: any) {
    console.error('Blog generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate blog post', details: error.message },
      { status: 500 }
    )
  }
}

// Generate blog post ideas
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const count = parseInt(searchParams.get('count') || '10')

    const generator = new BlogContentGenerator()
    const ideas = await generator.generateIdeas(count)

    return NextResponse.json({
      success: true,
      count: ideas.length,
      ideas,
    })
  } catch (error: any) {
    console.error('Idea generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas', details: error.message },
      { status: 500 }
    )
  }
}
