export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/admin-auth'
import { broadcastPush } from '@/lib/push'

export async function POST(req: NextRequest) {
  const admin = await getAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const title: string = (body.title || '').trim()
    const message: string = (body.body || body.message || '').trim()
    const url: string = (body.url || '/home').trim()
    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required.' }, { status: 400 })
    }
    const result = await broadcastPush({ title, body: message, url, tag: 'linkdup-broadcast' })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/push/broadcast]', msg)
    return NextResponse.json({ error: 'Broadcast failed.' }, { status: 500 })
  }
}
