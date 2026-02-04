import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

// GET: Get today's job application count and history
export async function GET() {
  try {
    const state = await getState();
    const today = new Date().toISOString().split('T')[0];

    // Count today's applications
    const todayApps = state.tracks.jobApplications.filter(
      (app) => app.date === today
    );

    return NextResponse.json({
      today: todayApps.length,
      goal: 100,
      progress: Math.round((todayApps.length / 100) * 100),
      applications: todayApps,
      total: state.tracks.jobApplications.length,
    });
  } catch (error) {
    console.error('Job tracker GET error:', error);
    return NextResponse.json({ error: 'Failed to get job data' }, { status: 500 });
  }
}

// POST: Log a new job application (manual or from Gmail)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, role, source, emailSubject } = body;

    const state = await getState();
    const today = new Date().toISOString().split('T')[0];

    // Check for duplicate (same company same day)
    const isDupe = state.tracks.jobApplications.some(
      (app) => app.date === today && app.company.toLowerCase() === company?.toLowerCase()
    );

    if (isDupe) {
      return NextResponse.json({ success: false, message: 'Already logged today' });
    }

    // Add the application
    state.tracks.jobApplications.push({
      date: today,
      company: company || 'Unknown',
      role: role || 'Unknown',
      source: source || 'manual',
      emailSubject: emailSubject || null,
      timestamp: new Date().toISOString(),
    });

    // Update today's job count in commitments
    const todayCount = state.tracks.jobApplications.filter((app) => app.date === today).length;
    if (state.today.date === today) {
      state.today.commitments.jobCount = todayCount;
      if (todayCount >= 100) {
        state.today.commitments.jobDone = true;
      }
    }

    await saveState(state);

    return NextResponse.json({
      success: true,
      todayCount,
      message: `Logged: ${company}`,
    });
  } catch (error) {
    console.error('Job tracker POST error:', error);
    return NextResponse.json({ error: 'Failed to log application' }, { status: 500 });
  }
}
