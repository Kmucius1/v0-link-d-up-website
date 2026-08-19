'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Bell, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/circle', label: 'Discover', icon: Search },
  { href: '/updates', label: 'Activity', icon: Bell },
  { href: '/profile', label: 'Profile', icon: UserRound },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0c1017]/95 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex h-[72px] max-w-md items-center justify-around px-3">
        {tabs.slice(0, 2).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className="flex min-w-16 flex-col items-center gap-1 text-[10px] font-medium">
              <Icon size={27} strokeWidth={active ? 2.5 : 2} className={cn(active ? 'text-[#2d8cff]' : 'text-white/72')} />
              <span className={cn(active ? 'text-[#2d8cff]' : 'text-white/45')}>{label}</span>
            </Link>
          )
        })}

        <Link
          href="/circle"
          aria-label="Create post"
          className="-mt-2 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#78b9ff]/55 bg-gradient-to-b from-[#268cff] to-[#0c63dd] shadow-[0_8px_28px_rgba(27,128,255,.35)] active:scale-95"
        >
          <Plus size={30} strokeWidth={2.2} />
        </Link>

        {tabs.slice(2).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className="flex min-w-16 flex-col items-center gap-1 text-[10px] font-medium">
              <Icon size={27} strokeWidth={active ? 2.5 : 2} className={cn(active ? 'text-[#2d8cff]' : 'text-white/72')} />
              <span className={cn(active ? 'text-[#2d8cff]' : 'text-white/45')}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
