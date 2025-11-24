import { OpenAI } from 'openai'
import { CompanyInfo } from './company-research'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface ProposalOptions {
  tone?: 'professional' | 'casual' | 'technical'
  length?: 'short' | 'medium' | 'long'
  focusArea?: 'automation' | 'ai-agents' | 'mobile-app' | 'mvp' | 'general'
  callToAction?: 'meeting' | 'call' | 'demo' | 'consultation'
}

export interface GeneratedProposal {
  subject: string
  body: string
  followUp?: string
  proposedSolutions: string[]
  estimatedValue: string
}

export class ProposalGenerator {
  /**
   * Generate a personalized proposal based on company research
   */
  async generate(
    company: CompanyInfo,
    options: ProposalOptions = {}
  ): Promise<GeneratedProposal> {
    const {
      tone = 'professional',
      length = 'medium',
      focusArea = 'general',
      callToAction = 'meeting',
    } = options

    const prompt = this.buildPrompt(company, tone, length, focusArea, callToAction)

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a senior sales consultant at AI 4U Labs, a boutique AI development studio.

Your writing style:
- Direct and value-focused
- Show don't tell (reference our actual work: AP2 protocol, 10+ apps, 1M+ users)
- No generic buzzwords
- Specific solutions, not vague promises
- Professional but conversational

AI 4U Labs background:
- Built 10+ production AI apps with 1M+ users
- Pioneered AP2 payments protocol before Google's announcement
- Ship MVPs in 2-4 weeks ($15-25K fixed price)
- Fastest ship: 6 days from idea to App Store (SheGPT)
- Full-stack: AI agents, mobile apps, payments, multilingual
- Tech: GPT-4o, Claude 3.5, Llama, OpenAI Realtime API
- We actually ship, not just consult`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content || ''
      return this.parseProposal(content, company)
    } catch (error) {
      console.error('Proposal generation failed:', error)
      return this.generateFallbackProposal(company)
    }
  }

  /**
   * Build the prompt for AI proposal generation
   */
  private buildPrompt(
    company: CompanyInfo,
    tone: string,
    length: string,
    focusArea: string,
    callToAction: string
  ): string {
    const lengthGuide = {
      short: '150-200 words',
      medium: '250-300 words',
      long: '350-400 words',
    }

    return `Write a personalized outreach email to ${company.name}.

Company Information:
- Industry: ${company.industry}
- Description: ${company.description}
- Tech Stack: ${company.techStack.join(', ') || 'Unknown'}
- Pain Points: ${company.painPoints.join('; ') || 'General business efficiency'}
- Opportunities: ${company.opportunities.join('; ') || 'AI automation'}
- Company Size: ${company.companySize || 'Unknown'}

Email Requirements:
- Tone: ${tone}
- Length: ${lengthGuide[length as keyof typeof lengthGuide]}
- Focus: ${focusArea}
- CTA: Schedule a ${callToAction}

Structure:
1. Subject line (compelling, specific to their business)
2. Opening (reference something specific about their company)
3. Credibility (1-2 relevant case studies from our portfolio)
4. Value prop (2-3 specific solutions for THEIR pain points)
5. Social proof (mention 10+ apps, 1M+ users, 2-4 week delivery)
6. Clear CTA (${callToAction})

Key Solutions to Consider:
${this.getSolutionSuggestions(company, focusArea)}

Writing Guidelines:
- NO generic templates or buzzwords
- Reference REAL metrics and projects
- Be specific about their industry/challenges
- Show how we solved similar problems
- Keep it conversational, not salesy
- Use "we built" not "we can build"
- Include specific timeline and pricing range if relevant

Return format:
SUBJECT: [subject line]

BODY:
[email body]

SOLUTIONS:
- [solution 1]
- [solution 2]
- [solution 3]

VALUE: [estimated project value or impact]`
  }

  /**
   * Get solution suggestions based on company info
   */
  private getSolutionSuggestions(company: CompanyInfo, focusArea: string): string {
    const solutions: Record<string, string[]> = {
      automation: [
        'AI workflow automation to eliminate manual processes',
        'Document processing with GPT-4 Vision',
        'Customer support automation with AI agents',
      ],
      'ai-agents': [
        'Conversational AI agents for customer interactions',
        'Internal AI assistants for team productivity',
        'Payment automation via conversational interfaces',
      ],
      'mobile-app': [
        'Native iOS app with AI integration',
        'Cross-platform AI-powered mobile experience',
        'Voice AI app with OpenAI Realtime API',
      ],
      mvp: [
        '2-4 week rapid MVP development',
        'Production-ready AI prototype with real users',
        'Validated proof-of-concept with App Store launch',
      ],
      general: [
        'Custom AI application tailored to their workflow',
        'LLM integration (GPT-4, Claude, Llama)',
        'End-to-end AI solution from concept to production',
      ],
    }

    const relevant = solutions[focusArea] || solutions.general
    return relevant.map((s, i) => `${i + 1}. ${s}`).join('\n')
  }

  /**
   * Parse AI response into structured proposal
   */
  private parseProposal(content: string, company: CompanyInfo): GeneratedProposal {
    const lines = content.split('\n')

    let subject = ''
    let body = ''
    let solutions: string[] = []
    let value = ''

    let section = ''

    for (const line of lines) {
      if (line.startsWith('SUBJECT:')) {
        subject = line.replace('SUBJECT:', '').trim()
        section = 'subject'
      } else if (line.startsWith('BODY:')) {
        section = 'body'
      } else if (line.startsWith('SOLUTIONS:')) {
        section = 'solutions'
      } else if (line.startsWith('VALUE:')) {
        value = line.replace('VALUE:', '').trim()
        section = 'value'
      } else if (section === 'body' && line.trim()) {
        body += line + '\n'
      } else if (section === 'solutions' && line.trim().startsWith('-')) {
        solutions.push(line.trim().replace(/^-\s*/, ''))
      }
    }

    // Fallback if parsing fails
    if (!subject || !body) {
      const parts = content.split('\n\n')
      subject = parts[0]?.replace('SUBJECT:', '').trim() || `AI Solutions for ${company.name}`
      body = parts.slice(1).join('\n\n').trim() || content
    }

    return {
      subject,
      body: body.trim(),
      proposedSolutions: solutions.length > 0 ? solutions : company.opportunities.slice(0, 3),
      estimatedValue: value || '$15-50K',
    }
  }

  /**
   * Generate fallback proposal if AI fails
   */
  private generateFallbackProposal(company: CompanyInfo): GeneratedProposal {
    return {
      subject: `AI Solutions for ${company.name}`,
      body: `Hi there,

I noticed ${company.name} is in the ${company.industry} space. We're AI 4U Labs – we've shipped 10+ AI products with 1M+ users.

We recently built:
- Conversational payments system (pioneered AP2 protocol)
- SheGPT: AI assistant (6 days to App Store)
- Spanish-first AI for Latin American market

Based on your industry, we could help with:
${company.opportunities.slice(0, 3).map(o => `- ${o}`).join('\n')}

We ship MVPs in 2-4 weeks, fixed price $15-25K.

Interested in a quick call to explore how AI could streamline your operations?

Best,
Edison
AI 4U Labs
edison@ai4ulabs.com`,
      proposedSolutions: company.opportunities.slice(0, 3),
      estimatedValue: '$15-50K',
    }
  }

  /**
   * Generate follow-up email
   */
  async generateFollowUp(
    company: CompanyInfo,
    previousEmail: string,
    daysElapsed: number
  ): Promise<string> {
    const prompt = `Write a brief follow-up email to ${company.name}.

Context:
- Original email sent ${daysElapsed} days ago
- No response yet
- Original email: ${previousEmail.slice(0, 500)}

Write a short (100-150 words) follow-up that:
1. Acknowledges they're busy
2. Adds ONE new piece of value (case study, insight, or stat)
3. Makes it easy to respond (yes/no question or calendar link)
4. No pressure, just helpful

Tone: Friendly and respectful of their time.`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      return `Hi again,\n\nJust wanted to bump this up in your inbox. Still interested in exploring how AI could help ${company.name}?\n\nNo pressure – just a friendly ping.\n\nBest,\nEdison`
    }
  }
}
