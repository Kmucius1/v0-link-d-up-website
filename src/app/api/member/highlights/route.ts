export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const memberId = req.nextUrl.searchParams.get('memberId') || member.id

  const { data: highlights } = await supabaseAdmin
    .from('highlights')
    .select('id, title, createdAt')
    .eq('memberId', memberId)
    .order('createdAt', { ascending: true })

  if (!highlights || highlights.length === 0) return NextResponse.json({ highlights: [] })

  const { data: items } = await supabaseAdmin
    .from('highlight_items')
    .select('highlightId, postId, sortOrder')
    .in(
      'highlightId',
      highlights.map((h) => h.id)
    )
    .order('sortOrder', { ascending: true })

  const postIds = [...new Set((items ?? []).map((i) => i.postId))]
  const { data: posts } = postIds.length
    ? await supabaseAdmin.from('posts').select('id, imageUrl, mediaType').in('id', postIds)
    : { data: [] }
  const postMap = new Map((posts ?? []).map((p) => [p.id, p]))

  const coverByHighlight = new Map<string, string | null>()
  for (const item of items ?? []) {
    if (!coverByHighlight.has(item.highlightId)) {
      coverByHighlight.set(item.highlightId, postMap.get(item.postId)?.imageUrl ?? null)
    }
  }

  const enriched = highlights.map((h) => ({
    ...h,
    coverImageUrl: coverByHighlight.get(h.id) ?? null,
    itemCount: (items ?? []).filter((i) => i.highlightId === h.id).length,
  }))

  return NextResponse.json({ highlights: enriched })
}

export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  try {
    const { title, postIds } = await req.json()
    const cleanTitle = typeof title === 'string' ? title.trim().slice(0, 40) : ''
    const ids: string[] = Array.isArray(postIds) ? postIds.filter((x) => typeof x === 'string') : []
    if (!cleanTitle) return NextResponse.json({ error: 'Give your highlight a title.' }, { status: 400 })
    if (ids.length === 0) return NextResponse.json({ error: 'Pick at least one post.' }, { status: 400 })

    // Only allow adding the member's own posts.
    const { data: ownPosts } = await supabaseAdmin.from('posts').select('id').eq('memberId', member.id).in('id', ids)
    const ownIds = new Set((ownPosts ?? []).map((p) => p.id))
    const validIds = ids.filter((id) => ownIds.has(id))
    if (validIds.length === 0) return NextResponse.json({ error: 'Pick at least one of your own posts.' }, { status: 400 })

    const highlightId = crypto.randomUUID()
    const now = new Date().toISOString()
    const { error } = await supabaseAdmin.from('highlights').insert({
      id: highlightId,
      memberId: member.id,
      title: cleanTitle,
      createdAt: now,
      updatedAt: now,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('highlight_items').insert(
      validIds.map((postId, i) => ({
        id: crypto.randomUUID(),
        highlightId,
        postId,
        sortOrder: i,
      }))
    )

    return NextResponse.json({ ok: true, id: highlightId })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/highlights POST]', msg)
    return NextResponse.json({ error: 'Could not create highlight.' }, { status: 500 })
  }
}
