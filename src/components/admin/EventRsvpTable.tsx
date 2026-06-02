'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { CheckCircle, XCircle } from 'lucide-react'

type Rsvp = {
  id: string
  rsvpStatus: string
  numberOfGuests: number
  howDidYouHear: string | null
  checkedIn: boolean
  attended: boolean
  createdAt: Date
  contact: {
    id: string
    fullName: string
    email: string
    phone: string | null
    businessName: string | null
    roleOrIndustry: string | null
  }
}

export function EventRsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  if (rsvps.length === 0) {
    return <p className="text-zinc-500 text-sm">No RSVPs yet for this event.</p>
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-2 pr-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
            <th className="text-left py-2 pr-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Business</th>
            <th className="text-left py-2 pr-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="text-center py-2 pr-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Guests</th>
            <th className="text-center py-2 pr-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Checked In</th>
            <th className="text-center py-2 pr-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Attended</th>
            <th className="text-left py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {rsvps.map((rsvp) => (
            <tr key={rsvp.id} className="hover:bg-zinc-800/20 transition-colors">
              <td className="py-2.5 pr-4">
                <Link href={`/admin/contacts/${rsvp.contact.id}`} className="group">
                  <p className="text-zinc-200 font-medium group-hover:text-violet-300 transition-colors">{rsvp.contact.fullName}</p>
                  <p className="text-xs text-zinc-600">{rsvp.contact.email}</p>
                </Link>
              </td>
              <td className="py-2.5 pr-4 hidden sm:table-cell text-zinc-400 text-xs">
                {rsvp.contact.businessName || rsvp.contact.roleOrIndustry || '—'}
              </td>
              <td className="py-2.5 pr-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  rsvp.rsvpStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                  rsvp.rsvpStatus === 'waitlisted' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{rsvp.rsvpStatus}</span>
              </td>
              <td className="py-2.5 pr-4 text-center text-zinc-300">{rsvp.numberOfGuests}</td>
              <td className="py-2.5 pr-4 text-center">
                {rsvp.checkedIn ? <CheckCircle size={13} className="text-emerald-400 mx-auto" /> : <XCircle size={13} className="text-zinc-700 mx-auto" />}
              </td>
              <td className="py-2.5 pr-4 text-center">
                {rsvp.attended ? <CheckCircle size={13} className="text-emerald-400 mx-auto" /> : <XCircle size={13} className="text-zinc-700 mx-auto" />}
              </td>
              <td className="py-2.5 hidden md:table-cell text-zinc-600 text-xs">{rsvp.howDidYouHear || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
