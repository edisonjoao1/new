# Enhanced Analytics Dashboard — User Detail & Onboarding Visibility

## Context

The IA Gratis iOS app tracks 50+ events and writes rich user data to Firestore, but the analytics dashboard doesn't surface much of it. Key gaps: no churned subscriber indicator, no AI memory visibility, no per-field profile breakdown, no onboarding status, and no churn/win-back event history. All the data already exists in Firestore and GA4 — this is purely a dashboard enhancement, no app changes needed.

## Data Sources

### Firestore User Document (`users/{deviceId}`)
Already written by the app — we just need to read and display:
- `was_previously_premium` (boolean) — set when subscription lapses
- `is_subscribed` / `is_premium` (boolean) — current subscription status
- `ai_memory_count` (number) — how many AI memories stored
- `ai_memories_sample` (string[]) — sample of stored memories
- `personalization_score` (number) — aggregate profile completeness
- Profile fields: `user_name`, `assistant_name`, `interests`, `occupation`, `goals`, `communication_style`, `about_me`

### GA4 Events (queryable via Data API)
Every event has a `device_id` parameter (set at `AnalyticsService.swift:983`) that maps to the Firestore doc ID, enabling per-user event queries.

**Onboarding events:**
- `onboarding_started`, `onboarding_step_1` through `onboarding_step_5`
- `onboarding_completed`, `onboarding_skipped`
- Parameters: `step`, `name_entered`, `chat_exchanges`, `trial_tapped`

**Churn/win-back events:**
- `subscriber_churned` (param: `memory_count`)
- `winback_banner_shown`, `winback_banner_tapped`, `winback_banner_dismissed`
- `winback_resubscribed`

## Files to Modify

| File | Changes |
|------|---------|
| `app/api/analytics/users/route.ts` | Read `was_previously_premium`, `ai_memory_count`, `ai_memories_sample` from Firestore; add `churned` segment |
| `components/analytics/UserList.tsx` | Add churned icon + segment + dashboard card; add onboarding funnel view tab |
| `components/analytics/UserDetailModal.tsx` | Add churned badge, AI memory section, profile field breakdown, onboarding journey, churn/win-back events |

## New File

| File | Purpose |
|------|---------|
| `app/api/analytics/onboarding/route.ts` | GA4 queries for onboarding funnel (aggregate), per-user onboarding status, and per-user churn/win-back events. Reuses OAuth pattern from `ga-events/route.ts` |

---

## Phase 1: Firestore-Only Enhancements (no GA4)

### 1A. Churned User Icon & Segment

**Backend** (`users/route.ts`):
- Read `was_previously_premium` from Firestore user docs (already written by app)
- Add to user list response alongside `is_subscribed`
- Add `churned` segment: `was_previously_premium == true && is_subscribed == false`
- Add `churned` count to dashboard stats and segment counts

**Frontend** (`UserList.tsx`):
- Add `was_previously_premium: boolean` to `User` interface
- Add `'churned'` to `UserSegment` type
- Add churned segment button: `{ id: 'churned', label: 'Churned', icon: UserX, description: 'Previously subscribed', color: 'red' }`
- In user table rows: show `UserX` icon (red) when `was_previously_premium && !is_subscribed` (next to existing Crown icon)
- Add "Churned" card to dashboard overview stats grid

**Frontend** (`UserDetailModal.tsx`):
- Add "Churned" badge (red) in header next to existing "Subscribed" badge
- Add "Previously Subscribed" feature badge

### 1B. AI Memory Display

**Backend** (`users/route.ts`):
- In `getUserDetail`, read and return `ai_memory_count`, `ai_memories_sample`, and computed `ai_memory_at_free_limit` (count >= 10 && not subscribed)

**Frontend** (`UserDetailModal.tsx`):
- New "AI Memories" section in Overview tab with Brain icon
- Shows memory count badge, "At Free Limit (10)" warning if applicable
- Lists the `ai_memories_sample` strings in styled cards
- Shows "... and X more memories" if count > sample length

### 1C. Profile Field Breakdown

