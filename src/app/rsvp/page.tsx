'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const industries = [
  'Artist', 'Musician / Performer', 'Entrepreneur', 'Business Owner',
  'Content Creator / Influencer', 'Photographer / Videographer', 'Designer',
  'Writer / Blogger', 'Educator / Coach', 'Marketing Professional',
  'Sales Professional', 'Real Estate Professional', 'Media Professional',
  'Tattoo Artist', 'Wellness Creator', 'Service Provider',
  'Student / Young Professional', 'Other',
]

const howDidYouHearOptions = [
  'Instagram', 'Facebook', 'A friend or colleague', 'Flyer or poster',
  'LinkedIn', 'DRYP Digital', 'Google Search', 'Other',
]

export default function RsvpPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    businessName: '', roleOrIndustry: '', instagram: '',
    linkedin: '', website: '', numberOfGuests: '1',
    howDidYouHear: '', consentToEmail: false,
  })
  const [eventId, setEventId] = useState('')
  const [eventDetails, setEventDetails] = useState<{ eventName: string; eventDate: string; startTime: string; endTime: string; locationName: string; address: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/events/active')
      .then(r => r.json())
      .then(d => {
        if (d.id) {
          setEventId(d.id)
          setEventDetails(d)
        }
      })
      .catch(() => {})
  }, [])

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.consentToEmail) {
      setError('Please check the consent box to continue.')
      return
    }
    if (!eventId) {
      setError('No active event found. Please check back soon.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      router.push('/rsvp/success')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F7F7]">
      {/* Header */}
      <div className="border-b border-[#7F90A8]/20 py-5 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-[#7F90A8] font-bold tracking-[0.3em] text-base">LINK'D UP</span>
          <a href="/" className="text-[#AEB9C8] text-sm hover:text-[#F7F7F7] transition-colors">← Back</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          {eventDetails ? (
            <div className="inline-block bg-[#7F90A8]/10 text-[#7F90A8] text-xs font-bold tracking-[0.2em] px-4 py-2 rounded-full mb-6">
              {new Date(eventDetails.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()} · {eventDetails.locationName.toUpperCase()}
            </div>
          ) : (
            <div className="inline-block bg-[#7F90A8]/10 text-[#7F90A8] text-xs font-bold tracking-[0.2em] px-4 py-2 rounded-full mb-6">
              UPCOMING EVENT
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            RSVP for<br /><span className="text-[#7F90A8]">LINK&apos;D UP</span>
          </h1>
          {eventDetails ? (
            <p className="text-[#AEB9C8] text-lg leading-relaxed">
              {new Date(eventDetails.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {eventDetails.startTime} – {eventDetails.endTime}<br />
              {eventDetails.locationName} · {eventDetails.address}
            </p>
          ) : (
            <p className="text-[#AEB9C8] text-lg leading-relaxed">Loading event details...</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
                FIRST NAME <span className="text-[#F7F7F7]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
                LAST NAME <span className="text-[#F7F7F7]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              EMAIL <span className="text-[#F7F7F7]">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              PHONE <span className="text-[#AEB9C8]/70 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
              placeholder="(727) 000-0000"
            />
          </div>

          {/* Business */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              BUSINESS / BRAND NAME <span className="text-[#AEB9C8]/70 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.businessName}
              onChange={e => set('businessName', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
              placeholder="Your business or brand"
            />
          </div>

          {/* Role / Industry */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              WHAT BEST DESCRIBES YOU? <span className="text-[#F7F7F7]">*</span>
            </label>
            <select
              required
              value={form.roleOrIndustry}
              onChange={e => set('roleOrIndustry', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] focus:outline-none focus:border-[#7F90A8] transition-colors appearance-none"
            >
              <option value="" disabled>Select your role or industry</option>
              {industries.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* Social links */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              INSTAGRAM <span className="text-[#AEB9C8]/70 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.instagram}
              onChange={e => set('instagram', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
              placeholder="@yourhandle"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
                LINKEDIN <span className="text-[#AEB9C8]/70 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.linkedin}
                onChange={e => set('linkedin', e.target.value)}
                className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
                placeholder="linkedin.com/in/you"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
                WEBSITE <span className="text-[#AEB9C8]/70 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={form.website}
                onChange={e => set('website', e.target.value)}
                className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
                placeholder="yoursite.com"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              ARE YOU BRINGING ANYONE?
            </label>
            <select
              value={form.numberOfGuests}
              onChange={e => set('numberOfGuests', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] focus:outline-none focus:border-[#7F90A8] transition-colors appearance-none"
            >
              <option value="1">Just me</option>
              <option value="2">Me + 1 guest</option>
              <option value="3">Me + 2 guests</option>
              <option value="4">Me + 3 guests</option>
              <option value="5">Me + 4+ guests</option>
            </select>
          </div>

          {/* How did you hear */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              HOW DID YOU HEAR ABOUT LINK'D UP?
            </label>
            <select
              value={form.howDidYouHear}
              onChange={e => set('howDidYouHear', e.target.value)}
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] focus:outline-none focus:border-[#7F90A8] transition-colors appearance-none"
            >
              <option value="">Select an option</option>
              {howDidYouHearOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Consent */}
          <div className="bg-[#171717] border border-[#7F90A8]/20 rounded-xl p-5">
            <label className="flex gap-4 cursor-pointer">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={form.consentToEmail}
                  onChange={e => set('consentToEmail', e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => set('consentToEmail', !form.consentToEmail)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                    form.consentToEmail ? 'bg-[#7F90A8] border-[#7F90A8]' : 'border-[#333] bg-transparent'
                  }`}
                >
                  {form.consentToEmail && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[#AEB9C8] text-sm leading-relaxed">
                Yes, I want to receive LINK'D UP updates, event reminders, surveys, and future invitations. You can unsubscribe at any time.
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-900 rounded-xl px-5 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7F90A8] text-black font-bold py-4 rounded-xl text-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : "RSVP — I'm In"}
          </button>

          <p className="text-center text-[#AEB9C8]/70 text-xs">
            By RSVPing, your information will only be used for LINK'D UP event communications.
          </p>
        </form>
      </div>
    </div>
  )
}
