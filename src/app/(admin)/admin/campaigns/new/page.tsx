'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const AUDIENCE_OPTIONS = [
  "All LINK'D UP Contacts",
  "RSVP'd for a specific event",
  "Attended a specific event",
  "Did not attend",
  "Survey Responders",
  "Interested in Sponsoring",
  "Interested in Vending",
  "Interested in Speaking",
  "Interested in Performing",
  "Interested in Art",
  "Interested in Collaborating",
  "Creators",
  "Business Owners",
  "Artists",
  "Entrepreneurs",
  "Students / Young Professionals",
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subject, bodyHtml: body, audienceTag: audience }),
    })
    if (res.ok) router.push('/admin/campaigns')
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/campaigns" className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-2xl font-bold text-white">New Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Campaign Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="Vol. 1 Reminder" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Email Subject *</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="You're Invited — LINK'D UP Vol. 1" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Audience</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500">
            {AUDIENCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Email Body (HTML or plain text) *</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={12}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 font-mono resize-none"
            placeholder="<p>Hey! We're excited to announce...</p>" />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/campaigns" className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60">
            {loading ? 'Saving…' : 'Save Campaign'}
          </button>
        </div>
      </form>
    </div>
  )
}
