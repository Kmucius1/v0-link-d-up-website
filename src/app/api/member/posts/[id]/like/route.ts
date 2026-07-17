export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params

  const { data: existing } = await supabaseAdmin
    .from('post_likes')
    .select('id')
    .eq('postId', postId)
    .eq('memberId', member.id)
    .maybeSingle()

  if (existing) {
    await supabaseAdmin.from('post_likes').delete().eq('id', existing.id)
  } else {
    await supabaseAdmin.from('post_likes').insert({
      id: crypto.randomUUID(),
      postId,
      memberId: member.id,
    })
  }

  const { count } = await supabaseAdmin
    .from('post_likes')
    .select('id', { count: 'exact', head: true })
    .eq('postId', postId)

  return NextResponse.json({ ok: true, liked: !existing, likeCount: count ?? 0 })
}
