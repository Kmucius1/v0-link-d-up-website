'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusSquare, Bell, MessageCircle, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/circle', label: 'Growth Circle', icon: Search },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/circle', label: 'Create', icon: PlusSquare, isCreate: true },
  { href: '/updates', label: 'Activity', icon: Bell },
  { href: '/profile', label: 'Profile', icon: UserRound },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col border-r border-white/[0.08] bg-[#0b0f16] px-3 py-6 lg:flex">
      <Link href="/home" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b1220] to-black text-lg font-extrabold tracking-tighter">
          <span className="text-[#a8d8f0]">L</span>
          <span className="text-white">U</span>
        </div>
        <span className="text-lg font-bold tracking-[-0.02em] text-white">LINK&apos;D UP</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {tabs.map(({ href, label, icon: Icon, isCreate }) => {
          const active = !isCreate && (pathname === href || pathname.startsWith(href + '/'))
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-4 rounded-xl px-3 py-3 text-[15px] transition-colors',
                active ? 'font-bold text-white' : 'font-medium text-white/75 hover:bg-white/[0.05]'
              )}
            >
              <Icon size={25} strokeWidth={active ? 2.4 : 2} className={active ? 'text-[#2d8cff]' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
