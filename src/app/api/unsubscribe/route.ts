export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { contactId } = await req.json()
  if (!contactId) return NextResponse.json({ error: 'Missing contactId' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('contacts')
    .update({ unsubscribed: true, consentToEmail: false })
    .eq('id', contactId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
