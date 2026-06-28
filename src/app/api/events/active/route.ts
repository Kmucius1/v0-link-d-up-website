export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data: event, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('status', 'live')
    .gte('eventDate', new Date().toISOString())
    .order('eventDate', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!event) return NextResponse.json({ error: 'No active event' }, { status: 404 })
  return NextResponse.json(event)
}
