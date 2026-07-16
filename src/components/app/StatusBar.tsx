'use client'

import { useEffect, useState } from 'react'

export function StatusBar() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000 * 20)
    return () => clearInterval(t)
  }, [])

  const time = now
    ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '--:--'
  const date = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : ''

  return (
    <div className="flex items-end justify-between px-1">
      <div>
        <p className="text-[40px] font-semibold leading-none tracking-tight text-white tabular-nums">{time}</p>
        <p className="mt-1.5 text-sm font-medium text-white/50">{date}</p>
      </div>
      <div className="mb-1 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
        <span className="h-2 w-2 rounded-full bg-[#34C759]" />
        <span className="text-xs font-semibold text-white/70">Link&apos;d Up</span>
      </div>
    </div>
  )
}
