import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { companyName, contactName, email, phone, website, sponsorshipType, budget, message } = await req.json()
  if (!companyName || !contactName || !email) {
    return NextResponse.json({ error: 'Company name, contact name, and email are required.' }, { status: 400 })
  }
  try {
    const inquiry = await prisma.sponsorInquiry.create({
      data: { id: crypto.randomUUID(), companyName, contactName, email, phone, website, sponsorshipType, budget, message },
    })
    return NextResponse.json({ ok: true, id: inquiry.id })
  } catch {
    return NextResponse.json({ error: 'Failed to save inquiry.' }, { status: 500 })
  }
}
