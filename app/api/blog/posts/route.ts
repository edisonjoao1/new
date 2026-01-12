import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog/posts'

export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to get posts:', error)
    return NextResponse.json([], { status: 200 })
  }
}
