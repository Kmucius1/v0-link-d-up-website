import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const FB_EVENT_FALLBACK = 'https://facebook.com/events/s/linkd-up-clearwater-fl/1626917025046995/'
const INSTAGRAM_URL = 'https://www.instagram.com/linkdupnetwork'

function parseClockToMinutes(clock: string): number {
  const match = clock.trim().match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return 0
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridiem = match[3].toUpperCase()
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

function toGoogleCalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export default async function RsvpSuccessPage() {
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('status', 'live')
    .gte('eventDate', new Date().toISOString())
    .order('eventDate', { ascending: true })
    .limit(1)
    .maybeSingle()

  const eventStart = event ? new Date(event.eventDate) : null

  let eventEnd = eventStart
  if (event && eventStart) {
    const startMinutes = parseClockToMinutes(event.startTime)
    let endMinutes = parseClockToMinutes(event.endTime)
    if (endMinutes <= startMinutes) endMinutes += 24 * 60 // crosses midnight
    eventEnd = new Date(eventStart.getTime() + (endMinutes - startMinutes) * 60 * 1000)
  }

  const calendarUrl = event && eventStart && eventEnd
    ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.eventName)}&dates=${toGoogleCalendarDate(eventStart)}/${toGoogleCalendarDate(eventEnd)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(`${event.locationName}, ${event.address}`)}`
    : null

  const facebookUrl = event?.facebookEventLink || FB_EVENT_FALLBACK

  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F7F7] flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <p className="text-[#7F90A8] font-bold tracking-[0.4em] text-sm mb-16">LINK'D UP</p>

      {/* Main */}
      <div className="max-w-lg w-full text-center">
        {/* Check */}
        <div className="w-20 h-20 rounded-full bg-[#7F90A8]/10 border border-[#7F90A8]/30 flex items-center justify-center mx-auto mb-8">
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
            <path d="M2 12L12 22L30 2" stroke="#a8d8f0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
          You're <span className="text-[#7F90A8]">LINK'D UP.</span>
        </h1>

        <p className="text-[#AEB9C8] text-xl mb-10 leading-relaxed">
          You're officially on the list. We can't wait to see you.
        </p>

        {/* Event Card */}
        {event && eventStart && (
          <div className="bg-[#171717] border border-[#7F90A8]/10 rounded-2xl p-8 mb-10 text-left">
            <p className="text-[#7F90A8] text-xs font-bold tracking-[0.2em] mb-5">YOUR EVENT DETAILS</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-[#7F90A8] mt-0.5">📅</span>
                <div>
                  <p className="text-[#F7F7F7] font-semibold">{format(eventStart, 'EEEE, MMMM d')}</p>
                  <p className="text-[#AEB9C8] text-sm">{event.startTime} – {event.endTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#7F90A8] mt-0.5">📍</span>
                <div>
                  <p className="text-[#F7F7F7] font-semibold">{event.locationName}</p>
                  <p className="text-[#AEB9C8] text-sm">{event.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm email note */}
        <div className="bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-6 py-4 mb-10">
          <p className="text-[#AEB9C8] text-sm">
            A confirmation email is on its way. Check your inbox (and spam just in case).
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#7F90A8] text-black font-bold py-4 rounded-xl text-base hover:bg-white transition-colors"
            >
              Add to Calendar
            </a>
          )}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-[#7F90A8] text-[#7F90A8] font-semibold py-4 rounded-xl text-base hover:bg-[#7F90A8]/10 transition-colors"
          >
            Join the Facebook Event
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-[#7F90A8]/20 text-[#AEB9C8] font-semibold py-4 rounded-xl text-base hover:border-[#333] hover:text-[#F7F7F7] transition-colors"
          >
            Follow @linkdupnetwork on Instagram
          </a>
        </div>

        {/* Share prompt */}
        <p className="text-[#AEB9C8]/70 text-sm mt-8">
          Know someone who should be in the room?<br />
          <span className="text-[#7F90A8]">Send them the link → linkdup.club/rsvp</span>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-[#333] text-xs">
        <p>LINK'D UP · linkdup.club · @linkdupnetwork</p>
        <p className="mt-1">Brought to you by DRYP Digital</p>
      </div>
    </div>
  )
}
