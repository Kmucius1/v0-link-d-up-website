export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  await requireAdminAuth()
  const inquiries = await prisma.sponsorInquiry.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(inquiries)
}

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { id, status, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const inquiry = await prisma.sponsorInquiry.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date(),
    },
  })
  return NextResponse.json({ ok: true, inquiry })
}
