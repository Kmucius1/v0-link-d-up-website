'use client'

import { useState } from 'react'
import { UserPlus, Check, Clock, Loader2 } from 'lucide-react'

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted'

export function ConnectButton({
  memberId,
  connectionId: initialConnectionId,
  status: initialStatus,
  size = 'sm',
}: {
  memberId: string
  connectionId?: string | null
  status: ConnectionStatus
  size?: 'sm' | 'md'
}) {
  const [status, setStatus] = useState(initialStatus)
  const [connectionId, setConnectionId] = useState(initialConnectionId ?? null)
  const [loading, setLoading] = useState(false)

  async function connect() {
    setLoading(true)
    try {
      const res = await fetch('/api/member/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: memberId }),
      })
      if (res.ok) {
        const d = await res.json()
        setConnectionId(d.id)
        setStatus(d.status === 'accepted' ? 'accepted' : 'pending_sent')
      }
    } finally {
      setLoading(false)
    }
  }

  async function respond(action: 'accept' | 'decline') {
    if (!connectionId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/member/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) setStatus(action === 'accept' ? 'accepted' : 'none')
    } finally {
      setLoading(false)
    }
  }

  const iconSize = size === 'sm' ? 12 : 16
  const pillCls = size === 'sm'
    ? 'flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold'
    : 'flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold'

  if (status === 'accepted') {
    return (
      <span className={`${pillCls} bg-white/[0.05] text-white/45`}>
        <Check size={iconSize} /> Connected
      </span>
    )
  }

  if (status === 'pending_received') {
    return (
      <div className={size === 'sm' ? 'flex items-center gap-1.5' : 'flex flex-1 gap-2'}>
        <button
          disabled={loading}
          onClick={() => respond('accept')}
          className={`${pillCls} bg-[#2d8cff] text-white disabled:opacity-40`}
        >
          {loading ? <Loader2 size={iconSize} className="animate-spin" /> : 'Accept'}
        </button>
        <button
          disabled={loading}
          onClick={() => respond('decline')}
          className={`${pillCls} bg-white/[0.05] text-white/50 disabled:opacity-40`}
        >
          Decline
        </button>
      </div>
    )
  }

  if (status === 'pending_sent') {
    return (
      <span className={`${pillCls} bg-white/[0.05] text-white/40`}>
        <Clock size={iconSize} /> Requested
      </span>
    )
  }

  return (
    <button disabled={loading} onClick={connect} className={`${pillCls} bg-[#2d8cff] text-white disabled:opacity-40`}>
      {loading ? <Loader2 size={iconSize} className="animate-spin" /> : <UserPlus size={iconSize} />}
      Connect
    </button>
  )
}
