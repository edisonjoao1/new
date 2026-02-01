import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export async function GET() {
  const state = await getState();
  return NextResponse.json({ checkIns: state.checkIns });
}

export async function POST(request: Request) {
  const state = await getState();
  const { type, content } = await request.json();
  const today = new Date().toISOString().split('T')[0];

  const checkIn = {
    id: Date.now().toString(),
    type,
    date: today,
    timestamp: new Date().toISOString(),
    content,
  };

  state.checkIns.push(checkIn);

  // Update today's state
  if (state.today.date !== today) {
    state.today = {
      date: today,
      priority: null,
      morningDone: false,
      middayDone: false,
      eveningDone: false,
    };
  }

  if (type === 'morning') {
    state.today.morningDone = true;
    state.today.priority = content.q1 || content.priority;
  } else if (type === 'midday') {
    state.today.middayDone = true;
  } else if (type === 'evening') {
    state.today.eveningDone = true;

    const lastCheckIn = state.streaks.lastCheckIn;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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
  return NextResponse.json({ success: true, checkIn, streaks: state.streaks });
}
