export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .update({
        eventName: body.eventName,
        eventSlug: body.eventSlug,
        eventDate: new Date(body.eventDate).toISOString(),
        startTime: body.startTime,
        endTime: body.endTime,
        locationName: body.locationName,
        address: body.address,
        description: body.description || null,
        rsvpLink: body.rsvpLink || null,
        surveyLink: body.surveyLink || null,
        facebookEventLink: body.facebookEventLink || null,
        status: body.status,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(event)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: event, error } = await supabaseAdmin
    .from('events')
    .select('*, rsvps(*, contacts(*)), survey_responses(*, contacts(*))')
    .eq('id', id)
    .single()
  if (error || !event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { rsvps, survey_responses, ...rest } = event
  return NextResponse.json({
    ...rest,
    rsvps,
    survey_responses,
    _count: {
      rsvps: rsvps?.length ?? 0,
      surveyResponses: survey_responses?.length ?? 0,
    },
  })
}
