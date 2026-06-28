import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import Link from 'next/link'
import { Star } from 'lucide-react'

const OPPORTUNITY_TYPES = [
  'Sponsor', 'Vendor', 'Speaker', 'Artist', 'Musician / Performer',
  'Collaborator', 'Community Partner', 'Referral Partner', 'Volunteer', 'Future Host',
]

const STATUS_COLORS: Record<string, string> = {
  potential: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
  contacted: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
  confirmed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
  declined: 'bg-red-500/20 text-red-400 border border-red-500/20',
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>
}) {
  const params = await searchParams

  let query = supabaseAdmin
    .from('opportunities')
    .select('*, contacts(id, fullName, email, businessName, roleOrIndustry), events(id, eventName)')
    .order('createdAt', { ascending: false })

  if (params.type) query = query.eq('opportunityType', params.type)
  if (params.status) query = query.eq('status', params.status)

  const { data: rawOpps } = await query
  const opportunities = (rawOpps ?? []).map((opp) => ({
    ...opp,
    contact: opp.contacts as { id: string; fullName: string; email: string; businessName: string | null; roleOrIndustry: string | null } | null,
    event: opp.events as { id: string; eventName: string } | null,
  }))

  const counts = await Promise.all(
    OPPORTUNITY_TYPES.map(async (type) => {
      const { count } = await supabaseAdmin
        .from('opportunities')
        .select('id', { count: 'exact', head: true })
        .eq('opportunityType', type)
      return { type, count: count ?? 0 }
    })
  )

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Sponsors, Vendors & More</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Track community members interested in participating with LINK&apos;D UP</p>
      </div>

      {/* Type breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {counts.map(({ type, count }) => (
          <Link key={type} href={`/admin/opportunities?type=${encodeURIComponent(type)}`}
            className={`bg-zinc-900 border rounded-xl p-4 text-center transition-all hover:border-zinc-700 ${
              params.type === type ? 'border-violet-500/50 bg-violet-500/5' : 'border-zinc-800'
            }`}>
            <p className="text-xl font-bold text-white">{count}</p>
            <p className="text-xs text-zinc-500 mt-0.5 leading-tight">{type}</p>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <form method="GET" className="flex items-center gap-3 flex-wrap">
          <select name="type" defaultValue={params.type || ''}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Types</option>
            {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="status" defaultValue={params.status || ''}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Statuses</option>
            <option value="potential">Potential</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">Filter</button>
          {(params.type || params.status) && (
            <Link href="/admin/opportunities" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-medium rounded-lg transition-colors">Clear</Link>
          )}
        </form>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Star size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No opportunities tracked yet</p>
          <p className="text-zinc-600 text-sm mt-1">Opportunities are added from contact cards when someone is flagged as a potential sponsor, vendor, speaker, etc.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Event</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Notes</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/contacts/${opp.contact?.id}`} className="group">
                      <p className="font-medium text-zinc-200 group-hover:text-violet-300 transition-colors">{opp.contact?.fullName}</p>
                      {opp.contact?.businessName && <p className="text-xs text-zinc-600">{opp.contact.businessName}</p>}
                      {opp.contact?.roleOrIndustry && <p className="text-xs text-zinc-600">{opp.contact.roleOrIndustry}</p>}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full">
                      {opp.opportunityType}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-zinc-400 text-xs">
                    {opp.event ? (
                      <Link href={`/admin/events/${opp.event.id}`} className="hover:text-violet-300 transition-colors">{opp.event.eventName}</Link>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[opp.status] || 'bg-zinc-700 text-zinc-400'}`}>
                      {opp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-zinc-500 text-xs max-w-xs truncate">
                    {opp.notes || '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-zinc-600 text-xs">
                    {format(opp.createdAt, 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
