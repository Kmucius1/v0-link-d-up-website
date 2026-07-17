import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'

// Generates the PWA / home-screen icons on the fly (no binary assets needed).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const size = Math.min(Number(searchParams.get('size')) || 512, 512)
  const maskable = searchParams.get('maskable') === '1'
  // Maskable icons need a safe zone — shrink the glyph and fill the background.
  const pad = maskable ? Math.round(size * 0.12) : 0
  const glyph = Math.round((size - pad * 2) * 0.5)

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
            fontSize: glyph,
            fontWeight: 800,
            letterSpacing: -2,
            color: '#a8d8f0',
            display: 'flex',
            fontFamily: 'sans-serif',
          }}
        >
          L
          <span style={{ color: '#ffffff' }}>U</span>
        </div>
      </div>
    ),
    { width: size, height: size }
  )
}
