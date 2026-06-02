import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { Calendar, Plus, MapPin, Users, ExternalLink } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-700 text-zinc-300',
  live: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  archived: 'bg-zinc-700/50 text-zinc-500',
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    include: { _count: { select: { rsvps: true, surveyResponses: true } } },
  })

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{events.length} total events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Plus size={14} />
          New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Calendar size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No events yet</p>
          <p className="text-zinc-600 text-sm mt-1">Create your first LINK'D UP event to get started.</p>
          <Link href="/admin/events/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={13} /> Create Event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Link key={event.id} href={`/admin/events/${event.id}`}>
              <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-violet-400 font-bold uppercase">{format(event.eventDate, 'MMM')}</span>
                    <span className="text-lg font-bold text-violet-300 leading-none">{format(event.eventDate, 'd')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">{event.eventName}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[event.status] || STATUS_COLORS.draft}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {event.locationName}
                      </span>
                      <span>{event.startTime} – {event.endTime}</span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {event._count.rsvps} RSVPs
                      </span>
                      {event._count.surveyResponses > 0 && (
                        <span>{event._count.surveyResponses} surveys</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {event.rsvpLink && (
                      <a href={event.rsvpLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
