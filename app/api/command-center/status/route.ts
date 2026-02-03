import { NextResponse } from 'next/server';
import { getState } from '@/lib/command-center';

// Get date in Eastern timezone (Edison's timezone)
function getTodayLA(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const state = await getState();
  const today = getTodayLA();

  const totalRevenue = Object.values(state.revenue.current).reduce((a, b) => a + b, 0);
  const progress = (totalRevenue / state.revenue.goal) * 100;

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = lastDay.getDate() - now.getDate();

  // Apps shipped stats
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const appsThisWeek = state.tracks?.appsShipped?.filter(
    (a) => new Date(a.date) >= weekAgo
  ).length || 0;
  const appsThisMonth = state.tracks?.appsShipped?.filter(
    (a) => new Date(a.date) >= monthStart
  ).length || 0;

  // Jobs today (goal: 100)
  const jobsToday = state.tracks?.jobApplications?.filter(
    (j) => j.date === today
  ).length || 0;
  const jobsThisWeek = state.tracks?.jobApplications?.filter(
    (j) => new Date(j.date) >= weekAgo
  ).length || 0;

  // Marketing stats
  const marketingToday = state.tracks?.marketing?.filter(
    (m) => m.date === today
  ).length || 0;
  const marketingThisWeek = state.tracks?.marketing?.filter(
    (m) => new Date(m.date) >= weekAgo
  ).length || 0;

  // Outreach stats
  const outreachToday = state.tracks?.outreach?.filter(
    (o) => o.date === today
  ).length || 0;
  const outreachThisWeek = state.tracks?.outreach?.filter(
    (o) => new Date(o.date) >= weekAgo
  ).length || 0;

  // Client sales stats
  const clientsThisMonth = state.tracks?.clientSales?.filter(
    (c) => new Date(c.date) >= monthStart
  ).length || 0;

  // Etsy stats
  const etsyToday = state.tracks?.etsy?.filter(
    (e) => e.date === today
  ).length || 0;

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

    // Multi-track accountability
    tracks: {
      appsShipped: {
        thisWeek: appsThisWeek,
        thisMonth: appsThisMonth,
        total: state.tracks?.appsShipped?.length || 0,
        recent: state.tracks?.appsShipped?.slice(-5).reverse() || [],
      },
      healthStreak: state.tracks?.healthStreak || 0,
      jobApplications: {
        today: jobsToday,
        dailyGoal: 100,
        thisWeek: jobsThisWeek,
        total: state.tracks?.jobApplications?.length || 0,
      },
      marketing: {
        today: marketingToday,
        thisWeek: marketingThisWeek,
        total: state.tracks?.marketing?.length || 0,
        recent: state.tracks?.marketing?.slice(-3).reverse() || [],
      },
      outreach: {
        today: outreachToday,
        thisWeek: outreachThisWeek,
        total: state.tracks?.outreach?.length || 0,
      },
      clientSales: {
        thisMonth: clientsThisMonth,
        total: state.tracks?.clientSales?.length || 0,
        recent: state.tracks?.clientSales?.slice(-3).reverse() || [],
      },
      etsy: {
        today: etsyToday,
        total: state.tracks?.etsy?.length || 0,
      },
    },
    dailyCommitments: state.today?.commitments || null,
  });
}
// Triggered redeploy Mon Feb  2 20:42:34 EST 2026
