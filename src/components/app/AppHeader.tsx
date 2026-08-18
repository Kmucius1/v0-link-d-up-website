'use client'

import Link from 'next/link'
import { ChevronLeft, Search, Menu } from 'lucide-react'

export function AppHeader({
  title,
  subtitle,
  color = '#2d8cff',
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
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0b0f16]/88 px-4 pb-3 pt-3 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <Link href={back} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] active:scale-95">
          <ChevronLeft size={25} style={{ color }} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[25px] font-bold leading-none tracking-[-0.03em] text-white">{title}</h1>
          {subtitle && <p className="mt-1 truncate text-[13px] text-[#9ba4b4]">{subtitle}</p>}
        </div>
        {right ?? (
          <div className="flex items-center gap-1">
            <button aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 active:bg-white/10"><Search size={23} /></button>
            <button aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 active:bg-white/10"><Menu size={23} /></button>
          </div>
        )}
      </div>
    </header>
  )
}
