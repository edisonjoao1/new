import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to get stats for a date range
function getStatsForRange(state: any, startDate: Date, endDate: Date) {
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const jobApps = state.tracks.jobApplications.filter(
    (app: any) => app.date >= start && app.date <= end
  );

  const appsShipped = state.tracks.appsShipped.filter(
    (app: any) => app.date >= start && app.date <= end
  );

  const marketing = state.tracks.marketing.filter(
    (m: any) => m.date >= start && m.date <= end
  );

  const outreach = state.tracks.outreach.filter(
    (o: any) => o.date >= start && o.date <= end
  );

  const checkIns = state.checkIns.filter(
    (c: any) => c.date >= start && c.date <= end
  );

  return {
    jobApplications: jobApps.length,
    jobsBySource: groupBy(jobApps, 'source'),
    appsShipped: appsShipped.length,
    appsList: appsShipped.map((a: any) => a.name),
    marketingActions: marketing.length,
    outreachCount: outreach.length,
    checkIns: checkIns.length,
    checkInsByType: {
      morning: checkIns.filter((c: any) => c.type === 'morning').length,
      midday: checkIns.filter((c: any) => c.type === 'midday').length,
      evening: checkIns.filter((c: any) => c.type === 'evening').length,
    },
  };
}

function groupBy(arr: any[], key: string) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function generateReportHTML(stats: any, streak: number, weekStart: string, weekEnd: string) {
  const jobGoal = 700; // 100/day * 7 days
  const jobProgress = Math.round((stats.jobApplications / jobGoal) * 100);

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
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f8f9fa;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #10b981;
      margin-top: 0;
      font-size: 24px;
    }
    .date-range {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .progress-bar {
      background: #e5e7eb;
      border-radius: 999px;
      height: 12px;
      margin: 10px 0;
      overflow: hidden;
    }
    .progress-fill {
      background: linear-gradient(90deg, #10b981, #059669);
      height: 100%;
      border-radius: 999px;
      transition: width 0.3s;
    }
    .section {
      margin: 25px 0;
      padding: 15px;
      background: #f0fdf4;
      border-radius: 8px;
      border-left: 4px solid #10b981;
    }
    .section-title {
      font-weight: 600;
      color: #059669;
      margin-bottom: 10px;
    }
    .streak-badge {
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 8px 16px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 14px;
    }
    .checkin-dots {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .checkin-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .dot-done { background: #10b981; color: white; }
    .dot-missed { background: #ef4444; color: white; }
    .dot-partial { background: #f59e0b; color: white; }
    ul { padding-left: 20px; margin: 10px 0; }
    li { margin: 5px 0; }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .cta {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Weekly Progress Report</h1>
    <div class="date-range">${weekStart} - ${weekEnd}</div>

    <div style="text-align: center; margin: 20px 0;">
      <div class="streak-badge">🔥 ${streak} Day Streak</div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.jobApplications}</div>
        <div class="stat-label">Job Applications</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.appsShipped}</div>
        <div class="stat-label">Apps Shipped</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.marketingActions}</div>
        <div class="stat-label">Marketing Actions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.outreachCount}</div>
        <div class="stat-label">Outreach</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📋 Job Applications Progress</div>
      <div style="display: flex; justify-content: space-between; font-size: 14px;">
        <span>${stats.jobApplications} / ${jobGoal} weekly goal</span>
        <span>${jobProgress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(jobProgress, 100)}%"></div>
      </div>
      ${Object.keys(stats.jobsBySource).length > 0 ? `
      <div style="font-size: 13px; color: #666; margin-top: 10px;">
        Sources: ${Object.entries(stats.jobsBySource).map(([k, v]) => `${k}: ${v}`).join(' · ')}
      </div>
      ` : ''}
    </div>

    ${stats.appsList.length > 0 ? `
    <div class="section">
      <div class="section-title">🚀 Apps Shipped This Week</div>
      <ul>
        ${stats.appsList.map((app: string) => `<li>${app}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div class="section">
      <div class="section-title">✅ Check-ins This Week</div>
      <div style="font-size: 14px;">
        Morning: ${stats.checkInsByType.morning}/7 ·
        Midday: ${stats.checkInsByType.midday}/7 ·
        Evening: ${stats.checkInsByType.evening}/7
      </div>
      <div style="font-size: 13px; color: #666; margin-top: 5px;">
        Total: ${stats.checkIns}/21 check-ins (${Math.round((stats.checkIns / 21) * 100)}%)
      </div>
    </div>

    <div style="text-align: center;">
      <a href="https://ai4u.space/command-center" class="cta">View Full Dashboard →</a>
    </div>

    <div class="footer">
      <p>Keep pushing. Mom's counting on you. 💪</p>
      <p style="font-size: 11px; color: #999;">
        This is your automated weekly report from Edison Command Center.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// GET: Trigger weekly report (can be called by cron)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Simple auth for cron jobs
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const state = await getState();

    // Calculate week range (Sunday to Saturday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek - 7); // Last Sunday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Last Saturday

    const stats = getStatsForRange(state, weekStart, weekEnd);
    const streak = state.streaks.current;

    const weekStartStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const weekEndStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const html = generateReportHTML(stats, streak, weekStartStr, weekEndStr);

    // Send email
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Resend API key not configured',
        preview: { stats, streak },
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Edison Command Center <edison@ai4u.space>',
      to: 'edison@ai4u.space',
      subject: `📊 Weekly Report: ${stats.jobApplications} jobs, ${stats.appsShipped} apps shipped`,
      html,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      stats,
      weekRange: `${weekStartStr} - ${weekEndStr}`,
    });
  } catch (error) {
    console.error('Weekly report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

// POST: Send report now (manual trigger)
export async function POST() {
  // Reuse GET logic
  const url = new URL('http://localhost/api/command-center/weekly-report');
  url.searchParams.set('secret', process.env.CRON_SECRET || 'manual');
  const request = new Request(url);
  return GET(request);
}
