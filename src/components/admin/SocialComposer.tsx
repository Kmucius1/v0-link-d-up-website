'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SocialComposer({ hasInstagram }: { hasInstagram: boolean }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [toFacebook, setToFacebook] = useState(true)
  const [toInstagram, setToInstagram] = useState(false)
  const [posting, setPosting] = useState(false)

  async function handlePost() {
    const platforms = [toFacebook && 'facebook', toInstagram && 'instagram'].filter(Boolean)
    if (platforms.length === 0) {
      alert('Pick at least one platform')
      return
    }
    if (!confirm(`Post this live to ${platforms.join(' + ')} right now?`)) return

    setPosting(true)
    try {
      const res = await fetch('/api/admin/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, imageUrl: imageUrl || undefined, platforms }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post')

      const summary = Object.entries(data.results as Record<string, { ok: boolean; error?: string }>)
        .map(([platform, r]) => `${platform}: ${r.ok ? 'posted' : `failed (${r.error})`}`)
        .join('\n')
      alert(summary)
      setMessage('')
      setImageUrl('')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
      <h2 className="font-semibold text-white">Compose a Post</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's happening at LINK'D UP?"
        rows={4}
        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (required for Instagram)"
        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
      />
      <div className="flex items-center gap-4 text-sm text-zinc-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={toFacebook} onChange={(e) => setToFacebook(e.target.checked)} />
          Facebook
        </label>
        <label className={`flex items-center gap-2 ${hasInstagram ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}>
          <input
            type="checkbox"
            checked={toInstagram}
            disabled={!hasInstagram}
            onChange={(e) => setToInstagram(e.target.checked)}
          />
          Instagram {!hasInstagram && '(no IG account linked)'}
        </label>
      </div>
      <button
        onClick={handlePost}
        disabled={posting}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {posting ? 'Posting…' : 'Post Now'}
      </button>
    </div>
  )
}
