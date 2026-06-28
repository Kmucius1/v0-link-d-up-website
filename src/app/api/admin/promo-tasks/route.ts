export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const eventId = searchParams.get('eventId') || undefined
  const tasks = await prisma.promoTask.findMany({
    where: {
      ...(status && { status }),
      ...(eventId && { eventId }),
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    include: { event: { select: { eventName: true } } },
  })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { eventId, platform, contentType, description, dueDate, assignedTo, notes } = await req.json()
  if (!platform || !contentType || !description) {
    return NextResponse.json({ error: 'Platform, content type, and description required.' }, { status: 400 })
  }
  const task = await prisma.promoTask.create({
    data: {
      id: crypto.randomUUID(),
      eventId: eventId || null,
      platform,
      contentType,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo,
      notes,
    },
  })
  return NextResponse.json({ ok: true, task })
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, postUrl, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const task = await prisma.promoTask.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(postUrl !== undefined && { postUrl }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date(),
    },
  })
  return NextResponse.json({ ok: true, task })
}
