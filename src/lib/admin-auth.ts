import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function requireAdminAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) redirect('/admin/login')
  const admin = await prisma.adminUser.findFirst({ where: { id: token } })
  if (!admin) redirect('/admin/login')
  return admin
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin) return null
  const valid = await bcrypt.compare(password, admin.password)
  return valid ? admin : null
}
