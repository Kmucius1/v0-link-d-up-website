import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { contactId } = await req.json()
  if (!contactId) return NextResponse.json({ error: 'Missing contactId' }, { status: 400 })

  await db.contact.update({
    where: { id: contactId },
    data: { unsubscribed: true, consentToEmail: false },
  })
  return NextResponse.json({ ok: true })
}
