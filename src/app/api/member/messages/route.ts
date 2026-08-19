export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const { data: messages } = await supabaseAdmin
    .from('dm_messages')
    .select('id, senderId, recipientId, body, createdAt, readAt')
    .or(`senderId.eq.${member.id},recipientId.eq.${member.id}`)
    .order('createdAt', { ascending: false })
    .limit(500)

  if (!messages || messages.length === 0) return NextResponse.json({ conversations: [] })

  type Convo = { counterpartId: string; lastBody: string; lastCreatedAt: string; unreadCount: number }
  const byCounterpart = new Map<string, Convo>()
  for (const m of messages) {
    const counterpartId = m.senderId === member.id ? m.recipientId : m.senderId
    const existing = byCounterpart.get(counterpartId)
    const isUnread = m.recipientId === member.id && !m.readAt
    if (!existing) {
      byCounterpart.set(counterpartId, {
        counterpartId,
        lastBody: m.body,
        lastCreatedAt: m.createdAt,
        unreadCount: isUnread ? 1 : 0,
      })
    } else if (isUnread) {
      existing.unreadCount += 1
    }
  }

  const counterpartIds = [...byCounterpart.keys()]
  const { data: members } = await supabaseAdmin
    .from('members')
    .select('id, fullName, businessName, avatarUrl, avatarPositionX, avatarPositionY')
    .in('id', counterpartIds)
  const memberMap = new Map((members ?? []).map((m) => [m.id, m]))

  const conversations = [...byCounterpart.values()]
    .map((c) => ({ ...c, member: memberMap.get(c.counterpartId) ?? null }))
    .filter((c) => c.member)
    .sort((a, b) => (a.lastCreatedAt < b.lastCreatedAt ? 1 : -1))

  return NextResponse.json({ conversations })
}
