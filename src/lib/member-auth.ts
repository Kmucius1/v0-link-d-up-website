import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from './supabase-admin'
import bcrypt from 'bcryptjs'

export const MEMBER_COOKIE = 'member_session'

export type Member = {
  id: string
  email: string
  firstName: string
  lastName: string | null
  fullName: string
  businessName: string | null
  roleOrIndustry: string | null
  city: string | null
  instagram: string | null
  website: string | null
  bio: string | null
  avatarUrl: string | null
  contactId: string | null
  status: string
  role: string
  createdAt: string
}

/** Returns the signed-in member, or null. Never redirects. */
export async function getMember(): Promise<Member | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(MEMBER_COOKIE)?.value
  if (!token) return null
  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('id', token)
    .maybeSingle()
  if (!data) return null
  return data as Member
}

/** Requires a signed-in member; redirects to /join otherwise. */
export async function requireMember(): Promise<Member> {
  const member = await getMember()
  if (!member) redirect('/join')
  if (member.status === 'suspended') redirect('/join?suspended=1')
  return member
}

export async function verifyMemberCredentials(email: string, password: string) {
  const { data } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  if (!data) return null
  const valid = await bcrypt.compare(password, data.password)
  return valid ? (data as Member & { password: string }) : null
}
