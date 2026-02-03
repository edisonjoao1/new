import { NextResponse } from 'next/server';
import { getState } from '@/lib/command-center';
import OpenAI from 'openai';

// Lazy-load OpenAI client
function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Get date in Eastern timezone
function getTodayET(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await getState();
    const today = getTodayET();

    // Calculate stats for AI context
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const appsThisWeek = state.tracks?.appsShipped?.filter(
      (a) => new Date(a.date) >= weekAgo
    ).length || 0;

    const jobsToday = state.tracks?.jobApplications?.filter(
      (j) => j.date === today
    ).length || 0;

    const jobsThisWeek = state.tracks?.jobApplications?.filter(
      (j) => new Date(j.date) >= weekAgo
    ).length || 0;

    const totalRevenue = Object.values(state.revenue.current).reduce((a, b) => a + b, 0);

    // Build context for AI
    const context = `
EDISON'S CURRENT STATUS:
- Revenue: $${totalRevenue.toFixed(2)} / $10,000 goal (${((totalRevenue / 10000) * 100).toFixed(1)}%)
- Check-in streak: ${state.streaks.current} days (best: ${state.streaks.best})
- Apps shipped this week: ${appsThisWeek} / 7 goal
- Jobs applied today: ${jobsToday} / 100 goal
- Jobs applied this week: ${jobsThisWeek}
- Health streak: ${state.tracks?.healthStreak || 0} days

TODAY'S COMMITMENTS:
- App to ship: ${state.today?.commitments?.app || 'Not set'}
- App shipped: ${state.today?.commitments?.appShipped ? 'Yes' : 'No'}
- Health task: ${state.today?.commitments?.health || 'Not set'}
- Health done: ${state.today?.commitments?.healthDone ? 'Yes' : 'No'}
- Job task: ${state.today?.commitments?.job || 'Not set'}
- Jobs applied: ${state.today?.commitments?.jobCount || 0}
- Marketing: ${state.today?.commitments?.marketing || 'Not set'} (Done: ${state.today?.commitments?.marketingDone ? 'Yes' : 'No'})
- Outreach: ${state.today?.commitments?.outreach || 'Not set'} (Count: ${state.today?.commitments?.outreachCount || 0})
- Client work: ${state.today?.commitments?.clientWork || 'Not set'} (Done: ${state.today?.commitments?.clientWorkDone ? 'Yes' : 'No'})
- Etsy: ${state.today?.commitments?.etsy || 'Not set'} (Done: ${state.today?.commitments?.etsyDone ? 'Yes' : 'No'})

CHECK-INS TODAY:
- Morning: ${state.today?.morningDone ? 'Done' : 'Not done'}
- Midday: ${state.today?.middayDone ? 'Done' : 'Not done'}
- Evening: ${state.today?.eveningDone ? 'Done' : 'Not done'}

CONTEXT:
- Edison has $1k left in the bank
- He needs to help retire his mother
- Goals: Ship 1 app/day with monetization, apply to 100 jobs/day, market products, do outreach, sell AI 4U services, improve Etsy store (228 products)
- He has a macOS accountability app that prompts check-ins
`;

    const response = await getOpenAI().responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: `You are Edison's AI accountability coach. Be direct, no fluff. Your job is to:
1. Analyze his current progress honestly
2. Identify what's blocking him or what he's avoiding
3. Give ONE specific action he should do RIGHT NOW
4. Keep him focused on what moves the needle (revenue, job applications)

Be tough but supportive. He has real financial pressure. Don't sugarcoat, but don't be cruel.
Keep response under 150 words. Use bullet points.`
        },
        {
          role: 'user',
          content: context
        }
      ],
    });

    const analysis = typeof response.output === 'string'
      ? response.output
      : response.output?.[0]?.content?.[0]?.text || 'Unable to generate analysis';

    return NextResponse.json({
      analysis,
      stats: {
        appsThisWeek,
        jobsToday,
        jobsThisWeek,
        totalRevenue,
        streak: state.streaks.current,
        healthStreak: state.tracks?.healthStreak || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI analysis', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    const state = await getState();
    const today = getTodayET();

    // Build context
    const totalRevenue = Object.values(state.revenue.current).reduce((a, b) => a + b, 0);
    const jobsToday = state.tracks?.jobApplications?.filter(
      (j) => j.date === today
    ).length || 0;

    const context = `
Edison's situation: $${totalRevenue} revenue, ${jobsToday}/100 jobs today, ${state.streaks.current} day streak.
Today's commitments: ${JSON.stringify(state.today?.commitments || {})}
His question: ${question}
`;

    const response = await getOpenAI().responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: `You're Edison's AI coach. He's asking for help. Be direct and actionable.
Give specific advice, not generic motivation. Under 100 words.`
        },
        {
          role: 'user',
          content: context
        }
      ],
    });

    const answer = typeof response.output === 'string'
      ? response.output
      : response.output?.[0]?.content?.[0]?.text || 'Unable to answer';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
