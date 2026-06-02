export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { name, subject, bodyHtml, audienceTag, eventId } = await req.json()
  const campaign = await prisma.emailCampaign.create({
    data: { name, subject, bodyHtml, audienceTag: audienceTag || null, eventId: eventId || null },
  })
  return NextResponse.json(campaign, { status: 201 })
}

export async function GET() {
  const campaigns = await prisma.emailCampaign.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(campaigns)
}