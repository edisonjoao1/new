import { Resend } from 'resend'
import { GeneratedProposal } from './proposal-generator'
import { CompanyInfo } from './company-research'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

export interface EmailOptions {
  from?: string
  replyTo?: string
  trackOpens?: boolean
  trackClicks?: boolean
  tags?: string[]
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  sentAt: Date
}

export class EmailSender {
  private fromEmail: string
  private replyTo: string

  constructor(options: EmailOptions = {}) {
    this.fromEmail = options.from || 'Edison @ AI 4U Labs <edison@ai4u.space>'
    this.replyTo = options.replyTo || 'edison@ai4u.space'
  }

  /**
   * Send a personalized proposal email
   */
  async sendProposal(
    company: CompanyInfo,
    proposal: GeneratedProposal,
    recipientEmail: string
  ): Promise<EmailResult> {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key') {
      console.warn('Resend API key not configured - email not sent')
      return {
        success: false,
        error: 'Email service not configured',
        sentAt: new Date(),
      }
    }

    try {
      const htmlBody = this.generateHTMLEmail(proposal, company)

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: recipientEmail,
        replyTo: this.replyTo,
        subject: proposal.subject,
        html: htmlBody,
        text: proposal.body,
        tags: [
          {
            name: 'campaign',
            value: 'outreach',
          },
          {
            name: 'company',
            value: company.name.replace(/\s+/g, '-').toLowerCase(),
          },
          {
            name: 'industry',
            value: company.industry.replace(/\s+/g, '-').toLowerCase(),
          },
        ],
      })

      if (error) {
        console.error('Email send error:', error)
        return {
          success: false,
          error: error.message,
          sentAt: new Date(),
        }
      }

      return {
        success: true,
        messageId: data?.id,
        sentAt: new Date(),
      }
    } catch (error: any) {
      console.error('Email send failed:', error)
      return {
        success: false,
        error: error.message,
        sentAt: new Date(),
      }
    }
  }

  /**
   * Generate HTML email with nice formatting
   */
  private generateHTMLEmail(proposal: GeneratedProposal, company: CompanyInfo): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 18px;
      font-weight: 600;
      color: #667eea;
    }
    .content {
      white-space: pre-wrap;
      font-size: 15px;
    }
    .solutions {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
    }
    .solutions h3 {
      margin-top: 0;
      color: #667eea;
      font-size: 16px;
    }
    .solutions ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .solutions li {
      margin: 8px 0;
    }
    .cta {
      background: #667eea;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #666;
    }
    .signature {
      margin-top: 20px;
      font-size: 14px;
    }
    .signature strong {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">AI 4U Labs</div>
  </div>

  <div class="content">
${proposal.body}
  </div>

  ${proposal.proposedSolutions.length > 0 ? `
  <div class="solutions">
    <h3>Proposed Solutions:</h3>
    <ul>
      ${proposal.proposedSolutions.map(s => `<li>${s}</li>`).join('')}
    </ul>
    <p><strong>Estimated Value:</strong> ${proposal.estimatedValue}</p>
  </div>
  ` : ''}

  <div style="text-align: center;">
    <a href="https://ai4u.space/contact?ref=outreach&company=${encodeURIComponent(company.name)}" class="cta">
      Schedule a Call
    </a>
  </div>

  <div class="signature">
    <p>
      <strong>Edison Espinosa</strong><br>
      Founder, AI 4U Labs<br>
      📧 edison@ai4u.space<br>
      🌐 <a href="https://ai4u.space">ai4u.space</a>
    </p>
  </div>

  <div class="footer">
    <p>
      <strong>AI 4U Labs</strong> • We Build Anything with AI<br>
      10+ Apps Shipped • 1M+ Users • 2-4 Week MVPs
    </p>
    <p style="font-size: 11px; color: #999;">
      You're receiving this because we identified potential AI opportunities for ${company.name}.
      Not interested? <a href="mailto:edison@ai4u.space?subject=Unsubscribe">Let us know</a>.
    </p>
  </div>
</body>
</html>
    `.trim()
  }

  /**
   * Send follow-up email
   */
  async sendFollowUp(
    company: CompanyInfo,
    followUpText: string,
    recipientEmail: string,
    originalMessageId?: string
  ): Promise<EmailResult> {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key') {
      return {
        success: false,
        error: 'Email service not configured',
        sentAt: new Date(),
      }
    }

    try {
      const htmlBody = this.generateFollowUpHTML(followUpText, company)

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: recipientEmail,
        replyTo: this.replyTo,
        subject: `Re: AI Solutions for ${company.name}`,
        html: htmlBody,
        text: followUpText,
        tags: [
          {
            name: 'campaign',
            value: 'follow-up',
          },
          {
            name: 'company',
            value: company.name.replace(/\s+/g, '-').toLowerCase(),
          },
        ],
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          sentAt: new Date(),
        }
      }

      return {
        success: true,
        messageId: data?.id,
        sentAt: new Date(),
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        sentAt: new Date(),
      }
    }
  }

  /**
   * Generate HTML for follow-up email
   */
  private generateFollowUpHTML(content: string, company: CompanyInfo): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .content {
      white-space: pre-wrap;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="content">
${content}
  </div>

  <p style="margin-top: 20px;">
    <strong>Edison Espinosa</strong><br>
    AI 4U Labs<br>
    edison@ai4u.space
  </p>
</body>
</html>
    `.trim()
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key') {
      return false
    }

    try {
      // Send test email to yourself
      const { error } = await resend.emails.send({
        from: this.fromEmail,
        to: this.replyTo,
        subject: 'AI 4U Labs Outreach System - Test Email',
        html: '<p>Your outreach system is configured correctly!</p>',
      })

      return !error
    } catch (error) {
      return false
    }
  }
}
