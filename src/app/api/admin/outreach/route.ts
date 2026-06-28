export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const eventId = searchParams.get('eventId') || undefined
  const records = await prisma.localOutreach.findMany({
    where: {
      ...(status && { status }),
      ...(eventId && { eventId }),
    },
    orderBy: [{ status: 'asc' }, { businessName: 'asc' }],
    include: { event: { select: { eventName: true } } },
  })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { businessName, contactName, email, phone, address, neighborhood, outreachType, notes, eventId } = await req.json()
  if (!businessName) return NextResponse.json({ error: 'Business name required.' }, { status: 400 })
  const record = await prisma.localOutreach.create({
    data: {
      id: crypto.randomUUID(),
      businessName,
      contactName,
      email,
      phone,
      address,
      neighborhood,
      outreachType,
      notes,
      eventId: eventId || null,
    },
  })
  return NextResponse.json({ ok: true, record })
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, notes, lastContactAt } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const record = await prisma.localOutreach.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      ...(lastContactAt !== undefined && { lastContactAt: lastContactAt ? new Date(lastContactAt) : null }),
      updatedAt: new Date(),
    },
  })
  return NextResponse.json({ ok: true, record })
}
