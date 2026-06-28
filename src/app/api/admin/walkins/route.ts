export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId') || undefined
  const walkIns = await prisma.walkIn.findMany({
    where: eventId ? { eventId } : {},
    orderBy: { createdAt: 'desc' },
    include: { event: { select: { eventName: true } } },
  })
  return NextResponse.json(walkIns)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { firstName, lastName, email, phone, businessName, instagram, eventId, notes } = await req.json()
  if (!firstName || !lastName) return NextResponse.json({ error: 'Name required.' }, { status: 400 })
  const walkIn = await prisma.walkIn.create({
    data: { id: crypto.randomUUID(), firstName, lastName, email, phone, businessName, instagram, eventId, notes },
  })
  return NextResponse.json({ ok: true, walkIn })
}
