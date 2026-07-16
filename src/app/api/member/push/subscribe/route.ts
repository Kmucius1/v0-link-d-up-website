export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { VAPID_PUBLIC_KEY } from '@/lib/push'

// Expose the public VAPID key so the client can subscribe.
export async function GET() {
  return NextResponse.json({ vapidPublicKey: VAPID_PUBLIC_KEY })
}

export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  try {
    const sub = await req.json()
    const endpoint: string | undefined = sub?.endpoint
    const p256dh: string | undefined = sub?.keys?.p256dh
    const auth: string | undefined = sub?.keys?.auth
    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Invalid subscription.' }, { status: 400 })
    }

    // Upsert by endpoint (unique).
    const { data: existing } = await supabaseAdmin
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .maybeSingle()

    if (existing) {
      await supabaseAdmin
        .from('push_subscriptions')
        .update({ memberId: member.id, p256dh, auth })
        .eq('id', existing.id)
    } else {
      await supabaseAdmin.from('push_subscriptions').insert({
        id: crypto.randomUUID(),
        memberId: member.id,
        endpoint,
        p256dh,
        auth,
        createdAt: new Date().toISOString(),
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[push/subscribe]', msg)
    return NextResponse.json({ error: 'Could not save subscription.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  try {
    const { endpoint } = await req.json()
    if (endpoint) {
      await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', endpoint)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
