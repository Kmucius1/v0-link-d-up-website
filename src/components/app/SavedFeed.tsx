'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { PostCard, type Post } from '@/components/app/CircleFeed'

export function SavedFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/member/saved')
    if (res.ok) setPosts((await res.json()).posts ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-14 text-white/30">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <Bookmark className="mx-auto text-white/20" />
        <p className="mt-3 font-semibold">Nothing saved yet.</p>
        <p className="mt-1 text-sm text-white/40">Tap the bookmark icon on a post to save it here.</p>
      </div>
    )
  }

  return <div>{posts.map((p) => <PostCard key={p.id} post={p} onChange={load} />)}</div>
}
