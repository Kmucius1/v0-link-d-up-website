'use client'

import { useEffect, useRef, useState } from 'react'
import { Bookmark, Heart, ImagePlus, Loader2, MessageCircle, MoreHorizontal, Send, Sparkles, Users, X } from 'lucide-react'
import { initials, timeAgo } from '@/lib/format'

type Author = { id?: string; fullName: string; businessName: string | null; roleOrIndustry?: string | null; avatarUrl: string | null } | null
type Post = { id: string; memberId: string; body: string; imageUrl: string | null; kind: string; createdAt: string; author: Author; likeCount: number; commentCount: number; likedByMe: boolean; mine: boolean }
type Comment = { id: string; body: string; createdAt: string; author: Author }

const KINDS: Record<string, { label: string; cls: string }> = {
  update: { label: 'Update', cls: 'text-[#8fc4ff] bg-[#2d8cff]/12' },
  ask: { label: 'Looking for', cls: 'text-[#e0e5ec] bg-white/[0.06]' },
  offer: { label: 'Offering', cls: 'text-[#a8d8f0] bg-[#a8d8f0]/10' },
}

function Avatar({ author, size = 'md' }: { author: Author; size?: 'sm' | 'md' | 'lg' }) {
  const name = author?.fullName || 'Member'
  const s = size === 'lg' ? 'h-14 w-14 text-base' : size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-sm'
  if (author?.avatarUrl) return <img src={author.avatarUrl} alt={name} className={`${s} rounded-full object-cover ring-1 ring-white/10`} />
  return <div className={`${s} flex items-center justify-center rounded-full bg-[linear-gradient(145deg,#26364d,#626f86)] font-semibold text-white`}>{initials(name)}</div>
}

