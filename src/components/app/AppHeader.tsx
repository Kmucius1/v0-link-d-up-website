'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function AppHeader({
  title,
  subtitle,
  color = '#0A84FF',
  back = '/home',
  right,
}: {
  title: string
  subtitle?: string
  color?: string
  back?: string
  right?: React.ReactNode
}) {
  return (
    <header className="flex items-center gap-3 px-4 pb-3 pt-4">
      <Link
        href={back}
        aria-label="Back"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08] active:scale-95"
      >
        <ChevronLeft size={26} className="text-white" style={{ color }} />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[26px] font-bold leading-tight tracking-tight text-white">{title}</h1>
        {subtitle && <p className="truncate text-sm text-white/45">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
