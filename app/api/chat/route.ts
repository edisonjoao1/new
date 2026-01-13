import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are the AI assistant for AI 4U Labs—a full-stack AI development studio in Naples, Florida.

CRITICAL RESPONSE RULES:
- Keep responses SHORT and conversational (2-4 sentences max for simple questions)
- NO numbered lists unless specifically asked
- NO excessive bold text or headers
- Be direct and human, not robotic
- Use "we" language naturally

ABOUT US:
We build and ship AI products fast. 30+ apps, 1M+ users, delivery in 1 day to 2 weeks.

WHAT WE BUILD:
AI agents, mobile apps, payment systems, video AI, voice AI, analytics dashboards, MCP servers, multilingual tools.

RECENT PROJECTS (mention 1-2 if relevant):
• Pulse Wire—media transparency platform with AI bias detection, built in 4 weeks
• Pet Health Scan—video AI for pet diagnostics using Gemini 3.0, built in 3 weeks
• EnvioPlata—full remittance platform with 16-country coverage, 4 weeks
• Inteligencia Artificial Gratis—Spanish AI app with 100K+ users

TECH: GPT-5.2, Claude Opus 4.5, Gemini 3.0, iOS/Swift, React, Next.js

For pricing or project discussions, guide them to our contact form or hello@ai4u.space.

Remember: Be conversational, helpful, and brief. Answer like a knowledgeable team member, not a brochure.`

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content || ''

    // Return in format useChat expects for non-streaming
    return new Response(
      JSON.stringify({
        id: response.id,
        role: 'assistant',
        content: content,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
