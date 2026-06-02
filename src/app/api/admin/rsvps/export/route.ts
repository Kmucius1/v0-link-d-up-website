import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET() {
  const rsvps = await prisma.rsvp.findMany({
    include: { contact: true, event: true },
    orderBy: { createdAt: 'desc' },
  })

  const header = ['Name', 'Email', 'Phone', 'Business', 'Role/Industry', 'City', 'Event', 'Event Date', 'RSVP Status', 'Guests', 'How They Heard', 'Checked In', 'Attended', 'Email Consent', 'RSVP Date']
  const rows = rsvps.map((r) => [
    r.contact.fullName,
    r.contact.email,
    r.contact.phone || '',
    r.contact.businessName || '',
    r.contact.roleOrIndustry || '',
    r.contact.city || '',
    r.event.eventName,
    format(r.event.eventDate, 'yyyy-MM-dd'),
    r.rsvpStatus,
    String(r.numberOfGuests),
    r.howDidYouHear || '',
    r.checkedIn ? 'Yes' : 'No',
    r.attended ? 'Yes' : 'No',
    r.contact.consentToEmail ? 'Yes' : 'No',
    format(r.createdAt, 'yyyy-MM-dd'),
  ])

  const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="linkdup-rsvps.csv"',
    },
  })
}
