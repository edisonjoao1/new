import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

const RESCUETIME_API_KEY = process.env.RESCUETIME_API_KEY;

export async function GET() {
  // Get live desktop data first (always available)
  let liveDesktop = null;
  try {
    const state = await getState();
    liveDesktop = state.liveDesktop || null;
  } catch (e) {
    console.error('Failed to get live desktop:', e);
  }

  if (!RESCUETIME_API_KEY) {
    return NextResponse.json({ liveDesktop, error: 'RescueTime API key not configured' });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    // Fetch today's activity by productivity level
    const [productivityRes, summaryRes, activitiesRes] = await Promise.all([
      // Productivity breakdown for today
      fetch(
        `https://www.rescuetime.com/anapi/data?key=${RESCUETIME_API_KEY}&perspective=interval&restrict_kind=productivity&interval=hour&restrict_begin=${today}&restrict_end=${today}&format=json`
      ),
      // Daily summary (last 14 days)
      fetch(
        `https://www.rescuetime.com/anapi/daily_summary_feed?key=${RESCUETIME_API_KEY}`
      ),
      // Top activities today
      fetch(
        `https://www.rescuetime.com/anapi/data?key=${RESCUETIME_API_KEY}&perspective=rank&restrict_kind=activity&restrict_begin=${today}&restrict_end=${today}&format=json`
      ),
    ]);

    const productivity = await productivityRes.json();
    const summaries = await summaryRes.json();
    const activities = await activitiesRes.json();

    // Get today's summary if available
    const todaySummary = summaries.find((s: any) => s.date === today) || summaries[0];

    // Process productivity data
    // Row format: [Date, Time Spent (seconds), Number of People, Productivity]
    // Productivity: -2 (very distracting), -1 (distracting), 0 (neutral), 1 (productive), 2 (very productive)
    let veryProductive = 0;
    let productive = 0;
    let neutral = 0;
    let distracting = 0;
    let veryDistracting = 0;

    if (productivity.rows) {
      productivity.rows.forEach((row: any[]) => {
        const seconds = row[1];
        const level = row[3];
        switch (level) {
          case 2: veryProductive += seconds; break;
          case 1: productive += seconds; break;
          case 0: neutral += seconds; break;
          case -1: distracting += seconds; break;
          case -2: veryDistracting += seconds; break;
        }
      });
    }

    const totalSeconds = veryProductive + productive + neutral + distracting + veryDistracting;
    const productiveSeconds = veryProductive + productive;
    const distractingSeconds = distracting + veryDistracting;

    // Process top activities
    // Row format: [Rank, Time Spent (seconds), Number of People, Activity, Category, Productivity]
    const topActivities = (activities.rows || []).slice(0, 10).map((row: any[]) => ({
      name: row[3],
      category: row[4],
      seconds: row[1],
      productivity: row[5],
      formatted: formatTime(row[1]),
    }));

    // Find most distracting apps today
    const distractingApps = topActivities.filter((a: any) => a.productivity < 0);

    return NextResponse.json({
      today: {
        totalTime: formatTime(totalSeconds),
        totalSeconds,
        productiveTime: formatTime(productiveSeconds),
        productiveSeconds,
        distractingTime: formatTime(distractingSeconds),
        distractingSeconds,
        productivityScore: totalSeconds > 0
          ? Math.round((productiveSeconds / totalSeconds) * 100)
          : 0,
        breakdown: {
          veryProductive: formatTime(veryProductive),
          productive: formatTime(productive),
          neutral: formatTime(neutral),
          distracting: formatTime(distracting),
          veryDistracting: formatTime(veryDistracting),
        },
      },
      topActivities,
      distractingApps,
      summary: todaySummary ? {
        productivityPulse: todaySummary.productivity_pulse,
        totalHours: todaySummary.total_hours,
        productivePercentage: todaySummary.all_productive_percentage,
        distractingPercentage: todaySummary.all_distracting_percentage,
        topCategories: {
          softwareDev: todaySummary.software_development_hours,
          communication: todaySummary.communication_and_scheduling_hours,
          socialNetworking: todaySummary.social_networking_hours,
          entertainment: todaySummary.entertainment_hours,
        },
      } : null,
      recentDays: summaries.slice(0, 7).map((s: any) => ({
        date: s.date,
        pulse: s.productivity_pulse,
        totalHours: s.total_hours,
        productivePercentage: s.all_productive_percentage,
      })),
      liveDesktop,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('RescueTime API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RescueTime data' },
      { status: 500 }
    );
  }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// POST: Receive live desktop activity from Mac script
export async function POST(request: Request) {
  try {
    const desktop = await request.json();
    desktop.lastUpdated = new Date().toISOString();

    const state = await getState();
    state.liveDesktop = desktop;
    await saveState(state);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Desktop activity POST error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
