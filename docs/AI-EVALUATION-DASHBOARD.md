# AI Evaluation Dashboard

Analyze and improve your AI assistant's conversation quality with OpenAI-powered insights.

## Overview

The AI Evaluation Dashboard analyzes conversations stored in Firebase Firestore to provide:
- **Quality Scoring**: 0-100 score for overall AI performance
- **Issue Detection**: Identifies critical, high, medium, and low severity problems
- **Success Patterns**: What your AI does well
- **Prompt Recommendations**: Copy-paste ready improvements for your system prompt
- **User Journey Insights**: Retention drivers and churn signals

## Quick Start

### 1. Setup Firebase

Add your Firebase service account credentials to `.env.local`:

```bash
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project",...}'
```

To get this:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Copy the entire JSON content

### 2. Add OpenAI API Key

```bash
OPENAI_API_KEY=sk-...
```

### 3. Set Analytics Password

```bash
ANALYTICS_PASSWORD=your-secure-password
```

### 4. Access the Dashboard

Navigate to `/analytics/ai-evaluation` and enter your analytics password.

## Features

### Date-Based Analysis

Run evaluations for specific dates to track quality over time:
- Select any date to analyze conversations from that day
- Compare performance across different periods
- Identify trends and patterns

### AI-Powered Analysis

Click "Run AI Analysis" to get:

#### Quality Score (0-100)
- **90-100**: Exceptional - Users clearly got value
- **80-89**: Very Good - Helpful with minor imperfections
- **70-79**: Good - Gets the job done
- **60-69**: Acceptable - Noticeable issues
- **50-59**: Below Average - Significant issues
- **<50**: Poor - Failed to help users

#### Issues Found
Each issue includes:
- **Severity**: Critical, High, Medium, Low
- **Issue**: Clear problem statement
- **Example**: Exact quote from conversation
- **Affected Users**: Who's impacted
- **Recommendation**: Specific fix
- **Expected Impact**: What improves if fixed

#### Success Patterns
Learn what works:
- Pattern description
- Real example from conversations
- Frequency (common/occasional/rare)
- Impact on user experience

#### Prompt Recommendations
Get actionable changes:
- Current problematic behavior
- Suggested system prompt change (copy-paste ready)
- Expected impact
- Potential risks

#### Quick Wins
2-3 simple changes implementable immediately with high impact.

### History & Trends

All evaluations are saved automatically:
- View past reports from the History tab
- Click any report for full analysis
- Direct links via URL parameters: `/analytics/ai-evaluation?date=2026-01-22`

### Recent Reports Quick Access

Even when collapsed, see your most recent reports with quality scores.

## Architecture

### Files Created

```
app/
├── analytics/
│   └── ai-evaluation/
│       └── page.tsx          # Full dashboard page
├── api/
│   └── analytics/
│       ├── ai-evaluation/
│       │   └── route.ts      # Main API endpoint
│       ├── insights/
│       │   └── route.ts      # Portfolio insights
│       └── system-prompt/
│           └── route.ts      # System prompt management

components/
└── analytics/
    ├── AIEvaluationPanel.tsx      # Embeddable panel
    ├── EvaluationDetailModal.tsx  # Full analysis modal
    ├── QualityGauge.tsx           # Visual quality meter
    ├── UserJourneyInsights.tsx    # Journey analysis
    └── ...other components

lib/
├── analytics/
│   ├── app-contexts.ts       # App profile types
│   └── app-contexts.json     # App profile data
└── firebase/
    └── admin.ts              # Firebase Admin SDK
```

### API Endpoints

#### POST `/api/analytics/ai-evaluation`

Run a new evaluation.

**Request:**
```json
{
  "key": "your-analytics-password",
  "date": "2026-01-22",
  "sampleSize": 500,
  "runAIAnalysis": true,
  "systemPrompt": "Optional: Your current system prompt for context"
}
```

**Response:**
```json
{
  "userMetrics": {
    "totalUsers": 100,
    "activeUsers24h": 25,
    "activeUsers7d": 60,
    "avgConversationsPerUser": 3.5,
    "topLocales": [{"locale": "es_ES", "count": 40}],
    "topDevices": [{"device": "iPhone 15", "count": 30}]
  },
  "aiMetrics": {
    "totalConversations": 150,
    "totalMessages": 450,
    "avgConversationLength": 3.0,
    "avgResponseLength": 280,
    "topTopics": [{"topic": "question", "count": 50}],
    "responseQuality": {
      "tooShort": 10,
      "appropriate": 120,
      "tooLong": 20
    },
    "conversationDepth": {
      "shallow": 40,
      "moderate": 80,
      "deep": 30
    }
  },
  "successMetrics": {
    "successful": 80,
    "partial": 40,
    "failed": 20,
    "abandoned": 10,
    "avgSuccessScore": 72
  },
  "aiAnalysis": {
    "overallQuality": 75,
    "summary": "AI performs well on Q&A but struggles with Spanish creative writing...",
    "issuesFound": [...],
    "successPatterns": [...],
    "promptRecommendations": [...],
    "quickWins": [...],
    "userJourneyInsights": {...}
  },
  "analysisDate": "2026-01-22",
  "generatedAt": "2026-01-22T15:30:00.000Z",
  "cached": false
}
```

