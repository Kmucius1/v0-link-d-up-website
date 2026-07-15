export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST() {
  await requireAdminAuth()
  await supabaseAdmin.from('social_connections').delete().neq('id', '')
  return NextResponse.json({ ok: true })
}
