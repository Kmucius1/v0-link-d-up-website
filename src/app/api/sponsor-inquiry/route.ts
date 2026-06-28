import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { companyName, contactName, email, phone, website, sponsorshipType, budget, message } = await req.json()
  if (!companyName || !contactName || !email) {
    return NextResponse.json({ error: 'Company name, contact name, and email are required.' }, { status: 400 })
  }
  try {
    const { data: inquiry, error } = await supabaseAdmin
      .from('sponsor_inquiries')
      .insert({ id: crypto.randomUUID(), companyName, contactName, email, phone, website, sponsorshipType, budget, message })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, id: inquiry.id })
  } catch {
    return NextResponse.json({ error: 'Failed to save inquiry.' }, { status: 500 })
  }
}
