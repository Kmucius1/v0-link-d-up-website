export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { memberId: counterpartId } = await params

  const { data: counterpart } = await supabaseAdmin
    .from('members')
    .select('id, fullName, businessName, roleOrIndustry, avatarUrl, avatarPositionX, avatarPositionY')
    .eq('id', counterpartId)
    .maybeSingle()
  if (!counterpart) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })

  const { data: messages } = await supabaseAdmin
    .from('dm_messages')
    .select('id, senderId, recipientId, body, createdAt, readAt')
    .or(
      `and(senderId.eq.${member.id},recipientId.eq.${counterpartId}),and(senderId.eq.${counterpartId},recipientId.eq.${member.id})`
    )
    .order('createdAt', { ascending: true })
    .limit(200)

  // Mark incoming messages from this counterpart as read.
  await supabaseAdmin
    .from('dm_messages')
    .update({ readAt: new Date().toISOString() })
    .eq('senderId', counterpartId)
    .eq('recipientId', member.id)
    .is('readAt', null)

  return NextResponse.json({ counterpart, messages: messages ?? [] })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { memberId: counterpartId } = await params
  if (counterpartId === member.id) {
    return NextResponse.json({ error: "You can't message yourself." }, { status: 400 })
  }

  try {
    const { body } = await req.json()
    const text = typeof body === 'string' ? body.trim() : ''
    if (!text) return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
    if (text.length > 2000) return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })

    const { data: counterpart } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('id', counterpartId)
      .maybeSingle()
    if (!counterpart) return NextResponse.json({ error: 'Member not found.' }, { status: 404 })

    const message = {
      id: crypto.randomUUID(),
      senderId: member.id,
      recipientId: counterpartId,
      body: text,
      createdAt: new Date().toISOString(),
    }
    const { error } = await supabaseAdmin.from('dm_messages').insert(message)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, message })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/messages POST]', msg)
    return NextResponse.json({ error: 'Could not send message.' }, { status: 500 })
  }
}
