# Firestore Schema & Development Workflow

> Single source of truth for all data flowing between the iOS app and the analytics dashboard.
> **Update this file FIRST when adding new features.**

---

## Development Workflow

### Dashboard-First Development

When building a new feature that involves analytics data:

1. **Define the field** in this document first (name, type, who writes, who reads)
2. **Add it to the dashboard** (API route + UI) — it will show empty initially
3. **Build the iOS feature** using the exact field name defined here
4. **Push the iOS update** — data starts flowing, dashboard lights up automatically

This prevents field name mismatches (e.g., `is_premium` vs `is_subscribed`) and ensures nothing falls through the cracks.

### What Doesn't Need an App Release

These are controlled server-side and update instantly:

- **System prompts** — via ConfigManager remote config
- **Push notification content & targeting** — server-side
- **Feature flags** — via remote config
- **Dashboard changes** — Vercel auto-deploys on push to main
- **Pricing/credit limits** — via remote config

### What Requires an App Release

- New Firestore fields (iOS must write them)
- New UI features or screens
- Model changes (e.g., switching from gpt-4.1-mini to gpt-5-mini)
- New SDK integrations

### Version-Aware Dashboard

The dashboard reads `app_version` from every user. When rolling out new fields:
- Filter by app version to see adoption
- Old fields stay as fallbacks until most users have updated
- Never remove dashboard reads for old fields until <5% of users are on old versions

---

## Estimated API Cost Rates

Defined in `app/api/analytics/users/route.ts` → `costs.breakdown`:

| Feature | Model | Rate | Notes |
|---------|-------|------|-------|
| Chat | `gpt-4.1-mini` | $0.001/message | ~500 tokens avg, $0.40/1M in + $1.60/1M out |
| Images | `gpt-image-1` | $0.19/image | High quality, 1024x1024 |
| Voice | `gpt-realtime` | $0.30/minute | ~$0.06 in + $0.24 out, ~2min avg session |
| Web Search | `gpt-4.1-mini` + web tool | $0.013/search | $0.01/call + ~8K context tokens |

Update these rates when OpenAI changes pricing. Dashboard auto-recalculates.

---

## User Document (`users/{device_id}`)

### Identity & Device

| Field | Type | iOS Writer | Dashboard Reader | Notes |
|-------|------|-----------|-----------------|-------|
| `device_id` | string | `updateUserEngagementInFirestore()` | List + Detail | UUID, primary key |
| `created_at` | timestamp | `updateUserEngagementInFirestore()` | List + Detail | First-ever open date |
| `first_open_date` | timestamp | `updateUserEngagementInFirestore()` | List + Detail + Stats | Same as created_at |
| `last_open_date` | timestamp | `updateUserEngagementInFirestore()` | Detail | Last app launch |
| `last_active` | server timestamp | `updateUserEngagement...()`, `saveConversation...()` | List + Detail + Stats | Most recent activity |
| `days_since_first_open` | number | `updateUserEngagementInFirestore()` | List + Detail | Computed on each open |
| `device_model` | string | `updateUserEngagementInFirestore()` | List + Detail + Stats | e.g., "iPhone" |
| `os_version` | string | `updateUserEngagementInFirestore()` | List + Detail | e.g., "26.2.1" |
| `app_version` | string | `updateUserEngagementInFirestore()` | List + Detail | e.g., "0.52" |
| `locale` | string | `updateUserEngagementInFirestore()` | List + Detail + Stats | e.g., "en_US" |
| `timezone` | string | `updateUserEngagementInFirestore()` | Detail | e.g., "America/New_York" |
| `previous_version` | string | App update detection | Detail | Previous app version |

### Profile (written by `syncUserProfile()`)

| Field | Type | Dashboard Reader | Notes |
|-------|------|-----------------|-------|
| `user_name` | string | List + Detail | Only written if non-empty |
| `assistant_name` | string | Detail | Custom AI name |
| `interests` | array[string] | Detail | Only written if non-empty |
| `occupation` | string | Detail | Premium only |
| `goals` | array[string] | Detail | Premium only |
| `communication_style` | string | Detail | e.g., "professional" |
| `about_me` | string | Detail | Only written if non-empty |
| `profile_updated_at` | server timestamp | Not read | Sync timestamp |

