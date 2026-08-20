'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { timeAgo } from '@/lib/format'

type Message = { id: string; senderId: string; recipientId: string; body: string; createdAt: string; readAt: string | null }

export function MessageThread({ meId, counterpartId }: { meId: string; counterpartId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [blocked, setBlocked] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    const res = await fetch(`/api/member/messages/${counterpartId}`)
    if (res.ok) {
      setMessages((await res.json()).messages ?? [])
    } else if (res.status === 403) {
      setBlocked(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [counterpartId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  async function send() {
    const body = text.trim()
    if (!body) return
    setSending(true)
    setError('')
    const res = await fetch(`/api/member/messages/${counterpartId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    if (res.ok) {
      const data = await res.json()
      setMessages((m) => [...m, data.message])
      setText('')
    } else {
      setError((await res.json().catch(() => ({}))).error || 'Could not send message.')
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-14 text-white/30">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (blocked) {
    return (
      <div className="py-16 text-center">
        <p className="font-semibold text-white">You're not connected yet.</p>
        <p className="mt-1 px-6 text-sm text-white/40">Connect with this member from their profile to start messaging.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-2 px-3 py-4">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-white/40">Say hello 👋</p>}
        {messages.map((m) => {
          const mine = m.senderId === meId
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-5 ${
                  mine ? 'bg-[#2d8cff] text-white' : 'bg-white/[0.06] text-white/90'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'text-white/70' : 'text-white/35'}`}>{timeAgo(m.createdAt)}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t border-white/8 bg-[#0b0f16] px-3 py-3 lg:rounded-b-2xl lg:border-x lg:border-b">
        {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Message..."
            className="flex-1 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button
            onClick={send}
            disabled={sending || !text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d8cff] text-white disabled:opacity-30"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
