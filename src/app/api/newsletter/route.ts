import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, source } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required.' }, { status: 400 })
  try {
    const signup = await prisma.newsletterSignup.upsert({
      where: { email },
      update: { firstName, lastName, source },
      create: { id: crypto.randomUUID(), email, firstName, lastName, source },
    })
    return NextResponse.json({ ok: true, id: signup.id })
  } catch {
    return NextResponse.json({ error: 'Failed to save signup.' }, { status: 500 })
  }
}
