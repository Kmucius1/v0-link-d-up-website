import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, source } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 })
  try {
    // Check for existing signup to avoid overwriting the id on conflict
    const { data: existing } = await supabaseAdmin
      .from('newsletter_signups')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      const { error } = await supabaseAdmin
        .from('newsletter_signups')
        .update({ firstName, lastName, source })
        .eq('id', existing.id)
      if (error) throw error
      return NextResponse.json({ ok: true, id: existing.id })
    }

    const { data: signup, error } = await supabaseAdmin
      .from('newsletter_signups')
      .insert({ id: crypto.randomUUID(), email, firstName, lastName, source })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, id: signup.id })
  } catch {
    return NextResponse.json({ error: 'Failed to save signup.' }, { status: 500 })
  }
}
