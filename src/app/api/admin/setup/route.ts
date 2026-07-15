export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { data: existing } = await supabaseAdmin.from('admin_users').select('id').limit(1)
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Admin already exists. Use the invite flow to add more admins.' }, { status: 409 })
  }

  const { email, password, name, setupKey } = await req.json()

  if (setupKey !== (process.env.ADMIN_SETUP_KEY ?? '')) {
    return NextResponse.json({ error: 'Invalid setup key.' }, { status: 403 })
  }
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Email and password (min 8 chars) required.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({ id: crypto.randomUUID(), email, password: hashed, name: name || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id, email: data.email })
}
