import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

// Universal logging endpoint for quick entries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    const state = await getState();
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    let message = '';

    switch (type) {
      case 'subscription':
      case 'revenue': {
        // Log new subscription/revenue
        const { app, amount, source } = data;
        const amountNum = parseFloat(amount) || 0;

        // Update revenue
        if (app === 'frenchAI' || app === 'french') {
          state.revenue.current.frenchAI += amountNum;
        } else if (app === 'spanishAI' || app === 'spanish') {
          state.revenue.current.spanishAI += amountNum;
        } else {
          state.revenue.current.otherApps += amountNum;
        }

        message = `+$${amountNum} from ${app || source || 'unknown'}`;
        break;
      }

      case 'job': {
        // Log job application
        const { company, role, source } = data;
        const isDupe = state.tracks.jobApplications.some(
          (app) => app.date === today && app.company?.toLowerCase() === company?.toLowerCase()
        );
        if (!isDupe) {
          state.tracks.jobApplications.push({
            date: today,
            company: company || 'Unknown',
            role: role || 'Unknown',
            source: source || 'manual',
            timestamp,
          });
          const todayCount = state.tracks.jobApplications.filter((a) => a.date === today).length;
          if (state.today.date === today) {
            state.today.commitments.jobCount = todayCount;
          }
          message = `Job logged: ${company} (${todayCount} today)`;
        } else {
          message = `Already logged: ${company}`;
        }
        break;
      }

      case 'app': {
        // Log app shipped
        const { name, link } = data;
        state.tracks.appsShipped.push({ date: today, name, link });
        if (state.today.date === today) {
          state.today.commitments.appShipped = true;
        }
        message = `App shipped: ${name}`;
        break;
      }

      case 'marketing': {
        // Log marketing action
        const { platform, description } = data;
        state.tracks.marketing.push({ date: today, platform, description });
        if (state.today.date === today) {
          state.today.commitments.marketingDone = true;
        }
        message = `Marketing: ${platform}`;
        break;
      }

      case 'outreach': {
        // Log outreach
        const { person, channel, count } = data;
        const outreachCount = parseInt(count) || 1;
        for (let i = 0; i < outreachCount; i++) {
          state.tracks.outreach.push({ date: today, person: person || 'various', channel: channel || 'unknown' });
        }
        if (state.today.date === today) {
          state.today.commitments.outreachCount = (state.today.commitments.outreachCount || 0) + outreachCount;
        }
        message = `Outreach: ${outreachCount} people`;
        break;
      }

      case 'client': {
        // Log client sale/work
        const { client, status, value } = data;
        state.tracks.clientSales.push({ date: today, client, status, value: parseFloat(value) || undefined });
        if (state.today.date === today) {
          state.today.commitments.clientWorkDone = true;
        }
        message = `Client: ${client} (${status})`;
        break;
      }

      case 'etsy': {
        // Log Etsy action
        const { action, count } = data;
        state.tracks.etsy.push({ date: today, action, count: parseInt(count) || undefined });
        if (state.today.date === today) {
          state.today.commitments.etsyDone = true;
        }
        message = `Etsy: ${action}`;
        break;
      }

      case 'health': {
        // Log health done
        if (state.today.date === today) {
          state.today.commitments.healthDone = true;
        }
        state.tracks.healthStreak += 1;
        message = `Health done! Streak: ${state.tracks.healthStreak}`;
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
    }

    await saveState(state);

    // Calculate new totals
    const totalRevenue = state.revenue.current.frenchAI + state.revenue.current.spanishAI + state.revenue.current.otherApps;
    const jobsToday = state.tracks.jobApplications.filter((a) => a.date === today).length;

    return NextResponse.json({
      success: true,
      message,
      totals: {
        revenue: totalRevenue,
        jobsToday,
        appsThisWeek: state.tracks.appsShipped.length,
      },
    });
  } catch (error) {
    console.error('Log error:', error);
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}

// GET: Show usage
export async function GET() {
  return NextResponse.json({
    usage: 'POST with { type, ...data }',
    types: {
      subscription: '{ type: "subscription", app: "frenchAI", amount: 3.99 }',
      job: '{ type: "job", company: "Google", role: "Engineer", source: "LinkedIn" }',
      app: '{ type: "app", name: "MyApp", link: "https://..." }',
      marketing: '{ type: "marketing", platform: "Twitter", description: "Posted launch" }',
      outreach: '{ type: "outreach", person: "John", channel: "LinkedIn", count: 5 }',
      client: '{ type: "client", client: "Acme", status: "closed", value: 5000 }',
      etsy: '{ type: "etsy", action: "listed products", count: 10 }',
      health: '{ type: "health" }',
    },
    shortcut: 'curl -X POST https://ai4u.space/api/command-center/log -H "Content-Type: application/json" -d \'{"type":"subscription","app":"frenchAI","amount":3.99}\'',
  });
}
