'use client';

import { useEffect, useState } from 'react';

interface Status {
  revenue: {
    current: number;
    goal: number;
    progress: string;
    breakdown: Record<string, number>;
  };
  apps: Record<string, { mau: number; subscribers: number; status: string }>;
  streaks: { current: number; best: number; lastCheckIn: string | null };
  today: { morningDone: boolean; middayDone: boolean; eveningDone: boolean };
  daysLeft: number;
  recentCheckIns: Array<{
    type: string;
    timestamp: string;
    content: { q1?: string; priority?: string };
  }>;
  totalCheckIns: number;
}

interface Admin {
  dream: { vision: string; why: string[] };
  directive: { priority: string; action: string; commitment: string | null };
}

export default function CommandCenter() {
  const [status, setStatus] = useState<Status | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [commitment, setCommitment] = useState('');
  const [activeCommitment, setActiveCommitment] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [statusRes, adminRes] = await Promise.all([
        fetch('/api/command-center/status'),
        fetch('/api/command-center/admin'),
      ]);
      const statusData = await statusRes.json();
      const adminData = await adminRes.json();
      setStatus(statusData);
      setAdmin(adminData);
      if (adminData.directive?.commitment) {
        setActiveCommitment(adminData.directive.commitment);
      }
    } catch (err) {
      console.error('Failed to load:', err);
    }
  }

  async function makeCommitment() {
    if (!commitment.trim()) return;
    await fetch('/api/command-center/commitment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commitment }),
    });
    setActiveCommitment(commitment);
    setCommitment('');
  }

  async function completeCommitment() {
    const res = await fetch('/api/command-center/commitment');
    const data = await res.json();
    if (data.active?.length > 0) {
      await fetch('/api/command-center/commitment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.active[0].id, status: 'completed' }),
      });
    }
    setActiveCommitment(null);
  }

  if (!status || !admin) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[3px] text-gray-500 mb-4">
            EDISON COMMAND CENTER
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            ${status.revenue.current.toFixed(2)} →{' '}
            <span className="text-emerald-400">$10,000</span>
          </h1>
          <p className="text-gray-500">{status.daysLeft} days left this month</p>
        </header>

        {/* Progress Section */}
        <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-5xl font-bold text-emerald-400">
                ${status.revenue.current.toFixed(2)}
              </div>
              <div className="text-gray-500">of $10,000 goal</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-5xl font-bold text-amber-500">
                {status.streaks.current}
              </div>
              <div>
                <div className="font-semibold">day streak</div>
                <div className="text-gray-500 text-sm">
                  Best: {status.streaks.best}
                </div>
              </div>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(parseFloat(status.revenue.progress), 100)}%` }}
            />
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <span>
              <span className="text-white font-semibold">{status.revenue.progress}%</span> complete
            </span>
            <span>
              <span className="text-white font-semibold">{status.totalCheckIns}</span> check-ins
            </span>
          </div>
        </section>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Directive */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">
              TODAY&apos;S DIRECTIVE
            </h2>
            <p className="text-lg mb-4">{admin.directive.priority}</p>
            <div className="bg-emerald-500/10 text-emerald-400 text-sm p-3 rounded-lg">
              {admin.directive.action}
            </div>
            <div className="flex gap-4 mt-5">
              <CheckinDot done={status.today.morningDone} label="Morning" />
              <CheckinDot done={status.today.middayDone} label="Midday" />
              <CheckinDot done={status.today.eveningDone} label="Evening" />
            </div>
          </div>

          {/* Apps */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">
              YOUR APPS
            </h2>
            <div className="space-y-3">
              {Object.entries(status.apps).map(([key, app]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl"
                >
                  <span className="font-semibold">{key.replace('AI', ' AI')}</span>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{app.mau} MAU</span>
                    <span>{app.subscribers} subs</span>
                    <span className="text-emerald-400 font-semibold">
                      ${status.revenue.breakdown[key] || 0}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        app.status === 'live'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commitment */}
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">
            TODAY&apos;S COMMITMENT
          </h2>
          {!activeCommitment ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                placeholder="What's your #1 priority today?"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
                onKeyDown={(e) => e.key === 'Enter' && makeCommitment()}
              />
              <button
                onClick={makeCommitment}
                className="bg-emerald-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-emerald-400 transition"
              >
                LOCK IN
              </button>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
              <p className="text-lg font-medium mb-4">{activeCommitment}</p>
              <div className="flex gap-3">
                <button
                  onClick={completeCommitment}
                  className="bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => setActiveCommitment(null)}
                  className="bg-white/10 text-gray-400 px-4 py-2 rounded-lg text-sm"
                >
                  Didn&apos;t Complete
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Recent Check-ins */}
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">
            RECENT CHECK-INS
          </h2>
          {status.recentCheckIns.length > 0 ? (
            <div className="space-y-3">
              {status.recentCheckIns.slice(0, 3).map((c, i) => (
                <div key={i} className="bg-white/[0.02] rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold capitalize">{c.type}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(c.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {c.content.q1 || c.content.priority || ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No check-ins today yet.</p>
          )}
        </section>

        {/* Why Section */}
        <section className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-10 text-center">
          <h2 className="text-sm text-purple-400 tracking-widest mb-5">REMEMBER WHY</h2>
          <p className="text-2xl font-semibold mb-6">{admin.dream.vision}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {admin.dream.why.map((reason, i) => (
              <span
                key={i}
                className="bg-purple-500/10 text-purple-300 px-4 py-2 rounded-full text-sm"
              >
                {reason}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CheckinDot({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${done ? 'text-emerald-400' : 'text-gray-600'}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-emerald-400' : 'bg-gray-700'}`} />
      <span>{label}</span>
    </div>
  );
}
