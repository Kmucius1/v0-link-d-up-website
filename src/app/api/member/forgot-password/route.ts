export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/lib/member-auth'
import { sendPasswordReset } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { APP_URL } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required.' }, { status: 400 })
    }

    const result = await createPasswordResetToken(email)
    if (result) {
      const to = email.toLowerCase().trim()
      const resetUrl = `${APP_URL}/reset-password?token=${result.token}`
      const subject = "Reset your password — LINK'D UP"
      try {
        const { error: sendError } = await sendPasswordReset({ to, name: result.firstName, resetUrl })
        if (sendError) throw new Error(sendError.message)
        if (result.contactId) {
          await supabaseAdmin.from('email_logs').insert({
            id: crypto.randomUUID(),
            contactId: result.contactId,
            emailType: 'password_reset',
            subject,
            status: 'sent',
          })
        }
      } catch (e) {
        console.error('[member/forgot-password] send failed', e)
        if (result.contactId) {
          await supabaseAdmin.from('email_logs').insert({
            id: crypto.randomUUID(),
            contactId: result.contactId,
            emailType: 'password_reset',
            subject,
            status: 'failed',
            errorMessage: e instanceof Error ? e.message : 'Email delivery failed',
          })
        }
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
