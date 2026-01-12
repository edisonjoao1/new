import axios from 'axios'
import * as cheerio from 'cheerio'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface CompanyInfo {
  name: string
  website: string
  industry: string
  description: string
  techStack: string[]
  painPoints: string[]
  opportunities: string[]
  contactEmails: string[]
  socialLinks: {
    linkedin?: string
    twitter?: string
  }
  companySize?: string
  foundedYear?: string
}

export class CompanyResearchAgent {
  /**
   * Main research function - scrapes website and analyzes with AI
   */
  async research(website: string): Promise<CompanyInfo> {
    try {
      // Step 1: Scrape website content
      const websiteData = await this.scrapeWebsite(website)

      // Step 2: Use AI to analyze and extract insights
      const analysis = await this.analyzeWithAI(websiteData, website)

      return analysis
    } catch (error) {
      console.error('Research failed:', error)
      throw error
    }
  }

  /**
   * Scrape company website for content
   */
  private async scrapeWebsite(url: string): Promise<string> {
    try {
      // Ensure proper URL format
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`

      const response = await axios.get(formattedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI4ULabsBot/1.0)',
        },
        timeout: 10000,
      })

      const $ = cheerio.load(response.data)

      // Remove scripts, styles, and non-content elements
      $('script, style, nav, footer, header').remove()

      // Extract key content areas
      const title = $('title').text()
      const metaDescription = $('meta[name="description"]').attr('content') || ''
      const h1 = $('h1').map((_, el) => $(el).text()).get().join(' ')
      const h2 = $('h2').map((_, el) => $(el).text()).get().slice(0, 5).join(' ')
      const mainContent = $('main, article, .content, #content').text().slice(0, 3000)
      const aboutSection = $('section:contains("about"), .about, #about').text().slice(0, 1000)

      // Combine extracted content
      return `
        Title: ${title}
        Description: ${metaDescription}
        Main Heading: ${h1}
        Subheadings: ${h2}
        About: ${aboutSection}
        Content: ${mainContent}
      `.trim()
    } catch (error) {
      console.error('Scraping failed:', error)
      return ''
    }
  }

  /**
   * Use AI to analyze website content and extract structured insights
   */
  private async analyzeWithAI(content: string, website: string): Promise<CompanyInfo> {
    const prompt = `You are an expert business analyst researching companies for AI consulting opportunities.

Analyze the following website content and extract structured information:

Website: ${website}
Content: ${content}

Extract and return a JSON object with:
1. company name
2. industry (be specific: e.g., "Healthcare SaaS", "E-commerce", "Fintech")
3. brief description (2-3 sentences about what they do)
4. tech stack (any technologies mentioned: React, Python, AWS, etc.)
5. pain points (3-5 business challenges they might face that AI could solve)
6. opportunities (3-5 specific AI solutions we could propose)
7. company size estimate (Startup/SMB/Mid-Market/Enterprise based on content)

Focus on identifying:
- Manual processes that could be automated
- Customer service bottlenecks
- Data analysis needs
- Content generation needs
- Integration opportunities
- Scalability challenges

Return ONLY valid JSON, no additional text.`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business intelligence analyst. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const analysisText = response.choices[0]?.message?.content || '{}'
      const analysis = JSON.parse(analysisText)

      return {
        name: analysis.name || 'Unknown Company',
        website,
        industry: analysis.industry || 'Unknown',
        description: analysis.description || '',
        techStack: analysis.tech_stack || analysis.techStack || [],
        painPoints: analysis.pain_points || analysis.painPoints || [],
        opportunities: analysis.opportunities || [],
        contactEmails: [],
        socialLinks: {},
        companySize: analysis.company_size || analysis.companySize,
      }
    } catch (error) {
      console.error('AI analysis failed:', error)

      // Fallback data
      return {
        name: website.replace(/^https?:\/\/(www\.)?/, '').split('.')[0],
        website,
        industry: 'Unknown',
        description: 'Company information pending analysis',
        techStack: [],
        painPoints: [],
        opportunities: [],
        contactEmails: [],
        socialLinks: {},
      }
    }
  }

  /**
   * Find email addresses on a website
   */
  async findEmails(website: string): Promise<string[]> {
    try {
      const formattedUrl = website.startsWith('http') ? website : `https://${website}`
      const response = await axios.get(formattedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI4ULabsBot/1.0)',
        },
        timeout: 10000,
      })

      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const emails: string[] = response.data.match(emailRegex) || []

      // Filter out common false positives and keep unique emails
      return [...new Set(emails)].filter(email =>
        !email.includes('example.com') &&
        !email.includes('test@') &&
        !email.includes('noreply@')
      )
    } catch (error) {
      return []
    }
  }

  /**
   * Batch research multiple companies
   */
  async researchBatch(websites: string[]): Promise<CompanyInfo[]> {
    const results: CompanyInfo[] = []

    for (const website of websites) {
      try {
        const info = await this.research(website)
        results.push(info)

        // Rate limiting - wait 2 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`Failed to research ${website}:`, error)
      }
    }

    return results
  }
}
