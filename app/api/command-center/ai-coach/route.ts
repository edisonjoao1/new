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

    // Get today's check-ins to compare commitment vs results
    const todayCheckIns = state.checkIns.filter(c => c.date === today);
    const morningCheckIn = todayCheckIns.find(c => c.type === 'morning');
    const eveningCheckIn = todayCheckIns.find(c => c.type === 'evening');

    // Get recent days' track record (last 7 days)
    const recentDays = [...new Set(state.checkIns.map(c => c.date))]
      .filter(d => d !== today)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 7);

    const trackRecord = recentDays.map(date => {
      const dayCheckIns = state.checkIns.filter(c => c.date === date);
      const morning = dayCheckIns.find(c => c.type === 'morning');
      const evening = dayCheckIns.find(c => c.type === 'evening');
      const appPromised = morning?.content?.app_commitment || 'none';
      const appDelivered = evening?.content?.app_shipped || 'no check-in';
      const shipped = appDelivered.toLowerCase().includes('yes');
      return `${date}: Promised "${appPromised}" → ${shipped ? '✓ SHIPPED' : '✗ NOT shipped'} (${appDelivered})`;
    }).join('\n');

    // Build context for AI
    const context = `
EDISON'S CURRENT STATUS:
- Revenue: $${totalRevenue.toFixed(2)} / $10,000 goal (${((totalRevenue / 10000) * 100).toFixed(1)}%)
- Check-in streak: ${state.streaks.current} days (best: ${state.streaks.best})
- Apps shipped this week: ${appsThisWeek} / 7 goal
- Jobs applied today: ${jobsToday} / 100 goal
- Jobs applied this week: ${jobsThisWeek}
- Health streak: ${state.tracks?.healthStreak || 0} days

TODAY'S MORNING COMMITMENT:
${morningCheckIn ? `
- App to ship: ${morningCheckIn.content?.app_commitment || 'Not set'}
- Health: ${morningCheckIn.content?.health_commitment || 'Not set'}
- Jobs goal: ${morningCheckIn.content?.job_commitment || 'Not set'}
- Marketing: ${morningCheckIn.content?.marketing_commitment || 'Not set'}
- Outreach: ${morningCheckIn.content?.outreach_commitment || 'Not set'}
- Client work: ${morningCheckIn.content?.client_commitment || 'Not set'}
- Etsy: ${morningCheckIn.content?.etsy_commitment || 'Not set'}
` : 'No morning check-in yet today!'}

TODAY'S EVENING RESULT:
${eveningCheckIn ? `
- App shipped: ${eveningCheckIn.content?.app_shipped || 'Not answered'}
- Health done: ${eveningCheckIn.content?.health_done || 'Not answered'}
- Jobs applied: ${eveningCheckIn.content?.job_count || 'Not answered'}
- Marketing done: ${eveningCheckIn.content?.marketing_done || 'Not answered'}
- Outreach count: ${eveningCheckIn.content?.outreach_count || 'Not answered'}
- Client work done: ${eveningCheckIn.content?.client_done || 'Not answered'}
- Etsy done: ${eveningCheckIn.content?.etsy_done || 'Not answered'}
` : 'No evening check-in yet today (still time to deliver!)'}

DESKTOP ACTIVITY (what he was doing during check-ins):
${todayCheckIns.map(c => {
  const currentApp = c.content?.current_app || '';
  const xcodeProjects = c.content?.xcode_projects || '';
  const vscodeProjects = c.content?.vscode_projects || '';
  const terminalSessions = c.content?.terminal_sessions || '';
  const browserTabs = c.content?.browser_tabs || '';
  const openApps = c.content?.open_apps || '';

  if (!currentApp && !openApps) return null;

  let details = `[${c.type.toUpperCase()}] Focus: ${currentApp || 'unknown'}`;
  if (xcodeProjects) details += `\\n  Xcode: ${xcodeProjects}`;
  if (vscodeProjects) details += `\\n  VS Code: ${vscodeProjects}`;
  if (terminalSessions) details += `\\n  Terminal: ${terminalSessions}`;
  if (browserTabs) {
    // Identify productive vs distraction tabs
    const tabs = browserTabs.split(' | ');
    const productive = tabs.filter((t: string) => /job|linkedin|indeed|github|greenhouse|lever|workday/i.test(t));
    const distraction = tabs.filter((t: string) => /youtube|twitter|reddit|netflix|twitch|instagram|tiktok|facebook/i.test(t));
    if (productive.length > 0) details += `\\n  Productive tabs: ${productive.join(', ')}`;
    if (distraction.length > 0) details += `\\n  ⚠️ DISTRACTION TABS: ${distraction.join(', ')}`;
  }
  details += `\\n  Open apps: ${openApps}`;
  return details;
}).filter(Boolean).join('\\n\\n') || 'No activity data yet'}

RECENT TRACK RECORD (Did he ship what he promised?):
${trackRecord || 'No historical data yet'}

CONTEXT:
- Edison has $1k left in the bank
- He needs to help retire his mother
- Goals: Ship 1 app/day with monetization, apply to 100 jobs/day, market products, do outreach, sell AI 4U services, improve Etsy store (228 products)
- He has a macOS accountability app that prompts check-ins
- IMPORTANT: Call out if he's not delivering on his commitments!
`;

    const response = await getOpenAI().responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: `You are Edison's AI accountability coach. Be direct, no fluff. Your job is to:
1. Compare his MORNING COMMITMENTS to EVENING RESULTS - did he deliver?
2. Look at his TRACK RECORD - is he consistently failing to ship what he promises?
3. Check DESKTOP ACTIVITY - is he using productive apps (Xcode, VS Code, Chrome for job apps) or wasting time?
4. Identify patterns of avoidance or excuse-making
5. Give ONE specific action he should do RIGHT NOW
6. Keep him focused on what moves the needle (revenue, job applications)

CRITICAL: If he promised to ship an app and didn't, CALL HIM OUT. If he's consistently not delivering, point out the pattern. If desktop activity shows distraction apps, mention it.

Be tough but supportive. He has real financial pressure. Don't sugarcoat, but don't be cruel.
Keep response under 150 words. Use bullet points.`
        },
        {
          role: 'user',
          content: context
        }
      ],
    });

    // Extract text from response - use type assertion for OpenAI response format
    let analysis = 'Unable to generate analysis';
    if (typeof response.output === 'string') {
      analysis = response.output;
    } else if (Array.isArray(response.output) && response.output.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstOutput = response.output[0] as any;
      if (firstOutput?.content?.[0]?.text) {
        analysis = firstOutput.content[0].text;
      }
    }

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

    // Extract text from response - use type assertion for OpenAI response format
    let answer = 'Unable to answer';
    if (typeof response.output === 'string') {
      answer = response.output;
    } else if (Array.isArray(response.output) && response.output.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstOutput = response.output[0] as any;
      if (firstOutput?.content?.[0]?.text) {
        answer = firstOutput.content[0].text;
      }
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