export function CircleFeed({ me }: { me: { fullName: string; businessName: string | null; avatarUrl: string | null } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function load() {
    const res = await fetch('/api/member/posts')
    if (res.ok) setPosts((await res.json()).posts ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const shown = filter === 'all' ? posts : posts.filter((p) => p.kind === filter)

  return (
    <div>
      <div className="-mx-3 overflow-x-auto border-b border-white/8 px-3 pb-4 pt-1 [scrollbar-width:none]">
        <div className="flex min-w-max gap-4">
          <Story label="You" author={{ fullName: me.fullName, businessName: me.businessName, avatarUrl: me.avatarUrl }} plus />
          <Story label="Link'd Up" initialsText="LU" />
          <Story label="Creators" initialsText="CR" />
          <Story label="Founders" initialsText="FD" />
          <Story label="Events" initialsText="EV" />
        </div>
      </div>

      <Composer me={me} onPosted={load} />

      <div className="-mx-3 mt-3 flex border-b border-white/8 px-3">
        {[['all','All'],['update','Updates'],['ask','Looking for'],['offer','Offering']].map(([key,label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`relative flex-1 py-3 text-xs font-semibold ${filter === key ? 'text-white' : 'text-white/38'}`}>
            {label}
            {filter === key && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#2d8cff]" />}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-14 text-white/30"><Loader2 className="animate-spin" /></div> : shown.length === 0 ? (
        <div className="py-16 text-center"><Users className="mx-auto text-white/20" /><p className="mt-3 font-semibold">Nothing here yet.</p><p className="mt-1 text-sm text-white/40">Be the first to get the circle moving.</p></div>
      ) : shown.map((p) => <PostCard key={p.id} post={p} onChange={load} />)}
    </div>
  )
}

function Story({ label, author, initialsText, plus }: { label: string; author?: Author; initialsText?: string; plus?: boolean }) {
  return <div className="w-[66px] text-center">
    <div className="relative mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#2d8cff,#b8c5d6)] p-[2px]">
      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d131d] p-[2px]">
        {author ? <Avatar author={author} size="lg" /> : <div className="flex h-full w-full items-center justify-center rounded-full bg-[#172131] text-xs font-bold text-[#8ec2ff]">{initialsText}</div>}
      </div>
      {plus && <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0b1018] bg-[#2d8cff] text-[14px] font-bold">+</span>}
    </div>
    <p className="mt-1.5 truncate text-[10px] text-white/60">{label}</p>
  </div>
}

function Composer({ me, onPosted }: { me: { fullName: string; businessName: string | null; avatarUrl: string | null }; onPosted: () => void }) {
  const [body, setBody] = useState('')
  const [kind, setKind] = useState('update')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); setError('')
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/member/upload', { method: 'POST', body: fd }); const data = await res.json()
    if (res.ok) setImageUrl(data.url); else setError(data.error || 'Upload failed.')
    setUploading(false); if (fileRef.current) fileRef.current.value = ''
  }

  async function submit() {
    if (!body.trim() && !imageUrl) return
    setPosting(true); setError('')
    const res = await fetch('/api/member/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body, kind, imageUrl }) })
    if (res.ok) { setBody(''); setImageUrl(null); setKind('update'); onPosted() } else setError((await res.json().catch(() => ({}))).error || 'Could not post.')
    setPosting(false)
  }

  return <div className="-mx-3 border-b border-white/8 bg-white/[0.018] px-3 py-4">
    <div className="flex gap-3">
      <Avatar author={{ fullName: me.fullName, businessName: me.businessName, avatarUrl: me.avatarUrl }} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} placeholder="Share something with the Circle..." className="min-h-[58px] flex-1 resize-none bg-transparent pt-1 text-[15px] text-white placeholder:text-white/28 focus:outline-none" />
    </div>
    {imageUrl && <div className="relative mt-3 overflow-hidden rounded-2xl border border-white/10"><img src={imageUrl} alt="attachment" className="max-h-72 w-full object-cover" /><button onClick={() => setImageUrl(null)} className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5"><X size={14}/></button></div>}
    <div className="mt-3 flex items-center gap-2">
      {Object.entries(KINDS).map(([key,m]) => <button key={key} onClick={() => setKind(key)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${kind === key ? 'bg-[#2d8cff] text-white' : 'bg-white/[0.05] text-white/42'}`}>{m.label}</button>)}
      <div className="ml-auto flex items-center gap-2">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full text-white/50">{uploading ? <Loader2 size={17} className="animate-spin"/> : <ImagePlus size={19}/>}</button>
        <button onClick={submit} disabled={posting || (!body.trim() && !imageUrl)} className="flex h-9 items-center gap-1.5 rounded-full bg-[#2d8cff] px-4 text-xs font-bold text-white disabled:opacity-35">{posting ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}Post</button>
      </div>
    </div>
    {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
  </div>
}

function PostCard({ post, onChange }: { post: Post; onChange: () => void }) {
  const [liked, setLiked] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showComments, setShowComments] = useState(false)
  const name = post.author?.fullName || 'Member'
  const subtitle = post.author?.businessName || post.author?.roleOrIndustry
  const kind = KINDS[post.kind] ?? KINDS.update

  async function like() {
    setLiked(v => !v); setLikeCount(c => c + (liked ? -1 : 1))
    const res = await fetch(`/api/member/posts/${post.id}/like`, { method: 'POST' })
    if (res.ok) { const d = await res.json(); setLiked(d.liked); setLikeCount(d.likeCount) }
  }

  return <article className="-mx-3 border-b border-white/8 px-3 py-4">
    <div className="flex items-center gap-3">
      <Avatar author={post.author} />
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{name}</p><p className="truncate text-[11px] text-white/38">{subtitle ? `${subtitle} · ` : ''}{timeAgo(post.createdAt)}</p></div>
      {post.kind !== 'update' && <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${kind.cls}`}>{kind.label}</span>}
      <MoreHorizontal size={19} className="text-white/45" />
    </div>
    {post.body && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-6 text-white/90">{post.body}</p>}
    {post.imageUrl && <img src={post.imageUrl} alt="" className="-mx-3 mt-3 aspect-square w-[calc(100%+24px)] object-cover" />}
    <div className="mt-3 flex items-center gap-5 text-white/70">
      <button onClick={like} className="flex items-center gap-1.5"><Heart size={22} className={liked ? 'fill-[#2d8cff] text-[#2d8cff]' : ''}/>{likeCount > 0 && <span className="text-xs">{likeCount}</span>}</button>
      <button onClick={() => setShowComments(v => !v)} className="flex items-center gap-1.5"><MessageCircle size={22}/>{post.commentCount > 0 && <span className="text-xs">{post.commentCount}</span>}</button>
      <Send size={21}/><Bookmark size={21} className="ml-auto" />
    </div>
    {showComments && <Comments postId={post.id} onAdded={onChange} />}
  </article>
}

function Comments({ postId, onAdded }: { postId: string; onAdded: () => void }) {
  const [comments, setComments] = useState<Comment[]>([]); const [text, setText] = useState(''); const [sending, setSending] = useState(false)
  useEffect(() => { fetch(`/api/member/posts/${postId}/comments`).then(r => r.json()).then(d => setComments(d.comments ?? [])) }, [postId])
  async function send() { if (!text.trim()) return; setSending(true); const res = await fetch(`/api/member/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: text }) }); if (res.ok) { const d = await res.json(); setComments(c => [...c, d.comment]); setText(''); onAdded() } setSending(false) }
  return <div className="mt-4 border-t border-white/8 pt-3">
    <div className="space-y-3">{comments.map(c => <div key={c.id} className="flex gap-2"><Avatar author={c.author} size="sm"/><div className="rounded-2xl bg-white/[0.045] px-3 py-2"><p className="text-[11px] font-semibold">{c.author?.fullName || 'Member'}</p><p className="text-sm text-white/75">{c.body}</p></div></div>)}</div>
    <div className="mt-3 flex items-center gap-2"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Add a comment..." className="flex-1 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm outline-none placeholder:text-white/28"/><button onClick={send} disabled={sending || !text.trim()} className="text-[#5da8ff] disabled:opacity-30"><Send size={19}/></button></div>
  </div>
}
