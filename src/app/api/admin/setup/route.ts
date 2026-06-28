export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// One-time setup endpoint — creates the first admin if none exists
export async function POST(req: NextRequest) {
  const existing = await prisma.adminUser.count()
  if (existing > 0) {
    return NextResponse.json({ error: 'Admin already exists. Use the invite flow to add more admins.' }, { status: 409 })
  }

  const { email, password, name, setupKey } = await req.json()

  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: 'Invalid setup key.' }, { status: 403 })
  }
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Email and password (min 8 chars) required.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const admin = await prisma.adminUser.create({
    data: { email, password: hashed, name: name || null },
  })

  return NextResponse.json({ ok: true, id: admin.id, email: admin.email })
}
