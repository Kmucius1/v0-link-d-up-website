import Link from 'next/link'
import { requireMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { StatusBar } from '@/components/app/StatusBar'
import { InstallHint } from '@/components/app/InstallHint'
import { Bell, ChevronRight, Link2, MessageCircleHeart, Search, Sparkles, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const member = await requireMember()
  const [{ count: postCount }, { data: updates }, { data: nextEvent }] = await Promise.all([
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('updates').select('id, title, category, createdAt').eq('published', true).order('pinned', { ascending: false }).order('createdAt', { ascending: false }).limit(3),
    supabaseAdmin.from('events').select('eventName, eventDate, locationName, startTime').eq('status', 'published').gte('eventDate', new Date().toISOString()).order('eventDate', { ascending: true }).limit(1).maybeSingle(),
  ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-3 pb-3">
      <div className="pt-2"><StatusBar /></div>

      <div className="mt-3 flex items-center justify-between px-1">
        <div>
          <p className="text-[13px] text-white/45">{greeting}</p>
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-white">{member.firstName}</h1>
        </div>
        <Link href="/updates" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <Bell size={22} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2d8cff]" />
        </Link>
      </div>

      <InstallHint />

      <Link href="/assistant" className="mt-4 block overflow-hidden rounded-[26px] border border-[#4b9cff]/25 bg-[linear-gradient(135deg,#111b2b_0%,#0b1320_52%,#14243c_100%)] p-5 shadow-[0_18px_55px_rgba(0,102,255,.14)] active:scale-[0.99]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(145deg,#4ba3ff,#b8c7d9)] shadow-[0_0_28px_rgba(45,140,255,.25)]">
            <MessageCircleHeart size={28} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-bold text-white">LINK'D Assistant</p>
            <p className="mt-0.5 text-sm text-white/58">Ask anything. Find people. Make your next move.</p>
          </div>
          <ChevronRight size={22} className="text-white/45" />
        </div>
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <HomeCard href="/circle" icon={<Users size={25} />} title="Growth Circle" text={`${postCount ?? 0} posts`} />
        <HomeCard href="/circle" icon={<Search size={25} />} title="Discover" text="Find your people" />
        <HomeCard href="/updates" icon={<Sparkles size={25} />} title="Updates" text={updates?.[0]?.title ?? 'Latest drops'} />
        <HomeCard href="/profile" icon={<Link2 size={25} />} title="My Profile" text="Your LINK'D identity" />
      </div>

      {nextEvent && (
        <Link href="/updates" className="mt-4 block rounded-[24px] border border-[#58a7ff]/20 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#66aaff]">Next LINK'D UP</p>
              <p className="mt-1 truncate text-[17px] font-bold text-white">{nextEvent.eventName}</p>
              <p className="mt-1 text-sm text-white/50">
                {new Date(nextEvent.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                {nextEvent.startTime ? ` · ${nextEvent.startTime}` : ''} · {nextEvent.locationName}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2d8cff]/15 text-[#63adff]">
              <ChevronRight />
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

function HomeCard({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="min-h-[132px] rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018))] p-4 active:scale-[0.985]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#4e9dff]/20 bg-[#2d8cff]/12 text-[#72b5ff]">{icon}</div>
      <p className="mt-5 text-[16px] font-bold text-white">{title}</p>
      <p className="mt-0.5 truncate text-xs text-white/42">{text}</p>
    </Link>
  )
}
