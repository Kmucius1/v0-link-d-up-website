export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

function clean(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t.length ? t : null
}

export async function GET() {
  const member = await getMember()
  if (!member) return NextResponse.json({ member: null }, { status: 401 })
  return NextResponse.json({ member })
}

export async function PATCH(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  try {
    const body = await req.json()
    const firstName = clean(body.firstName) ?? member.firstName
    const lastName = clean(body.lastName)
    const fullName = `${firstName} ${lastName ?? ''}`.trim()
    const update = {
      firstName,
      lastName,
      fullName,
      businessName: clean(body.businessName),
      roleOrIndustry: clean(body.roleOrIndustry),
      city: clean(body.city),
      instagram: clean(body.instagram)?.replace(/^@/, '') ?? null,
      website: clean(body.website),
      bio: clean(body.bio),
      updatedAt: new Date().toISOString(),
    }
    const { error } = await supabaseAdmin.from('members').update(update).eq('id', member.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Keep the CRM contact in sync.
    if (member.contactId) {
      await supabaseAdmin
        .from('contacts')
        .update({
          firstName,
          lastName: lastName ?? '',
          fullName,
          businessName: update.businessName,
          roleOrIndustry: update.roleOrIndustry,
          city: update.city,
          instagram: update.instagram,
          website: update.website,
          updatedAt: update.updatedAt,
        })
        .eq('id', member.contactId)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/me PATCH]', msg)
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 })
  }
}
