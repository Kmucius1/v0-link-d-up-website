export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'

export async function GET() {
  const { data: rsvps, error } = await supabaseAdmin
    .from('rsvps')
    .select('*, contacts(*), events(*)')
    .order('createdAt', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const header = ['Name', 'Email', 'Phone', 'Business', 'Role/Industry', 'City', 'Event', 'Event Date', 'RSVP Status', 'Guests', 'How They Heard', 'Checked In', 'Attended', 'Email Consent', 'RSVP Date']
  const rows = (rsvps || []).map((r) => [
    r.contacts.fullName,
    r.contacts.email,
    r.contacts.phone || '',
    r.contacts.businessName || '',
    r.contacts.roleOrIndustry || '',
    r.contacts.city || '',
    r.events.eventName,
    format(r.events.eventDate, 'yyyy-MM-dd'),
    r.rsvpStatus,
    String(r.numberOfGuests),
    r.howDidYouHear || '',
    r.checkedIn ? 'Yes' : 'No',
    r.attended ? 'Yes' : 'No',
    r.contacts.consentToEmail ? 'Yes' : 'No',
    format(r.createdAt, 'yyyy-MM-dd'),
  ])

  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="linkdup-rsvps.csv"',
    },
  })
}
