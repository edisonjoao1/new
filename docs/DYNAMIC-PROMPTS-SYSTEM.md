# Dynamic System Prompts - Documentation

## Overview

This system allows you to update all 7 iOS app prompts from the web dashboard without requiring an app release. Changes take effect the next time users launch the app.

---

## How It Works

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  You edit prompt │ ──▶ │  Saves to        │ ──▶ │  iOS app fetches │
│  on website      │     │  Firebase        │     │  on launch       │
│  /analytics/     │     │  POST /api/      │     │  GET /api/       │
│  ai-evaluation   │     │  analytics/      │     │  app-config      │
│  > System Prompt │     │  system-prompt   │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
                                                  ┌──────────────────┐
                                                  │  Users get       │
                                                  │  updated prompt! │
                                                  └──────────────────┘
```

---

## 7 Prompt Types

| # | Prompt Key | Purpose | iOS File |
|---|------------|---------|----------|
| 1 | `main` | Primary text chat | OpenAIService.swift:315 |
| 2 | `streaming` | Real-time streaming responses | OpenAIService.swift:577 |
| 3 | `imageAnalysis` | Analyzing user-uploaded images | OpenAIService.swift:919 |
| 4 | `lessonChat` | Educational lesson interactions | OpenAIService.swift:1119 |
| 5 | `lessonVoice` | Voice-based lesson delivery | OpenAIService.swift:1746 |
| 6 | `voiceChat` | Real-time voice conversations | RealtimeViewModel.swift:93 |
| 7 | `voiceLessons` | Voice lessons for language learning | LessonVoiceViewModel.swift:108 |

---

## Web Dashboard

### Location
`https://ai4u.space/analytics/ai-evaluation` > System Prompt tab

### Features
- **Edit Prompt**: Click "Edit Prompt" to modify
- **Version Notes**: Add notes when saving (e.g., "Added better greeting")
- **Version History**: See all previous versions with dates
- **Revert**: Roll back to any previous version
- **AI Suggestions**: After running an evaluation, get AI-powered improvement suggestions

### How to Edit
1. Go to `/analytics/ai-evaluation`
2. Click "System Prompt" in the sidebar
3. Click "Edit Prompt"
4. Make your changes
5. Add version notes (optional)
6. Click "Save New Version"

---

## API Endpoints

### GET /api/app-config
Fetches all prompts for iOS app. **NEVER fails** - always returns HTTP 200.

**Response:**
```json
{
  "prompts": {
    "main": { "content": "...", "version": 3, "updatedAt": "..." },
    "imageAnalysis": { "content": "...", "version": 2, "updatedAt": "..." },
    "streaming": { "content": "...", "version": 1, "updatedAt": "..." },
    "lessonChat": { "content": "...", "version": 1, "updatedAt": "..." },
    "lessonVoice": { "content": "...", "version": 1, "updatedAt": "..." },
    "voiceChat": { "content": "...", "version": 2, "updatedAt": "..." },
    "voiceLessons": { "content": "...", "version": 1, "updatedAt": "..." }
  },
  "promptsVersion": 12,
  "systemPrompt": "...",  // Legacy field (same as prompts.main)
  "promptVersion": 3
}
```

### POST /api/analytics/system-prompt
Saves new prompt version. Requires authentication.

**Request:**
```json
{
  "key": "your-analytics-password",
  "prompt": "Your new system prompt...",
  "notes": "Optional version notes"
}
```

---

## API Resilience (Bulletproof)

The `/api/app-config` endpoint has 5 layers of protection:

```
┌─────────────────────────────────────────────────────────────────┐
│                    /api/app-config Request Flow                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  iOS App Launch                                                   │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           LAYER 1: Request Validation                    │    │
│  │  • Validate query params                                 │    │
│  │  • Set response timeout (10s max)                        │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           LAYER 2: Firebase Queries                      │    │
│  │                                                          │    │
│  │  For each prompt type (main, streaming, etc.):           │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  TRY:                                             │   │    │
│  │  │    • Query with 5s timeout                        │   │    │
│  │  │    • Return Firebase prompt                       │   │    │
│  │  │  CATCH:                                           │   │    │
│  │  │    • Log error                                    │   │    │
│  │  │    • Return DEFAULT_PROMPT for this type          │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  │  Result: Always have a value for EVERY prompt type       │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           LAYER 3: Response Validation                   │    │
│  │  • Verify all 7 prompt types present                     │    │
│  │  • Verify each has content string                        │    │
│  │  • Fill missing with defaults                            │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           LAYER 4: Always Return 200                     │    │
│  │  • Return JSON with prompts object                       │    │
│  │  • Include legacy systemPrompt field                     │    │
│  │  • Add _warnings field if partial failure                │    │
│  │  • NEVER return 4xx or 5xx                               │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                       │
│                           ▼                                       │
│                    iOS App Works!                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Guarantees
- **Query timeout**: 5 seconds per prompt (won't hang)
- **Individual failure**: Falls back to default for that prompt only
- **Response validation**: All 7 prompts always present
- **HTTP status**: Always 200 (app never breaks)
- **Total request time**: Max 10 seconds even if all queries fail

---

## Firebase Schema

```
system_prompts/
├── {documentId}/
│   ├── type: string           // "main", "streaming", etc.
│   ├── prompt: string         // The actual prompt content
│   ├── version: number        // Version number
│   ├── isActive: boolean      // true for current version
│   ├── notes: string          // Version notes
│   ├── updatedAt: timestamp
│   └── createdAt: timestamp
```

---

## Files Reference

### Web (business-website)
| File | Purpose |
|------|---------|
| `/app/api/app-config/route.ts` | Public API for iOS app |
| `/app/api/analytics/system-prompt/route.ts` | Save/update prompts |
| `/app/analytics/ai-evaluation/page.tsx` | Dashboard UI |

### iOS (Inteligencia Artificial Gratis)
| File | Purpose |
|------|---------|
| `ConfigManager.swift` | Fetches prompts on launch |
| `OpenAIService.swift` | Uses prompts for chat |
| `RealtimeViewModel.swift` | Uses prompts for voice |
| `LessonVoiceViewModel.swift` | Uses prompts for lessons |

---

## Default Prompts

If Firebase fails, the API returns hardcoded default prompts defined in:
`/app/api/app-config/route.ts` → `DEFAULT_PROMPTS`

These defaults mirror the original prompts in the iOS app code.

---

## Troubleshooting

### Prompt not updating in app?
1. Force quit the app
2. Relaunch - prompts are fetched on launch
3. Check Firebase console for the prompt document

### API returning old prompt?
1. CDN caches for 5 minutes (`Cache-Control: s-maxage=300`)
2. Wait 5 minutes or use `?nocache=1` param

### Version history empty?
Check Firebase `system_prompts` collection has documents with the correct `type` field.
