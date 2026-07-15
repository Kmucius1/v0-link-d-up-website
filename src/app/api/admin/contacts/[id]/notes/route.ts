export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { note, createdBy } = await req.json()

  const { data: record, error } = await supabaseAdmin
    .from('contact_notes')
    .insert({ id: crypto.randomUUID(), contactId: id, note, createdBy: createdBy || 'Admin' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(record, { status: 201 })
}
