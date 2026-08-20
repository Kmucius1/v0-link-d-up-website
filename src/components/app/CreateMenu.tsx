'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus, Image as ImageIcon, Circle, Film, X } from 'lucide-react'

const OPTIONS = [
  { type: 'post', label: 'Post', hint: 'Photo, video, or text', Icon: ImageIcon },
  { type: 'story', label: 'Story', hint: 'Vertical, disappears fast', Icon: Circle },
  { type: 'reel', label: 'Reel', hint: 'Vertical video', Icon: Film },
] as const

export function CreateMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} className="relative -mt-2">
      {open && (
        <div className="absolute bottom-[62px] left-1/2 w-52 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#151a22] shadow-[0_12px_40px_rgba(0,0,0,.5)]">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
            <span className="text-xs font-bold uppercase tracking-wide text-white/50">Create</span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/40">
              <X size={14} />
            </button>
          </div>
          {OPTIONS.map(({ type, label, hint, Icon }) => (
            <Link
              key={type}
              href={`/circle?compose=${type}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 active:bg-white/[0.04]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2d8cff]/15 text-[#5da8ff]">
                <Icon size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="truncate text-[11px] text-white/40">{hint}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Create post"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#78b9ff]/55 bg-gradient-to-b from-[#268cff] to-[#0c63dd] shadow-[0_8px_28px_rgba(27,128,255,.35)] active:scale-95"
      >
        <Plus size={30} strokeWidth={2.2} className={open ? 'rotate-45 transition-transform' : 'transition-transform'} />
      </button>
    </div>
  )
}
