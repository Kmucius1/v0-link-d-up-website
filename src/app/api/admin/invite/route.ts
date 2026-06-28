export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { email, password, name } = await req.json()
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Email and password (min 8 chars) required.' }, { status: 400 })
  }

  const { data: existing } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  if (existing) {
    return NextResponse.json({ error: 'An admin with that email already exists.' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const { data: admin, error } = await supabaseAdmin
    .from('admin_users')
    .insert({ email, password: hashed, name: name || null })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, id: admin.id, email: admin.email })
}
