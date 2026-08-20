'use client'

import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Link as LinkIcon } from 'lucide-react'

export function PostMenu({
  mine,
  onEdit,
  onDelete,
  onShare,
}: {
  mine: boolean
  onEdit?: () => void
  onDelete?: () => void
  onShare: () => void
}) {
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
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-label="Post options" className="flex h-7 w-7 items-center justify-center text-white/45">
        <MoreHorizontal size={19} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#151a22] shadow-[0_12px_32px_rgba(0,0,0,.5)]">
          {mine && onEdit && (
            <button
              onClick={() => {
                setOpen(false)
                onEdit()
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-white active:bg-white/[0.05]"
            >
              <Pencil size={15} /> Edit post
            </button>
          )}
          <button
            onClick={() => {
              setOpen(false)
              onShare()
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-white active:bg-white/[0.05]"
          >
            <LinkIcon size={15} /> Copy link
          </button>
          {mine && onDelete && (
            <button
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-red-400 active:bg-white/[0.05]"
            >
              <Trash2 size={15} /> Delete post
            </button>
          )}
        </div>
      )}
    </div>
  )
}
