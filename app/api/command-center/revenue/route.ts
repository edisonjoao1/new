import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

// GET current revenue
export async function GET() {
  const state = await getState();
  const total = state.revenue.current.frenchAI + state.revenue.current.spanishAI + state.revenue.current.otherApps;

  return NextResponse.json({
    current: state.revenue.current,
    total,
    goal: state.revenue.goal,
    progress: ((total / state.revenue.goal) * 100).toFixed(2) + '%',
  });
}

// POST to update revenue
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { frenchAI, spanishAI, otherApps, set } = body;

    const state = await getState();

    // If "set" is true, replace values. Otherwise add to existing.
    if (set) {
      if (frenchAI !== undefined) state.revenue.current.frenchAI = parseFloat(frenchAI) || 0;
      if (spanishAI !== undefined) state.revenue.current.spanishAI = parseFloat(spanishAI) || 0;
      if (otherApps !== undefined) state.revenue.current.otherApps = parseFloat(otherApps) || 0;
    } else {
      if (frenchAI !== undefined) state.revenue.current.frenchAI += parseFloat(frenchAI) || 0;
      if (spanishAI !== undefined) state.revenue.current.spanishAI += parseFloat(spanishAI) || 0;
      if (otherApps !== undefined) state.revenue.current.otherApps += parseFloat(otherApps) || 0;
    }

    await saveState(state);

    const total = state.revenue.current.frenchAI + state.revenue.current.spanishAI + state.revenue.current.otherApps;

    return NextResponse.json({
      success: true,
      current: state.revenue.current,
      total,
      message: `Revenue updated: $${total.toFixed(2)}`,
    });
  } catch (error) {
    console.error('Revenue update error:', error);
    return NextResponse.json({ error: 'Failed to update revenue' }, { status: 500 });
  }
}
