import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; tagId: string }> }) {
  const { tagId } = await params
  await prisma.contactTag.delete({ where: { id: tagId } })
  return NextResponse.json({ ok: true })
}
