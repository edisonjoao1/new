import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const contactEmail = process.env.CONTACT_EMAIL || 'hello@ai4u.space'

    // Send confirmation email to the subscriber
    await resend.emails.send({
      from: 'AI 4U Labs <hello@mail.ai4u.space>',
      to: email,
      subject: 'Welcome to AI 4U Labs Newsletter',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="font-size: 24px; font-weight: 300; margin: 0;">AI 4U Labs</h1>
            </div>

            <h2 style="font-size: 20px; font-weight: 400;">Welcome to the Newsletter!</h2>

            <p>Thanks for subscribing to AI 4U Labs. You'll receive:</p>

            <ul style="padding-left: 20px;">
              <li>Weekly AI industry updates and trends</li>
              <li>Case studies and project breakdowns</li>
              <li>Tips for building AI-powered products</li>
              <li>Early access to guides and resources</li>
            </ul>

            <p>We typically send 1-2 emails per month—no spam, just valuable content.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 14px; color: #666;">
                AI 4U Labs<br>
                Naples, Florida<br>
                <a href="https://ai4u.space" style="color: #000;">ai4u.space</a>
              </p>
              <p style="font-size: 12px; color: #999;">
                To unsubscribe, reply to this email with "unsubscribe" in the subject line.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    // Notify the team about new subscriber
    await resend.emails.send({
      from: 'AI 4U Labs <hello@mail.ai4u.space>',
      to: contactEmail,
      subject: `New Newsletter Subscriber: ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
            <h2 style="font-weight: 400;">New Newsletter Subscriber</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscribed:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">Add this email to your newsletter list.</p>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
