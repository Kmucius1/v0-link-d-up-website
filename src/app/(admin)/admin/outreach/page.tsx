'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { MapPin } from 'lucide-react'

type Event = { id: string; eventName: string }
type Outreach = {
  id: string
  businessName: string
  contactName: string | null
  email: string | null
  phone: string | null
  address: string | null
  neighborhood: string | null
  outreachType: string | null
  status: string
  notes: string | null
  lastContactAt: string | null
  createdAt: string
  event: { eventName: string } | null
}

const STATUS_OPTIONS = ['not_contacted', 'reached_out', 'in_conversation', 'confirmed', 'declined', 'no_response']
const STATUS_LABELS: Record<string, string> = {
  not_contacted: 'Not Contacted',
  reached_out: 'Reached Out',
  in_conversation: 'In Conversation',
  confirmed: 'Confirmed',
  declined: 'Declined',
  no_response: 'No Response',
}
const STATUS_COLORS: Record<string, string> = {
  not_contacted: 'bg-zinc-700 text-zinc-400',
  reached_out: 'bg-blue-500/20 text-blue-400',
  in_conversation: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-emerald-500/20 text-emerald-400',
  declined: 'bg-red-500/20 text-red-400',
  no_response: 'bg-zinc-700 text-zinc-500',
}

export default function OutreachPage() {
  const [records, setRecords] = useState<Outreach[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ businessName: '', contactName: '', email: '', phone: '', address: '', neighborhood: '', outreachType: '', notes: '', eventId: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/events').then((r) => r.json()).then(setEvents)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/outreach${filter ? `?status=${filter}` : ''}`)
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false))
  }, [filter])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.ok) {
      setRecords((prev) => [data.record, ...prev])
      setForm({ businessName: '', contactName: '', email: '', phone: '', address: '', neighborhood: '', outreachType: '', notes: '', eventId: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/outreach', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, lastContactAt: new Date().toISOString() }),
    })
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status, lastContactAt: new Date().toISOString() } : r))
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Local Outreach Tracker</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{records.length} businesses tracked</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Business
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === '' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-white">Add Business</h2>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Contact name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Neighborhood" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <input placeholder="Outreach type (flyer, email, cold call…)" value={form.outreachType} onChange={(e) => setForm({ ...form, outreachType: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <select value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
              <option value="">No event</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.eventName}</option>)}
            </select>
          </div>
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
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
      ) : records.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <MapPin size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No outreach records yet.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Business</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Area</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Last Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-200">{r.businessName}</p>
                    {r.outreachType && <p className="text-xs text-zinc-500">{r.outreachType}</p>}
                    {r.event && <p className="text-xs text-violet-400">{r.event.eventName}</p>}
                    {r.notes && <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-48">{r.notes}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {r.contactName && <p className="text-zinc-300 text-sm">{r.contactName}</p>}
                    {r.email && <p className="text-xs text-zinc-500">{r.email}</p>}
                    {r.phone && <p className="text-xs text-zinc-500">{r.phone}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {r.neighborhood && <p className="text-sm text-zinc-300">{r.neighborhood}</p>}
                    {r.address && <p className="text-xs text-zinc-500">{r.address}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 focus:outline-none focus:border-violet-500">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {r.lastContactAt ? format(new Date(r.lastContactAt), 'MMM d, yyyy') : '—'}
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
