export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { thirdThursdayEventDateUtc, ordinal } from '@/lib/recurring-event'

// Ensures a "live" event exists for the next third-Thursday-of-the-month —
// LINK'D UP's fixed recurring cadence. Idempotent: safe to run as often as scheduled.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  let year = now.getUTCFullYear()
  let month1 = now.getUTCMonth() + 1
  let eventDate = thirdThursdayEventDateUtc(year, month1)

  if (eventDate.getTime() < now.getTime()) {
    month1 += 1
    if (month1 > 12) {
      month1 = 1
      year += 1
    }
    eventDate = thirdThursdayEventDateUtc(year, month1)
  }

  const { data: existing } = await supabaseAdmin.from('events').select('id').eq('eventDate', eventDate.toISOString()).maybeSingle()
  if (existing) {
    return NextResponse.json({ ok: true, skipped: true, eventDate: eventDate.toISOString() })
  }

  const { data: template } = await supabaseAdmin
    .from('events')
    .select('locationName, address, description, startTime, endTime')
    .order('eventDate', { ascending: false })
    .limit(1)
    .maybeSingle()

  const monthName = eventDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'America/New_York' })
  const dayNum = Number(eventDate.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/New_York' }))
  const eventName = `LINK'D UP — ${monthName} ${ordinal(dayNum)}`
  const eventSlug = `linkdup-${monthName.toLowerCase()}-${year}`

  const { error } = await supabaseAdmin.from('events').insert({
    id: crypto.randomUUID(),
    eventName,
    eventSlug,
    eventDate: eventDate.toISOString(),
    startTime: template?.startTime ?? '6:00 PM',
    endTime: template?.endTime ?? '8:30 PM',
    locationName: template?.locationName ?? 'The Ring Workspace',
    address: template?.address ?? '600 Cleveland St, Clearwater, FL',
    description: template?.description ?? null,
    status: 'live',
  })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, created: true, eventName, eventDate: eventDate.toISOString() })
}
