'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'

export default function SendReminderButton({ eventId, eventName }: { eventId: string; eventName: string }) {
  const router = useRouter()
  const [sending, setSending] = useState(false)

  async function handleSend() {
    if (!confirm(`Send an event reminder to everyone confirmed for "${eventName}"?`)) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/rsvps/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')
      alert(`Reminder sent to ${data.sent} of ${data.total} confirmed RSVPs${data.failed ? ` (${data.failed} failed)` : ''}.`)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send reminder')
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={sending}
      className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Bell size={14} /> {sending ? 'Sending…' : 'Send Reminder to RSVPs'}
    </button>
  )
}
