import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

// Clean up duplicate check-ins, keeping only the most recent of each type per day
export async function POST() {
  try {
    const state = await getState();

    // Group check-ins by date and type, keep only the most recent
    const seen = new Map<string, typeof state.checkIns[0]>();

    // Sort by timestamp descending (newest first)
    const sorted = [...state.checkIns].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Keep only the first (most recent) of each date+type combo
    for (const checkIn of sorted) {
      const key = `${checkIn.date}-${checkIn.type}`;
      if (!seen.has(key)) {
        seen.set(key, checkIn);
      }
    }

    // Convert back to array, sorted by date desc then type
    const cleaned = Array.from(seen.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const removed = state.checkIns.length - cleaned.length;

    // Update state
    state.checkIns = cleaned;
    await saveState(state);

    return NextResponse.json({
      success: true,
      before: state.checkIns.length + removed,
      after: cleaned.length,
      removed,
      remaining: cleaned.map(c => ({ date: c.date, type: c.type, timestamp: c.timestamp }))
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup', details: String(error) },
      { status: 500 }
    );
  }
}
