export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId') || undefined

  let query = supabaseAdmin
    .from('walk_ins')
    .select('*, events(eventName)')
    .order('createdAt', { ascending: false })

  if (eventId) query = query.eq('eventId', eventId)

  const { data: walkIns, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(walkIns)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { firstName, lastName, email, phone, businessName, instagram, eventId, notes } = await req.json()
  if (!firstName || !lastName) return NextResponse.json({ error: 'Name required.' }, { status: 400 })

  const { data: walkIn, error } = await supabaseAdmin
    .from('walk_ins')
    .insert({ id: crypto.randomUUID(), firstName, lastName, email, phone, businessName, instagram, eventId, notes })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, walkIn })
}
