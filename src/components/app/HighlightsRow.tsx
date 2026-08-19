'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

type Highlight = { id: string; title: string; coverImageUrl: string | null; itemCount: number }

export function HighlightsRow({ memberId, own }: { memberId: string; own?: boolean }) {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/member/highlights?memberId=${memberId}`)
      .then((r) => r.json())
      .then((d) => setHighlights(d.highlights ?? []))
      .finally(() => setLoading(false))
  }, [memberId])

  if (loading || (highlights.length === 0 && !own)) return null

  return (
    <section className="mt-5 px-4">
      <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {own && (
          <Link href="/highlights/new" className="w-[66px] shrink-0 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-[#111720]"><Plus size={26} /></div>
            <span className="mt-1 block truncate text-[11px] text-white/70">New</span>
          </Link>
        )}
        {highlights.map((h) => (
          <Link key={h.id} href={`/highlights/${h.id}`} className="w-[66px] shrink-0 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#587da8] bg-gradient-to-br from-[#14243a] to-[#0d131d] shadow-inner">
              {h.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.coverImageUrl} alt={h.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-[#6fb0ff]">{h.title.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <span className="mt-1 block truncate text-[11px] text-white/70">{h.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