**Frontend** (`UserDetailModal.tsx`):
- New "Profile Completeness" section replacing the simple score number
- 2x4 grid checking each field: Name, Assistant Name, Interests, Occupation, Goals, Communication Style, About Me, Timezone
- Green `CircleCheck` for set fields, gray `CircleX` for empty
- Color-coded progress bar (green >= 6, yellow >= 3, red < 3)
- Score display: `X/8`

---

## Phase 2: GA4 Event Integration

### 2A. New API Route (`app/api/analytics/onboarding/route.ts`)

Reuses the exact OAuth + `runGAReport` pattern from `ga-events/route.ts` (lines 16-64).

**Three modes via `?mode=` param:**

**`mode=funnel`** (aggregate):
- Queries GA4 for all onboarding event counts across all users
- Returns: step-by-step funnel (started -> step 1-5 -> completed), skip distribution by step, metrics (completion rate, skip rate, name entry rate, trial tap rate)

**`mode=user&deviceId=X`** (per-user):
- Queries GA4 with `customEvent:device_id` dimension filtered to specific user
- Returns: completed/skipped/step reached, name entered vs skipped, chat exchange count, trial button tapped
- Falls back gracefully if `device_id` isn't registered as a custom dimension in GA4

**`mode=churn&deviceId=X`** (per-user churn):
- Queries GA4 for `subscriber_churned`, `winback_banner_*`, `winback_resubscribed` events for specific user
- Returns: hasChurned, memoryCountAtChurn, win-back banner stats, resubscribed boolean

**Caching**: 5-min for per-user, 30-min for funnel aggregate.

### 2B. Onboarding Funnel View (`UserList.tsx`)

- Add `'onboarding'` to viewMode options with `Footprints` icon
- New view showing:
  - Metric cards: Completion Rate, Skip Rate, Name Entry Rate, Trial Tap Rate
  - Funnel visualization (same style as existing `ConversionFunnel.tsx`): horizontal bars per step with dropoff indicators
  - Skip distribution chart: which steps users bail at
- Fetched on-demand when tab is selected

### 2C. Per-User Onboarding Journey (`UserDetailModal.tsx`)

- Fetched alongside user detail (parallel requests)
- New "Onboarding Journey" section with:
  - Completed/Skipped/Not completed indicator
  - Name entered vs skipped
  - Chat exchange count
  - Trial tapped indicator
  - Step progress bar (5 segments, filled purple for reached steps)

### 2D. Churn & Win-back Events (`UserDetailModal.tsx`)

- Only shown for churned users (`was_previously_premium && !is_subscribed`)
- Red-tinted card showing:
  - "Subscriber churned" with memory count at churn
  - Win-back mini funnel: Banner Shown -> Banner Tapped -> Dismissed -> Resubscribed (4 stat boxes)
  - Green highlight if resubscribed

---

## Implementation Order

1. Phase 1A: Churned icon/segment (backend + UserList + UserDetailModal)
2. Phase 1B: AI memory display (backend + UserDetailModal)
3. Phase 1C: Profile field breakdown (UserDetailModal only)
4. Phase 2A: New onboarding API route
5. Phase 2B: Onboarding funnel view
6. Phase 2C: Per-user onboarding in detail modal
7. Phase 2D: Per-user churn/win-back in detail modal

## Verification

1. Run locally: `cd ~/Desktop/new-analytics-temp && npm run dev`
2. Navigate to `/analytics/users`, authenticate with password
3. Verify "Churned" segment appears with correct count
4. Verify churned users show red `UserX` icon in list, gold `Crown` for active subscribers
5. Click into a user -> verify AI Memories section shows count + sample texts
6. Verify Profile Completeness shows per-field checkmarks matching actual data
7. Switch to Onboarding view -> verify funnel loads from GA4
8. Click into a specific user -> verify Onboarding Journey section shows their status
9. Click into a churned user -> verify Churn & Win-back section shows event data
10. Test both dark and light mode for all new sections

## Notes

- GA4 has 24-48h data processing delay -- onboarding data will note this
- If `device_id` isn't registered as a GA4 custom dimension, per-user GA4 queries will gracefully degrade (show "Data unavailable" instead of errors)
- All new sections follow existing dark/light mode patterns with `isDark` conditional classes
- The GA4 property ID for IA Gratis is `488396770`
