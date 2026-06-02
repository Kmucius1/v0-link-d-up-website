export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event = await prisma.event.create({
      data: {
        eventName: body.eventName,
        eventSlug: body.eventSlug,
        eventDate: new Date(body.eventDate),
        startTime: body.startTime,
        endTime: body.endTime,
        locationName: body.locationName,
        address: body.address,
        description: body.description || null,
        rsvpLink: body.rsvpLink || null,
        surveyLink: body.surveyLink || null,
        facebookEventLink: body.facebookEventLink || null,
        status: body.status || 'draft',
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create event'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    include: { _count: { select: { rsvps: true, surveyResponses: true } } },
  })
  return NextResponse.json(events)
}