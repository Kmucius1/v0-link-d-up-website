export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const eventId = searchParams.get('eventId') || undefined

  let query = supabaseAdmin
    .from('local_outreach')
    .select('*, events(eventName)')
    .order('status', { ascending: true })
    .order('businessName', { ascending: true })

  if (status) query = query.eq('status', status)
  if (eventId) query = query.eq('eventId', eventId)

  const { data: records, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { businessName, contactName, email, phone, address, neighborhood, outreachType, notes, eventId } = await req.json()
  if (!businessName) return NextResponse.json({ error: 'Business name required.' }, { status: 400 })

  const { data: record, error } = await supabaseAdmin
    .from('local_outreach')
    .insert({
      id: crypto.randomUUID(),
      businessName,
      contactName,
      email,
      phone,
      address,
      neighborhood,
      outreachType,
      notes,
      eventId: eventId || null,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, record })
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, notes, lastContactAt } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (status !== undefined) updateData.status = status
  if (notes !== undefined) updateData.notes = notes
  if (lastContactAt !== undefined) updateData.lastContactAt = lastContactAt ? new Date(lastContactAt).toISOString() : null

  const { data: record, error } = await supabaseAdmin
    .from('local_outreach')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, record })
}
