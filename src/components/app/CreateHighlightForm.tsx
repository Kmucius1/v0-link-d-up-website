'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Film, Loader2 } from 'lucide-react'

type MyPost = { id: string; imageUrl: string | null; mediaType: string; body: string; mine: boolean }

export function CreateHighlightForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [posts, setPosts] = useState<MyPost[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/member/posts')
      .then((r) => r.json())
      .then((d) => setPosts(((d.posts ?? []) as MyPost[]).filter((p) => p.mine && p.imageUrl)))
      .finally(() => setLoading(false))
  }, [])

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  async function submit() {
    setError('')
    if (!title.trim()) return setError('Give your highlight a title.')
    if (selected.length === 0) return setError('Pick at least one post.')
    setSaving(true)
    const res = await fetch('/api/member/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, postIds: selected }),
    })
    setSaving(false)
    if (res.ok) {
      router.push('/profile')
    } else {
      setError((await res.json().catch(() => ({}))).error || 'Could not create highlight.')
    }
  }

  return (
    <div className="px-4 py-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Highlight title (e.g. Events)"
        maxLength={40}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#a8d8f0]/50 focus:outline-none"
      />

      <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-white/40">
        Pick posts with photos or video ({selected.length} selected)
      </p>

      {loading ? (
        <div className="flex justify-center py-10 text-white/30"><Loader2 className="animate-spin" /></div>
      ) : posts.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">You don&apos;t have any posts with media yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((p) => {
            const isSelected = selected.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className="relative aspect-square overflow-hidden rounded-lg bg-[#151a22]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.mediaType === 'video' ? (
                  <>
                    <video src={p.imageUrl!} className="h-full w-full object-cover" muted />
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 p-1"><Film size={11} className="text-white" /></span>
                  </>
                ) : (
                  <img src={p.imageUrl!} alt="" className="h-full w-full object-cover" />
                )}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#2d8cff]/40">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2d8cff] text-white"><Check size={14} /></span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      <button
        onClick={submit}
        disabled={saving}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#a8d8f0] py-2.5 text-sm font-semibold text-black disabled:opacity-60"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        Create highlight
      </button>
    </div>
  )
}
