import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export async function GET() {
  const state = await getState();

  // Get apps shipped this week
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeek = state.tracks.appsShipped.filter(
    (a) => new Date(a.date) >= weekAgo
  );
  const thisMonth = state.tracks.appsShipped.filter(
    (a) => new Date(a.date) >= monthAgo
  );

  return NextResponse.json({
    thisWeek: thisWeek.length,
    thisMonth: thisMonth.length,
    total: state.tracks.appsShipped.length,
    recent: state.tracks.appsShipped.slice(-10).reverse(),
    weeklyGoal: 7, // 1 app per day
    monthlyGoal: 30,
  });
}

export async function POST(request: Request) {
  const state = await getState();
  const { name, link } = await request.json();
  const today = new Date().toISOString().split('T')[0];

  // Add to shipped apps
  state.tracks.appsShipped.push({
    date: today,
    name: name || 'Unnamed App',
    link: link || undefined,
  });

  // Mark today's app as shipped
  if (state.today.commitments) {
    state.today.commitments.appShipped = true;
  }

  await saveState(state);

  return NextResponse.json({
    success: true,
    totalShipped: state.tracks.appsShipped.length,
    message: `App "${name}" logged! Keep shipping!`,
  });
}
