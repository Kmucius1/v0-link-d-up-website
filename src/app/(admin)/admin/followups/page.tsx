'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CheckSquare } from 'lucide-react'

type Task = {
  id: string
  title: string
  notes: string | null
  dueDate: string | null
  assignedTo: string | null
  status: string
  priority: string
  createdAt: string
  contact: { fullName: string; email: string } | null
  event: { eventName: string } | null
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  normal: 'bg-zinc-700 text-zinc-300',
  low: 'bg-zinc-800 text-zinc-500',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  done: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-zinc-700 text-zinc-500',
}

export default function FollowupsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', notes: '', dueDate: '', assignedTo: '', priority: 'normal' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/followups?status=${filter}`)
      .then((r) => r.json())
      .then(setTasks)
      .finally(() => setLoading(false))
  }, [filter])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/followups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.ok) {
      setTasks((prev) => [data.task, ...prev])
      setForm({ title: '', notes: '', dueDate: '', assignedTo: '', priority: 'normal' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/followups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setTasks((prev) => prev.filter((t) => t.id !== id || filter === 'all'))
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow-Up Tasks</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{tasks.length} tasks</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Task
        </button>
      </div>

      <div className="flex gap-2">
        {['pending', 'in_progress', 'done', 'all'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
            {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-white">New Follow-Up Task</h2>
          <input required placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
            <input placeholder="Assigned to" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500" />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
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
          <CheckSquare size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No tasks in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-zinc-100">{task.title}</p>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                  </div>
                  {task.notes && <p className="text-sm text-zinc-400 mt-1">{task.notes}</p>}
                  <div className="flex gap-3 mt-1 text-xs text-zinc-500 flex-wrap">
                    {task.dueDate && <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>}
                    {task.assignedTo && <span>→ {task.assignedTo}</span>}
                    {task.contact && <span>Contact: {task.contact.fullName}</span>}
                    {task.event && <span>Event: {task.event.eventName}</span>}
                  </div>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                  className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 shrink-0 focus:outline-none focus:border-violet-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
