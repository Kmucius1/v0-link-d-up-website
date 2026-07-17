export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { broadcastPush } from '@/lib/push'

const CATEGORIES = ['ai', 'growth', 'event', 'announcement']

export async function GET() {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: updates } = await supabaseAdmin
    .from('updates')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(200)
  return NextResponse.json({ updates: updates ?? [] })
}

export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const title: string = (body.title || '').trim()
    const text: string = (body.body || '').trim()
    const category: string = CATEGORIES.includes(body.category) ? body.category : 'ai'
    const link: string | null = typeof body.link === 'string' && body.link.trim() ? body.link.trim() : null
    const pinned = !!body.pinned
    const notify = body.notify !== false // default: send a push
    if (!title || !text) {
      return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const { error } = await supabaseAdmin.from('updates').insert({
      id,
      title,
      body: text,
      category,
      link,
      pinned,
      published: true,
      createdBy: admin.email ?? null,
      createdAt: now,
      updatedAt: now,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    let push = null
    if (notify) {
      push = await broadcastPush({
        title: `LINK'D UP · ${title}`,
        body: text.length > 120 ? text.slice(0, 117) + '…' : text,
        url: '/updates',
        tag: 'linkdup-update',
      })
    }

    return NextResponse.json({ ok: true, id, push })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/updates POST]', msg)
    return NextResponse.json({ error: 'Could not create update.' }, { status: 500 })
  }
}
