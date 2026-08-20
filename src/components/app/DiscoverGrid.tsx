'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Film, Loader2, Search, Users, X } from 'lucide-react'
import { initials } from '@/lib/format'

type GridPost = {
  id: string
  memberId: string
  imageUrl: string
  mediaType: string
  aspectRatio: string
  author: { id: string; fullName: string; avatarUrl: string | null } | null
}

type SearchMember = {
  id: string
  fullName: string
  businessName: string | null
  roleOrIndustry: string | null
  avatarUrl: string | null
  avatarPositionX: number | null
  avatarPositionY: number | null
}

export function DiscoverGrid() {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<GridPost[]>([])
  const [results, setResults] = useState<SearchMember[]>([])
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function loadGrid() {
    setLoading(true)
    const res = await fetch('/api/member/discover')
    if (res.ok) setPosts((await res.json()).posts ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadGrid()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (!q) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/member/discover?q=${encodeURIComponent(q)}`)
      if (res.ok) setResults((await res.json()).members ?? [])
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const searching = query.trim().length > 0

  return (
    <div>
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-9 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#2d8cff]/50"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
            <X size={15} />
          </button>
        )}
      </div>

      {searching ? (
        results.length === 0 ? (
          <div className="py-14 text-center text-sm text-white/40">No one matches &ldquo;{query}&rdquo;.</div>
        ) : (
          <div className="space-y-1">
            {results.map((m) => (
              <Link key={m.id} href={`/members/${m.id}`} className="flex items-center gap-3 rounded-xl px-2 py-2.5 active:bg-white/[0.04]">
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.avatarUrl}
                    alt={m.fullName}
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
                    style={{ objectPosition: `${m.avatarPositionX ?? 50}% ${m.avatarPositionY ?? 50}%` }}
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,#26364d,#626f86)] text-sm font-semibold text-white">
                    {initials(m.fullName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{m.fullName}</p>
                  {(m.businessName || m.roleOrIndustry) && <p className="truncate text-xs text-white/45">{m.businessName || m.roleOrIndustry}</p>}
                </div>
              </Link>
            ))}
          </div>
        )
      ) : loading ? (
        <div className="flex justify-center py-14 text-white/30">
          <Loader2 className="animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <Users className="mx-auto text-white/20" />
          <p className="mt-3 font-semibold">Nothing to discover yet.</p>
          <p className="mt-1 text-sm text-white/40">Photo and video posts from the Circle will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] bg-[#0b0f16]">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.author?.id ? `/members/${post.author.id}` : '#'}
              className="relative aspect-square overflow-hidden bg-[#151a22]"
            >
              {post.mediaType === 'video' ? (
                <>
                  <video src={post.imageUrl} className="h-full w-full object-cover" muted />
                  <Film size={16} className="absolute right-1.5 top-1.5 text-white drop-shadow" />
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
