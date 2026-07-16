'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const eventTypes = [
  'More mixers like this one',
  'Guest speakers',
  'Workshops',
  'Art nights',
  'Creator meetups',
  'Business referral events',
  'Live music nights',
  'Vendor opportunities',
  'Sponsor opportunities',
  'Member spotlights / features',
  'Networking with a specific industry',
  'Collab sessions',
]

const opportunities = [
  'Vendor',
  'Sponsor',
  'Speaker',
  'Performer / Musician',
  'Artist (display work)',
  'Collaborator',
  'Brand partner',
]

const industries = [
  'More artists', 'More musicians', 'More entrepreneurs', 'More business owners',
  'More creatives', 'More educators', 'More real estate professionals',
  'More marketers', 'More content creators', 'More photographers/videographers',
  'More wellness professionals', 'More students/young professionals',
  'More tech professionals', 'All types — keep it mixed',
]

function SurveyContent() {
  const params = useSearchParams()
  const contactId = params.get('id') || ''
  const [eventId, setEventId] = useState(params.get('event') || '')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [keyFeedback, setKeyFeedback] = useState('')
  const [suggestedFollowUp, setSuggestedFollowUp] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (eventId) return
    fetch('/api/events/active')
      .then(r => r.json())
      .then(d => { if (d.id) setEventId(d.id) })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contactId && !email.trim()) { setError('Please enter your email so we know who this is from.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId: contactId || undefined,
        firstName: contactId ? undefined : firstName.trim(),
        lastName: contactId ? undefined : lastName.trim(),
        email: contactId ? undefined : email.trim(),
        eventId: eventId || undefined,
        surveyTitle: "LINK'D UP Post-Event Feedback",
        answers: { eventTypes: selectedEvents, opportunities: selectedOpportunities, industries: selectedIndustries },
        rating,
        interestTags: [...selectedOpportunities, ...selectedEvents],
        keyFeedback,
        suggestedFollowUp,
      }),
    })

    if (res.ok) {
      setDone(true)
    } else {
      const d = await res.json()
      setError(d.error || 'Something went wrong. Try again.')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F7F7F7] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#7F90A8] font-bold tracking-[0.4em] text-sm mb-12">LINK'D UP</p>
        <div className="w-16 h-16 rounded-full bg-[#7F90A8]/10 border border-[#7F90A8]/30 flex items-center justify-center mx-auto mb-8">
          <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
            <path d="M2 10L9 17L24 2" stroke="#a8d8f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-4xl font-black mb-4">Thank you.</h1>
        <p className="text-[#AEB9C8] text-lg max-w-md">Your feedback helps shape every future LINK'D UP event. We read every response.</p>
        <a href="/" className="mt-10 text-[#7F90A8] text-sm hover:underline">← Back to LINK'D UP</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F7F7]">
      <div className="border-b border-[#7F90A8]/20 py-5 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-[#7F90A8] font-bold tracking-[0.3em] text-base">LINK'D UP</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="inline-block bg-[#7F90A8]/10 text-[#7F90A8] text-xs font-bold tracking-[0.2em] px-4 py-2 rounded-full mb-6">
            FEEDBACK SURVEY
          </div>
          <h1 className="text-4xl font-black mb-3">Help shape the next<br /><span className="text-[#7F90A8]">LINK'D UP.</span></h1>
          <p className="text-[#AEB9C8] text-lg">Your answers help us build better events. Takes 2 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {!contactId && (
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-4">
                YOUR INFO
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
                />
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors"
                />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors mt-3"
              />
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-4">
              HOW WOULD YOU RATE THE EVENT?
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                    rating >= n
                      ? 'bg-[#7F90A8] text-black'
                      : 'bg-[#171717] border border-[#7F90A8]/20 text-[#AEB9C8]/70 hover:border-[#7F90A8]/40'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="self-center text-[#AEB9C8]/70 text-sm ml-2">
                {rating === 0 ? '' : rating <= 2 ? 'Needs work' : rating === 3 ? 'It was good' : rating === 4 ? 'Really good' : 'Amazing'}
              </span>
            </div>
          </div>

          {/* What to do next */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              WHAT DO YOU WANT TO SEE NEXT? <span className="text-[#AEB9C8]/70 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              {eventTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(selectedEvents, setSelectedEvents, item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedEvents.includes(item)
                      ? 'bg-[#7F90A8] text-black'
                      : 'bg-[#171717] border border-[#7F90A8]/20 text-[#AEB9C8] hover:border-[#7F90A8]/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              INTERESTED IN ANY OF THESE ROLES? <span className="text-[#AEB9C8]/70 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              {opportunities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(selectedOpportunities, setSelectedOpportunities, item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedOpportunities.includes(item)
                      ? 'bg-[#7F90A8] text-black'
                      : 'bg-[#171717] border border-[#7F90A8]/20 text-[#AEB9C8] hover:border-[#7F90A8]/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              WHAT INDUSTRIES SHOULD WE INVITE MORE OF? <span className="text-[#AEB9C8]/70 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              {industries.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(selectedIndustries, setSelectedIndustries, item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedIndustries.includes(item)
                      ? 'bg-[#7F90A8] text-black'
                      : 'bg-[#171717] border border-[#7F90A8]/20 text-[#AEB9C8] hover:border-[#7F90A8]/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Open feedback */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              WHAT DID YOU LOVE? WHAT SHOULD WE CHANGE?
            </label>
            <textarea
              value={keyFeedback}
              onChange={e => setKeyFeedback(e.target.value)}
              rows={4}
              placeholder="Be honest — what worked, what didn't, what would make this even better..."
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors resize-none mt-3"
            />
          </div>

          {/* Follow up idea */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#7F90A8] mb-2">
              ANY OTHER IDEAS FOR LINK'D UP?
            </label>
            <textarea
              value={suggestedFollowUp}
              onChange={e => setSuggestedFollowUp(e.target.value)}
              rows={3}
              placeholder="Themes, venues, collaborations, features — anything goes..."
              className="w-full bg-[#171717] border border-[#7F90A8]/20 rounded-xl px-4 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors resize-none mt-3"
            />
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
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>

          <p className="text-center text-[#7F90A8]/70 text-xs pb-8">
            LINK'D UP · linkdup.club · Brought to you by DRYP Digital
          </p>
        </form>
      </div>
    </div>
  )
}

export default function SurveyPage() {
  return (
    <Suspense>
      <SurveyContent />
    </Suspense>
  )
}
