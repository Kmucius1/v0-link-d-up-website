import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const event = await prisma.event.update({
      where: { id },
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
        status: body.status,
      },
    })
    return NextResponse.json(event)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rsvps: { include: { contact: true } },
      surveyResponses: { include: { contact: true } },
      _count: { select: { rsvps: true, surveyResponses: true } },
    },
  })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}
