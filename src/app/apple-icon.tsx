import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b1220 0%, #000000 55%, #0a0f1a 100%)',
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -3,
            color: '#a8d8f0',
            display: 'flex',
            fontFamily: 'sans-serif',
          }}
        >
          L<span style={{ color: '#ffffff' }}>U</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
