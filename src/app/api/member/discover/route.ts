export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (q) {
    const { data: members } = await supabaseAdmin
      .from('members')
      .select('id, fullName, businessName, roleOrIndustry, avatarUrl, avatarPositionX, avatarPositionY')
      .neq('id', member.id)
      .eq('status', 'active')
      .or(`fullName.ilike.%${q}%,businessName.ilike.%${q}%`)
      .limit(20)
    return NextResponse.json({ mode: 'search', members: members ?? [] })
  }

  const { data: posts } = await supabaseAdmin
    .from('posts')
    .select('id, memberId, imageUrl, mediaType, aspectRatio')
    .not('imageUrl', 'is', null)
    .order('createdAt', { ascending: false })
    .limit(60)

  if (!posts || posts.length === 0) return NextResponse.json({ mode: 'grid', posts: [] })

  const memberIds = [...new Set(posts.map((p) => p.memberId))]
  const { data: members } = await supabaseAdmin
    .from('members')
    .select('id, fullName, avatarUrl')
    .in('id', memberIds)
  const memberMap = new Map((members ?? []).map((m) => [m.id, m]))

  const enriched = posts.map((p) => ({ ...p, author: memberMap.get(p.memberId) ?? null }))

  return NextResponse.json({ mode: 'grid', posts: enriched })
}
