import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

// Get date in Eastern timezone (Edison's timezone)
function getTodayLA(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function getYesterdayLA(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export async function GET() {
  const state = await getState();
  return NextResponse.json({ checkIns: state.checkIns });
}

export async function POST(request: Request) {
  const state = await getState();
  const { type, content } = await request.json();
  const today = getTodayLA();

  const checkIn = {
    id: Date.now().toString(),
    type,
    date: today,
    timestamp: new Date().toISOString(),
    content,
  };

  state.checkIns.push(checkIn);

  // Initialize today if new day
  if (state.today.date !== today) {
    state.today = {
      date: today,
      priority: null,
      morningDone: false,
      middayDone: false,
      eveningDone: false,
      commitments: {
        app: null,
        health: null,
        job: null,
        appShipped: false,
        healthDone: false,
        jobDone: false,
      },
    };
  }

  // Ensure commitments object exists
  if (!state.today.commitments) {
    state.today.commitments = {
      app: null,
      health: null,
      job: null,
      appShipped: false,
      healthDone: false,
      jobDone: false,
    };
  }

  if (type === 'morning') {
    state.today.morningDone = true;
    state.today.priority = content.app_commitment || content.q1;
    // Store morning commitments
    state.today.commitments.app = content.app_commitment || null;
    state.today.commitments.health = content.health_commitment || null;
    state.today.commitments.job = content.job_commitment || null;
  } else if (type === 'midday') {
    state.today.middayDone = true;
  } else if (type === 'evening') {
    state.today.eveningDone = true;

    // Check if they shipped the app
    const appAnswer = (content.app_shipped || '').toLowerCase();
    if (appAnswer.includes('yes')) {
      state.today.commitments.appShipped = true;
    }

    // Check health completion
    const healthAnswer = (content.health_done || '').toLowerCase();
    if (healthAnswer.includes('yes')) {
      state.today.commitments.healthDone = true;
      // Update health streak
      if (state.tracks) {
        state.tracks.healthStreak = (state.tracks.healthStreak || 0) + 1;
      }
    }

    // Check job completion
    const jobAnswer = (content.job_done || '').toLowerCase();
    if (jobAnswer.includes('yes') || jobAnswer.length > 10) {
      state.today.commitments.jobDone = true;
    }

    // Update check-in streak
    const lastCheckIn = state.streaks.lastCheckIn;
    const yesterday = getYesterdayLA();

    if (!lastCheckIn || lastCheckIn === yesterday || lastCheckIn === today) {
      state.streaks.current = lastCheckIn === today ? state.streaks.current : state.streaks.current + 1;
    } else {
      state.streaks.missedDates.push(lastCheckIn);
      state.streaks.current = 1;
    }

    state.streaks.lastCheckIn = today;
    if (state.streaks.current > state.streaks.best) {
      state.streaks.best = state.streaks.current;
    }
  }

  await saveState(state);
  return NextResponse.json({ success: true, checkIn, streaks: state.streaks, today: state.today });
}
