export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: rsvps, error } = await supabaseAdmin
    .from('rsvps')
    .select('*, contacts(*), events(*)')
    .eq('eventId', id)
    .order('createdAt', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const header = ['Name', 'Email', 'Phone', 'Business', 'Role/Industry', 'RSVP Status', 'Guests', 'How They Heard', 'Checked In', 'Attended', 'RSVP Date']
  const rows = (rsvps || []).map((r) => [
    r.contacts.fullName,
    r.contacts.email,
    r.contacts.phone || '',
    r.contacts.businessName || '',
    r.contacts.roleOrIndustry || '',
    r.rsvpStatus,
    String(r.numberOfGuests),
    r.howDidYouHear || '',
    r.checkedIn ? 'Yes' : 'No',
    r.attended ? 'Yes' : 'No',
    format(r.createdAt, 'yyyy-MM-dd'),
  ])

  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="rsvps-${id}.csv"`,
    },
  })
}
