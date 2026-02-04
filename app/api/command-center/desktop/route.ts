import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

// GET current desktop activity
export async function GET() {
  try {
    const state = await getState();
    return NextResponse.json({ desktop: state.liveDesktop || null });
  } catch (error) {
    console.error('Desktop GET error:', error);
    return NextResponse.json({ desktop: null });
  }
}

// POST desktop activity from Mac script
export async function POST(request: Request) {
  try {
    const desktop = await request.json();
    desktop.lastUpdated = new Date().toISOString();

    const state = await getState();
    state.liveDesktop = desktop;
    await saveState(state);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Desktop POST error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
