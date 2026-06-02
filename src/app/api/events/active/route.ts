export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const event = await db.event.findFirst({
    where: { status: 'live', eventDate: { gte: new Date() } },
    orderBy: { eventDate: 'asc' },
  })
  if (!event) return NextResponse.json({ error: 'No active event' }, { status: 404 })
  return NextResponse.json(event)
}