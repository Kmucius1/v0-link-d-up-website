export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined

  let query = supabaseAdmin
    .from('followup_tasks')
    .select('*, contacts(fullName, email), events(eventName)')
    .order('priority', { ascending: false })
    .order('dueDate', { ascending: true })
    .order('createdAt', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: tasks, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { contactId, eventId, title, notes, dueDate, assignedTo, priority } = await req.json()
  if (!title) return NextResponse.json({ error: 'Title required.' }, { status: 400 })

  const { data: task, error } = await supabaseAdmin
    .from('followup_tasks')
    .insert({
      id: crypto.randomUUID(),
      contactId: contactId || null,
      eventId: eventId || null,
      title,
      notes,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedTo,
      priority: priority || 'normal',
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, task })
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, notes, assignedTo, dueDate, priority } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (status !== undefined) updateData.status = status
  if (notes !== undefined) updateData.notes = notes
  if (assignedTo !== undefined) updateData.assignedTo = assignedTo
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate).toISOString() : null
  if (priority !== undefined) updateData.priority = priority

  const { data: task, error } = await supabaseAdmin
    .from('followup_tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, task })
}
