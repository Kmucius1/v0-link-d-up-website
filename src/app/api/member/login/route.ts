export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyMemberCredentials, MEMBER_COOKIE } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
    }
    const member = await verifyMemberCredentials(email, password)
    if (!member) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }
    if (member.status === 'suspended') {
      return NextResponse.json({ error: 'This account has been suspended.' }, { status: 403 })
    }

    await supabaseAdmin
      .from('members')
      .update({ lastSeenAt: new Date().toISOString() })
      .eq('id', member.id)

    const cookieStore = await cookies()
    cookieStore.set(MEMBER_COOKIE, member.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60,
      path: '/',
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/login]', msg)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
