export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

type Actor = { id: string; fullName: string; businessName: string | null; avatarUrl: string | null; avatarPositionX: number | null; avatarPositionY: number | null } | null

type ActivityItem = {
  id: string
  type: 'like' | 'comment' | 'connection_request' | 'connection_accepted'
  createdAt: string
  actor: Actor
  postId?: string
  connectionId?: string
  commentPreview?: string
}

export async function GET() {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const { data: myPosts } = await supabaseAdmin.from('posts').select('id').eq('memberId', member.id)
  const myPostIds = (myPosts ?? []).map((p) => p.id)

  const [{ data: likes }, { data: comments }, { data: requestsIn }, { data: acceptedForMe }] = await Promise.all([
    myPostIds.length
      ? supabaseAdmin.from('post_likes').select('id, postId, memberId, createdAt').in('postId', myPostIds).order('createdAt', { ascending: false }).limit(50)
      : Promise.resolve({ data: [] as { id: string; postId: string; memberId: string; createdAt: string }[] }),
    myPostIds.length
      ? supabaseAdmin.from('post_comments').select('id, postId, memberId, body, createdAt').in('postId', myPostIds).order('createdAt', { ascending: false }).limit(50)
      : Promise.resolve({ data: [] as { id: string; postId: string; memberId: string; body: string; createdAt: string }[] }),
    supabaseAdmin
      .from('connections')
      .select('id, requesterId, createdAt')
      .eq('recipientId', member.id)
      .eq('status', 'pending')
      .order('createdAt', { ascending: false })
      .limit(50),
    supabaseAdmin
      .from('connections')
      .select('id, recipientId, updatedAt')
      .eq('requesterId', member.id)
      .eq('status', 'accepted')
      .order('updatedAt', { ascending: false })
      .limit(50),
  ])

  const actorIds = new Set<string>()
  for (const l of likes ?? []) if (l.memberId !== member.id) actorIds.add(l.memberId)
  for (const c of comments ?? []) if (c.memberId !== member.id) actorIds.add(c.memberId)
  for (const r of requestsIn ?? []) actorIds.add(r.requesterId)
  for (const a of acceptedForMe ?? []) actorIds.add(a.recipientId)

  const { data: actors } = actorIds.size
    ? await supabaseAdmin
        .from('members')
        .select('id, fullName, businessName, avatarUrl, avatarPositionX, avatarPositionY')
        .in('id', [...actorIds])
    : { data: [] }
  const actorMap = new Map((actors ?? []).map((a) => [a.id, a]))

  const items: ActivityItem[] = []
  for (const l of likes ?? []) {
    if (l.memberId === member.id) continue
    items.push({ id: `like-${l.id}`, type: 'like', createdAt: l.createdAt, actor: actorMap.get(l.memberId) ?? null, postId: l.postId })
  }
  for (const c of comments ?? []) {
    if (c.memberId === member.id) continue
    items.push({
      id: `comment-${c.id}`,
      type: 'comment',
      createdAt: c.createdAt,
      actor: actorMap.get(c.memberId) ?? null,
      postId: c.postId,
      commentPreview: c.body?.slice(0, 140),
    })
  }
  for (const r of requestsIn ?? []) {
    items.push({ id: `request-${r.id}`, type: 'connection_request', createdAt: r.createdAt, actor: actorMap.get(r.requesterId) ?? null, connectionId: r.id })
  }
  for (const a of acceptedForMe ?? []) {
    items.push({ id: `accepted-${a.id}`, type: 'connection_accepted', createdAt: a.updatedAt, actor: actorMap.get(a.recipientId) ?? null, connectionId: a.id })
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  return NextResponse.json({ items: items.slice(0, 50) })
}