### Core Counters (written by `updateUserEngagementInFirestore()`)

| Field | Type | Dashboard Reader | Notes |
|-------|------|-----------------|-------|
| `total_app_opens` | number | List + Detail + Stats | Incremented on init |
| `total_messages_sent` | number | List + Detail + Stats | Syncs on app open (may lag) |
| `total_images_generated` | number | List + Detail + Stats | Used for cost calc |
| `total_videos_generated` | number | List + Detail + Stats | |
| `total_voice_sessions` | number | List + Detail + Stats | Used for cost calc |
| `total_web_searches` | number | List + Detail + Stats | Used for cost calc |
| `total_session_seconds` | number | List + Detail + Stats | Fixed in v0.52 (scenePhase) |
| `total_learn_lessons_viewed` | number | Detail | |

### Subscription & Notifications

| Field | Type | iOS Writer | Dashboard Reader |
|-------|------|-----------|-----------------|
| `is_subscribed` | boolean | `updateSubscriptionStatus()` | List + Detail + Stats |
| `subscription_updated_at` | timestamp | `updateSubscriptionStatus()` | Detail |
| `notification_prompted` | boolean | `requestNotificationPermission()` | Stats (3-way split) |
| `notification_granted` | boolean | `updateUserEngagement...()` | List + Detail + Stats |
| `notifications_enabled` | boolean | `updateNotificationPreferences()` | Detail |
| `notification_frequency` | string | `updateNotificationPreferences()` | Detail |
| `preferred_notification_time` | string | `updateNotificationPreferences()` | Detail |
| `fcm_token` | string | `saveFCMToken()` | Stats (reachable count) |

### Activity Patterns

| Field | Type | iOS Writer | Dashboard Reader | Notes |
|-------|------|-----------|-----------------|-------|
| `activity_hours` | array[number] | `arrayUnion([currentHour])` | Stats (peak hours) | Bounded 0-23, deduped |
| `active_dates` | array[string] | `arrayUnion([todayString])` | Detail (calendar + streaks) | "YYYY-MM-DD", 1/day max |
| `engagement_level` | string | Computed on each open | List + Detail | power/engaged/curious/inactive |
| `personalization_score` | number | Computed from tracking flags | List + Detail + Stats | 0-100, fixed in v0.52 |

### Lesson Tracking

| Field | Type | iOS Writer | Dashboard Reader |
|-------|------|-----------|-----------------|
| `viewed_lesson_ids` | array[string] | `arrayUnion`, only if non-empty | Detail |
| `completed_lesson_ids` | array[string] | `arrayUnion`, only if non-empty | Detail |
| `viewed_lesson_names` | array[string] | `syncViewedLessonNames()` | **Not read** |

### Error Tracking

| Field | Type | iOS Writer | Dashboard Reader |
|-------|------|-----------|-----------------|
| `error_count` | number | `saveErrorToFirestore()` (increment) | Detail |
| `last_error` | timestamp | `saveErrorToFirestore()` | Detail |
| `last_error_category` | string | `saveErrorToFirestore()` | Detail |
| `last_error_code` | number | `saveErrorToFirestore()` | Detail |
| `image_failure_count` | number | `saveImageFailureToFirestore()` (increment) | Detail |
| `last_image_failure` | timestamp | `saveImageFailureToFirestore()` | Detail |
| `last_image_failure_type` | string | `saveImageFailureToFirestore()` | Detail |
| `voice_failure_count` | number | `saveVoiceFailureToFirestore()` (increment) | List + Detail |
| `last_voice_failure` | timestamp | `saveVoiceFailureToFirestore()` | Detail |
| `last_voice_failure_type` | string | `saveVoiceFailureToFirestore()` | Detail |
| `nsfw_attempt_count` | number | `saveContentPolicyEvent()` (increment) | List + Detail |
| `last_nsfw_attempt` | timestamp | `saveContentPolicyEvent()` | Detail |

### Rating & Feedback

