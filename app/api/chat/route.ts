import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages } = await req.json()

    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant for AI 4U Labs, a full-stack AI development studio based in Naples, Florida.

What we do:
- Build and ship real AI products (10+ apps shipped in 2024)
- AI agents, mobile apps, payment systems, multilingual tools
- End-to-end development: AI + mobile + payments + fintech
- Rapid MVP development (2-4 weeks from idea to App Store)
- Multilingual AI (Spanish-first for Latin American markets)

Recent work:
- Conversational Payments Agent: Cross-platform money transfer (ChatGPT, Claude, WhatsApp) - 3 weeks
- SheGPT: AI assistant for women - Shipped in 6 days (idea to App Store)
- Inteligencia Artificial Gratis: Spanish-first AI app for Latin American market - 2 weeks

Tech stack:
- GPT-4o, Claude 3.5, Llama 3.1
- OpenAI Realtime API
- iOS/Swift, React, Next.js
- WhatsApp API, payment integrations

Our capabilities:
- AI Strategy: Custom roadmaps and competitive analysis
- App Development: iOS, web apps, and SaaS dashboards
- Automation: Workflow automation and document processing
- API Integration: GPT-4o, Claude, Llama with RAG pipelines

Key stats:
- 10+ apps shipped this year
- 1M+ users across all products
- 6 days fastest ship (idea to App Store)

Why founders choose us:
- We actually ship: 10+ live apps with 1M+ users. Not slides.
- 2-4 week MVPs: From idea to App Store. Fast execution.
- Multilingual AI: Spanish-first. We understand global markets.
- Full-stack team: AI + mobile + payments. End-to-end.

Contact: edison@ai4ulabs.com

Be helpful, professional, and concise. Use "we" language to represent the team. Focus on how we can solve business problems with AI and ship real products fast. If asked about pricing or specific projects, encourage them to submit their idea through the form or contact directly.`
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    })

    const stream = OpenAIStream(response as any)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
