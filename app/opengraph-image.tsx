import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'AI 4U Labs - We Build Anything with AI'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000',
        }}
      >
        {/* Minimal content - centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Company name - small, understated */}
          <span
            style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#666666',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
            }}
          >
            AI 4U Labs
          </span>

          {/* Main headline - large, clean */}
          <span
            style={{
              fontSize: '64px',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            We Build Anything with AI
          </span>

          {/* Single line stats */}
          <span
            style={{
              fontSize: '20px',
              fontWeight: 300,
              color: '#555555',
              marginTop: '8px',
            }}
          >
            30+ apps · 1M+ users · 1 day - 2 week delivery
          </span>
        </div>

        {/* Subtle bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            display: 'flex',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: '#333333',
            }}
          >
            ai4u.space
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
