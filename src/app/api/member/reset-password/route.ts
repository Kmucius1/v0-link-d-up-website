export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordWithToken } from '@/lib/member-auth'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing reset token.' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const ok = await resetPasswordWithToken(token, password)
    if (!ok) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/reset-password]', msg)
    return NextResponse.json({ error: 'Could not reset password. Please try again.' }, { status: 500 })
  }
}
