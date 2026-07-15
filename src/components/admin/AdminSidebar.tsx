'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  MessageSquare,
  Mail,
  Star,
  Settings,
  LogOut,
  Link2,
  UserCheck,
  UserPlus,
  CheckSquare,
  Megaphone,
  MapPin,
  Inbox,
  Send,
  Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/checkin', label: 'Check-In', icon: UserCheck },
  { href: '/admin/rsvps', label: 'RSVPs', icon: ClipboardList },
  { href: '/admin/walkins', label: 'Walk-Ins', icon: UserPlus },
  { href: '/admin/contacts', label: 'Contacts', icon: Users },
  { href: '/admin/surveys', label: 'Surveys', icon: MessageSquare },
  { href: '/admin/opportunities', label: 'Sponsors & More', icon: Star },
  { href: '/admin/sponsor-inquiries', label: 'Sponsor Inquiries', icon: Send },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/contact-forms', label: 'Contact Forms', icon: Inbox },
  { href: '/admin/campaigns', label: 'Email Campaigns', icon: Mail },
  { href: '/admin/social', label: 'Social Media', icon: Share2 },
  { href: '/admin/followups', label: 'Follow-Up Tasks', icon: CheckSquare },
  { href: '/admin/promo-tasks', label: 'Promo Tasks', icon: Megaphone },
  { href: '/admin/outreach', label: 'Local Outreach', icon: MapPin },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-56 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Link2 size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">LINK'D UP</p>
            <p className="text-[10px] text-zinc-500 -mt-0.5">CRM Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                active
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              )}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 border-t border-zinc-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
