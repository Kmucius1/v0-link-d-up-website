export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  await requireAdminAuth()
  const { email, password, name } = await req.json()
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Email and password (min 8 chars) required.' }, { status: 400 })
  }
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An admin with that email already exists.' }, { status: 409 })
  }
  const hashed = await bcrypt.hash(password, 12)
  const admin = await prisma.adminUser.create({
    data: { email, password: hashed, name: name || null },
  })
  return NextResponse.json({ ok: true, id: admin.id, email: admin.email })
}
