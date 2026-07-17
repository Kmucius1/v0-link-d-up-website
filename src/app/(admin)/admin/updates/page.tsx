'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Send, Loader2, Pin } from 'lucide-react'

type Update = {
  id: string
  title: string
  body: string
  category: string
  link: string | null
  pinned: boolean
  createdAt: string
}

const CATEGORIES = [
  { value: 'ai', label: 'AI' },
  { value: 'growth', label: 'Growth' },
  { value: 'event', label: 'Event' },
  { value: 'announcement', label: 'Announcement' },
]

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [form, setForm] = useState({ title: '', body: '', category: 'ai', link: '', pinned: false, notify: true })
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState('')

  async function load() {
    const res = await fetch('/api/admin/updates')
    if (res.ok) setUpdates((await res.json()).updates ?? [])
  }
  useEffect(() => {
    load()
  }, [])

  async function publish(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setResult('')
    const res = await fetch('/api/admin/updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      const push = data.push
      setResult(
        push
          ? push.skipped
            ? `Published. Push skipped: ${push.skipped}`
            : `Published & notified ${push.sent}/${push.total} device(s).`
          : 'Published.'
      )
      setForm({ title: '', body: '', category: 'ai', link: '', pinned: false, notify: true })
      load()
    } else {
      setResult(data.error || 'Failed to publish.')
    }
    setSaving(false)
  }

  const input =
    'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500 focus:outline-none'

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="text-violet-400" />
        <h1 className="text-xl font-bold text-white">Member Updates &amp; Push</h1>
      </div>

      <form onSubmit={publish} className="mb-8 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <p className="text-sm font-semibold text-zinc-300">Publish an update to the member app</p>
        <input
          className={input}
          placeholder="Title (e.g. 3 AI tools to automate your DMs)"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />
        <textarea
          className={input}
          rows={4}
          placeholder="Write the update members will read…"
          value={form.body}
          onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            className={input}
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            className={input}
            placeholder="Link (optional)"
            value={form.link}
            onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm((p) => ({ ...p, pinned: e.target.checked }))}
            />
            Pin to top
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.notify}
              onChange={(e) => setForm((p) => ({ ...p, notify: e.target.checked }))}
            />
            Send push notification
          </label>
          <button
            type="submit"
            disabled={saving}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Publish
          </button>
        </div>
        {result && <p className="text-sm text-violet-300">{result}</p>}
      </form>

      <h2 className="mb-3 text-sm font-semibold text-zinc-400">Published updates</h2>
      <div className="space-y-2">
        {updates.map((u) => (
          <div key={u.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-300">
                {u.category}
              </span>
              {u.pinned && <Pin size={12} className="text-zinc-500" />}
              <span className="ml-auto text-xs text-zinc-600">
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1.5 font-semibold text-white">{u.title}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-zinc-400">{u.body}</p>
          </div>
        ))}
        {updates.length === 0 && <p className="text-sm text-zinc-600">No updates published yet.</p>}
      </div>
    </div>
  )
}
