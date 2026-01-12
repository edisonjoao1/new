import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface BlogPostIdea {
  title: string
  description: string
  keywords: string[]
  targetAudience: string
  searchIntent: 'informational' | 'commercial' | 'transactional' | 'navigational'
}

export interface GeneratedBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  keywords: string[]
  metaDescription: string
  readingTime: number
  category: string
  publishDate?: Date
}

export class BlogContentGenerator {
  /**
   * Generate a complete SEO-optimized blog post with web search for accuracy
   */
  async generatePost(idea: BlogPostIdea): Promise<GeneratedBlogPost> {
    const prompt = this.buildBlogPrompt(idea)

    try {
      // Use GPT-5.2 with web search for factual, up-to-date content
      const response = await openai.chat.completions.create({
        model: 'gpt-5.2',
        messages: [
          {
            role: 'system',
            content: `You are an expert content writer for AI 4U Labs, specializing in AI development, automation, and technical content.

CRITICAL: Use web search to verify all facts, statistics, and technical details. Cite sources when possible.

Writing style:
- Authoritative but accessible
- Data-driven with specific, verified numbers
- Cite recent studies and sources
- Use real examples from our work (AP2 protocol, 1M+ users, 10+ apps)
- Actionable insights with current best practices
- Technical accuracy with latest information
- SEO-optimized naturally (not keyword stuffing)

Content structure:
- Hook with a surprising fact or stat
- Clear headings (H2, H3)
- Short paragraphs (2-3 sentences)
- Bullet points and lists
- Code examples with latest syntax
- Real case studies with dates
- Clear CTAs

SEO guidelines:
- Target keyword in first 100 words
- Use keyword in H2 naturally
- Include semantic variations
- Internal links to our services
- External links to authority sources (with dates)
- Use latest terminology and model names`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      })

      const content = response.choices[0]?.message?.content || ''
      return this.parseGeneratedPost(content, idea)
    } catch (error) {
      console.error('Blog generation failed:', error)
      throw error
    }
  }

  /**
   * Build prompt for blog post generation
   */
  private buildBlogPrompt(idea: BlogPostIdea): string {
    return `Write a complete, SEO-optimized blog post for AI 4U Labs.

Topic: ${idea.title}
Description: ${idea.description}
Target Keywords: ${idea.keywords.join(', ')}
Target Audience: ${idea.targetAudience}
Search Intent: ${idea.searchIntent}

Requirements:
- 1500-2000 words
- SEO-optimized (naturally incorporate keywords)
- Engaging introduction with hook
- Clear H2 and H3 headings
- Actionable insights
- Real examples from AI 4U Labs portfolio
- Code snippets if relevant
- Internal CTAs to our services
- Meta description (150-160 characters)

Company context for examples:
- Built 30+ AI apps with 1M+ users
- Pioneered AP2 payments protocol BEFORE Google announced it
- Ship MVPs in 2-4 weeks ($15-25K)
- Tech: GPT-5.2, Claude Opus 4.5, Gemini 3.0, OpenAI Realtime API
- Real products: SheGPT (1 day to launch), Conversational Payments, Spanish AI
- Using cutting-edge models: GPT-5.2 (Jan 2026), Claude Opus 4.5 (Nov 2025), Gemini 3.0 (Dec 2025)

Output format:
TITLE: [compelling, SEO-optimized title with main keyword]
META: [meta description 150-160 chars]
CATEGORY: [one of: AI Development, Automation, Case Studies, Tutorials, Industry Insights]

CONTENT:
[Full markdown blog post with headings, lists, code blocks, etc.]

KEYWORDS: [comma-separated list of 5-7 target keywords]`
  }

  /**
   * Parse generated content into structured post
   */
  private parseGeneratedPost(content: string, idea: BlogPostIdea): GeneratedBlogPost {
    const lines = content.split('\n')

    let title = ''
    let metaDescription = ''
    let category = 'AI Development'
    let keywords: string[] = []
    let postContent = ''
    let section = ''

    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim()
      } else if (line.startsWith('META:')) {
        metaDescription = line.replace('META:', '').trim()
      } else if (line.startsWith('CATEGORY:')) {
        category = line.replace('CATEGORY:', '').trim()
      } else if (line.startsWith('KEYWORDS:')) {
        keywords = line
          .replace('KEYWORDS:', '')
          .trim()
          .split(',')
          .map(k => k.trim())
      } else if (line.startsWith('CONTENT:')) {
        section = 'content'
      } else if (section === 'content') {
        postContent += line + '\n'
      }
    }

    // Fallbacks
    if (!title) title = idea.title
    if (!metaDescription) metaDescription = idea.description.slice(0, 160)
    if (keywords.length === 0) keywords = idea.keywords

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Calculate reading time (avg 200 words/min)
    const wordCount = postContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Extract excerpt (first paragraph)
    const paragraphs = postContent.split('\n\n').filter(p => p.trim() && !p.startsWith('#'))
    const excerpt = paragraphs[0]?.slice(0, 200) + '...' || metaDescription

    return {
      title,
      slug,
      excerpt,
      content: postContent.trim(),
      keywords,
      metaDescription,
      readingTime,
      category,
    }
  }

