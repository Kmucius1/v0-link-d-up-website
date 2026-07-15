export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendCampaign } from '@/lib/campaign-send'
import { format } from 'date-fns'

export async function POST(req: NextRequest) {
  try {
    const { eventId } = await req.json()
    if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 })

    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    if (eventError || !event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const bodyHtml = `
      <p style="margin:0 0 20px;">Hey {{firstName}} 👋</p>
      <p style="margin:0 0 24px;">Quick reminder — <strong style="color:#c084fc;">${event.eventName}</strong> is coming up. We can't wait to see you there!</p>
      <div style="background:#1a1a2e;border:1px solid #2d2d44;border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="color:#a78bfa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 4px;">Date &amp; Time</p>
        <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0 0 16px;">${format(new Date(event.eventDate), 'EEEE, MMMM d')} · ${event.startTime} – ${event.endTime}</p>
        <p style="color:#a78bfa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 4px;">Location</p>
        <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0;">${event.locationName}</p>
        <p style="color:#64748b;font-size:13px;margin:2px 0 0;">${event.address}</p>
      </div>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">
        Bring yourself, your energy, and business cards if you have them. See you in the room.
      </p>
    `.trim()

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('email_campaigns')
      .insert({
        id: crypto.randomUUID(),
        name: `Event Reminder — ${event.eventName}`,
        subject: `Reminder: ${event.eventName} is coming up`,
        bodyHtml,
        audienceTag: `RSVP'd for ${event.eventName}`,
        eventId: event.id,
      })
      .select()
      .single()
    if (campaignError || !campaign) return NextResponse.json({ error: campaignError?.message || 'Failed to create campaign' }, { status: 500 })

    const result = await sendCampaign(campaign.id)
    return NextResponse.json({ ok: true, campaignId: campaign.id, ...result })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send reminder'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
