import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, subject, message, source } = await req.json()
  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }
  try {
    const { data: sub, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ id: crypto.randomUUID(), firstName, lastName, email, phone, subject, message, source })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, id: sub.id })
  } catch {
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
  }
}