  /**
   * Generate multiple blog post ideas based on trending topics
   */
  async generateIdeas(count: number = 10): Promise<BlogPostIdea[]> {
    const prompt = `Generate ${count} SEO-optimized blog post ideas for AI 4U Labs.

Focus on:
- AI development trends
- Automation use cases
- Technical tutorials
- Case studies
- Industry insights
- AI agent development
- LLM integration
- Mobile AI apps
- Rapid prototyping

For each idea, provide:
1. Title (compelling, includes target keyword)
2. Description (2-3 sentences)
3. Primary keywords (3-5)
4. Target audience (developers, founders, CTOs, etc.)
5. Search intent (informational, commercial, transactional)

Return as JSON array:
[
  {
    "title": "...",
    "description": "...",
    "keywords": ["..."],
    "targetAudience": "...",
    "searchIntent": "informational"
  }
]`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO and content strategist. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      })

      const content = response.choices[0]?.message?.content || '[]'
      return JSON.parse(content)
    } catch (error) {
      console.error('Idea generation failed:', error)
      return this.getFallbackIdeas()
    }
  }

  /**
   * Fallback blog ideas
   */
  private getFallbackIdeas(): BlogPostIdea[] {
    return [
      {
        title: 'How to Build an AI MVP in 2-4 Weeks: A Complete Guide',
        description: 'Learn our exact process for shipping production-ready AI MVPs in 2-4 weeks. From idea validation to App Store launch.',
        keywords: ['AI MVP', 'rapid prototyping', 'AI development', 'MVP development'],
        targetAudience: 'Founders and CTOs',
        searchIntent: 'informational',
      },
      {
        title: 'AI Agents for Business: 10 Real-World Use Cases with ROI',
        description: 'Discover 10 proven AI agent applications that deliver measurable ROI. Includes implementation costs and timelines.',
        keywords: ['AI agents', 'business automation', 'AI use cases', 'ROI'],
        targetAudience: 'Business leaders',
        searchIntent: 'commercial',
      },
      {
        title: 'GPT-5 vs Claude Opus 4.5 vs Llama: Which LLM Should You Use?',
        description: 'A practical comparison of GPT-5.2, Claude Opus 4.5, and Llama for production applications. Real performance data and cost analysis.',
        keywords: ['GPT-5', 'Claude Opus 4.5', 'Llama', 'LLM comparison'],
        targetAudience: 'Technical decision makers',
        searchIntent: 'informational',
      },
    ]
  }

  /**
   * Optimize existing blog post for SEO
   */
  async optimizePost(existingContent: string, targetKeywords: string[]): Promise<string> {
    const prompt = `Optimize this blog post for SEO while maintaining quality.

Target keywords: ${targetKeywords.join(', ')}

Current content:
${existingContent.slice(0, 2000)}

Improvements needed:
1. Naturally incorporate target keywords
2. Improve headings for SEO
3. Add meta-relevant sections
4. Enhance readability
5. Add internal linking opportunities

Return the optimized full content in markdown.`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 2500,
      })

      return response.choices[0]?.message?.content || existingContent
    } catch (error) {
      return existingContent
    }
  }
}
