'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle, XCircle, UserCheck } from 'lucide-react'

type Event = { id: string; eventName: string; eventDate: string }
type Rsvp = {
  id: string
  checkedIn: boolean
  attended: boolean
  rsvpStatus: string
  numberOfGuests: number
  contact: { fullName: string; email: string; phone: string | null; businessName: string | null }
}

export default function CheckInPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/events').then((r) => r.json()).then(setEvents)
  }, [])

  useEffect(() => {
    if (!selectedEvent) return
    setLoading(true)
    fetch(`/api/admin/events/${selectedEvent}`)
      .then((r) => r.json())
      .then((data) => setRsvps(data.rsvps || []))
      .finally(() => setLoading(false))
  }, [selectedEvent])

  async function toggle(rsvpId: string, field: 'checkedIn' | 'attended', current: boolean) {
    await fetch('/api/admin/rsvps/checkin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsvpId, [field]: !current }),
    })
    setRsvps((prev) => prev.map((r) => r.id === rsvpId ? { ...r, [field]: !current } : r))
  }

  const filtered = rsvps.filter((r) => {
    const q = search.toLowerCase()
    return !q || r.contact.fullName.toLowerCase().includes(q) || r.contact.email.toLowerCase().includes(q) || (r.contact.businessName || '').toLowerCase().includes(q)
  })

  const checkedInCount = rsvps.filter((r) => r.checkedIn).length

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Event Check-In</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Check attendees in as they arrive</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500"
        >
          <option value="">Select an event…</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.eventName} ({format(new Date(e.eventDate), 'MMM d, yyyy')})</option>
          ))}
        </select>
        {selectedEvent && (
          <input
            type="text"
            placeholder="Search by name, email, or business…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500"
          />
        )}
      </div>

      {selectedEvent && rsvps.length > 0 && (
        <div className="flex gap-4 text-sm">
          <span className="text-zinc-400">{rsvps.length} RSVPs</span>
          <span className="text-emerald-400 font-medium">{checkedInCount} checked in</span>
          <span className="text-zinc-500">{rsvps.length - checkedInCount} remaining</span>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading RSVPs…</p>
      ) : selectedEvent && filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <UserCheck size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">{search ? 'No matches found.' : 'No RSVPs for this event.'}</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Attendee</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Guests</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Checked In</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Attended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((rsvp) => (
                <tr key={rsvp.id} className={`transition-colors ${rsvp.checkedIn ? 'bg-emerald-500/5' : 'hover:bg-zinc-800/20'}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-200">{rsvp.contact.fullName}</p>
                    <p className="text-xs text-zinc-500">{rsvp.contact.email}</p>
                    {rsvp.contact.businessName && <p className="text-xs text-zinc-600">{rsvp.contact.businessName}</p>}
                    {rsvp.contact.phone && <p className="text-xs text-zinc-600">{rsvp.contact.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-300">{rsvp.numberOfGuests}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(rsvp.id, 'checkedIn', rsvp.checkedIn)} className="mx-auto block hover:scale-110 transition-transform">
                      {rsvp.checkedIn
                        ? <CheckCircle size={22} className="text-emerald-400" />
                        : <XCircle size={22} className="text-zinc-700 hover:text-zinc-500" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(rsvp.id, 'attended', rsvp.attended)} className="mx-auto block hover:scale-110 transition-transform">
                      {rsvp.attended
                        ? <CheckCircle size={22} className="text-violet-400" />
                        : <XCircle size={22} className="text-zinc-700 hover:text-zinc-500" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
