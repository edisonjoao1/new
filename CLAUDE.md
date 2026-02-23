# AI 4U Command Center

## Project Overview
Personal accountability and revenue tracking dashboard for Edison's app business.

**Live URL:** https://new-gold-eta.vercel.app (also accessible via ai4u.space)

## Key Features

### Revenue Tracking
- **MRR (Monthly Recurring Revenue)**: Normalized to monthly (yearly/12, weekly*4.33)
- **Revenue This Month**: Actual cash collected this month
- **Subscription Management**: Add, edit, churn subscriptions
- **Trial Tracking**: Trials don't count in MRR until converted

### Check-in System
- Morning/Midday/Evening check-ins via STAYING IN TRACK macOS app
- Tracks: App shipping, Health, Jobs, Marketing, Outreach, Client work
- Posts to `/api/command-center/checkin`

### Apps Being Tracked
- French AI (frenchAI)
- Spanish AI (spanishAI)
- Days Together (daysTogether)
- Love (love)
- Gem AI (gemAI)

## Architecture

### Tech Stack
- Next.js 14 (App Router)
- Neon Postgres for state persistence
- Vercel deployment
- TypeScript

### Key Files
- `lib/command-center.ts` - State management, DB operations
- `app/command-center/page.tsx` - Main dashboard UI
- `app/api/command-center/subscriptions/route.ts` - Subscription CRUD + MRR calculations
- `app/api/command-center/checkin/route.ts` - Check-in handling
- `app/api/command-center/status/route.ts` - Dashboard data

### Subscription Data Model
```typescript
interface Subscription {
  id: string;
  app: string;           // frenchAI, spanishAI, etc.
  plan: 'weekly' | 'monthly' | 'yearly';
  price: number;         // gross price
  startDate: string;     // YYYY-MM-DD
  isTrial: boolean;
  trialEndDate?: string; // When trial converts
  isActive: boolean;
}
```

### MRR Calculation Logic
- Trials don't count until `trialEndDate` passes
- Weekly subs: `price * 4.33`
- Monthly subs: `price * 1`
- Yearly subs: `price / 12`
- Apple cut: 15%

### Revenue This Month Calculation
- Counts actual payments that occurred this month
- Based on `startDate` and billing cycles
- Includes churned subs if they paid this month

## API Endpoints

### GET /api/command-center/subscriptions
Returns MRR, trials, revenue this month, churned data

### POST /api/command-center/subscriptions
Add new subscription
```json
{ "app": "frenchAI", "plan": "weekly", "price": 3.99, "isTrial": false }
```

### PATCH /api/command-center/subscriptions
Update subscription (trial status, end date, active status)
```json
{ "id": "...", "isTrial": false, "trialEndDate": null }
```

### DELETE /api/command-center/subscriptions?id=...
Mark subscription as churned (isActive: false)

## Deployment
- GitHub: https://github.com/edisonjoao1/new
- Auto-deploys to Vercel on push to main
- Manual deploy: `vercel --prod`

## Goals
- $1,000 MRR (first milestone)
- $10,000 MRR (dream goal)
