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

---

# Analytics Dashboard

## Purpose
Internal analytics dashboard for Edison's iOS apps, primarily **Inteligencia Artificial Gratis** (IA Gratis). Connects to Firebase/Firestore for user data and GA4 Data API for event analytics. Password-protected.

## Styling & Charts
- Tailwind CSS + Radix UI primitives
- Recharts for charts
- lucide-react for icons
- Firebase Admin SDK (Firestore), Google Analytics Data API v1beta (OAuth)

## How to Run
```bash
cd ~/Desktop/new-analytics-temp
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run type-check   # TypeScript check
```

## Environment Variables (`.env.local`)
```
OPENAI_API_KEY          # For AI evaluation features + AI-generated push notifications
GOOGLE_CLIENT_ID        # GA4 OAuth
GOOGLE_CLIENT_SECRET    # GA4 OAuth
GOOGLE_REFRESH_TOKEN    # GA4 OAuth
ANALYTICS_PASSWORD      # Dashboard login password
RESEND_API_KEY          # Email service
ASC_KEY_ID              # App Store Connect API key ID (9BP2A7V89P)
ASC_ISSUER_ID           # ASC API issuer ID
ASC_PRIVATE_KEY         # ASC .p8 private key (single-line with \n)
ASC_VENDOR_NUMBER       # ASC vendor number (find in Sales & Trends)
```

Firebase credentials: `serviceAccountKey.json` in project root (not committed).

## Analytics Architecture

### Pages
- `/analytics` — Main dashboard with tabs for different views
- `/analytics/users` — User list + detail modal (primary working area)
- `/admin` — Admin panel
- `/playground` — AI playground
- Plus marketing pages: `/about`, `/services`, `/blog`, etc.

### API Routes (`app/api/analytics/`)
| Route | Purpose |
|-------|---------|
| `route.ts` | Root analytics (overview) |
| `users/route.ts` | **Main user data** — Firestore queries, dashboard stats, user list, user detail |
| `ga-events/route.ts` | GA4 event queries via OAuth + Data API |
| `ga-properties/route.ts` | GA4 property discovery |
| `funnel/route.ts` | Conversion funnel data |
| `retention/route.ts` | Retention cohort analysis |
| `errors/route.ts` | Error tracking |
| `behavior-insights/route.ts` | Behavior analysis |
| `performance/route.ts` | Performance metrics |
| `alerts/route.ts` | Alert system |
| `voice-diagnostics/route.ts` | Voice feature diagnostics |
| `ai-evaluation/route.ts` | AI response quality evaluation |
| `insights/route.ts` | Actionable insights |
| `realtime/route.ts` | Realtime data |
| `system-prompt/route.ts` | System prompt management |
| `prompt-insights/route.ts` | Prompt analytics |
| `onboarding/route.ts` | Onboarding funnel + per-user onboarding/churn events (GA4) |
| `asc-revenue/route.ts` | ASC revenue data — MRR, subs, refunds, daily timeline (GET cached, POST refresh) |
| `push-notifications/route.ts` | Send push notifications — individual, AI-generated, template, segment broadcast |

### API Routes (`app/api/webhooks/`)
| Route | Purpose |
|-------|---------|
| `apple-notifications/route.ts` | Apple Server Notifications v2 — subscription lifecycle events (trial, renew, churn, refund) |

### Components (`components/analytics/`)
| Component | Purpose |
|-----------|---------|
| `UserList.tsx` | **Main view** — Dashboard stats, segment filters, user table, view modes |
| `UserDetailModal.tsx` | **User detail** — 4-tab modal (Overview, Conversations, Images, Voice) |
| `ConversionFunnel.tsx` | Funnel visualization with horizontal bars |
| `RetentionCohorts.tsx` | Retention analysis |
| `ErrorTracking.tsx` | Error monitoring |
| `BehaviorInsights.tsx` | Behavior patterns |
| `PerformanceDashboard.tsx` | Performance metrics |
| `AlertsPanel.tsx` | Alerts management |
| `ConversationViewer.tsx` | Chat thread viewer |
| `EnhancedAIDashboard.tsx` | AI quality dashboard |
| `VoiceDiagnostics.tsx` | Voice feature analysis |

