'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Sparkles, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home', label: 'Home', icon: Home, color: '#0A84FF' },
  { href: '/circle', label: 'Circle', icon: Users, color: '#34C759' },
  { href: '/updates', label: 'Updates', icon: Sparkles, color: '#5E5CE6' },
  { href: '/profile', label: 'Me', icon: UserRound, color: '#8E8E93' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pointer-events-none pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-1 rounded-[26px] border border-white/10 bg-[#161618]/85 px-2.5 py-2.5 shadow-2xl backdrop-blur-2xl mx-3">
        {tabs.map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <span
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-[16px] transition-all duration-200',
                  active ? 'scale-105 shadow-lg' : 'bg-white/[0.06]'
                )}
                style={active ? { backgroundColor: color } : undefined}
              >
                <Icon size={25} strokeWidth={2.2} className={active ? 'text-white' : 'text-white/60'} />
              </span>
              <span className={cn('text-[11px] font-semibold', active ? 'text-white' : 'text-white/45')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
