export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { MEMBER_COOKIE } from '@/lib/member-auth'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(MEMBER_COOKIE)
  return NextResponse.json({ ok: true })
}
