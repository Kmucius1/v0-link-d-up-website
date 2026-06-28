'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Megaphone } from 'lucide-react'

type Event = { id: string; eventName: string }
type PromoTask = {
  id: string
  platform: string
  contentType: string
  description: string
  dueDate: string | null
  assignedTo: string | null
  status: string
  postUrl: string | null
  notes: string | null
  createdAt: string
  event: { eventName: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  posted: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-zinc-700 text-zinc-500',
}

const PLATFORMS = ['Instagram', 'TikTok', 'Facebook', 'Twitter/X', 'LinkedIn', 'Email', 'Flyer', 'Website', 'Other']
const CONTENT_TYPES = ['Post', 'Story', 'Reel', 'Video', 'Graphic', 'Email Blast', 'Blog Post', 'Press Release', 'Ad']

export default function PromoTasksPage() {
  const [tasks, setTasks] = useState<PromoTask[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ platform: 'Instagram', contentType: 'Post', description: '', dueDate: '', assignedTo: '', eventId: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/events').then((r) => r.json()).then(setEvents)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/promo-tasks${filter ? `?status=${filter}` : ''}`)
      .then((r) => r.json())
      .then(setTasks)
      .finally(() => setLoading(false))
  }, [filter])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/promo-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.ok) {
      setTasks((prev) => [data.task, ...prev])
      setForm({ platform: 'Instagram', contentType: 'Post', description: '', dueDate: '', assignedTo: '', eventId: '', notes: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/promo-tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Promo / Social Tasks</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{tasks.length} tasks</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Task
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'in_progress', 'posted', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
            {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-white">New Promo Task</h2>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500">
              {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500">
              {CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea required placeholder="Description / content brief" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
            <input placeholder="Assigned to" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <select value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
              <option value="">No event</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.eventName}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Task'}
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
      ) : tasks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Megaphone size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No promo tasks yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">{task.platform}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{task.contentType}</span>
                    {task.event && <span className="text-xs text-zinc-500">{task.event.eventName}</span>}
                  </div>
                  <p className="text-sm text-zinc-200 mt-1.5">{task.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-zinc-500 flex-wrap">
                    {task.dueDate && <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>}
                    {task.assignedTo && <span>→ {task.assignedTo}</span>}
                    {task.postUrl && <a href={task.postUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">View Post ↗</a>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                  <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 focus:outline-none focus:border-violet-500">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="posted">Posted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
