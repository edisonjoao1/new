import { NextResponse } from 'next/server';
import { getState } from '@/lib/command-center';

export async function GET() {
  const state = await getState();
  const today = new Date().toISOString().split('T')[0];

  const totalRevenue = Object.values(state.revenue.current).reduce((a, b) => a + b, 0);
  const progress = (totalRevenue / state.revenue.goal) * 100;

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = lastDay.getDate() - now.getDate();

  const recentCheckIns = state.checkIns
    .filter((c) => c.date === today)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({
    revenue: {
      current: totalRevenue,
      goal: state.revenue.goal,
      progress: progress.toFixed(2),
      breakdown: state.revenue.current,
    },
    apps: state.apps,
    streaks: state.streaks,
    today: state.today,
    daysLeft,
    recentCheckIns,
    totalCheckIns: state.checkIns.length,
  });
}
