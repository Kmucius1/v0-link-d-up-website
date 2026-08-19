export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id } = await params

  const { data: highlight } = await supabaseAdmin
    .from('highlights')
    .select('id, memberId, title, createdAt')
    .eq('id', id)
    .maybeSingle()
  if (!highlight) return NextResponse.json({ error: 'Highlight not found.' }, { status: 404 })

  const { data: owner } = await supabaseAdmin
    .from('members')
    .select('id, fullName, avatarUrl, avatarPositionX, avatarPositionY')
    .eq('id', highlight.memberId)
    .maybeSingle()

  const { data: items } = await supabaseAdmin
    .from('highlight_items')
    .select('postId, sortOrder')
    .eq('highlightId', id)
    .order('sortOrder', { ascending: true })
  const postIds = (items ?? []).map((i) => i.postId)

  const { data: posts } = postIds.length
    ? await supabaseAdmin.from('posts').select('*').in('id', postIds)
    : { data: [] }
  const postMap = new Map((posts ?? []).map((p) => [p.id, p]))
  const orderedPosts = postIds.map((pid) => postMap.get(pid)).filter(Boolean)

  return NextResponse.json({
    highlight: { ...highlight, owner },
    posts: orderedPosts,
    mine: highlight.memberId === member.id,
  })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id } = await params

  const { data: highlight } = await supabaseAdmin.from('highlights').select('memberId').eq('id', id).maybeSingle()
  if (!highlight) return NextResponse.json({ error: 'Highlight not found.' }, { status: 404 })
  if (highlight.memberId !== member.id) return NextResponse.json({ error: 'Not your highlight.' }, { status: 403 })

  await supabaseAdmin.from('highlight_items').delete().eq('highlightId', id)
  await supabaseAdmin.from('highlights').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}
