'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { UserPlus } from 'lucide-react'

type Event = { id: string; eventName: string; eventDate: string }
type WalkIn = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  businessName: string | null
  instagram: string | null
  notes: string | null
  createdAt: string
  event: { eventName: string } | null
}

export default function WalkInsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [walkIns, setWalkIns] = useState<WalkIn[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', businessName: '', instagram: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/events').then((r) => r.json()).then(setEvents)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/walkins${selectedEvent ? `?eventId=${selectedEvent}` : ''}`)
      .then((r) => r.json())
      .then(setWalkIns)
      .finally(() => setLoading(false))
  }, [selectedEvent])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/walkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: selectedEvent || undefined }),
    })
    const data = await res.json()
    if (data.ok) {
      setWalkIns((prev) => [data.walkIn, ...prev])
      setForm({ firstName: '', lastName: '', email: '', phone: '', businessName: '', instagram: '', notes: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Walk-In Attendees</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{walkIns.length} walk-ins recorded</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Walk-In
        </button>
      </div>

      <div className="flex gap-3">
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
          <option value="">All Events</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-white">Add Walk-In</h2>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Instagram @handle" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
          </div>
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Walk-In'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading…</p>
      ) : walkIns.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <UserPlus size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No walk-ins recorded yet.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Business</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {walkIns.map((w) => (
                <tr key={w.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-200">{w.firstName} {w.lastName}</td>
                  <td className="px-4 py-3">
                    {w.email && <p className="text-xs text-zinc-400">{w.email}</p>}
                    {w.phone && <p className="text-xs text-zinc-500">{w.phone}</p>}
                    {w.instagram && <p className="text-xs text-violet-400">@{w.instagram.replace('@', '')}</p>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">{w.businessName || '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{w.event?.eventName || '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{format(new Date(w.createdAt), 'MMM d, h:mm a')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
