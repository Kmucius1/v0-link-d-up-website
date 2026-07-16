'use client'

import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, CalendarDays, Megaphone, Pin, ArrowUpRight, Loader2 } from 'lucide-react'
import { timeAgo } from '@/lib/format'

type Update = {
  id: string
  title: string
  body: string
  category: string
  link: string | null
  imageUrl: string | null
  pinned: boolean
  createdAt: string
}

const CATS: Record<string, { label: string; icon: typeof Sparkles; color: string }> = {
  ai: { label: 'AI', icon: Sparkles, color: 'text-[#a8d8f0] bg-[#a8d8f0]/12' },
  growth: { label: 'Growth', icon: TrendingUp, color: 'text-emerald-300 bg-emerald-400/12' },
  event: { label: 'Event', icon: CalendarDays, color: 'text-violet-300 bg-violet-400/12' },
  announcement: { label: 'News', icon: Megaphone, color: 'text-amber-300 bg-amber-400/12' },
}

export function UpdatesFeed() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/member/updates')
      .then((r) => r.json())
      .then((d) => setUpdates(d.updates ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-zinc-600">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (updates.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <Sparkles className="mx-auto text-[#a8d8f0]" />
        <p className="mt-2 font-semibold text-white">Fresh drops are coming.</p>
        <p className="mt-1 text-sm text-zinc-400">
          AI tips, growth plays, and Link&apos;d Up news will land right here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {updates.map((u) => {
        const cat = CATS[u.category] ?? CATS.ai
        const Icon = cat.icon
        return (
          <div key={u.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.color}`}>
                <Icon size={12} />
                {cat.label}
              </span>
              {u.pinned && <Pin size={13} className="text-zinc-500" />}
              <span className="ml-auto text-xs text-zinc-600">{timeAgo(u.createdAt)}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-white">{u.title}</h3>
            {u.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.imageUrl} alt="" className="mt-2 w-full rounded-xl border border-white/10" />
            )}
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{u.body}</p>
            {u.link && (
              <a
                href={u.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#a8d8f0]"
              >
                Open <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}
