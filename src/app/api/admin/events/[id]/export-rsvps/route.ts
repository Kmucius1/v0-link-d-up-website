export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const rsvps = await prisma.rsvp.findMany({
    where: { eventId: id },
    include: { contact: true, event: true },
    orderBy: { createdAt: 'desc' },
  })

  const header = ['Name', 'Email', 'Phone', 'Business', 'Role/Industry', 'RSVP Status', 'Guests', 'How They Heard', 'Checked In', 'Attended', 'RSVP Date']
  const rows = rsvps.map((r) => [
    r.contact.fullName,
    r.contact.email,
    r.contact.phone || '',
    r.contact.businessName || '',
    r.contact.roleOrIndustry || '',
    r.rsvpStatus,
    String(r.numberOfGuests),
    r.howDidYouHear || '',
    r.checkedIn ? 'Yes' : 'No',
    r.attended ? 'Yes' : 'No',
    format(r.createdAt, 'yyyy-MM-dd'),
  ])

  const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="rsvps-${id}.csv"`,
    },
  })
}