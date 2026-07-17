export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  await requireAdminAuth()
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, email, name, createdAt, lastLoginAt')
    .order('createdAt', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
