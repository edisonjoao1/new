import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export async function GET() {
  const state = await getState();
  const today = new Date().toISOString().split('T')[0];

  // Reset if new day
  if (state.today.date !== today) {
    return NextResponse.json({
      date: today,
      commitments: { app: null, health: null, job: null },
      completed: { appShipped: false, healthDone: false, jobDone: false },
    });
  }

  return NextResponse.json({
    date: today,
    commitments: {
      app: state.today.commitments.app,
      health: state.today.commitments.health,
      job: state.today.commitments.job,
    },
    completed: {
      appShipped: state.today.commitments.appShipped,
      healthDone: state.today.commitments.healthDone,
      jobDone: state.today.commitments.jobDone,
    },
  });
}

export async function POST(request: Request) {
  const state = await getState();
  const { app, health, job } = await request.json();
  const today = new Date().toISOString().split('T')[0];

  // Reset today if new day
  if (state.today.date !== today) {
    state.today = {
      date: today,
      priority: app,
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
        jobCount: 0,
        marketing: null,
        marketingDone: false,
        outreach: null,
        outreachCount: 0,
        clientWork: null,
        clientWorkDone: false,
        etsy: null,
        etsyDone: false,
      },
    };
  }

  // Set today's commitments
  state.today.commitments.app = app;
  state.today.commitments.health = health;
  state.today.commitments.job = job;

  await saveState(state);

  return NextResponse.json({
    success: true,
    commitments: state.today.commitments,
  });
}
