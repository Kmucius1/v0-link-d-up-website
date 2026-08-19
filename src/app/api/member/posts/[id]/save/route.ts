export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params

  const { data: existing } = await supabaseAdmin
    .from('post_saves')
    .select('id')
    .eq('postId', postId)
    .eq('memberId', member.id)
    .maybeSingle()

  if (existing) {
    await supabaseAdmin.from('post_saves').delete().eq('id', existing.id)
  } else {
    await supabaseAdmin.from('post_saves').insert({
      id: crypto.randomUUID(),
      postId,
      memberId: member.id,
    })
  }

  return NextResponse.json({ ok: true, saved: !existing })
}
