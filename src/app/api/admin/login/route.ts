import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const admin = await verifyAdminCredentials(email, password)
  if (!admin) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  const cookieStore = await cookies()
  cookieStore.set('admin_session', admin.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return NextResponse.json({ ok: true })
}
