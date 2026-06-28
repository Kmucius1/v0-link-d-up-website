export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { opportunityType, notes, eventId } = await req.json()

  const { data: record, error } = await supabaseAdmin
    .from('opportunities')
    .insert({ contactId: id, opportunityType, notes: notes || null, eventId: eventId || null })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(record, { status: 201 })
}
