// Command Center State Management
// Uses in-memory storage with optional Postgres persistence

export interface CommandCenterState {
  revenue: {
    current: { frenchAI: number; spanishAI: number; otherApps: number };
    goal: number;
  };
  apps: Record<string, { mau: number; subscribers: number; status: string }>;
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
  };
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
  streaks: { current: 0, best: 0, lastCheckIn: null, missedDates: [] },
  checkIns: [],
  commitments: [],
  today: {
    date: null,
    priority: null,
    morningDone: false,
    middayDone: false,
    eveningDone: false,
  },
};

// In-memory state (persists during serverless function lifetime)
let memoryState: CommandCenterState | null = null;

async function tryPostgres(): Promise<boolean> {
  try {
    const { sql } = await import('@vercel/postgres');
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function getState(): Promise<CommandCenterState> {
  // Try Postgres first
  try {
    const hasPostgres = await tryPostgres();
    if (hasPostgres) {
      const { sql } = await import('@vercel/postgres');

      // Create table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS command_center (
          id TEXT PRIMARY KEY,
          state JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `;

      const result = await sql`SELECT state FROM command_center WHERE id = 'edison'`;
      if (result.rows.length === 0) {
        await sql`INSERT INTO command_center (id, state) VALUES ('edison', ${JSON.stringify(DEFAULT_STATE)})`;
        return DEFAULT_STATE;
      }
      return result.rows[0].state as CommandCenterState;
    }
  } catch (error) {
    console.log('Postgres not available, using memory:', error);
  }

  // Fallback to memory
  if (!memoryState) {
    memoryState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  return memoryState!;
}

export async function saveState(state: CommandCenterState): Promise<void> {
  // Update memory
  memoryState = state;

  // Try Postgres
  try {
    const hasPostgres = await tryPostgres();
    if (hasPostgres) {
      const { sql } = await import('@vercel/postgres');
      await sql`
        INSERT INTO command_center (id, state, updated_at)
        VALUES ('edison', ${JSON.stringify(state)}, NOW())
        ON CONFLICT (id) DO UPDATE SET state = ${JSON.stringify(state)}, updated_at = NOW()
      `;
    }
  } catch (error) {
    console.log('Postgres save failed, data in memory only:', error);
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
