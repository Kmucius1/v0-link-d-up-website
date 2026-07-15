export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { name, subject, bodyHtml, audienceTag, eventId } = await req.json()
  const { data: campaign, error } = await supabaseAdmin
    .from('email_campaigns')
    .insert({ id: crypto.randomUUID(), name, subject, bodyHtml, audienceTag: audienceTag || null, eventId: eventId || null })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(campaign, { status: 201 })
}

export async function GET() {
  const { data: campaigns, error } = await supabaseAdmin
    .from('email_campaigns')
    .select('*')
    .order('createdAt', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(campaigns)
}
