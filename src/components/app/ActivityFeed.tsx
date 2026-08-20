'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, UserPlus, UserCheck, Loader2, Bell } from 'lucide-react'
import { timeAgo, initials } from '@/lib/format'
import { ConnectButton } from '@/components/app/ConnectButton'

type Actor = { id: string; fullName: string; businessName: string | null; avatarUrl: string | null; avatarPositionX: number | null; avatarPositionY: number | null } | null

type ActivityItem = {
  id: string
  type: 'like' | 'comment' | 'connection_request' | 'connection_accepted'
  createdAt: string
  actor: Actor
  postId?: string
  connectionId?: string
  commentPreview?: string
}

const ICONS: Record<ActivityItem['type'], { Icon: typeof Heart; cls: string }> = {
  like: { Icon: Heart, cls: 'text-[#ff5c7a] bg-[#ff5c7a]/15' },
  comment: { Icon: MessageCircle, cls: 'text-[#8fc4ff] bg-[#2d8cff]/15' },
  connection_request: { Icon: UserPlus, cls: 'text-[#c8a96a] bg-[#c8a96a]/15' },
  connection_accepted: { Icon: UserCheck, cls: 'text-emerald-300 bg-emerald-400/15' },
}

function ActorAvatar({ actor }: { actor: Actor }) {
  const name = actor?.fullName || 'Member'
  if (actor?.avatarUrl)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={actor.avatarUrl}
        alt={name}
        className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
        style={{ objectPosition: `${actor.avatarPositionX ?? 50}% ${actor.avatarPositionY ?? 50}%` }}
      />
    )
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#26364d,#626f86)] text-sm font-semibold text-white">
      {initials(name)}
    </div>
  )
}

function describe(item: ActivityItem) {
  const name = item.actor?.fullName || 'Someone'
  switch (item.type) {
    case 'like':
      return (
        <>
          <strong className="font-semibold text-white">{name}</strong> liked your post
        </>
      )
    case 'comment':
      return (
        <>
          <strong className="font-semibold text-white">{name}</strong> commented
          {item.commentPreview ? <span className="text-white/55">: &ldquo;{item.commentPreview}&rdquo;</span> : null}
        </>
      )
    case 'connection_request':
      return (
        <>
          <strong className="font-semibold text-white">{name}</strong> wants to connect
        </>
      )
    case 'connection_accepted':
      return (
        <>
          <strong className="font-semibold text-white">{name}</strong> accepted your connection request
        </>
      )
  }
}

export function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/member/activity')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-white/30">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <Bell className="mx-auto text-white/25" />
        <p className="mt-2 font-semibold text-white">Nothing yet.</p>
        <p className="mt-1 text-sm text-zinc-400">Likes, comments, and connection requests will show up here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const { Icon, cls } = ICONS[item.type]
        const profileHref = item.actor?.id ? `/members/${item.actor.id}` : undefined
        return (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-3">
            <div className="relative shrink-0">
              {profileHref ? (
                <Link href={profileHref}>
                  <ActorAvatar actor={item.actor} />
                </Link>
              ) : (
                <ActorAvatar actor={item.actor} />
              )}
              <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-[#0b0f16] ${cls}`}>
                <Icon size={11} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] leading-5 text-white/85">{describe(item)}</p>
              <p className="text-[11px] text-white/35">{timeAgo(item.createdAt)}</p>
            </div>
            {item.type === 'connection_request' && item.actor?.id && item.connectionId && (
              <ConnectButton memberId={item.actor.id} connectionId={item.connectionId} status="pending_received" size="sm" />
            )}
          </div>
        )
      })}
    </div>
  )
}
