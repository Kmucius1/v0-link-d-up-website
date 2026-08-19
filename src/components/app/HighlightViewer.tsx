'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { ASPECT_RATIOS, type Post } from '@/components/app/CircleFeed'

type HighlightDetail = {
  highlight: { id: string; title: string; owner: { fullName: string } | null }
  posts: Post[]
  mine: boolean
}

export function HighlightViewer({ id }: { id: string }) {
  const router = useRouter()
  const [data, setData] = useState<HighlightDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/member/highlights/${id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [id])

  async function remove() {
    setDeleting(true)
    const res = await fetch(`/api/member/highlights/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/profile')
    setDeleting(false)
  }

  if (loading) {
    return <div className="flex justify-center py-14 text-white/30"><Loader2 className="animate-spin" /></div>
  }
  if (!data) {
    return <p className="py-14 text-center text-sm text-white/40">Highlight not found.</p>
  }

  return (
    <div className="px-3 py-4">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-lg font-bold text-white">{data.highlight.title}</h1>
        {data.mine && (
          <button
            onClick={remove}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-red-400 disabled:opacity-50"
          >
            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {data.posts.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10">
            <div className="bg-black" style={{ aspectRatio: ASPECT_RATIOS[p.aspectRatio]?.css ?? ASPECT_RATIOS.square.css }}>
              {p.mediaType === 'video' ? (
                <video src={p.imageUrl!} className="h-full w-full object-cover" controls playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl!} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            {p.body && <p className="whitespace-pre-wrap px-3 py-2.5 text-sm text-white/85">{p.body}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
