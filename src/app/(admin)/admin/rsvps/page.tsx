import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import Link from 'next/link'
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react'
import SendReminderButton from '@/components/admin/SendReminderButton'

export default async function RSVPsPage({
  searchParams,
}: {
  searchParams: Promise<{
    event?: string
    status?: string
    attended?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const pageNum = parseInt(params.page || '1')
  const perPage = 50

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, eventName, eventDate')
    .order('eventDate', { ascending: false })

  let query = supabaseAdmin
    .from('rsvps')
    .select('*, contacts(*), events(id, eventName, eventDate)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range((pageNum - 1) * perPage, pageNum * perPage - 1)

  if (params.event) query = query.eq('eventId', params.event)
  if (params.status) query = query.eq('rsvpStatus', params.status)
  if (params.attended === 'yes') query = query.eq('attended', true)
  if (params.attended === 'no') query = query.eq('attended', false)

  const { data: rawRsvps, count } = await query
  const total = count ?? 0

  const rsvps = (rawRsvps ?? []).map((r) => ({
    ...r,
    contact: r.contacts as { fullName: string; email: string; businessName: string | null },
    event: r.events as { id: string; eventName: string; eventDate: string },
  }))

  const totalPages = Math.ceil(total / perPage)

  const buildQuery = (overrides: Record<string, string>) => {
    const base: Record<string, string> = {}
    if (params.event) base.event = params.event
    if (params.status) base.status = params.status
    if (params.attended) base.attended = params.attended
    const merged = { ...base, ...overrides }
    return '?' + new URLSearchParams(merged).toString()
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">RSVPs</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{total.toLocaleString()} total RSVPs</p>
        </div>
        <div className="flex items-center gap-3">
          {params.event && (
            <SendReminderButton
              eventId={params.event}
              eventName={(events ?? []).find((e) => e.id === params.event)?.eventName || 'this event'}
            />
          )}
          <a href="/api/admin/rsvps/export"
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">
            Export CSV
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <form method="GET" className="flex items-center gap-3 flex-wrap">
          <select name="event" defaultValue={params.event || ''}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Events</option>
            {(events ?? []).map((e) => (
              <option key={e.id} value={e.id}>{e.eventName} ({format(e.eventDate, 'MMM d, yyyy')})</option>
            ))}
          </select>
          <select name="status" defaultValue={params.status || ''}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select name="attended" defaultValue={params.attended || ''}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
            <option value="">All Attendance</option>
            <option value="yes">Attended</option>
            <option value="no">Did Not Attend</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
            Filter
          </button>
          {(params.event || params.status || params.attended) && (
            <Link href="/admin/rsvps" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-medium rounded-lg transition-colors">
              Clear
            </Link>
          )}
        </form>
      </div>

      {rsvps.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <ClipboardList size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No RSVPs found</p>
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Guests</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Checked In</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Attended</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/contacts/${rsvp.contactId}`} className="group">
                        <p className="font-medium text-zinc-200 group-hover:text-violet-300 transition-colors">{rsvp.contact.fullName}</p>
                        <p className="text-xs text-zinc-600">{rsvp.contact.email}</p>
                        {rsvp.contact.businessName && <p className="text-xs text-zinc-600">{rsvp.contact.businessName}</p>}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/events/${rsvp.eventId}`} className="hover:text-violet-300 transition-colors">
                        <p className="text-zinc-300">{rsvp.event.eventName}</p>
                        <p className="text-xs text-zinc-600">{format(rsvp.event.eventDate, 'MMM d, yyyy')}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        rsvp.rsvpStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                        rsvp.rsvpStatus === 'waitlisted' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {rsvp.rsvpStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-300">{rsvp.numberOfGuests}</td>
                    <td className="px-4 py-3 text-center">
                      {rsvp.checkedIn ? <CheckCircle size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-zinc-700 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rsvp.attended ? <CheckCircle size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-zinc-700 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{format(rsvp.createdAt, 'MMM d, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-zinc-500">Page {pageNum} of {totalPages} · {total} RSVPs</p>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <Link href={buildQuery({ page: String(pageNum - 1) })}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">← Prev</Link>
                )}
                {pageNum < totalPages && (
                  <Link href={buildQuery({ page: String(pageNum + 1) })}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">Next →</Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
