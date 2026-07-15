'use client'

import { useRouter } from 'next/navigation'

export default function DisconnectSocialButton() {
  const router = useRouter()

  async function handleDisconnect() {
    if (!confirm('Disconnect Facebook & Instagram? You\'ll need to reconnect to post again.')) return
    await fetch('/api/admin/social/disconnect', { method: 'POST' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDisconnect}
      className="px-3 py-1.5 bg-zinc-800 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 text-xs font-medium rounded-lg transition-colors"
    >
      Disconnect
    </button>
  )
}
