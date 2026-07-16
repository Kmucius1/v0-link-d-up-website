export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { MEMBER_COOKIE } from '@/lib/member-auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

function clean(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t.length ? t : null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = clean(body.email)?.toLowerCase()
    const password: string = body.password || ''
    const firstName = clean(body.firstName)
    const lastName = clean(body.lastName)
    const businessName = clean(body.businessName)
    const roleOrIndustry = clean(body.roleOrIndustry)
    const city = clean(body.city)
    const instagram = clean(body.instagram)?.replace(/^@/, '')

    if (!email || !firstName || password.length < 6) {
      return NextResponse.json(
        { error: 'First name, email, and a password (min 6 characters) are required.' },
        { status: 400 }
      )
    }

    // Already a member?
    const { data: existing } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('email', email)
      .maybeSingle()
    if (existing) {
      return NextResponse.json(
        { error: 'An account with that email already exists. Try signing in.' },
        { status: 409 }
      )
    }

    const fullName = `${firstName} ${lastName ?? ''}`.trim()
    const now = new Date().toISOString()

    // Upsert a CRM Contact so this member shows up in the admin dashboard.
    let contactId: string | null = null
    try {
      const { data: contact } = await supabaseAdmin
        .from('contacts')
        .select('id')
        .eq('email', email)
        .maybeSingle()
      if (contact) {
        contactId = contact.id
        await supabaseAdmin
          .from('contacts')
          .update({
            firstName,
            lastName: lastName ?? '',
            fullName,
            businessName,
            roleOrIndustry,
            city,
            instagram,
            contactSource: 'member_app',
            updatedAt: now,
          })
          .eq('id', contact.id)
      } else {
        contactId = crypto.randomUUID()
        await supabaseAdmin.from('contacts').insert({
          id: contactId,
          firstName,
          lastName: lastName ?? '',
          fullName,
          email,
          businessName,
          roleOrIndustry,
          city,
          instagram,
          contactSource: 'member_app',
          consentToEmail: true,
          createdAt: now,
          updatedAt: now,
        })
      }
    } catch (e) {
      // Never block signup if the CRM sync hiccups.
      console.error('[member/register] contact sync failed', e)
    }

    const id = crypto.randomUUID()
    const hashed = await bcrypt.hash(password, 12)
    const { error } = await supabaseAdmin.from('members').insert({
      id,
      email,
      password: hashed,
      firstName,
      lastName,
      fullName,
      businessName,
      roleOrIndustry,
      city,
      instagram,
      contactId,
      status: 'active',
      role: 'member',
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const cookieStore = await cookies()
    cookieStore.set(MEMBER_COOKIE, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 60,
      path: '/',
    })

    return NextResponse.json({ ok: true, id, fullName })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/register]', msg)
    return NextResponse.json({ error: 'Sign up failed. Please try again.' }, { status: 500 })
  }
}
