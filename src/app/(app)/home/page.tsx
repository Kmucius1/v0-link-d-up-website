import Link from 'next/link'
import { requireMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { InstallHint } from '@/components/app/InstallHint'
import { NotificationToggle } from '@/components/app/NotificationToggle'
import { Users, Sparkles, ArrowRight, CalendarDays } from 'lucide-react'
import { timeAgo } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const member = await requireMember()

  const [{ data: updates }, { count: postCount }, { data: nextEvent }] = await Promise.all([
    supabaseAdmin
      .from('updates')
      .select('id, title, category, createdAt')
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order('createdAt', { ascending: false })
      .limit(3),
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
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
    <div>
      <header className="px-5 pt-8">
        <p className="text-sm text-zinc-500">{greeting},</p>
        <h1 className="text-2xl font-bold text-white">{member.firstName} 👋</h1>
      </header>

      <InstallHint />

      <div className="px-4 pt-4">
        <NotificationToggle />
      </div>

      {nextEvent && (
        <div className="mx-4 mt-4 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
            <CalendarDays size={14} /> NEXT EVENT
          </div>
          <p className="mt-1 text-base font-semibold text-white">{nextEvent.eventName}</p>
          <p className="text-sm text-zinc-400">
            {new Date(nextEvent.eventDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
            {nextEvent.startTime ? ` · ${nextEvent.startTime}` : ''} · {nextEvent.locationName}
          </p>
        </div>
      )}

      {/* Quick links */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <Link
          href="/circle"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
        >
          <Users className="text-[#a8d8f0]" size={22} />
          <p className="mt-2 font-semibold text-white">Growth Circle</p>
          <p className="text-xs text-zinc-500">
            {postCount ?? 0} post{postCount === 1 ? '' : 's'} in the room
          </p>
        </Link>
        <Link
          href="/updates"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
        >
          <Sparkles className="text-[#a8d8f0]" size={22} />
          <p className="mt-2 font-semibold text-white">AI &amp; Updates</p>
          <p className="text-xs text-zinc-500">Level-up drops</p>
        </Link>
      </div>

      {/* Latest updates */}
      <section className="mt-6 px-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-zinc-400">Latest updates</h2>
          <Link href="/updates" className="flex items-center gap-1 text-xs text-[#a8d8f0]">
            See all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {updates && updates.length > 0 ? (
            updates.map((u) => (
              <Link
                key={u.id}
                href="/updates"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a8d8f0]/12 text-[#a8d8f0]">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{u.title}</p>
                  <p className="text-xs text-zinc-500">{timeAgo(u.createdAt)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-500">
              No updates yet — check back soon.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
