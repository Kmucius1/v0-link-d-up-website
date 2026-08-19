export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/lib/member-auth'
import { sendPasswordReset } from '@/lib/email'
import { APP_URL } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required.' }, { status: 400 })
    }

    const result = await createPasswordResetToken(email)
    if (result) {
      const resetUrl = `${APP_URL}/reset-password?token=${result.token}`
      try {
        await sendPasswordReset({ to: email.toLowerCase().trim(), name: result.firstName, resetUrl })
      } catch (e) {
        console.error('[member/forgot-password] send failed', e)
      }
    }

    // Always respond the same way so we don't leak which emails are registered.
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/forgot-password]', msg)
    return NextResponse.json({ error: 'Could not process request. Please try again.' }, { status: 500 })
  }
}
