'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Star } from 'lucide-react'

type Inquiry = {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string | null
  website: string | null
  sponsorshipType: string | null
  budget: string | null
  message: string | null
  status: string
  notes: string | null
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-violet-500/20 text-violet-300',
  contacted: 'bg-blue-500/20 text-blue-300',
  in_review: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-emerald-500/20 text-emerald-300',
  declined: 'bg-red-500/20 text-red-300',
}

export default function SponsorInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/sponsor-inquiries')
      .then((r) => r.json())
      .then(setInquiries)
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/sponsor-inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Sponsor Inquiries</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{inquiries.length} inquiries</p>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading…</p>
      ) : inquiries.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Star size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No sponsor inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-zinc-100 text-lg">{inq.companyName}</p>
                  <p className="text-sm text-zinc-300">{inq.contactName} · {inq.email}{inq.phone ? ` · ${inq.phone}` : ''}</p>
                  {inq.website && <p className="text-xs text-violet-400 mt-0.5">{inq.website}</p>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {inq.sponsorshipType && (
                      <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-300">{inq.sponsorshipType}</span>
                    )}
                    {inq.budget && (
                      <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-300">Budget: {inq.budget}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[inq.status] || 'bg-zinc-700 text-zinc-300'}`}>
                    {inq.status}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 focus:outline-none focus:border-violet-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_review">In Review</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>
              {inq.message && (
                <p className="text-sm text-zinc-300 mt-3 whitespace-pre-wrap leading-relaxed border-t border-zinc-800 pt-3">{inq.message}</p>
              )}
              <p className="text-xs text-zinc-600 mt-2">{format(new Date(inq.createdAt), 'MMM d, yyyy h:mm a')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
