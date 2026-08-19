'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, Move } from 'lucide-react'
import { initials } from '@/lib/format'

export function AvatarPositioner({
  src,
  name,
  positionX,
  positionY,
  onPositionChange,
  onPositionCommit,
  onPickPhoto,
  uploading,
  size = 112,
}: {
  src: string | null
  name: string
  positionX: number
  positionY: number
  onPositionChange: (x: number, y: number) => void
  onPositionCommit: (x: number, y: number) => void
  onPickPhoto: () => void
  uploading?: boolean
  size?: number
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  function onPointerDown(e: React.PointerEvent) {
    if (!src) return
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: positionX, posY: positionY }
    setDragging(true)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const dxPct = ((e.clientX - dragRef.current.startX) / rect.width) * 100
    const dyPct = ((e.clientY - dragRef.current.startY) / rect.height) * 100
    const x = Math.min(100, Math.max(0, dragRef.current.posX - dxPct))
    const y = Math.min(100, Math.max(0, dragRef.current.posY - dyPct))
    onPositionChange(x, y)
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragRef.current) return
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    setDragging(false)
    dragRef.current = null
    onPositionCommit(positionX, positionY)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ width: size, height: size, touchAction: 'none' }}
          className={`flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#22324a] to-[#121722] text-xl font-bold text-white ${dragging ? 'ring-2 ring-[#2d8cff]' : 'ring-1 ring-white/10'} ${src ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Profile photo"
              draggable={false}
              className="h-full w-full select-none object-cover"
              style={{ objectPosition: `${positionX}% ${positionY}%` }}
            />
          ) : (
            initials(name || 'Member')
          )}
        </div>
        <button
          type="button"
          onClick={onPickPhoto}
          disabled={uploading}
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#121720] bg-[#2d8cff] text-white disabled:opacity-60"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
        </button>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Profile photo</p>
        <button type="button" onClick={onPickPhoto} className="text-xs font-medium text-[#5da8ff]">
          Change photo
        </button>
        {src && <p className="mt-1 flex items-center gap-1 text-[11px] text-white/40"><Move size={11} /> Drag the photo to reposition</p>}
      </div>
    </div>
  )
}
