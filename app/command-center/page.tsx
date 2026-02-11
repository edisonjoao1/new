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
  today: {
    morningDone: boolean;
    middayDone: boolean;
    eveningDone: boolean;
    commitments?: {
      app: string | null;
      health: string | null;
      job: string | null;
      appShipped: boolean;
      healthDone: boolean;
      jobDone: boolean;
      jobCount: number;
      marketing: string | null;
      marketingDone: boolean;
      outreach: string | null;
      outreachCount: number;
      clientWork: string | null;
      clientWorkDone: boolean;
      etsy: string | null;
      etsyDone: boolean;
    };
  };
  daysLeft: number;
  recentCheckIns: Array<{
    type: string;
    date: string;
    timestamp: string;
    content: Record<string, string>;
  }>;
  totalCheckIns: number;
  tracks: {
    appsShipped: {
      thisWeek: number;
      thisMonth: number;
      total: number;
      recent: Array<{ date: string; name: string; link?: string }>;
    };
    healthStreak: number;
    jobApplications: {
      today: number;
      dailyGoal: number;
      thisWeek: number;
      total: number;
    };
    marketing: {
      today: number;
      thisWeek: number;
      total: number;
      recent: Array<{ date: string; platform: string; description: string }>;
    };
    outreach: {
      today: number;
      thisWeek: number;
      total: number;
    };
    clientSales: {
      thisMonth: number;
      total: number;
      recent: Array<{ date: string; client: string; status: string }>;
    };
    etsy: {
      today: number;
      total: number;
    };
  };
  dailyCommitments: {
    app: string | null;
    health: string | null;
    job: string | null;
    appShipped: boolean;
    healthDone: boolean;
    jobDone: boolean;
    jobCount: number;
    marketing: string | null;
    marketingDone: boolean;
    outreach: string | null;
    outreachCount: number;
    clientWork: string | null;
    clientWorkDone: boolean;
    etsy: string | null;
    etsyDone: boolean;
  } | null;
  history: {
    dailyStats: Array<{
      date: string;
      hasMorning: boolean;
      hasMidday: boolean;
      hasEvening: boolean;
      complete: boolean;
      appCommitment: string | null;
      appShipped: string | null;
      jobCount: string | null;
    }>;
    allCheckIns: Array<{
      type: string;
      date: string;
      timestamp: string;
      content: Record<string, string>;
    }>;
  };
}

interface Admin {
  dream: { vision: string; why: string[] };
  directive: { priority: string; action: string; commitment: string | null };
}

interface Subscription {
  id: string;
  app: string;
  plan: 'weekly' | 'monthly' | 'yearly';
  price: number;
  startDate: string;
  isTrial: boolean;
  isActive: boolean;
}

interface SubscriptionData {
  subscriptions: Subscription[];
  mrr: {
    gross: number;
    net: number;
    byApp: Record<string, { gross: number; net: number; count: number; breakdown: Record<string, number> }>;
  };
  progress: {
    current: number;
    goal1k: number;
    goal10k: number;
    percent1k: string;
    percent10k: string;
    remaining1k: number;
    remaining10k: number;
  };
}

interface Activity {
  today: {
    totalTime: string;
    productiveTime: string;
    distractingTime: string;
    productivityScore: number;
  };
  topActivities: Array<{
    name: string;
    productivity: number;
    formatted: string;
  }>;
  distractingApps: Array<{
    name: string;
    formatted: string;
  }>;
  liveDesktop?: {
    frontmost: string;
    openApps: string;
    xcodeProjects: string;
    vscodeProjects: string;
    terminalSessions: string;
    browserTabs: string;
    lastUpdated: string;
  };
}

