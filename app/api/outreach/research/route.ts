import { NextRequest, NextResponse } from 'next/server'
import { CompanyResearchAgent } from '@/lib/outreach/company-research'
import { ProposalGenerator } from '@/lib/outreach/proposal-generator'
import { EmailSender } from '@/lib/outreach/email-sender'

export const maxDuration = 60 // Allow up to 60 seconds for research

export async function POST(req: NextRequest) {
  try {
    const { website, recipientEmail, options } = await req.json()

    if (!website) {
      return NextResponse.json(
        { error: 'Website is required' },
        { status: 400 }
      )
    }

    // Step 1: Research the company
    const researcher = new CompanyResearchAgent()
    const companyInfo = await researcher.research(website)

    // Find emails if not provided
    if (!recipientEmail && companyInfo.contactEmails.length === 0) {
      const emails = await researcher.findEmails(website)
      companyInfo.contactEmails = emails
    }

    // Step 2: Generate personalized proposal
    const generator = new ProposalGenerator()
    const proposal = await generator.generate(companyInfo, options)

    // Step 3: Send email if recipient provided
    let emailResult
    if (recipientEmail) {
      const sender = new EmailSender()
      emailResult = await sender.sendProposal(companyInfo, proposal, recipientEmail)
    }

    return NextResponse.json({
      success: true,
      company: companyInfo,
      proposal,
      email: emailResult,
    })
  } catch (error: any) {
    console.error('Outreach error:', error)
    return NextResponse.json(
      { error: 'Failed to process outreach request', details: error.message },
      { status: 500 }
    )
  }
}

// Batch research endpoint
export async function PUT(req: NextRequest) {
  try {
    const { websites } = await req.json()

    if (!Array.isArray(websites) || websites.length === 0) {
      return NextResponse.json(
        { error: 'Websites array is required' },
        { status: 400 }
      )
    }

    const researcher = new CompanyResearchAgent()
    const results = await researcher.researchBatch(websites)

    return NextResponse.json({
      success: true,
      count: results.length,
      companies: results,
    })
  } catch (error: any) {
    console.error('Batch research error:', error)
    return NextResponse.json(
      { error: 'Failed to process batch research', details: error.message },
      { status: 500 }
    )
  }
}
