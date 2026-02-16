import { NextResponse } from 'next/server';
import { getState, saveState, Subscription } from '@/lib/command-center';

export const dynamic = 'force-dynamic';

const APPLE_CUT = 0.15;

// MRR multipliers
const MRR_MULTIPLIER = {
  weekly: 4.33,  // weeks per month
  monthly: 1,
  yearly: 1 / 12,
};

// GET all subscriptions with MRR calculations
export async function GET() {
  const state = await getState();
  const subs = state.subscriptions || [];

  // Calculate MRR by app
  const byApp: Record<string, { gross: number; net: number; count: number; breakdown: Record<string, number> }> = {};
  let totalGrossMRR = 0;
  let totalNetMRR = 0;

  for (const sub of subs) {
    if (!sub.isActive) continue;

    const grossMRR = sub.price * MRR_MULTIPLIER[sub.plan];
    const netMRR = grossMRR * (1 - APPLE_CUT);

    if (!byApp[sub.app]) {
      byApp[sub.app] = { gross: 0, net: 0, count: 0, breakdown: {} };
    }

    byApp[sub.app].gross += grossMRR;
    byApp[sub.app].net += netMRR;
    byApp[sub.app].count += 1;
    byApp[sub.app].breakdown[sub.plan] = (byApp[sub.app].breakdown[sub.plan] || 0) + 1;

    totalGrossMRR += grossMRR;
    totalNetMRR += netMRR;
  }

  return NextResponse.json({
    subscriptions: subs,
    mrr: {
      gross: Math.round(totalGrossMRR * 100) / 100,
      net: Math.round(totalNetMRR * 100) / 100,
      byApp,
    },
    progress: {
      current: Math.round(totalNetMRR * 100) / 100,
      goal1k: 1000,
      goal10k: 10000,
      percent1k: ((totalNetMRR / 1000) * 100).toFixed(2) + '%',
      percent10k: ((totalNetMRR / 10000) * 100).toFixed(2) + '%',
      remaining1k: Math.round((1000 - totalNetMRR) * 100) / 100,
      remaining10k: Math.round((10000 - totalNetMRR) * 100) / 100,
    },
  });
}

// POST to add a new subscription
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { app, plan, price, isTrial, trialEndDate } = body;

    if (!app || !plan || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const state = await getState();
    if (!state.subscriptions) {
      state.subscriptions = [];
    }

    const newSub: Subscription = {
      id: `${app}-${plan}-${Date.now()}`,
      app,
      plan,
      price: parseFloat(price),
      startDate: new Date().toISOString().split('T')[0],
      isTrial: isTrial || false,
      trialEndDate: trialEndDate || undefined,
      isActive: true,
    };

    state.subscriptions.push(newSub);
    await saveState(state);

    // Recalculate MRR
    let totalNetMRR = 0;
    for (const sub of state.subscriptions) {
      if (sub.isActive) {
        totalNetMRR += sub.price * MRR_MULTIPLIER[sub.plan] * (1 - APPLE_CUT);
      }
    }

    return NextResponse.json({
      success: true,
      subscription: newSub,
      newMRR: Math.round(totalNetMRR * 100) / 100,
      message: `Added ${app} ${plan} subscription`,
    });
  } catch (error) {
    console.error('Subscription add error:', error);
    return NextResponse.json({ error: 'Failed to add subscription' }, { status: 500 });
  }
}

// PATCH to update a subscription
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isTrial, trialEndDate, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    const state = await getState();
    const subIndex = state.subscriptions?.findIndex(s => s.id === id);

    if (subIndex === undefined || subIndex === -1) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (isTrial !== undefined) state.subscriptions[subIndex].isTrial = isTrial;
    if (trialEndDate !== undefined) state.subscriptions[subIndex].trialEndDate = trialEndDate || undefined;
    if (isActive !== undefined) state.subscriptions[subIndex].isActive = isActive;

    await saveState(state);

    return NextResponse.json({
      success: true,
      subscription: state.subscriptions[subIndex],
      message: 'Subscription updated',
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

// DELETE to remove/deactivate a subscription
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    const state = await getState();
    const subIndex = state.subscriptions?.findIndex(s => s.id === id);

    if (subIndex === undefined || subIndex === -1) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    state.subscriptions[subIndex].isActive = false;
    await saveState(state);

    let totalNetMRR = 0;
    for (const sub of state.subscriptions) {
      if (sub.isActive) {
        totalNetMRR += sub.price * MRR_MULTIPLIER[sub.plan] * (1 - APPLE_CUT);
      }
    }

    return NextResponse.json({
      success: true,
      newMRR: Math.round(totalNetMRR * 100) / 100,
      message: 'Subscription deactivated',
    });
  } catch (error) {
    console.error('Subscription delete error:', error);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}
