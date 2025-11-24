import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build')

const ideaSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  idea: z.string().min(20, 'Please provide more details about your idea'),
  budget: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = ideaSchema.parse(body)

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const emailHtml = `
      <h2>New Project Idea Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
      ${validatedData.budget ? `<p><strong>Budget Range:</strong> ${validatedData.budget}</p>` : ''}
      <p><strong>Project Idea:</strong></p>
      <p>${validatedData.idea.replace(/\n/g, '<br>')}</p>
    `

    const { data, error } = await resend.emails.send({
      from: 'AI 4U Labs <noreply@ai4ulabs.com>',
      to: [process.env.CONTACT_EMAIL || 'edison@ai4ulabs.com'],
      replyTo: validatedData.email,
      subject: `New Project Idea: ${validatedData.name}${validatedData.company ? ` from ${validatedData.company}` : ''}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Idea submitted successfully', data },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Idea API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
