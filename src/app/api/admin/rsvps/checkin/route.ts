export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  await requireAdminAuth()
  const { rsvpId, checkedIn, attended } = await req.json()
  if (!rsvpId) return NextResponse.json({ error: 'rsvpId required' }, { status: 400 })
  const rsvp = await prisma.rsvp.update({
    where: { id: rsvpId },
    data: {
      ...(checkedIn !== undefined && { checkedIn }),
      ...(attended !== undefined && { attended }),
      updatedAt: new Date(),
    },
  })
  return NextResponse.json({ ok: true, rsvp })
}
