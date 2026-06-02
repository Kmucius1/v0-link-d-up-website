import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { opportunityType, notes, eventId } = await req.json()
  const record = await prisma.opportunity.create({
    data: { contactId: id, opportunityType, notes: notes || null, eventId: eventId || null },
  })
  return NextResponse.json(record, { status: 201 })
}
