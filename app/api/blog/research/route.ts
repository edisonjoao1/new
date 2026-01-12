import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const maxDuration = 60

interface TrendingTopic {
  topic: string
  description: string
  searchVolume: 'high' | 'medium' | 'low'
  competition: 'high' | 'medium' | 'low'
  relevanceScore: number
  suggestedTitle: string
  keywords: string[]
  targetAudience: string
  contentAngle: string
}

/**
 * Research trending AI topics using web search
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || 'all'
    const count = parseInt(searchParams.get('count') || '5')

    // Use GPT-5.2 with web search to find trending topics
    const searchPrompt = buildSearchPrompt(category)

    const response = await openai.responses.create({
      model: 'gpt-5.2',
      input: searchPrompt,
      tools: [{ type: 'web_search_preview' }],
    })

    // Extract text from response
    let researchContent = ''
    if (response.output) {
      for (const item of response.output) {
        if (item.type === 'message' && item.content) {
          for (const content of item.content) {
            if (content.type === 'output_text') {
              researchContent += content.text
            }
          }
        }
      }
    }

    // Parse the research into structured topics
    const topics = await parseResearchIntoTopics(researchContent, count)

    return NextResponse.json({
      success: true,
      category,
      timestamp: new Date().toISOString(),
      topics,
    })
  } catch (error: any) {
    console.error('Research error:', error)
    return NextResponse.json(
      { error: 'Failed to research trending topics', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Build search prompt for trending topics
 */
function buildSearchPrompt(category: string): string {
  const categoryPrompts: Record<string, string> = {
    all: 'AI trends, AI development, AI agents, LLM updates, AI tools, AI business applications',
    technical: 'AI development tutorials, LLM integration, AI coding, MCP servers, RAG systems',
    business: 'AI ROI, AI business applications, AI cost savings, AI automation',
    news: 'AI news this week, new AI models, AI company announcements, AI funding',
    models: 'GPT-5 updates, Claude updates, Gemini updates, new AI models, model comparisons',
  }

  const focus = categoryPrompts[category] || categoryPrompts.all

  return `Search for the latest trending topics in: ${focus}

Focus on January 2026 news and updates. Find:
1. What AI topics are trending right now
2. New model releases or updates
3. Emerging AI use cases
4. Business AI applications getting attention
5. Technical breakthroughs or tutorials in demand

For each topic found, provide:
- Topic name
- Brief description of why it's trending
- Estimated search interest (high/medium/low)
- Content opportunity for AI 4U Labs

Be specific with dates and sources when possible.`
}

/**
 * Parse research content into structured topics
 */
async function parseResearchIntoTopics(
  researchContent: string,
  count: number
): Promise<TrendingTopic[]> {
  const prompt = `Based on this research, identify the ${count} best blog post opportunities for AI 4U Labs:

Research:
${researchContent.slice(0, 4000)}

For each topic, provide JSON with:
{
  "topic": "Main topic/trend",
  "description": "Why this is trending and relevant",
  "searchVolume": "high|medium|low",
  "competition": "high|medium|low",
  "relevanceScore": 1-10 (how relevant to AI 4U Labs),
  "suggestedTitle": "Compelling blog post title",
  "keywords": ["primary", "secondary", "keywords"],
  "targetAudience": "Who would read this",
  "contentAngle": "How AI 4U Labs should approach this topic"
}

Return as JSON array. Only valid JSON, no markdown.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a content strategist. Return only valid JSON array.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content || '[]'

    // Clean JSON (remove markdown code blocks if present)
    const cleanJson = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    return JSON.parse(cleanJson)
  } catch (error) {
    console.error('Failed to parse topics:', error)
    return getDefaultTopics()
  }
}

/**
 * Default topics if research fails
 */
function getDefaultTopics(): TrendingTopic[] {
  return [
    {
      topic: 'AI Agents in Production',
      description: 'AI agents are moving from demos to real production systems',
      searchVolume: 'high',
      competition: 'medium',
      relevanceScore: 9,
      suggestedTitle: 'Building Production AI Agents: Lessons from 35+ Deployments',
      keywords: ['AI agents', 'production AI', 'AI automation', 'agent development'],
      targetAudience: 'Technical decision makers',
      contentAngle: 'Share real experiences from our agent deployments',
    },
    {
      topic: 'Cost Optimization with AI',
      description: 'Businesses seeking ROI from AI investments',
      searchVolume: 'high',
      competition: 'low',
      relevanceScore: 10,
      suggestedTitle: 'How We Cut Client Costs by 40% with AI Automation',
      keywords: ['AI ROI', 'AI cost savings', 'AI optimization', 'business AI'],
      targetAudience: 'Business leaders',
      contentAngle: 'Real case studies with specific numbers',
    },
    {
      topic: 'Multi-Model AI Architecture',
      description: 'Using multiple AI models together for best results',
      searchVolume: 'medium',
      competition: 'low',
      relevanceScore: 9,
      suggestedTitle: 'Multi-Model AI: When and How to Use GPT-5, Claude, and Gemini Together',
      keywords: ['multi-model AI', 'model routing', 'AI architecture', 'LLM comparison'],
      targetAudience: 'AI developers',
      contentAngle: 'Technical guide with code examples',
    },
  ]
}