### Libraries (`lib/`)
| File | Purpose |
|------|---------|
| `firebase/admin.ts` | Firebase Admin SDK — Firestore + Messaging exports |
| `apple/asc-client.ts` | ASC API client — JWT auth, sales report fetching, MRR calculation |
| `apple/jwt-validator.ts` | JWS validation for Apple Server Notifications (x5c chain) |
| `apple/notification-types.ts` | TypeScript types for Apple Server Notification v2 payloads |
| `notifications/templates.ts` | Push notification templates with placeholder resolution |

### Key Patterns
- **Segment filtering**: `UserSegment` type defines user segments (all, today, new, power, at_risk, voice, images, subscribed, videos, churned, billing_retry)
- **View modes**: dashboard | users | retention | funnel | errors | behavior | performance | alerts | voice | insights | onboarding
- **Dark mode**: `isDark` prop threaded through all components
- **Caching**: Server-side 5-min TTL cache for most queries
- **Auth**: Password check via `ANALYTICS_PASSWORD` env var

### Firestore Schema (`users/{deviceId}`)
Key fields read by dashboard:
- `user_name`, `locale`, `device_model`, `os_version`, `app_version`
- `total_messages_sent`, `total_images_generated`, `total_videos_generated`, `total_voice_sessions`, `total_web_searches`
- `total_app_opens`, `total_session_seconds`
- `is_subscribed`, `is_premium`, `was_previously_premium`, `is_in_billing_retry`
- `notification_granted`, `has_rated`
- `personalization_score`, `engagement_level`
- `ai_memory_count`, `ai_memories_sample`
- Profile: `assistant_name`, `interests`, `occupation`, `goals`, `communication_style`, `about_me`
- `first_open_date`, `last_active`, `created_at`, `last_open_date`

### GA4 Integration
- Property ID: `488396770` (IA Gratis)
- OAuth flow: refresh token -> access token -> Data API queries
- Pattern in `ga-events/route.ts`: `getAccessToken()` + `runGAReport()`
- Events queryable by `customEvent:device_id` dimension for per-user filtering

## What's Done (Feb 28, 2026)
- [x] Phase 1A: Churned user icon (`UserX`), segment filter, and dashboard card
- [x] Phase 1B: AI Memory display in user detail modal (count, sample texts, free limit warning)
- [x] Phase 1C: Profile field breakdown (8-field checklist with progress bar)
- [x] Phase 2A: New onboarding API route (`app/api/analytics/onboarding/route.ts`) — 3 modes: funnel, user, churn
- [x] Phase 2B: Onboarding funnel view tab in UserList (metric cards + step visualization)
- [x] Phase 2C: Per-user onboarding journey in detail modal (step progress, name/chat/trial status)
- [x] Phase 2D: Per-user churn/win-back events in detail modal (banner stats, resubscribe tracking)
- [x] Build passes with zero TypeScript errors

## What's Done (Mar 1, 2026)
- [x] Billing retry detection & display — amber `CreditCard` icon, "Billing Retry" segment
- [x] Manual subscription status override — PATCH `/api/analytics/users` endpoint
- [x] Override buttons in user detail modal (Billing Retry / Churned / Subscribed / Free)
- [x] `is_in_billing_retry` read from Firestore (future-proof for app update)
- [x] GA4 `subscriber_churned` event query for supplementing `was_previously_premium`
- [x] iOS app changes: billing retry check before firing `subscriber_churned` (not yet deployed)
- [x] iOS app changes: `syncChurnedStatus()`, `syncBillingRetryStatus()` Firestore writes (not yet deployed)

### Manual Override API
```
PATCH /api/analytics/users
Body: { key, userId, status }
Status values: billing_retry | churned | subscribed | free
```
Writes `subscription_status_override`, `subscription_status_override_at`, and relevant Firestore fields directly. Invalidates caches.

## What's Done (Mar 2, 2026) — Intelligence Layer
All features work with the current live iOS app — no app update required.

### Feature 1: Apple Server Notifications v2 Webhook
- [x] `app/api/webhooks/apple-notifications/route.ts` — POST handler for Apple's signed JWS payloads
- [x] `lib/apple/jwt-validator.ts` — JWS validation using Apple's root certificate (x5c chain)
- [x] `lib/apple/notification-types.ts` — TypeScript enums/interfaces for all notification types
- [x] Handles: SUBSCRIBED, DID_RENEW, DID_FAIL_TO_RENEW, EXPIRED, GRACE_PERIOD_EXPIRED, REFUND, RENEWAL_EXTENDED, DID_CHANGE_RENEWAL_STATUS
- [x] Transaction map lookup for device ID resolution (without appAccountToken)
- [x] Audit log to `subscription_events/{docId}` Firestore collection
- [x] Unmatched events stored in `unmatched_subscription_events/{docId}` until app update adds appAccountToken
- **Edison TODO**: Configure webhook URL in ASC → App Info → Server Notifications → `https://new-gold-eta.vercel.app/api/webhooks/apple-notifications`, Version 2

