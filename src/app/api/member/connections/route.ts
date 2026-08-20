export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const recipientId = typeof body.recipientId === 'string' ? body.recipientId : ''
  if (!recipientId || recipientId === member.id) {
    return NextResponse.json({ error: 'Invalid member.' }, { status: 400 })
  }

  const { data: recipient } = await supabaseAdmin.from('members').select('id').eq('id', recipientId).maybeSingle()
  if (!recipient) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })

  const { data: existing } = await supabaseAdmin
    .from('connections')
    .select('id, requesterId, recipientId, status')
    .or(`and(requesterId.eq.${member.id},recipientId.eq.${recipientId}),and(requesterId.eq.${recipientId},recipientId.eq.${member.id})`)
    .maybeSingle()

  if (existing) {
    // They already requested me — connecting back accepts it instead of duplicating.
    if (existing.status === 'pending' && existing.requesterId === recipientId) {
      const { data: updated } = await supabaseAdmin
        .from('connections')
        .update({ status: 'accepted', updatedAt: new Date().toISOString() })
        .eq('id', existing.id)
        .select('id, status')
        .single()
      return NextResponse.json(updated)
    }
    return NextResponse.json({ id: existing.id, status: existing.status })
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const { error } = await supabaseAdmin.from('connections').insert({
    id,
    requesterId: member.id,
    recipientId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id, status: 'pending' })
}
