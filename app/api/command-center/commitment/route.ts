import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/command-center';

export async function GET() {
  const state = await getState();
  const today = new Date().toISOString().split('T')[0];

  const activeCommitments = state.commitments.filter((c) => c.status === 'active');
  const todayCommitments = state.commitments.filter((c) => c.date === today);

  return NextResponse.json({
    active: activeCommitments,
    today: todayCommitments,
    all: state.commitments.slice(-20),
  });
}

export async function POST(request: Request) {
  const state = await getState();
  const { commitment } = await request.json();
  const today = new Date().toISOString().split('T')[0];

  const newCommitment = {
    id: Date.now().toString(),
    text: commitment,
    date: today,
    timestamp: new Date().toISOString(),
    status: 'active',
    completedAt: null,
  };

  state.commitments.push(newCommitment);
  await saveState(state);

  return NextResponse.json({ success: true, commitment: newCommitment });
}

export async function PUT(request: Request) {
  const state = await getState();
  const { id, status } = await request.json();

  const commitment = state.commitments.find((c) => c.id === id);
  if (commitment) {
    commitment.status = status;
    if (status === 'completed') {
      commitment.completedAt = new Date().toISOString();
    }
    await saveState(state);
    return NextResponse.json({ success: true, commitment });
  }

  return NextResponse.json({ error: 'Commitment not found' }, { status: 404 });
}
