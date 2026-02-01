import { NextResponse } from 'next/server';
import { getState, saveState, DREAM } from '@/lib/command-center';

export async function GET() {
  const state = await getState();
  const hour = new Date().getHours();
  const totalRevenue = Object.values(state.revenue.current).reduce((a, b) => a + b, 0);
  const progress = (totalRevenue / DREAM.monthlyTarget) * 100;

  let energy = 'medium';
  let timeContext = '';
  if (hour >= 5 && hour < 12) {
    energy = 'high';
    timeContext = 'Peak hours. This is when you do your best work.';
  } else if (hour >= 12 && hour < 14) {
    energy = 'medium';
    timeContext = 'Post-lunch dip. Do focused work, avoid new complex problems.';
  } else if (hour >= 14 && hour < 18) {
    energy = 'medium';
    timeContext = 'Afternoon push. Finish what you started this morning.';
  } else if (hour >= 18 && hour < 21) {
    energy = 'low';
    timeContext = 'Evening wind-down. Light tasks only.';
  } else {
    energy = 'rest';
    timeContext = 'Rest time. Sleep is part of productivity.';
  }

  let priority = '';
  let action = '';

  if (state.apps.spanishAI?.status === 'pending_review') {
    priority = 'Spanish AI is waiting on Apple. Focus on what you can control.';
    action = 'Improve French AI conversion or prepare Spanish AI marketing.';
  } else if (totalRevenue < 100) {
    priority = 'Get to $100/month first. One step at a time.';
    action = 'Focus on converting free users to paid. What feature would make them pay?';
  } else {
    priority = "Scale what's working.";
    action = 'Double down on your best-performing app.';
  }

  const today = new Date().toISOString().split('T')[0];
  const todayCommitment = state.commitments.find((c) => c.date === today && c.status === 'active');

  return NextResponse.json({
    dream: DREAM,
    revenue: {
      current: totalRevenue,
      goal: DREAM.monthlyTarget,
      progress: progress.toFixed(2),
    },
    time: { hour, energy, context: timeContext },
    directive: {
      priority,
      action,
      commitment: todayCommitment?.text || null,
    },
    streaks: state.streaks,
    today: state.today,
  });
}

export async function POST(request: Request) {
  const state = await getState();
  const { revenue, apps } = await request.json();

  if (revenue) {
    Object.assign(state.revenue.current, revenue);
  }
  if (apps) {
    Object.assign(state.apps, apps);
  }

  await saveState(state);
  return NextResponse.json({ success: true });
}