export default function CommandCenter() {
  const [status, setStatus] = useState<Status | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [aiCoach, setAiCoach] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [showRevenueInput, setShowRevenueInput] = useState(false);
  const [revenueInput, setRevenueInput] = useState({
    app: 'frenchAI',
    type: 'weekly',
    count: 1,
    isTrial: false
  });
  const [revenueSaving, setRevenueSaving] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [statusRes, adminRes, activityRes, desktopRes, subsRes] = await Promise.all([
        fetch('/api/command-center/status'),
        fetch('/api/command-center/admin'),
        fetch('/api/command-center/activity'),
        fetch('/api/command-center/desktop'),
        fetch('/api/command-center/subscriptions'),
      ]);
      const statusData = await statusRes.json();
      const adminData = await adminRes.json();
      const activityData = await activityRes.json();
      const desktopData = await desktopRes.json();
      const subsData = await subsRes.json();
      setStatus(statusData);
      setAdmin(adminData);
      setSubData(subsData);
      // Merge desktop data into activity
      if (desktopData.desktop) {
        activityData.liveDesktop = desktopData.desktop;
      }
      if (!activityData.error) {
        setActivity(activityData);
      }
    } catch (err) {
      console.error('Failed to load:', err);
    }
  }

  async function getAiCoaching() {
    setAiLoading(true);
    try {
      const res = await fetch('/api/command-center/ai-coach');
      const data = await res.json();
      setAiCoach(data.analysis);
    } catch (err) {
      console.error('AI Coach error:', err);
    }
    setAiLoading(false);
  }

  async function askAi() {
    if (!question.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/command-center/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAiCoach(data.answer);
      setQuestion('');
    } catch (err) {
      console.error('AI Coach error:', err);
    }
    setAiLoading(false);
  }

  // Subscription prices
  const PRICES: Record<string, Record<string, number>> = {
    frenchAI: { weekly: 3.99, monthly: 14.99, yearly: 44.99 },
    spanishAI: { weekly: 8.99, monthly: 29.99, yearly: 69.99 },
    daysTogether: { monthly: 4.99, yearly: 34.99 },
    love: { weekly: 3.99, monthly: 19.99 },
    gemAI: { weekly: 5.99, monthly: 19.99 }
  };

  const APP_NAMES: Record<string, string> = {
    frenchAI: 'French AI',
    spanishAI: 'Spanish AI',
    daysTogether: 'Days Together',
    love: 'Love',
    gemAI: 'Gem AI (pending)'
  };

  const APPLE_CUT = 0.15; // 15% for small business program

  async function saveRevenue() {
    setRevenueSaving(true);
    try {
      const price = PRICES[revenueInput.app]?.[revenueInput.type] || 0;

      // Add each subscription individually
      for (let i = 0; i < revenueInput.count; i++) {
        await fetch('/api/command-center/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            app: revenueInput.app,
            plan: revenueInput.type,
            price: price,
            isTrial: revenueInput.isTrial
          })
        });
      }

      // Reload data
      await loadData();
      setShowRevenueInput(false);
      setRevenueInput({ app: 'frenchAI', type: 'weekly', count: 1, isTrial: false });
    } catch (err) {
      console.error('Revenue save error:', err);
    }
    setRevenueSaving(false);
  }

  if (!status || !admin) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading...</div>
      </div>
    );
  }

  const jobsToday = status.tracks?.jobApplications?.today || 0;
  const jobGoal = 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[3px] text-gray-500 mb-3">
            EDISON COMMAND CENTER
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            ${subData?.mrr.net.toFixed(2) || status.revenue.current.toFixed(2)}<span className="text-lg text-gray-500">/mo</span> → <span className="text-yellow-400">$1,000</span> → <span className="text-emerald-400">$10K</span>
          </h1>
          <div className="flex justify-center gap-4 text-sm mt-2">
            <span className="text-yellow-400">{subData?.progress.percent1k || '0%'} to $1k</span>
            <span className="text-gray-500">·</span>
            <span className="text-emerald-400">${subData?.progress.remaining1k.toFixed(0) || '1000'} to go</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">Mom counting on you</span>
          </div>
        </header>

        {/* AI Coach Section */}
        <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold tracking-wider text-cyan-400">AI COACH</h2>
            <button
              onClick={getAiCoaching}
              disabled={aiLoading}
              className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg hover:bg-cyan-500/30 transition disabled:opacity-50"
            >
              {aiLoading ? 'Thinking...' : 'Get Analysis'}
            </button>
          </div>
          {aiCoach && (
            <div className="text-sm text-gray-100 whitespace-pre-wrap mb-4 p-4 bg-gray-900 rounded-lg leading-relaxed">
              {aiCoach}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask for help... (e.g., 'How do I stay focused?' 'What should I prioritize?')"
              className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
              onKeyDown={(e) => e.key === 'Enter' && askAi()}
            />
            <button
              onClick={askAi}
              disabled={aiLoading}
              className="bg-cyan-500 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cyan-400 transition disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </section>

        {/* Daily Progress Grid - 6 Tracks */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {/* Apps Shipped */}
          <TrackCard
            title="APPS SHIPPED"
            value={status.tracks?.appsShipped?.thisWeek || 0}
            goal={7}
            unit="/ 7 this week"
            color="blue"
            done={status.dailyCommitments?.appShipped}
            commitment={status.dailyCommitments?.app}
          />

          {/* Jobs Applied */}
          <TrackCard
            title="JOBS TODAY"
            value={jobsToday}
            goal={jobGoal}
            unit={`/ ${jobGoal} goal`}
            color="purple"
            done={jobsToday >= jobGoal}
            commitment={status.dailyCommitments?.job}
            showProgress
          />

          {/* Marketing */}
          <TrackCard
            title="MARKETING"
            value={status.tracks?.marketing?.today || 0}
            goal={1}
            unit="launches today"
            color="pink"
            done={status.dailyCommitments?.marketingDone}
            commitment={status.dailyCommitments?.marketing}
          />

          {/* Outreach */}
          <TrackCard
            title="OUTREACH"
            value={status.tracks?.outreach?.today || 0}
            goal={10}
            unit="people today"
            color="orange"
            done={(status.dailyCommitments?.outreachCount || 0) >= 10}
            commitment={status.dailyCommitments?.outreach}
          />

          {/* Client Sales */}
          <TrackCard
            title="AI 4U CLIENTS"
            value={status.tracks?.clientSales?.thisMonth || 0}
            goal={5}
            unit="this month"
            color="emerald"
            done={status.dailyCommitments?.clientWorkDone}
            commitment={status.dailyCommitments?.clientWork}
          />

          {/* Etsy */}
          <TrackCard
            title="ETSY"
            value={status.tracks?.etsy?.today || 0}
            goal={10}
            unit="products today"
            color="amber"
            done={status.dailyCommitments?.etsyDone}
            commitment={status.dailyCommitments?.etsy}
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{status.streaks.current}</div>
            <div className="text-xs text-gray-500">day streak</div>
          </div>
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{status.tracks?.healthStreak || 0}</div>
            <div className="text-xs text-gray-500">health streak</div>
          </div>
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{status.tracks?.appsShipped?.total || 0}</div>
            <div className="text-xs text-gray-500">total apps</div>
          </div>
        </div>

        {/* RescueTime Activity */}
        {activity && activity.today && (
          <section className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 rounded-2xl p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-xs font-semibold tracking-wider text-orange-400 mb-1">PRODUCTIVITY</h2>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {activity.today.productivityScore}% Productive
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-green-400">{activity.today.productiveTime} productive</div>
                <div className="text-red-400">{activity.today.distractingTime} distracting</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: `${activity.today.productivityScore}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${100 - activity.today.productivityScore}%` }} />
            </div>
          </section>
        )}

        {/* Live Desktop Activity */}
        {activity?.liveDesktop && (
          <section className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/30 rounded-2xl p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-semibold tracking-wider text-blue-400">LIVE DESKTOP</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500">
                  {new Date(activity.liveDesktop.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500">📍 Focus:</span>
                <span className="text-green-400 font-medium">{activity.liveDesktop.frontmost}</span>
              </div>
              {activity.liveDesktop.xcodeProjects && (
                <div className="flex gap-2">
                  <span className="text-gray-500">🔨 Xcode:</span>
                  <span className="text-blue-400">{activity.liveDesktop.xcodeProjects}</span>
                </div>
              )}
              {activity.liveDesktop.vscodeProjects && (
                <div className="flex gap-2">
                  <span className="text-gray-500">💻 VS Code:</span>
                  <span className="text-blue-400">{activity.liveDesktop.vscodeProjects}</span>
                </div>
              )}
              {activity.liveDesktop.terminalSessions && (
                <div className="flex gap-2">
                  <span className="text-gray-500">⌨️ Terminal:</span>
                  <span className="text-green-400">{activity.liveDesktop.terminalSessions}</span>
                </div>
              )}
              {activity.liveDesktop.browserTabs && (
                <div className="flex gap-2 flex-wrap">
                  <span className="text-gray-500">🌐 Tabs:</span>
                  <span className="text-gray-300 text-xs">{activity.liveDesktop.browserTabs}</span>
                </div>
              )}
              <div className="flex gap-2 pt-1 border-t border-white/10 mt-2">
                <span className="text-gray-500">📱 Open:</span>
                <span className="text-gray-400 text-xs">{activity.liveDesktop.openApps}</span>
              </div>
            </div>
          </section>
        )}

        {/* Check-in Status */}
        <section className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">TODAY&apos;S CHECK-INS</h2>
          <div className="flex justify-around">
            <CheckinDot done={status.today.morningDone} label="Morning" time="Set commitments" />
            <CheckinDot done={status.today.middayDone} label="Midday" time="Progress check" />
            <CheckinDot done={status.today.eveningDone} label="Evening" time="Daily review" />
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-semibold tracking-wider text-emerald-400">REVENUE BREAKDOWN (MRR)</h2>
            <button
              onClick={() => setShowRevenueInput(!showRevenueInput)}
              className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/30 transition"
            >
              {showRevenueInput ? 'Cancel' : '+ Add Subscription'}
            </button>
          </div>

          {/* Revenue Input Form */}
          {showRevenueInput && (
            <div className="bg-gray-900/50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">App</label>
                  <select
                    value={revenueInput.app}
                    onChange={(e) => {
                      const newApp = e.target.value;
                      const availablePlans = Object.keys(PRICES[newApp] || {});
                      const newType = availablePlans.includes(revenueInput.type) ? revenueInput.type : availablePlans[0];
                      setRevenueInput({...revenueInput, app: newApp, type: newType});
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="frenchAI">French AI</option>
                    <option value="spanishAI">Spanish AI</option>
                    <option value="daysTogether">Days Together</option>
                    <option value="love">Love</option>
                    <option value="gemAI">Gem AI (pending)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Plan</label>
                  <select
                    value={revenueInput.type}
                    onChange={(e) => setRevenueInput({...revenueInput, type: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    {PRICES[revenueInput.app]?.weekly !== undefined && <option value="weekly">Weekly (${PRICES[revenueInput.app].weekly})</option>}
                    {PRICES[revenueInput.app]?.monthly !== undefined && <option value="monthly">Monthly (${PRICES[revenueInput.app].monthly})</option>}
                    {PRICES[revenueInput.app]?.yearly !== undefined && <option value="yearly">Yearly (${PRICES[revenueInput.app].yearly})</option>}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">How many?</label>
                  <input
                    type="number"
                    min="1"
                    value={revenueInput.count}
                    onChange={(e) => setRevenueInput({...revenueInput, count: parseInt(e.target.value) || 1})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={revenueInput.isTrial}
                      onChange={(e) => setRevenueInput({...revenueInput, isTrial: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-yellow-400">On trial (pending)</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <div className="text-sm">
                  <span className="text-gray-400">Gross: </span>
                  <span className="text-white font-medium">
                    ${((PRICES[revenueInput.app]?.[revenueInput.type] || 0) * revenueInput.count).toFixed(2)}
                  </span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-gray-400">Net (after 15%): </span>
                  <span className="text-emerald-400 font-medium">
                    ${((PRICES[revenueInput.app]?.[revenueInput.type] || 0) * revenueInput.count * (1 - APPLE_CUT)).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={saveRevenue}
                  disabled={revenueSaving}
                  className="bg-emerald-500 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {revenueSaving ? 'Saving...' : 'Log Subscription'}
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-3 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((subData?.mrr.net || 0) / 1000 * 100, 100)}%` }}
            />
            {/* $1k marker */}
            <div className="absolute top-0 left-[10%] h-full w-0.5 bg-yellow-400/50" title="$1k goal" />
          </div>

          {/* Current MRR Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">${subData?.mrr.net.toFixed(2) || '0.00'}</div>
              <div className="text-xs text-gray-500">Net MRR (after 15%)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-400">${subData?.mrr.gross.toFixed(2) || '0.00'}</div>
              <div className="text-xs text-gray-500">Gross MRR</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">${subData?.progress.remaining1k.toFixed(0) || '1000'}</div>
              <div className="text-xs text-gray-500">to $1k goal</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{subData?.subscriptions.filter(s => s.isActive).length || 0}</div>
              <div className="text-xs text-gray-500">active subs</div>
            </div>
          </div>

          {/* Breakdown by App */}
          <div className="bg-gray-900/30 rounded-lg p-3 mb-3">
            <div className="text-xs font-semibold text-gray-400 mb-2">BY APP</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {subData?.mrr.byApp && Object.entries(subData.mrr.byApp).map(([app, data]) => (
                <div key={app} className="bg-white/5 rounded p-2">
                  <div className="text-sm font-semibold text-emerald-400">${data.net.toFixed(2)}/mo</div>
                  <div className="text-xs text-gray-500">{APP_NAMES[app] || app}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {data.count} sub{data.count !== 1 ? 's' : ''}: {Object.entries(data.breakdown).map(([plan, count]) => `${count} ${plan}`).join(', ')}
                  </div>
                </div>
              ))}
              {(!subData?.mrr.byApp || Object.keys(subData.mrr.byApp).length === 0) && (
                <div className="text-sm text-gray-500 col-span-3">No active subscriptions yet</div>
              )}
            </div>
          </div>

          {/* Dynamic: How many MORE subs needed */}
          {(() => {
            const currentNet = subData?.mrr.net || 0;
            const remaining1k = Math.max(0, 1000 - currentNet);
            const remaining10k = Math.max(0, 10000 - currentNet);

            // Calculate how many of each sub type needed (net MRR per sub)
            const calcNeeded = (price: number, plan: string, target: number) => {
              const multiplier = plan === 'weekly' ? 4.33 : plan === 'yearly' ? 1/12 : 1;
              const netPerSub = price * multiplier * (1 - APPLE_CUT);
              return Math.ceil(target / netPerSub);
            };

            return (
              <div className="bg-gray-900/30 rounded-lg p-3 mt-3">
                <div className="text-xs font-semibold text-yellow-400 mb-2">🎯 TO REACH $1K/MONTH ({remaining1k > 0 ? `$${remaining1k.toFixed(0)} more needed` : 'REACHED!'})</div>
                {remaining1k > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                      <div className="text-yellow-400 font-bold">{calcNeeded(3.99, 'weekly', remaining1k)}</div>
                      <div className="text-gray-500">French weekly ($3.99)</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                      <div className="text-yellow-400 font-bold">{calcNeeded(14.99, 'monthly', remaining1k)}</div>
                      <div className="text-gray-500">French monthly ($14.99)</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                      <div className="text-yellow-400 font-bold">{calcNeeded(8.99, 'weekly', remaining1k)}</div>
                      <div className="text-gray-500">Spanish weekly ($8.99)</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                      <div className="text-yellow-400 font-bold">{calcNeeded(29.99, 'monthly', remaining1k)}</div>
                      <div className="text-gray-500">Spanish monthly ($29.99)</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-emerald-400 font-bold text-center py-2">🎉 $1K GOAL REACHED!</div>
                )}

                {/* Mix suggestions */}
                {remaining1k > 0 && (
                  <div className="bg-white/5 rounded p-2 mb-3">
                    <div className="text-xs font-semibold text-cyan-400 mb-1">💡 REALISTIC MIXES TO $1K:</div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>• <span className="text-blue-400">10 French weekly</span> + <span className="text-purple-400">5 Spanish weekly</span> + <span className="text-emerald-400">15 monthly mix</span> = ~$1k</div>
                      <div>• <span className="text-blue-400">20 French weekly</span> + <span className="text-emerald-400">20 French monthly</span> = ~$1k</div>
                      <div>• <span className="text-purple-400">15 Spanish weekly</span> + <span className="text-emerald-400">10 Spanish monthly</span> = ~$1k</div>
                      <div>• <span className="text-yellow-400">25 yearly subs</span> (French @ $44.99) = ~$1k MRR</div>
                    </div>
                  </div>
                )}

                <div className="text-xs font-semibold text-emerald-400 mb-2">🚀 TO REACH $10K/MONTH ({remaining10k > 0 ? `$${remaining10k.toFixed(0)} more needed` : 'REACHED!'})</div>
                {remaining10k > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-blue-400 font-bold">{calcNeeded(3.99, 'weekly', remaining10k)}</div>
                      <div className="text-gray-500">French weekly</div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-blue-400 font-bold">{calcNeeded(14.99, 'monthly', remaining10k)}</div>
                      <div className="text-gray-500">French monthly</div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-purple-400 font-bold">{calcNeeded(8.99, 'weekly', remaining10k)}</div>
                      <div className="text-gray-500">Spanish weekly</div>
                    </div>
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-purple-400 font-bold">{calcNeeded(29.99, 'monthly', remaining10k)}</div>
                      <div className="text-gray-500">Spanish monthly</div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-3 text-center">
                  Weekly = ~4.33 payments/month · Monthly = 1/month · Yearly = 1/12 per month · 15% Apple cut
                </div>
              </div>
            );
          })()}

          {/* Active Subscriptions List */}
          {subData?.subscriptions && subData.subscriptions.filter(s => s.isActive).length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs font-semibold text-gray-400 mb-2">ACTIVE SUBSCRIPTIONS</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {subData.subscriptions.filter(s => s.isActive).map(sub => (
                  <div key={sub.id} className="flex justify-between items-center text-xs bg-white/5 rounded px-2 py-1">
                    <span className="text-gray-300">{APP_NAMES[sub.app] || sub.app} - {sub.plan}</span>
                    <span className="text-emerald-400">${sub.price} {sub.isTrial && <span className="text-yellow-400">(trial)</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* History - Past Days */}
        {status.history?.dailyStats && status.history.dailyStats.length > 0 && (
          <section className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5 mb-6">
            <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">PAST 7 DAYS</h2>
            <div className="space-y-3">
              {status.history.dailyStats.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${day.complete ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    <div>
                      <div className="font-medium text-sm">
                        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      {day.appCommitment && (
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          App: {day.appCommitment}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex gap-1">
                      <span className={day.hasMorning ? 'text-emerald-400' : 'text-gray-500'}>M</span>
                      <span className={day.hasMidday ? 'text-emerald-400' : 'text-gray-500'}>D</span>
                      <span className={day.hasEvening ? 'text-emerald-400' : 'text-gray-500'}>E</span>
                    </div>
                    {day.appShipped && (
                      <span className={day.appShipped.toLowerCase().includes('yes') ? 'text-emerald-400' : 'text-red-400'}>
                        {day.appShipped.toLowerCase().includes('yes') ? '✓ Shipped' : '✗ No ship'}
                      </span>
                    )}
                    {day.jobCount && (
                      <span className="text-purple-400">{day.jobCount} jobs</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Today's Check-ins - Full Details */}
        {status.recentCheckIns && status.recentCheckIns.length > 0 && (
          <section className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-6">
            <h2 className="text-xs font-semibold tracking-wider text-emerald-500 mb-4">TODAY&apos;S COMMITMENTS</h2>
            <div className="space-y-4">
              {/* Show the most recent of each type */}
              {(() => {
                const byType: Record<string, typeof status.recentCheckIns[0]> = {};
                status.recentCheckIns.forEach(c => {
                  if (!byType[c.type]) byType[c.type] = c;
                });
                return ['morning', 'midday', 'evening']
                  .filter(t => byType[t])
                  .map(t => <CheckInCard key={t} checkIn={byType[t]} />);
              })()}
            </div>
          </section>
        )}

        {/* Historical Check-ins - Grouped by Date */}
        {status.history?.allCheckIns && status.history.allCheckIns.length > 0 && (() => {
          // Group check-ins by date (excluding today)
          const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
          const grouped: Record<string, typeof status.history.allCheckIns> = {};
          status.history.allCheckIns
            .filter(c => c.date !== today)
            .forEach(c => {
              if (!grouped[c.date]) grouped[c.date] = [];
              grouped[c.date].push(c);
            });
          const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

          if (sortedDates.length === 0) return null;

          return (
            <section className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-5 mb-6">
              <h2 className="text-xs font-semibold tracking-wider text-gray-500 mb-4">PREVIOUS DAYS</h2>
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {sortedDates.slice(0, 7).map(date => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="space-y-3 pl-2">
                      {grouped[date].map((c, i) => (
                        <CheckInCard key={i} checkIn={c} compact />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Why Section */}
        <section className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6 text-center">
          <h2 className="text-xs text-purple-400 tracking-widest mb-3">REMEMBER WHY</h2>
          <p className="text-lg font-semibold mb-4">{admin.dream.vision}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {admin.dream.why.map((reason, i) => (
              <span key={i} className="bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full text-xs">
                {reason}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TrackCard({
  title,
  value,
  goal,
  unit,
  color,
  done,
  commitment,
  showProgress,
}: {
  title: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  done?: boolean;
  commitment?: string | null;
  showProgress?: boolean;
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/30 text-purple-400',
    pink: 'from-pink-500/10 to-pink-500/5 border-pink-500/30 text-pink-400',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-500/30 text-orange-400',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/30 text-amber-400',
    green: 'from-green-500/10 to-green-500/5 border-green-500/30 text-green-400',
  };

  const bgColors: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  };

  const progress = Math.min((value / goal) * 100, 100);

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="text-[10px] font-semibold tracking-wider opacity-80 mb-1">{title}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-gray-500 text-xs">{unit}</span>
      </div>
      {/* Always show progress bar */}
      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{Math.round(progress)}% of goal</div>
      <div className="mt-2 text-xs">
        {done ? (
          <span className="opacity-80">✓ Done</span>
        ) : commitment ? (
          <span className="text-yellow-400 truncate block">→ {commitment}</span>
        ) : (
          <span className="text-gray-500">Set in check-in</span>
        )}
      </div>
    </div>
  );
}

function CheckinDot({ done, label, time }: { done: boolean; label: string; time: string }) {
  return (
    <div className="text-center">
      <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${done ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
      <div className={`text-sm font-medium ${done ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-500'}`}>
        {label}
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
}

// Map content keys to readable labels
const CONTENT_LABELS: Record<string, string> = {
  app_commitment: '🚀 App to ship',
  app_shipped: '🚀 App shipped?',
  app_progress: '🚀 App progress',
  health_commitment: '💪 Health',
  health_done: '💪 Health done?',
  job_commitment: '💼 Jobs goal',
  job_count: '💼 Jobs applied',
  marketing_commitment: '📣 Marketing',
  marketing_done: '📣 Marketing done?',
  outreach_commitment: '🤝 Outreach',
  outreach_count: '🤝 Outreach count',
  client_commitment: '💰 Client work',
  client_done: '💰 Client done?',
  etsy_commitment: '🛍️ Etsy',
  etsy_done: '🛍️ Etsy done?',
  other_progress: '📝 Other',
};

// Desktop activity fields to show separately
const ACTIVITY_FIELDS = ['desktop_activity', 'open_apps', 'current_app', 'xcode_projects', 'vscode_projects', 'terminal_sessions', 'browser_tabs'];

const ACTIVITY_LABELS: Record<string, string> = {
  current_app: '📍 Focus',
  xcode_projects: '🔨 Xcode',
  vscode_projects: '💻 VS Code',
  terminal_sessions: '⌨️ Terminal',
  browser_tabs: '🌐 Browser',
  open_apps: '📱 Apps',
};

function CheckInCard({
  checkIn,
  compact = false
}: {
  checkIn: { type: string; date: string; timestamp: string; content: Record<string, string> };
  compact?: boolean;
}) {
  const typeColors: Record<string, string> = {
    morning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    midday: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    evening: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const typeEmoji: Record<string, string> = {
    morning: '🌅',
    midday: '☀️',
    evening: '🌙',
  };

  // Separate content into commitments/answers and desktop activity
  const contentEntries = Object.entries(checkIn.content).filter(
    ([key]) => key !== 'timestamp' && !ACTIVITY_FIELDS.includes(key)
  );
  const activityEntries = Object.entries(checkIn.content).filter(
    ([key]) => ACTIVITY_FIELDS.includes(key) && key !== 'desktop_activity' && checkIn.content[key]
  );

  // Parse browser tabs for productive vs distraction
  const browserTabs = checkIn.content.browser_tabs || '';
  const tabs = browserTabs.split(' | ').filter(Boolean);
  const productiveTabs = tabs.filter(t => /job|linkedin|indeed|github|greenhouse|lever|workday|stackoverflow/i.test(t));
  const distractionTabs = tabs.filter(t => /youtube|twitter|reddit|netflix|twitch|instagram|tiktok|facebook/i.test(t));

  return (
    <div className={`border rounded-xl ${typeColors[checkIn.type]} ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeEmoji[checkIn.type]}</span>
          <span className="font-semibold capitalize">{checkIn.type} Check-in</span>
          {compact && <span className="text-xs opacity-60">{checkIn.date}</span>}
        </div>
        <span className="text-xs opacity-60">
          {new Date(checkIn.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      {/* Commitments/Answers */}
      <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {contentEntries.map(([key, value]) => (
          <div key={key} className="flex gap-2 text-sm">
            <span className="font-medium opacity-70 whitespace-nowrap">
              {CONTENT_LABELS[key] || key.replace(/_/g, ' ')}:
            </span>
            <span className="text-gray-900 dark:text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Desktop Activity Section */}
      {activityEntries.length > 0 && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <div className="text-xs font-semibold opacity-60 mb-2">DESKTOP ACTIVITY</div>
          <div className="grid gap-1.5">
            {checkIn.content.current_app && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">📍 Focus:</span>
                <span className="font-medium text-green-400">{checkIn.content.current_app}</span>
              </div>
            )}
            {checkIn.content.xcode_projects && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">🔨 Xcode:</span>
                <span className="text-blue-400">{checkIn.content.xcode_projects}</span>
              </div>
            )}
            {checkIn.content.vscode_projects && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">💻 VS Code:</span>
                <span className="text-blue-400">{checkIn.content.vscode_projects}</span>
              </div>
            )}
            {checkIn.content.terminal_sessions && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">⌨️ Terminal:</span>
                <span className="text-green-400">{checkIn.content.terminal_sessions}</span>
              </div>
            )}
            {productiveTabs.length > 0 && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">✅ Productive:</span>
                <span className="text-green-400">{productiveTabs.slice(0, 3).join(', ')}</span>
              </div>
            )}
            {distractionTabs.length > 0 && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">⚠️ Distraction:</span>
                <span className="text-red-400">{distractionTabs.slice(0, 3).join(', ')}</span>
              </div>
            )}
            {checkIn.content.open_apps && (
              <div className="flex gap-2 text-xs">
                <span className="opacity-60">📱 Open:</span>
                <span className="opacity-80 truncate max-w-[300px]">{checkIn.content.open_apps}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
