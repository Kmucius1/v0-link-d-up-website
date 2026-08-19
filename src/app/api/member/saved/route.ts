export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const { data: saves } = await supabaseAdmin
    .from('post_saves')
    .select('postId, createdAt')
    .eq('memberId', member.id)
    .order('createdAt', { ascending: false })
  const postIds = (saves ?? []).map((s) => s.postId)
  if (postIds.length === 0) return NextResponse.json({ posts: [] })

  const { data: posts } = await supabaseAdmin.from('posts').select('*').in('id', postIds)
  if (!posts || posts.length === 0) return NextResponse.json({ posts: [] })

  const memberIds = [...new Set(posts.map((p) => p.memberId))]
  const [{ data: members }, { data: likes }, { data: comments }] = await Promise.all([
    supabaseAdmin
      .from('members')
      .select('id, firstName, fullName, businessName, roleOrIndustry, instagram, avatarUrl, avatarPositionX, avatarPositionY')
      .in('id', memberIds),
    supabaseAdmin.from('post_likes').select('postId, memberId').in('postId', postIds),
    supabaseAdmin.from('post_comments').select('postId').in('postId', postIds),
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

  const postMap = new Map(posts.map((p) => [p.id, p]))
  const enriched = postIds
    .map((id) => postMap.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      ...p,
      author: memberMap.get(p.memberId) ?? null,
      likeCount: likeCount.get(p.id) ?? 0,
      commentCount: commentCount.get(p.id) ?? 0,
      likedByMe: likedByMe.has(p.id),
      mine: p.memberId === member.id,
      savedByMe: true,
    }))

  return NextResponse.json({ posts: enriched })
}
