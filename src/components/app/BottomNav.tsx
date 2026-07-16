'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Sparkles, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/circle', label: 'Circle', icon: Users },
  { href: '/updates', label: 'Updates', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: UserRound },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-lg grid grid-cols-4">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                active ? 'text-[#a8d8f0]' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Icon size={21} strokeWidth={active ? 2.4 : 1.9} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
