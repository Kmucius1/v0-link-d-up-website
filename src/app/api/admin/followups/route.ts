export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  await requireAdminAuth()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const tasks = await prisma.followupTask.findMany({
    where: status ? { status } : {},
    orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    include: {
      contact: { select: { fullName: true, email: true } },
      event: { select: { eventName: true } },
    },
  })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { contactId, eventId, title, notes, dueDate, assignedTo, priority } = await req.json()
  if (!title) return NextResponse.json({ error: 'Title required.' }, { status: 400 })
  const task = await prisma.followupTask.create({
    data: {
      id: crypto.randomUUID(),
      contactId: contactId || null,
      eventId: eventId || null,
      title,
      notes,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo,
      priority: priority || 'normal',
    },
  })
  return NextResponse.json({ ok: true, task })
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, notes, assignedTo, dueDate, priority } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const task = await prisma.followupTask.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(priority !== undefined && { priority }),
      updatedAt: new Date(),
    },
  })
  return NextResponse.json({ ok: true, task })
}
