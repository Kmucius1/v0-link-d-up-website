'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

export default function SendCampaignButton({ campaignId, campaignName }: { campaignId: string; campaignName: string }) {
  const router = useRouter()
  const [sending, setSending] = useState(false)

  async function handleSend() {
    if (!confirm(`Send "${campaignName}" now? This will email everyone in the audience immediately.`)) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/send`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')
      alert(`Sent to ${data.sent} of ${data.total} recipients${data.failed ? ` (${data.failed} failed)` : ''}.`)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send campaign')
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={sending}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
    >
      <Send size={11} /> {sending ? 'Sending…' : 'Send'}
    </button>
  )
}
