'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, MessageCircle } from 'lucide-react'
import { initials, timeAgo } from '@/lib/format'

type Conversation = {
  counterpartId: string
  lastBody: string
  lastCreatedAt: string
  unreadCount: number
  member: { id: string; fullName: string; businessName: string | null; avatarUrl: string | null } | null
}

export function MessagesList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/member/messages')
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-14 text-white/30">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="py-16 text-center">
        <MessageCircle className="mx-auto text-white/20" />
        <p className="mt-3 font-semibold">No messages yet.</p>
        <p className="mt-1 text-sm text-white/40">Message someone from their profile to start a conversation.</p>
      </div>
    )
  }

  return (
    <div>
      {conversations.map((c) => (
        <Link
          key={c.counterpartId}
          href={`/messages/${c.counterpartId}`}
          className="flex items-center gap-3 border-b border-white/8 px-3 py-3.5 lg:rounded-xl lg:border lg:mb-2 lg:px-4"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#22324a] to-[#121722] text-sm font-bold text-white ring-1 ring-white/10">
            {c.member?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.member.avatarUrl} alt={c.member.fullName} className="h-full w-full object-cover" />
            ) : (
              initials(c.member?.fullName || 'Member')
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm ${c.unreadCount > 0 ? 'font-bold text-white' : 'font-semibold text-white/90'}`}>
              {c.member?.fullName || 'Member'}
            </p>
            <p className={`truncate text-xs ${c.unreadCount > 0 ? 'text-white/80' : 'text-white/40'}`}>{c.lastBody}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-[11px] text-white/35">{timeAgo(c.lastCreatedAt)}</span>
            {c.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2d8cff] px-1.5 text-[10px] font-bold text-white">
                {c.unreadCount}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