#### GET `/api/analytics/ai-evaluation?history=true`

Fetch evaluation history.

**Query Parameters:**
- `key`: Analytics password (required)
- `history`: Set to "true" to fetch history
- `limit`: Number of records (default: 10)

**Response:**
```json
{
  "history": [
    {
      "id": "daily_2026-01-22",
      "date": "2026-01-22",
      "createdAt": "2026-01-22T15:30:00.000Z",
      "sampleSize": 100,
      "aiAnalysis": {...}
    }
  ],
  "count": 1
}
```

## Firebase Data Structure

The dashboard expects this Firestore structure:

```
users/
├── {userId}/
│   ├── locale: "es_ES"
│   ├── device_model: "iPhone 15"
│   ├── app_version: "2.1.0"
│   ├── last_active: Timestamp
│   └── conversations/
│       └── {conversationId}/
│           ├── created_at: Timestamp
│           └── messages: [
│               {
│                 "role": "user" | "assistant",
│                 "content": "Message text",
│                 "timestamp": Timestamp
│               }
│           ]
```

## Components

### AIEvaluationPanel

Embeddable panel for the main analytics dashboard.

```tsx
import AIEvaluationPanel from '@/components/analytics/AIEvaluationPanel'

<AIEvaluationPanel
  analyticsKey="your-key"
  isDark={isDarkMode}
/>
```

### EvaluationDetailModal

Full-screen modal for viewing complete analysis.

```tsx
import EvaluationDetailModal from '@/components/analytics/EvaluationDetailModal'

<EvaluationDetailModal
  item={historyItem}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  isDark={isDarkMode}
/>
```

### QualityGauge

Visual quality score display.

```tsx
import QualityGauge, { QualityBadge } from '@/components/analytics/QualityGauge'

<QualityGauge score={75} isDark={isDarkMode} />
<QualityBadge score={75} />
```

## Evaluation Criteria

### Success Classification

Conversations are classified as:
- **Successful**: User clearly got value (score >= 70)
- **Partial**: Somewhat helpful (score 45-69)
- **Failed**: User didn't get what they needed (score < 45, >2 messages)
- **Abandoned**: User left after 1-2 messages

### Success Indicators

- User expressed thanks/gratitude
- Asked follow-up questions
- Conversation ended positively
- AI provided detailed responses
- Multi-turn engagement

### Quality Signals

- Response length (too short <50, appropriate 50-500, too long >500)
- Conversation depth (shallow 1-2, moderate 3-5, deep 6+)
- Language matching
- Topic appropriateness

## Cost Optimization

The dashboard is designed for cost efficiency:

- **Model**: Uses `gpt-5-mini` (cheapest viable)
- **Caching**: 1-hour TTL on evaluations
- **Sampling**: Analyzes up to 10 users with 3 conversations each
- **On-demand**: Only runs when you click "Run AI Analysis"
- **History Storage**: Full conversations excluded from history to save space

Estimated cost: ~$0.05-0.25 per analysis run.

## Troubleshooting

### "Firebase not configured"

Ensure `FIREBASE_SERVICE_ACCOUNT` is set in `.env.local` with valid JSON.

### "Unauthorized"

Check that `ANALYTICS_PASSWORD` matches what you entered.

### No conversations found

- Verify your Firestore structure matches the expected format
- Check that conversations have `created_at` timestamps
- Ensure messages array exists in conversation documents

### AI Analysis returns null

- Check `OPENAI_API_KEY` is valid
- Ensure you have at least a few conversations to analyze
- Check server logs for OpenAI API errors

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | Yes | Firebase service account JSON |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI analysis |
| `ANALYTICS_PASSWORD` | Yes | Password to access analytics |

## Related Files

- `/app/analytics/page.tsx` - Main analytics dashboard with embedded panel
- `/lib/firebase/admin.ts` - Firebase Admin SDK initialization
- `/lib/analytics/app-contexts.ts` - App context type definitions
