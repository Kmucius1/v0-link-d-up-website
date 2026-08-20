export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

const VALID_KINDS = ['update', 'ask', 'offer']
const VALID_MEDIA_TYPES = ['image', 'video']
const VALID_ASPECT_RATIOS = ['square', 'portrait', 'landscape', 'story']

export async function GET() {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(100)

  if (!posts || posts.length === 0) return NextResponse.json({ posts: [] })

  const memberIds = [...new Set(posts.map((p) => p.memberId))]
  const postIds = posts.map((p) => p.id)
  const otherMemberIds = memberIds.filter((id) => id !== member.id)

  const [{ data: members }, { data: likes }, { data: comments }, { data: connections }] = await Promise.all([
    supabaseAdmin
      .from('members')
      .select('id, firstName, fullName, businessName, roleOrIndustry, instagram, avatarUrl, avatarPositionX, avatarPositionY')
      .in('id', memberIds),
    supabaseAdmin.from('post_likes').select('postId, memberId').in('postId', postIds),
    supabaseAdmin.from('post_comments').select('postId').in('postId', postIds),
    otherMemberIds.length
      ? supabaseAdmin
          .from('connections')
          .select('id, requesterId, recipientId, status')
          .or(`requesterId.eq.${member.id},recipientId.eq.${member.id}`)
      : Promise.resolve({ data: [] }),
  ])

  const memberMap = new Map((members ?? []).map((m) => [m.id, m]))
  const likeCount = new Map<string, number>()
  const likedByMe = new Set<string>()
  for (const l of likes ?? []) {
    likeCount.set(l.postId, (likeCount.get(l.postId) ?? 0) + 1)
    if (l.memberId === member.id) likedByMe.add(l.postId)
  }
  const commentCount = new Map<string, number>()
  for (const c of comments ?? []) {
    commentCount.set(c.postId, (commentCount.get(c.postId) ?? 0) + 1)
  }

  const connectionByOther = new Map<string, { id: string; status: 'accepted' | 'pending_sent' | 'pending_received' }>()
  for (const c of connections ?? []) {
    const otherId = c.requesterId === member.id ? c.recipientId : c.requesterId
    const status = c.status === 'accepted' ? 'accepted' : c.requesterId === member.id ? 'pending_sent' : 'pending_received'
    connectionByOther.set(otherId, { id: c.id, status })
  }

  const enriched = posts.map((p) => {
    const authorRow = memberMap.get(p.memberId)
    const conn = p.memberId !== member.id ? connectionByOther.get(p.memberId) : undefined
    const author = authorRow
      ? { ...authorRow, connectionId: conn?.id ?? null, connectionStatus: conn?.status ?? 'none' }
      : null
    return {
      ...p,
      author,
      likeCount: likeCount.get(p.id) ?? 0,
      commentCount: commentCount.get(p.id) ?? 0,
      likedByMe: likedByMe.has(p.id),
      mine: p.memberId === member.id,
    }
  })

  return NextResponse.json({ posts: enriched })
}

export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  try {
    const body = await req.json()
    const text: string = (body.body || '').trim()
    const kind: string = VALID_KINDS.includes(body.kind) ? body.kind : 'update'
    const imageUrl: string | null = typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : null
    const mediaType: string = VALID_MEDIA_TYPES.includes(body.mediaType) ? body.mediaType : 'image'
    const aspectRatio: string = VALID_ASPECT_RATIOS.includes(body.aspectRatio) ? body.aspectRatio : 'square'
    if (!text && !imageUrl) {
      return NextResponse.json({ error: 'Write something or add a photo.' }, { status: 400 })
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: 'Post is too long (2000 char max).' }, { status: 400 })
    }
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const { error } = await supabaseAdmin.from('posts').insert({
      id,
      memberId: member.id,
      body: text,
      imageUrl,
      mediaType: imageUrl ? mediaType : 'image',
      aspectRatio,
      kind,
      city: member.city,
      createdAt: now,
      updatedAt: now,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/posts POST]', msg)
    return NextResponse.json({ error: 'Could not post.' }, { status: 500 })
  }
}
