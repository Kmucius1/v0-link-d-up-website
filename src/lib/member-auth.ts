import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from './supabase-admin'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

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
  avatarPositionX: number
  avatarPositionY: number
  contactId: string | null
  status: string
  role: string
  createdAt: string
}

const MEMBER_PUBLIC_FIELDS =
  'id, email, firstName, lastName, fullName, businessName, roleOrIndustry, city, instagram, website, bio, avatarUrl, avatarPositionX, avatarPositionY, contactId, status, role, createdAt'

/** Returns the signed-in member (never includes the password hash), or null. Never redirects. */
export async function getMember(): Promise<Member | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(MEMBER_COOKIE)?.value
  if (!token) return null
  const { data } = await supabaseAdmin
    .from('members')
    .select(MEMBER_PUBLIC_FIELDS)
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

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Issues a password reset token for the given email, if a member exists.
 * Returns the raw token (to put in the email link) or null if no such member —
 * callers should respond identically either way to avoid leaking which emails are registered.
 */
export async function createPasswordResetToken(
  email: string
): Promise<{ token: string; firstName: string; contactId: string | null } | null> {
  const { data } = await supabaseAdmin
    .from('members')
    .select('id, firstName, contactId')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  if (!data) return null

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString()
  await supabaseAdmin
    .from('members')
    .update({ resetToken: hashResetToken(token), resetTokenExpiresAt: expiresAt })
    .eq('id', data.id)

  return { token, firstName: data.firstName, contactId: data.contactId }
}

/** Validates a reset token and, if valid, sets the new password. Consumes the token either way. */
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const hashed = hashResetToken(token)
  const { data } = await supabaseAdmin
    .from('members')
    .select('id, resetTokenExpiresAt')
    .eq('resetToken', hashed)
    .maybeSingle()

  if (!data || !data.resetTokenExpiresAt || new Date(data.resetTokenExpiresAt) < new Date()) {
    return false
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await supabaseAdmin
    .from('members')
    .update({ password: passwordHash, resetToken: null, resetTokenExpiresAt: null, updatedAt: new Date().toISOString() })
    .eq('id', data.id)

  return true
}
