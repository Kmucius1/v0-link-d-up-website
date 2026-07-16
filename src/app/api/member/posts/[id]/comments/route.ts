export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params

  const { data: comments } = await supabaseAdmin
    .from('post_comments')
    .select('*')
    .eq('postId', postId)
    .order('createdAt', { ascending: true })

  const memberIds = [...new Set((comments ?? []).map((c) => c.memberId))]
  const { data: members } = memberIds.length
    ? await supabaseAdmin.from('members').select('id, fullName, businessName, avatarUrl').in('id', memberIds)
    : { data: [] }
  const map = new Map((members ?? []).map((m) => [m.id, m]))

  return NextResponse.json({
    comments: (comments ?? []).map((c) => ({ ...c, author: map.get(c.memberId) ?? null })),
  })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params
  try {
    const body = await req.json()
    const text: string = (body.body || '').trim()
    if (!text) return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 })
    if (text.length > 1000) return NextResponse.json({ error: 'Comment too long.' }, { status: 400 })

    const id = crypto.randomUUID()
    const { error } = await supabaseAdmin.from('post_comments').insert({
      id,
      postId,
      memberId: member.id,
      body: text,
      createdAt: new Date().toISOString(),
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({
      ok: true,
      comment: {
        id,
        postId,
        memberId: member.id,
        body: text,
        createdAt: new Date().toISOString(),
        author: { id: member.id, fullName: member.fullName, businessName: member.businessName, avatarUrl: member.avatarUrl },
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/comments POST]', msg)
    return NextResponse.json({ error: 'Could not comment.' }, { status: 500 })
  }
}
