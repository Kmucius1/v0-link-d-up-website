import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { note, createdBy } = await req.json()
  const record = await prisma.contactNote.create({
    data: { contactId: id, note, createdBy: createdBy || 'Admin' },
  })
  return NextResponse.json(record, { status: 201 })
}
