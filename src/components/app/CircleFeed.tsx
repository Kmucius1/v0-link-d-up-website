'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart, MessageCircle, ImagePlus, X, Send, Loader2, Megaphone, HandHelping, Sparkle } from 'lucide-react'
import { timeAgo, initials } from '@/lib/format'

type Author = {
  id?: string
  firstName?: string
  fullName: string
  businessName: string | null
  roleOrIndustry?: string | null
  instagram?: string | null
  avatarUrl: string | null
} | null

type Post = {
  id: string
  memberId: string
  body: string
  imageUrl: string | null
  kind: string
  createdAt: string
  author: Author
  likeCount: number
  commentCount: number
  likedByMe: boolean
  mine: boolean
}

type Comment = {
  id: string
  body: string
  createdAt: string
  author: Author
}

const KINDS: Record<string, { label: string; icon: typeof Megaphone; badge: string }> = {
  update: { label: 'Update', icon: Sparkle, badge: 'bg-white/10 text-zinc-300' },
  ask: { label: 'Looking for', icon: HandHelping, badge: 'bg-amber-400/15 text-amber-300' },
  offer: { label: 'Offering', icon: Megaphone, badge: 'bg-[#a8d8f0]/15 text-[#a8d8f0]' },
}

function Avatar({ author }: { author: Author }) {
  const name = author?.fullName || 'Member'
  if (author?.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={author.avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#a8d8f0]/30 to-violet-500/20 text-sm font-semibold text-white">
      {initials(name)}
    </div>
  )
}

export function CircleFeed({ me }: { me: { fullName: string; businessName: string | null; avatarUrl: string | null } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/member/posts')
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-4">
      <Composer me={me} onPosted={load} />
      {loading ? (
        <div className="flex justify-center py-10 text-zinc-600">
          <Loader2 className="animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="font-semibold text-white">The Circle is quiet… for now.</p>
          <p className="mt-1 text-sm text-zinc-400">
            Be the first to post. Share what you&apos;re working on or ask the room for help.
          </p>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} onChange={load} />)
      )}
    </div>
  )
}

function Composer({
  me,
  onPosted,
}: {
  me: { fullName: string; businessName: string | null; avatarUrl: string | null }
  onPosted: () => void
}) {
  const [body, setBody] = useState('')
  const [kind, setKind] = useState('update')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/member/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setImageUrl(data.url)
    else setError(data.error || 'Upload failed.')
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function submit() {
    if (!body.trim() && !imageUrl) return
    setPosting(true)
    setError('')
    const res = await fetch('/api/member/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, kind, imageUrl }),
    })
    if (res.ok) {
      setBody('')
      setImageUrl(null)
      setKind('update')
      onPosted()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Could not post.')
    }
    setPosting(false)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex gap-3">
        <Avatar author={{ fullName: me.fullName, businessName: me.businessName, avatarUrl: me.avatarUrl }} />
        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Share an update, or ask the room for help…"
            className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {imageUrl && (
            <div className="relative mt-2 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="attachment" className="max-h-52 rounded-xl border border-white/10" />
              <button
                onClick={() => setImageUrl(null)}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {Object.entries(KINDS).map(([key, { label, icon: Icon }]) => (
          <button
            key={key}
            onClick={() => setKind(key)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              kind === key ? 'bg-[#a8d8f0] text-black' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-white/5 hover:text-zinc-200 disabled:opacity-60"
            title="Add photo"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={17} />}
          </button>
          <button
            onClick={submit}
            disabled={posting || (!body.trim() && !imageUrl)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#a8d8f0] px-4 py-1.5 text-sm font-semibold text-black disabled:opacity-40"
          >
            {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
            Post
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function PostCard({ post, onChange }: { post: Post; onChange: () => void }) {
  const [liked, setLiked] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showComments, setShowComments] = useState(false)
  const kindMeta = KINDS[post.kind] ?? KINDS.update
  const name = post.author?.fullName || 'Member'
  const subtitle = post.author?.businessName || post.author?.roleOrIndustry

  async function like() {
    setLiked((v) => !v)
    setLikeCount((c) => c + (liked ? -1 : 1))
    const res = await fetch(`/api/member/posts/${post.id}/like`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-3">
        <Avatar author={post.author} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          {subtitle && <p className="truncate text-xs text-zinc-500">{subtitle}</p>}
        </div>
        {post.kind !== 'update' && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${kindMeta.badge}`}>
            {kindMeta.label}
          </span>
        )}
        <span className="shrink-0 text-xs text-zinc-600">{timeAgo(post.createdAt)}</span>
      </div>

      {post.body && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-100">{post.body}</p>}
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt="" className="mt-3 w-full rounded-xl border border-white/10 object-cover" />
      )}

      <div className="mt-3 flex items-center gap-5 text-sm text-zinc-400">
        <button onClick={like} className="inline-flex items-center gap-1.5 hover:text-white">
          <Heart size={17} className={liked ? 'fill-red-500 text-red-500' : ''} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="inline-flex items-center gap-1.5 hover:text-white"
        >
          <MessageCircle size={17} />
          {post.commentCount > 0 && <span>{post.commentCount}</span>}
        </button>
      </div>

      {showComments && <Comments postId={post.id} onAdded={onChange} />}
    </div>
  )
}

function Comments({ postId, onAdded }: { postId: string; onAdded: () => void }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch(`/api/member/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .finally(() => setLoading(false))
  }, [postId])

  async function send() {
    if (!text.trim()) return
    setSending(true)
    const res = await fetch(`/api/member/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: text }),
    })
    if (res.ok) {
      const data = await res.json()
      setComments((c) => [...c, data.comment])
      setText('')
      onAdded()
    }
    setSending(false)
  }

  return (
    <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
      {loading ? (
        <p className="text-xs text-zinc-600">Loading…</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <Avatar author={c.author} />
            <div className="flex-1 rounded-2xl bg-white/[0.04] px-3 py-2">
              <p className="text-xs font-semibold text-white">{c.author?.fullName || 'Member'}</p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-zinc-200">{c.body}</p>
            </div>
          </div>
        ))
      )}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Add a comment…"
          className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#a8d8f0]/50 focus:outline-none"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a8d8f0] text-black disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
