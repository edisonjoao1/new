// Command Center State Management
// Uses Neon Postgres for persistence

import { neon } from '@neondatabase/serverless';

export interface Subscription {
  id: string;
  app: string;           // frenchAI, spanishAI, daysTogether, love, gemAI
  plan: 'weekly' | 'monthly' | 'yearly';
  price: number;         // gross price
  startDate: string;
  isTrial: boolean;
  isActive: boolean;
}

export interface DailyCommitment {
  app: string | null;        // What app are you shipping today?
  health: string | null;     // Health commitment
  job: string | null;        // Job search task
  appShipped: boolean;       // Did you actually ship?
  healthDone: boolean;
  jobDone: boolean;
  jobCount: number;          // Jobs applied today (goal: 100)
  marketing: string | null;  // Marketing task
  marketingDone: boolean;
  outreach: string | null;   // Outreach task
  outreachCount: number;     // People reached out to today
  clientWork: string | null; // AI 4U client work
  clientWorkDone: boolean;
  etsy: string | null;       // Etsy task
  etsyDone: boolean;
}

export interface CommandCenterState {
  revenue: {
    current: { frenchAI: number; spanishAI: number; otherApps: number };
    goal: number;
  };
  apps: Record<string, { mau: number; subscribers: number; status: string }>;

  // Multi-track accountability
  tracks: {
    appsShipped: Array<{ date: string; name: string; link?: string }>;
    healthStreak: number;
    jobApplications: Array<{ date: string; company: string; role: string; source?: string; emailSubject?: string | null; timestamp?: string }>;
    // New tracks
    marketing: Array<{ date: string; platform: string; description: string }>;
    outreach: Array<{ date: string; person: string; channel: string }>;
    clientSales: Array<{ date: string; client: string; status: string; value?: number }>;
    etsy: Array<{ date: string; action: string; count?: number }>;
  };

  streaks: { current: number; best: number; lastCheckIn: string | null; missedDates: string[] };
  checkIns: Array<{
    id: string;
    type: string;
    date: string;
    timestamp: string;
    content: Record<string, string>;
  }>;
  commitments: Array<{
    id: string;
    text: string;
    date: string;
    timestamp: string;
    status: string;
    completedAt: string | null;
  }>;
  today: {
    date: string | null;
    priority: string | null;
    morningDone: boolean;
    middayDone: boolean;
    eveningDone: boolean;
    commitments: DailyCommitment;
  };
  liveDesktop?: {
    frontmost: string;
    openApps: string;
    xcodeProjects: string;
    vscodeProjects: string;
    terminalSessions: string;
    browserTabs: string;
    lastUpdated: string;
  };
  subscriptions: Subscription[];
}

const DEFAULT_STATE: CommandCenterState = {
  revenue: {
    current: { frenchAI: 3.99, spanishAI: 0, otherApps: 0 },
    goal: 10000,
  },
  apps: {
    frenchAI: { mau: 200, subscribers: 1, status: 'live' },
    spanishAI: { mau: 746, subscribers: 0, status: 'pending_review' },
  },
  tracks: {
    appsShipped: [],
    healthStreak: 0,
    jobApplications: [],
    marketing: [],
    outreach: [],
    clientSales: [],
    etsy: [],
  },
  streaks: { current: 0, best: 0, lastCheckIn: null, missedDates: [] },
  checkIns: [],
  commitments: [],
  today: {
    date: null,
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
  },
  subscriptions: [
    // Current confirmed subscriptions
    { id: 'french-w1', app: 'frenchAI', plan: 'weekly', price: 3.99, startDate: '2025-01-01', isTrial: false, isActive: true },
    { id: 'french-w2', app: 'frenchAI', plan: 'weekly', price: 3.99, startDate: '2025-01-15', isTrial: false, isActive: true },
    { id: 'french-y1', app: 'frenchAI', plan: 'yearly', price: 44.99, startDate: '2025-02-10', isTrial: false, isActive: true },
    { id: 'spanish-w1', app: 'spanishAI', plan: 'weekly', price: 8.99, startDate: '2025-01-20', isTrial: false, isActive: true },
    { id: 'spanish-m1', app: 'spanishAI', plan: 'monthly', price: 29.99, startDate: '2025-02-01', isTrial: true, isActive: true },
  ],
};

// Get database connection
function getSQL() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) {
    throw new Error('No database URL found');
  }
  return neon(dbUrl);
}

// Initialize table
async function initTable() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS command_center (
      id TEXT PRIMARY KEY,
      state JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function getState(): Promise<CommandCenterState> {
  try {
    const sql = getSQL();
    await initTable();

    const result = await sql`SELECT state FROM command_center WHERE id = 'edison'`;
    if (result.length === 0) {
      // Insert default state
      await sql`INSERT INTO command_center (id, state) VALUES ('edison', ${JSON.stringify(DEFAULT_STATE)})`;
      return DEFAULT_STATE;
    }
    return result[0].state as CommandCenterState;
  } catch (error) {
    console.error('Database error in getState:', error);
    return DEFAULT_STATE;
  }
}

export async function saveState(state: CommandCenterState): Promise<void> {
  try {
    const sql = getSQL();
    await initTable();

    await sql`
      INSERT INTO command_center (id, state, updated_at)
      VALUES ('edison', ${JSON.stringify(state)}, NOW())
      ON CONFLICT (id) DO UPDATE SET state = ${JSON.stringify(state)}, updated_at = NOW()
    `;
    console.log('State saved successfully');
  } catch (error) {
    console.error('Database error in saveState:', error);
    throw error; // Re-throw so caller knows it failed
  }
}

export const DREAM = {
  vision: 'Financial freedom through apps that help people learn languages',
  monthlyTarget: 10000,
  why: [
    "Build something that's truly mine",
    'Help people learn languages with AI',
    'Create sustainable income from my own products',
    'Prove I can do this',
  ],
};
