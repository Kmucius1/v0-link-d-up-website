import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, subject, message, source } = await req.json()
  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }
  try {
    const sub = await prisma.contactSubmission.create({
      data: { id: crypto.randomUUID(), firstName, lastName, email, phone, subject, message, source },
    })
    return NextResponse.json({ ok: true, id: sub.id })
  } catch {
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
  }
}
