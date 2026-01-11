'use client'

import { Analytics } from "@vercel/analytics/next"

export function AnalyticsWrapper() {
  return (
    <Analytics
      beforeSend={(event) => {
        // To exclude yourself: open browser console and run:
        // localStorage.setItem('excludeFromAnalytics', 'true')
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('excludeFromAnalytics') === 'true') {
            return null // Don't send the event
          }
        }
        return event
      }}
    />
  )
}
