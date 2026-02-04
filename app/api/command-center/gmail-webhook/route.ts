import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

// Patterns to match job application confirmation emails
const JOB_PATTERNS = [
  /your application was sent to (.+?)(?:\.|$)/i,
  /application (?:to|for) (.+?) (?:was |has been )?(?:sent|submitted|received)/i,
  /successfully applied to (.+)/i,
  /applied to (.+?) on/i,
  /application.+?submitted.+?(.+?)(?:\.|$)/i,
  /thank you for applying.+?(.+?)(?:\.|$)/i,
  /we received your application.+?(.+?)(?:\.|$)/i,
];

function extractCompany(text: string): string | null {
  for (const pattern of JOB_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Clean up the company name
      let company = match[1].trim();
      // Remove common suffixes
      company = company.replace(/\s*(via|through|on|at)\s+.*$/i, '');
      company = company.replace(/[.,!]$/, '');
      if (company.length > 2 && company.length < 100) {
        return company;
      }
    }
  }
  return null;
}

// POST: Receive email webhook (from Zapier, Make, or direct forwarding)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support multiple webhook formats
    const subject = body.subject || body.Subject || body.email_subject || '';
    const textBody = body.body || body.Body || body.text || body.plain || body.snippet || '';
    const from = body.from || body.From || body.sender || '';
    const timestamp = body.timestamp || body.date || new Date().toISOString();

    // Combine subject and body for pattern matching
    const fullText = `${subject} ${textBody}`;

    // Try to extract company name
    const company = extractCompany(fullText);

    if (!company) {
      console.log('No job application pattern found in:', subject);
      return NextResponse.json({
        success: false,
        message: 'No job application pattern found',
        subject,
      });
    }

    // Check if this looks like a job site confirmation
    const jobSites = ['linkedin', 'indeed', 'greenhouse', 'lever', 'workday', 'glassdoor', 'ziprecruiter', 'monster', 'dice', 'builtin'];
    const fromLower = from.toLowerCase();
    const isFromJobSite = jobSites.some(site => fromLower.includes(site));

    const state = await getState();
    const today = new Date().toISOString().split('T')[0];

    // Check for duplicate
    const isDupe = state.tracks.jobApplications.some(
      (app) => app.date === today && app.company.toLowerCase() === company.toLowerCase()
    );

    if (isDupe) {
      return NextResponse.json({
        success: false,
        message: `Already logged: ${company}`,
      });
    }

    // Determine source
    let source = 'email';
    if (fromLower.includes('linkedin')) source = 'LinkedIn';
    else if (fromLower.includes('indeed')) source = 'Indeed';
    else if (fromLower.includes('greenhouse')) source = 'Greenhouse';
    else if (fromLower.includes('lever')) source = 'Lever';
    else if (fromLower.includes('workday')) source = 'Workday';

    // Add the application
    state.tracks.jobApplications.push({
      date: today,
      company,
      role: 'Unknown', // Could parse this too
      source,
      emailSubject: subject,
      timestamp: new Date().toISOString(),
    });

    // Update today's count
    const todayCount = state.tracks.jobApplications.filter((app) => app.date === today).length;
    if (state.today.date === today) {
      state.today.commitments.jobCount = todayCount;
      if (todayCount >= 100) {
        state.today.commitments.jobDone = true;
      }
    }

    await saveState(state);

    console.log(`Job application logged: ${company} (${source}) - Total today: ${todayCount}`);

    return NextResponse.json({
      success: true,
      company,
      source,
      todayCount,
      message: `Logged: ${company} via ${source}`,
    });
  } catch (error) {
    console.error('Gmail webhook error:', error);
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 });
  }
}

// GET: Test endpoint and show setup instructions
export async function GET() {
  return NextResponse.json({
    status: 'Gmail webhook active',
    usage: 'POST emails to this endpoint with { subject, body, from }',
    patterns: [
      'Edison, your application was sent to [Company]',
      'Application to [Company] was submitted',
      'Successfully applied to [Company]',
      'Thank you for applying to [Company]',
    ],
    setup: {
      zapier: 'Create a Zap: Gmail trigger (new email matching search) -> Webhook POST to this URL',
      make: 'Create a scenario: Gmail watch -> HTTP POST to this URL',
      gmail_filter: 'Forward matching emails to a parsing service that POSTs here',
    },
  });
}
