import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, ExternalLink, Users, MessageSquare, Download } from 'lucide-react'
import { EventRsvpTable } from '@/components/admin/EventRsvpTable'
import { EventSurveyList } from '@/components/admin/EventSurveyList'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-700 text-zinc-300',
  live: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  archived: 'bg-zinc-700/50 text-zinc-500',
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rsvps: {
        include: { contact: true },
        orderBy: { createdAt: 'desc' },
      },
      surveyResponses: {
        include: { contact: true },
        orderBy: { submittedAt: 'desc' },
      },
      _count: { select: { rsvps: true, surveyResponses: true } },
    },
  })

  if (!event) notFound()

  const attended = event.rsvps.filter((r) => r.attended).length
  const checkedIn = event.rsvps.filter((r) => r.checkedIn).length

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/events" className="mt-1 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{event.eventName}</h1>
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[event.status] || STATUS_COLORS.draft}`}>
              {event.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {format(event.eventDate, 'EEEE, MMMM d, yyyy')} · {event.startTime} – {event.endTime}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {event.locationName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {event.rsvpLink && (
            <a href={event.rsvpLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors">
              <ExternalLink size={12} /> RSVP Page
            </a>
          )}
          <Link href={`/admin/events/${id}/edit`}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors">
            Edit Event
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total RSVPs', value: event._count.rsvps, icon: Users },
          { label: 'Checked In', value: checkedIn, icon: Users },
          { label: 'Attended', value: attended, icon: Users },
          { label: 'Surveys', value: event._count.surveyResponses, icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Event details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-zinc-500">Address</span><p className="text-zinc-200 mt-0.5">{event.address}</p></div>
          {event.description && <div><span className="text-zinc-500">Description</span><p className="text-zinc-200 mt-0.5">{event.description}</p></div>}
          {event.surveyLink && <div><span className="text-zinc-500">Survey URL</span><a href={event.surveyLink} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline mt-0.5 block truncate">{event.surveyLink}</a></div>}
          {event.facebookEventLink && <div><span className="text-zinc-500">Facebook Event</span><a href={event.facebookEventLink} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline mt-0.5 block truncate">{event.facebookEventLink}</a></div>}
        </div>
      </div>

      {/* RSVPs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Users size={15} className="text-violet-400" />
            RSVPs ({event._count.rsvps})
          </h2>
          <a href={`/api/admin/events/${id}/export-rsvps`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors">
            <Download size={12} /> Export CSV
          </a>
        </div>
        <EventRsvpTable rsvps={event.rsvps} />
      </div>

      {/* Surveys */}
      {event.surveyResponses.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare size={15} className="text-fuchsia-400" />
              Survey Responses ({event._count.surveyResponses})
            </h2>
            <a href={`/api/admin/events/${id}/export-surveys`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors">
              <Download size={12} /> Export CSV
            </a>
          </div>
          <EventSurveyList responses={event.surveyResponses} />
        </div>
      )}
    </div>
  )
}
