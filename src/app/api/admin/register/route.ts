export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

const INVITE_CODE = process.env.ADMIN_INVITE_CODE || process.env.ADMIN_SETUP_KEY || 'linkdup-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, inviteCode } = await req.json()

    if (inviteCode !== INVITE_CODE) {
      return NextResponse.json({ error: 'Invalid invite code.' }, { status: 403 })
    }
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Email and password (min 8 chars) required.' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        id: crypto.randomUUID(),
        email: email.toLowerCase().trim(),
        password: hashed,
        name: name?.trim() || null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id: admin.id, email: admin.email })
  } catch {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 })
  }
}
