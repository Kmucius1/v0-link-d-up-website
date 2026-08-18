import Link from 'next/link'
import { requireMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { StatusBar } from '@/components/app/StatusBar'
import { InstallHint } from '@/components/app/InstallHint'
import { NotificationToggle } from '@/components/app/NotificationToggle'
import { Users, Sparkles, UserRound, MessageCircleHeart, CalendarDays, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const member = await requireMember()

  const [{ count: postCount }, { data: updates }, { data: nextEvent }] = await Promise.all([
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('updates')
      .select('id, title, category, createdAt')
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order('createdAt', { ascending: false })
      .limit(3),
    supabaseAdmin
      .from('events')
      .select('eventName, eventDate, locationName, startTime')
      .eq('status', 'published')
      .gte('eventDate', new Date().toISOString())
      .order('eventDate', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-3">
      <div className="pt-3">
        <StatusBar />
      </div>
      <p className="mt-5 px-1 text-lg font-medium text-white/60">
        {greeting}, <span className="font-bold text-white">{member.firstName}</span>
      </p>

      <InstallHint />

      {/* Assistant hero */}
      <Link
        href="/assistant"
        className="mt-4 block overflow-hidden rounded-[28px] p-5 active:scale-[0.99] transition-transform"
        style={{ background: 'linear-gradient(135deg, #5E5CE6 0%, #0A84FF 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white/20">
            <MessageCircleHeart size={30} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-white">Your AI Assistant</p>
            <p className="text-sm text-white/80">Ask anything — growth, AI, your next move</p>
          </div>
          <ChevronRight className="text-white/70" />
        </div>
      </Link>

      {/* Big tiles */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Tile href="/circle" title="Growth Circle" status={`${postCount ?? 0} post${postCount === 1 ? '' : 's'}`} color="#34C759" Icon={Users} />
        <Tile href="/updates" title="AI & Updates" status="Level-up drops" color="#5E5CE6" Icon={Sparkles} />
      </div>

      {nextEvent && (
        <div className="mt-3 rounded-[24px] border border-[#FF9F0A]/25 bg-[#FF9F0A]/[0.08] p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#FF9F0A]">
            <CalendarDays size={15} /> Next Event
          </div>
          <p className="mt-1.5 text-lg font-bold text-white">{nextEvent.eventName}</p>
          <p className="text-sm text-white/60">
            {new Date(nextEvent.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {nextEvent.startTime ? ` · ${nextEvent.startTime}` : ''} · {nextEvent.locationName}
          </p>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Tile href="/profile" title="My Profile" status="Edit & settings" color="#8E8E93" Icon={UserRound} />
        <Link
          href="/updates"
          className="flex flex-col justify-between rounded-[24px] bg-[#1c1c1e] p-4 active:scale-[0.98] transition-transform min-h-[104px]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#FF375F]">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white">Latest</p>
            <p className="truncate text-xs text-white/50">{updates?.[0]?.title ?? 'Nothing yet'}</p>
          </div>
        </Link>
      </div>

      {/* Notifications */}
      <div className="mt-4">
        <NotificationToggle />
      </div>
    </div>
  )
}

function Tile({
  href,
  title,
  status,
  color,
  Icon,
}: {
  href: string
  title: string
  status: string
  color: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[104px] flex-col justify-between rounded-[24px] p-4 active:scale-[0.98] transition-transform"
      style={{ backgroundColor: color === '#8E8E93' ? '#1c1c1e' : color }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: color === '#8E8E93' ? '#3a3a3c' : 'rgba(255,255,255,0.22)' }}
      >
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-base font-bold text-white">{title}</p>
        <p className="text-xs text-white/70">{status}</p>
      </div>
    </Link>
  )
}
