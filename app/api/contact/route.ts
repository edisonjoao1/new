import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build')

// Use verified Resend domain for sending
const FROM_EMAIL = 'AI 4U Labs <hello@mail.ai4u.space>'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  categories: z.array(z.string()).optional(),
})

// Map category IDs to readable labels
const categoryLabels: Record<string, string> = {
  'chat-ai': 'Chat & Conversation AI',
  'video-analysis': 'Video & Image Analysis',
  'voice-ai': 'Voice AI & Audio',
  analytics: 'Analytics & BI',
  'mobile-app': 'Mobile AI App',
  'media-analysis': 'Media & Content AI',
  fintech: 'Payments & Fintech',
  multilingual: 'Multi-language AI',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = contactSchema.parse(body)

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Format categories as readable list
    const selectedCategories = validatedData.categories
      ?.map((cat) => categoryLabels[cat] || cat)
      .join(', ')

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
      ${selectedCategories ? `<p><strong>Interested in:</strong> ${selectedCategories}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
    `

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [process.env.CONTACT_EMAIL || 'edison@ai4u.space'],
      replyTo: validatedData.email,
      subject: `New Contact: ${validatedData.name}${validatedData.company ? ` from ${validatedData.company}` : ''}`,
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
      { success: true, message: 'Email sent successfully', data },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
