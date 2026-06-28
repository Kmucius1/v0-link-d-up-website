export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { rsvpId, checkedIn, attended } = await req.json()
  if (!rsvpId) return NextResponse.json({ error: 'rsvpId required' }, { status: 400 })

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (checkedIn !== undefined) updateData.checkedIn = checkedIn
  if (attended !== undefined) updateData.attended = attended

  const { data: rsvp, error } = await supabaseAdmin
    .from('rsvps')
    .update(updateData)
    .eq('id', rsvpId)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, rsvp })
}
