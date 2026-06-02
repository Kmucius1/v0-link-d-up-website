import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tag } = await req.json()
  try {
    const record = await prisma.contactTag.create({ data: { contactId: id, tag } })
    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Tag already exists' }, { status: 409 })
  }
}