| Field | Type | iOS Writer | Dashboard Reader | Status |
|-------|------|-----------|-----------------|--------|
| `has_rated` | boolean | **Not written to Firestore** | List + Detail + Stats | ORPHANED |
| `rating_response` | string | **Not written** | Detail | ORPHANED |
| `rating_prompt_count` | number | **Not written** | Detail | ORPHANED |
| `last_rating_event` | string | **Not written** | Detail | ORPHANED |
| `last_rating_event_at` | timestamp | **Not written** | Detail | ORPHANED |
| `feedback_count` | number | **Not written** | Detail | ORPHANED |
| `last_feedback` | timestamp | **Not written** | Detail | ORPHANED |
| `last_feedback_trigger` | string | **Not written** | Detail | ORPHANED |

> **TODO**: iOS logs rating events to Firebase Analytics only, not Firestore.
> Need to either write these to the user doc or create a Cloud Function to aggregate.

### Legacy/Deprecated Fields (still in some user docs)

| Field | Status | Notes |
|-------|--------|-------|
| `is_premium` | Replaced by `is_subscribed` | Dashboard reads both as fallback |
| `activity_timestamps` | Replaced by `active_dates` | Unbounded growth, removed |
| `personalization_fields` | Removed | Redundant boolean map |
| `has_basic_personalization` | Removed | Derivable from personalization_score |
| `missing_personalizations` | Removed | Derivable from personalization_score |

---

## Subcollections

### `conversations/{conversation_id}`

Written by `saveConversationToFirestore()`, `updateConversationMessages()`

| Field | Type | Notes |
|-------|------|-------|
| `created_at` | server timestamp | |
| `updated_at` | server timestamp | |
| `message_count` | number | Dashboard uses this for activity timeline |
| `messages` | array[{role, content}] | Full chat history |
| `metadata` | object | Context (not read by dashboard) |
| `openai_response_id` | string | For OpenAI reference (not read) |
| `behavioral_signals` | object | copied, shared, length |

### `errors/{error_id}`

Written by `saveErrorToFirestore()`. Also saved to global `app_errors` collection.

### `voice_failures/{failure_id}`

Written by `saveVoiceFailureToFirestore()`. Also saved to global `voice_failures` collection.

### `image_failures/{failure_id}`

Written by `saveImageFailureToFirestore()`. Also saved to global `image_failures` collection.

### `voice_sessions/{session_id}`

Stores successful voice session logs.

### `parse_errors/{doc_id}`

Written by `logParseError()`. Debugging collection for stream parsing issues.

---

## Global Collections (not under users)

| Collection | Purpose | Written By |
|-----------|---------|-----------|
| `app_errors` | All errors across all users | `saveErrorToFirestore()` |
| `voice_failures` | All voice failures | `saveVoiceFailureToFirestore()` |
| `image_failures` | All image failures | `saveImageFailureToFirestore()` |
| `content_policy_events` | NSFW/policy violations | `saveContentPolicyEvent()` |
| `parse_errors` | Stream parsing errors | `logParseError()` |

---

## Dashboard Computed Fields

These are calculated server-side, not stored in Firestore:

| Field | Formula | Notes |
|-------|---------|-------|
| `engagement_score` | Weighted sum (100pts max) | Messages 30, Convos 15, Images 10, Voice 10, Videos 10, Web 8, Time 7, Personal 5, Sub 5 |
| `current_streak` | Consecutive days from `active_dates` | Must include today or yesterday |
| `longest_streak` | Max consecutive run in `active_dates` | |
| `estimated_cost` | Usage × rates | Images $0.19, Voice $0.60/session, Search $0.013, Chat $0.001 |
| `conversation_count` | Subcollection `.count()` | Used as fallback when `total_messages_sent` is 0 |

---

## Known Issues & TODOs

- [ ] **Rating fields orphaned**: iOS logs to Firebase Analytics, not Firestore user doc
- [ ] **`viewed_lesson_names`**: Written by iOS but never read by dashboard
- [ ] **`previous_version`**: Read by dashboard but unclear if/when iOS writes it
- [ ] **Voice session details**: `was_successful`, `end_reason` read by dashboard but write path unclear
- [ ] **`total_messages_sent` lag**: Counter only syncs on next app open. Dashboard uses `max(messages, conversations)` as workaround
