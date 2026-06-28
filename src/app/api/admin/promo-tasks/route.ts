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
    .from('promo_tasks')
    .select('*, events(eventName)')
    .order('dueDate', { ascending: true })
    .order('createdAt', { ascending: false })

  if (status) query = query.eq('status', status)
  if (eventId) query = query.eq('eventId', eventId)

  const { data: tasks, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { eventId, platform, contentType, description, dueDate, assignedTo, notes } = await req.json()
  if (!platform || !contentType || !description) {
    return NextResponse.json({ error: 'Platform, content type, and description required.' }, { status: 400 })
  }

  const { data: task, error } = await supabaseAdmin
    .from('promo_tasks')
    .insert({
      id: crypto.randomUUID(),
      eventId: eventId || null,
      platform,
      contentType,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedTo,
      notes,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, task })
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, postUrl, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (status !== undefined) updateData.status = status
  if (postUrl !== undefined) updateData.postUrl = postUrl
  if (notes !== undefined) updateData.notes = notes

  const { data: task, error } = await supabaseAdmin
    .from('promo_tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, task })
}
