import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/blog/posts'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to get post:', error)
    return NextResponse.json(
      { error: 'Failed to get post' },
      { status: 500 }
    )
  }
}
