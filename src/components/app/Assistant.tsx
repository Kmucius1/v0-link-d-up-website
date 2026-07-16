'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

// Minimal markdown: **bold**, and normalize bullet markers to "• ".
function renderRich(text: string) {
  return text.split('\n').map((line, li) => {
    const clean = line.replace(/^\s*[-*]\s+/, '• ')
    const parts = clean.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={li}>
        {parts.map((p, i) =>
          p.startsWith('**') && p.endsWith('**') ? (
            <strong key={i} className="font-semibold text-white">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
        {li < text.split('\n').length - 1 && <br />}
      </span>
    )
  })
}

const SUGGESTIONS = [
  'Give me 3 ways to get more clients this week',
  'Draft a post to introduce my business in the Growth Circle',
  'What AI tools should I be using?',
  'Help me plan content for the next 7 days',
]

export function Assistant({ firstName }: { firstName: string }) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    setError('')
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/member/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (res.ok && data.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Network error — try again.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 190px)' }}>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 pb-2">
        {messages.length === 0 && (
          <div className="pt-2">
            <div className="rounded-[24px] bg-[#1c1c1e] p-5">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-[16px]" style={{ background: 'linear-gradient(135deg,#5E5CE6,#0A84FF)' }}>
                <Sparkles size={24} className="text-white" />
              </div>
              <p className="text-lg font-bold text-white">Hey {firstName} 👋</p>
              <p className="mt-1 text-[15px] leading-relaxed text-white/60">
                I&apos;m LINQ, your Link&apos;d Up assistant. Ask me about growing your business, networking, AI, content — anything.
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-[15px] font-medium text-white/85 active:scale-[0.99]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[85%] rounded-[22px] rounded-br-md bg-[#0A84FF] px-4 py-2.5 text-[15px] leading-relaxed text-white'
                  : 'max-w-[90%] rounded-[22px] rounded-bl-md bg-[#1c1c1e] px-4 py-3 text-[15px] leading-relaxed text-white/90'
              }
            >
              {m.role === 'assistant' ? renderRich(m.content) : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-[22px] rounded-bl-md bg-[#1c1c1e] px-4 py-3 text-white/50">
              <Loader2 size={16} className="animate-spin" /> Thinking…
            </div>
          </div>
        )}
        {error && <p className="px-1 text-sm text-red-400">{error}</p>}
      </div>

      <div className="px-3 pt-2">
        <div className="flex items-end gap-2 rounded-[22px] border border-white/10 bg-[#1c1c1e] p-2 pl-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder="Ask LINQ anything…"
            className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[16px] text-white placeholder-white/40 focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A84FF] text-white disabled:opacity-40"
          >
            <Send size={19} />
          </button>
        </div>
      </div>
    </div>
  )
}
