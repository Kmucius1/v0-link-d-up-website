import { supabaseAdmin } from '@/lib/supabase-admin'
import { format, subDays } from 'date-fns'
import { Users, ClipboardList, Calendar, MessageSquare, TrendingUp, Star, Mic, Palette, Music, Handshake } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const weekAgo = subDays(new Date(), 7)

  const [
    { count: totalContacts },
    { count: totalRsvps },
    { count: totalSurveys },
    { count: newContactsThisWeek },
    { data: rawUpcoming },
    { count: sponsorCount },
    { count: vendorCount },
    { count: speakerCount },
    { count: musicianCount },
    { count: artistCount },
    { count: collaboratorCount },
    { data: roleData },
  ] = await Promise.all([
    supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('rsvps').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('survey_responses').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('contacts').select('id', { count: 'exact', head: true }).gte('createdAt', weekAgo.toISOString()),
    supabaseAdmin
      .from('events')
      .select('*, rsvps(count)')
      .gte('eventDate', new Date().toISOString())
      .eq('status', 'live')
      .order('eventDate', { ascending: true })
      .limit(3),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).eq('opportunityType', 'Sponsor'),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).eq('opportunityType', 'Vendor'),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).eq('opportunityType', 'Speaker'),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).eq('opportunityType', 'Musician / Performer'),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).eq('opportunityType', 'Artist'),
    supabaseAdmin.from('opportunities').select('id', { count: 'exact', head: true }).eq('opportunityType', 'Collaborator'),
    supabaseAdmin.from('contacts').select('roleOrIndustry').not('roleOrIndustry', 'is', null),
  ])

  const upcomingEvents = (rawUpcoming ?? []).map((e) => ({
    ...e,
    _count: { rsvps: (e.rsvps as Array<{ count: number }>)?.[0]?.count ?? 0 },
  }))

  // Group roleOrIndustry in JS since Supabase has no direct groupBy
  const roleMap = new Map<string, number>()
  for (const c of roleData ?? []) {
    if (c.roleOrIndustry) {
      roleMap.set(c.roleOrIndustry, (roleMap.get(c.roleOrIndustry) ?? 0) + 1)
    }
  }
  const industryGroups = Array.from(roleMap.entries())
    .map(([roleOrIndustry, _count]) => ({ roleOrIndustry, _count }))
    .sort((a, b) => b._count - a._count)
    .slice(0, 6)

  return {
    totalContacts: totalContacts ?? 0,
    totalRsvps: totalRsvps ?? 0,
    totalSurveys: totalSurveys ?? 0,
    newContactsThisWeek: newContactsThisWeek ?? 0,
    upcomingEvents,
    sponsorCount: sponsorCount ?? 0,
    vendorCount: vendorCount ?? 0,
    speakerCount: speakerCount ?? 0,
    musicianCount: musicianCount ?? 0,
    artistCount: artistCount ?? 0,
    collaboratorCount: collaboratorCount ?? 0,
    industryGroups,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: 'Total Contacts', value: stats.totalContacts, icon: Users, color: 'violet', href: '/admin/contacts' },
    { label: 'Total RSVPs', value: stats.totalRsvps, icon: ClipboardList, color: 'fuchsia', href: '/admin/rsvps' },
    { label: 'Survey Responses', value: stats.totalSurveys, icon: MessageSquare, color: 'purple', href: '/admin/surveys' },
    { label: 'New This Week', value: stats.newContactsThisWeek, icon: TrendingUp, color: 'pink', href: '/admin/contacts' },
  ]

  const opportunityCards = [
    { label: 'Sponsors', value: stats.sponsorCount, icon: Star },
    { label: 'Vendors', value: stats.vendorCount, icon: Handshake },
    { label: 'Speakers', value: stats.speakerCount, icon: Mic },
    { label: 'Musicians', value: stats.musicianCount, icon: Music },
    { label: 'Artists', value: stats.artistCount, icon: Palette },
    { label: 'Collaborators', value: stats.collaboratorCount, icon: Handshake },
  ]

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">LINK&apos;D UP Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                color === 'violet' ? 'bg-violet-500/20' :
                color === 'fuchsia' ? 'bg-fuchsia-500/20' :
                color === 'purple' ? 'bg-purple-500/20' :
                'bg-pink-500/20'
              }`}>
                <Icon size={16} className={
                  color === 'violet' ? 'text-violet-400' :
                  color === 'fuchsia' ? 'text-fuchsia-400' :
                  color === 'purple' ? 'text-purple-400' :
                  'text-pink-400'
                } />
              </div>
              <p className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">{value.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Calendar size={15} className="text-violet-400" />
              Upcoming Events
            </h2>
            <Link href="/admin/events" className="text-xs text-violet-400 hover:text-violet-300">
              View all →
            </Link>
          </div>
          {stats.upcomingEvents.length === 0 ? (
            <p className="text-zinc-500 text-sm">No upcoming events. <Link href="/admin/events/new" className="text-violet-400 hover:underline">Create one →</Link></p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingEvents.map((event) => (
                <Link key={event.id} href={`/admin/events/${event.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-violet-400 font-bold uppercase">{format(event.eventDate, 'MMM')}</span>
                      <span className="text-sm font-bold text-violet-300 -mt-0.5">{format(event.eventDate, 'd')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{event.eventName}</p>
                      <p className="text-xs text-zinc-500">{event.locationName} · {event.startTime}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-white">{event._count.rsvps}</p>
                      <p className="text-[10px] text-zinc-500">RSVPs</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Opportunity Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Star size={15} className="text-fuchsia-400" />
              Opportunities
            </h2>
            <Link href="/admin/opportunities" className="text-xs text-fuchsia-400 hover:text-fuchsia-300">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {opportunityCards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={13} className="text-zinc-500" />
                  <span className="text-sm text-zinc-300">{label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Breakdown */}
      {stats.industryGroups.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4">Top Industries / Roles</h2>
          <div className="flex flex-wrap gap-2">
            {stats.industryGroups.filter(g => g.roleOrIndustry).map((group) => (
              <div key={group.roleOrIndustry} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700">
                <span className="text-sm text-zinc-300">{group.roleOrIndustry}</span>
                <span className="text-xs font-bold text-violet-400">{group._count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