### Feature 2: Dashboard Push Notifications
- [x] `app/api/analytics/push-notifications/route.ts` — 4 POST modes (individual, ai, template, segment) + GET for templates/history
- [x] `lib/notifications/templates.ts` — 5 templates (win_back, feature_discovery, milestone, billing_issue, conversation_continuation) with placeholder resolution
- [x] `lib/firebase/admin.ts` — Added `getFirebaseMessaging()` export
- [x] **UserDetailModal.tsx** — "Send Push Notification" section with 3 modes:
  - AI-Generated (reads conversations + memories, calls gpt-4.1-mini to craft personalized message)
  - Template (dropdown of predefined templates)
  - Custom (title/body/targetView inputs)
  - History toggle showing last 3 sent notifications
  - Disabled gracefully when user has no FCM token
- [x] **UserList.tsx** — Segment broadcast UI (appears for subscribed/churned/billing_retry/at_risk segments)
  - Title/body/targetView inputs, recipient count preview, confirmation dialog
  - Results summary (sent/failed/no-token)
- This is an OPTIONAL manual tool — does NOT replace the automated Cloud Functions (3 daily crons)

### Feature 3: Billing Retry Filter in Cloud Functions
- [x] `~/Desktop/Inteligencia Artificial Gratis/functions/index.js` — 6-line addition
  - Checks `is_in_billing_retry` field in processNotificationsForWindow
  - Skips standard re-engagement for billing retry users
  - Tracks skip count in `stats.skipped.billingRetry`
- **Edison TODO**: Deploy with `firebase deploy --only functions`

### Feature 4: ASC Revenue Integration
- [x] `lib/apple/asc-client.ts` — Full ASC API client
  - JWT generation (ES256 with .p8 key, 20-min expiry)
  - Sales report fetching (gzipped TSV → parsed records)
  - Revenue calculation (filters for subscription product types: IA1, IA9, IAY, 1F)
  - MRR estimation (weekly×4.33, monthly×1, yearly÷12)
- [x] `app/api/analytics/asc-revenue/route.ts` — GET with dual cache (30-min memory + Firestore `asc_revenue/{date}`) + POST refresh
- [x] **UserList.tsx** — Revenue cards (MRR, This Month, New Subs, Renewals, Refunds) + Recharts AreaChart daily timeline + product breakdown pills
- **Edison TODO**: Add `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`, `ASC_VENDOR_NUMBER` env vars to Vercel

### New Firestore Collections
| Collection | Purpose |
|------------|---------|
| `subscription_events/{docId}` | Audit log of every Apple Server Notification |
| `unmatched_subscription_events/{docId}` | Events that couldn't be matched to a device ID (temporary) |
| `transaction_map/{originalTransactionId}` | Maps Apple transaction IDs to device IDs |
| `asc_revenue/{date}` | Cached daily ASC revenue data |

### Edison's Manual Steps (after deploy)
1. Register `device_id` as GA4 custom dimension — GA4 Admin → Custom Definitions → Create → Name: `device_id`, Scope: Event, Parameter: `device_id`
2. Configure Apple Server Notifications URL in ASC — App Info → Server Notifications → URL: `https://new-gold-eta.vercel.app/api/webhooks/apple-notifications`, Version 2
3. Add ASC env vars to Vercel — `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`, `ASC_VENDOR_NUMBER`
4. Deploy Cloud Functions — `firebase deploy --only functions` (billing retry filter)

## Known Issues
- `UserDetailModal.tsx` and `UserList.tsx` are large files (1500+ lines each) — be careful with edits
- GA4 has 24-48h data processing delay for events
- `device_id` must be registered as a custom dimension in GA4 for per-user event queries to work
- iOS app billing retry detection requires app update to deploy — until then, use manual override from dashboard
- Billing retry users show `is_subscribed: false` in Firestore because StoreKit detects no active entitlements during retry
- ASC Sales Reports API uses `filter[version]: '1_1'` (NOT `1_3`) — version `1_1` is the only supported version for SALES/SUMMARY reports
- ASC report version `1_1` does not populate the `Period` field — subscription periods show as "Unknown"
