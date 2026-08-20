export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const action = body.action

  const { data: conn } = await supabaseAdmin
    .from('connections')
    .select('id, requesterId, recipientId, status')
    .eq('id', id)
    .maybeSingle()
  if (!conn) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (conn.recipientId !== member.id) return NextResponse.json({ error: 'Not allowed.' }, { status: 403 })
  if (conn.status !== 'pending') return NextResponse.json({ error: 'Already resolved.' }, { status: 400 })

  if (action === 'accept') {
    await supabaseAdmin.from('connections').update({ status: 'accepted', updatedAt: new Date().toISOString() }).eq('id', id)
    return NextResponse.json({ ok: true, status: 'accepted' })
  }
  if (action === 'decline') {
    await supabaseAdmin.from('connections').delete().eq('id', id)
    return NextResponse.json({ ok: true, status: 'none' })
  }
  return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
}

// Cancel a pending request I sent, or remove an accepted connection.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id } = await params

  const { data: conn } = await supabaseAdmin
    .from('connections')
    .select('id, requesterId, recipientId')
    .eq('id', id)
    .maybeSingle()
  if (!conn) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (conn.requesterId !== member.id && conn.recipientId !== member.id) {
    return NextResponse.json({ error: 'Not allowed.' }, { status: 403 })
  }
  await supabaseAdmin.from('connections').delete().eq('id', id)
  return NextResponse.json({ ok: true, status: 'none' })
}
