import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from './supabase-admin'
import bcrypt from 'bcryptjs'

export async function requireAdminAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) redirect('/admin/login')
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', token)
    .single()
  if (!data) redirect('/admin/login')
  return data
}

/** Non-redirecting admin check for API routes. Returns the admin row or null. */
export async function getAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', token)
    .maybeSingle()
  return data ?? null
}

export async function verifyAdminCredentials(email: string, password: string) {
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()
  if (!data) return null
  const valid = await bcrypt.compare(password, data.password)
  return valid ? data : null
}
