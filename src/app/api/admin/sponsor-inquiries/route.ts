export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  await requireAdminAuth()
  const { data: inquiries, error } = await supabaseAdmin
    .from('sponsor_inquiries')
    .select('*')
    .order('createdAt', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(inquiries)
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (status !== undefined) updateData.status = status
  if (notes !== undefined) updateData.notes = notes

  const { data: inquiry, error } = await supabaseAdmin
    .from('sponsor_inquiries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, inquiry })
}
