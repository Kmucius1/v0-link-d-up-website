export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const { data: updates } = await supabaseAdmin
    .from('updates')
    .select('*')
    .eq('published', true)
    .order('pinned', { ascending: false })
    .order('createdAt', { ascending: false })
    .limit(100)

  return NextResponse.json({ updates: updates ?? [] })
}
