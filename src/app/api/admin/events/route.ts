export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert({
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
        status: body.status || 'draft',
      })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(event, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create event'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function GET() {
  const { data: events, error } = await supabaseAdmin
    .from('events')
    .select('*, rsvps(count), survey_responses(count)')
    .order('eventDate', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const eventsWithCounts = (events || []).map((event) => {
    const rsvpData = event.rsvps as unknown as Array<{ count: number }>
    const surveyData = event.survey_responses as unknown as Array<{ count: number }>
    const { rsvps, survey_responses, ...rest } = event
    void rsvps
    void survey_responses
    return {
      ...rest,
      _count: {
        rsvps: Number(rsvpData?.[0]?.count ?? 0),
        surveyResponses: Number(surveyData?.[0]?.count ?? 0),
      },
    }
  })
  return NextResponse.json(eventsWithCounts)
}
