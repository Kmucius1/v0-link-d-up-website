export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Current password and a new password (min 6 characters) are required.' },
        { status: 400 }
      )
    }

    const { data } = await supabaseAdmin.from('members').select('password').eq('id', member.id).maybeSingle()
    if (!data) return NextResponse.json({ error: 'Account not found.' }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, data.password)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })

    const hashed = await bcrypt.hash(newPassword, 12)
    await supabaseAdmin
      .from('members')
      .update({ password: hashed, updatedAt: new Date().toISOString() })
      .eq('id', member.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/change-password]', msg)
    return NextResponse.json({ error: 'Could not change password.' }, { status: 500 })
  }
}
