'use client'

import { useState, Suspense } from 'react'
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
  const eventId = params.get('event') || ''

  const [rating, setRating] = useState(0)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [keyFeedback, setKeyFeedback] = useState('')
  const [suggestedFollowUp, setSuggestedFollowUp] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contactId) { setError('Missing your contact ID. Please use the link from your email.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId,
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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#a8d8f0] font-bold tracking-[0.4em] text-sm mb-12">LINK'D UP</p>
        <div className="w-16 h-16 rounded-full bg-[#1e3a4a] border border-[#a8d8f0]/30 flex items-center justify-center mx-auto mb-8">
          <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
            <path d="M2 10L9 17L24 2" stroke="#a8d8f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-4xl font-black mb-4">Thank you.</h1>
        <p className="text-[#888] text-lg max-w-md">Your feedback helps shape every future LINK'D UP event. We read every response.</p>
        <a href="/" className="mt-10 text-[#a8d8f0] text-sm hover:underline">← Back to LINK'D UP</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-[#1a1a1a] py-5 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-[#a8d8f0] font-bold tracking-[0.3em] text-base">LINK'D UP</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="inline-block bg-[#1e3a4a] text-[#a8d8f0] text-xs font-bold tracking-[0.2em] px-4 py-2 rounded-full mb-6">
            FEEDBACK SURVEY
          </div>
          <h1 className="text-4xl font-black mb-3">Help shape the next<br /><span className="text-[#a8d8f0]">LINK'D UP.</span></h1>
          <p className="text-[#888] text-lg">Your answers help us build better events. Takes 2 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#a8d8f0] mb-4">
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
                      ? 'bg-[#a8d8f0] text-black'
                      : 'bg-[#111] border border-[#1a1a1a] text-[#555] hover:border-[#a8d8f0]/40'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="self-center text-[#555] text-sm ml-2">
                {rating === 0 ? '' : rating <= 2 ? 'Needs work' : rating === 3 ? 'It was good' : rating === 4 ? 'Really good' : 'Amazing'}
              </span>
            </div>
          </div>

          {/* What to do next */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#a8d8f0] mb-2">
              WHAT DO YOU WANT TO SEE NEXT? <span className="text-[#555] font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              {eventTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(selectedEvents, setSelectedEvents, item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedEvents.includes(item)
                      ? 'bg-[#a8d8f0] text-black'
                      : 'bg-[#111] border border-[#1a1a1a] text-[#ccc] hover:border-[#a8d8f0]/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#a8d8f0] mb-2">
              INTERESTED IN ANY OF THESE ROLES? <span className="text-[#555] font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              {opportunities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(selectedOpportunities, setSelectedOpportunities, item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedOpportunities.includes(item)
                      ? 'bg-[#a8d8f0] text-black'
                      : 'bg-[#111] border border-[#1a1a1a] text-[#ccc] hover:border-[#a8d8f0]/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#a8d8f0] mb-2">
              WHAT INDUSTRIES SHOULD WE INVITE MORE OF? <span className="text-[#555] font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-4">
              {industries.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(selectedIndustries, setSelectedIndustries, item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedIndustries.includes(item)
                      ? 'bg-[#a8d8f0] text-black'
                      : 'bg-[#111] border border-[#1a1a1a] text-[#ccc] hover:border-[#a8d8f0]/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Open feedback */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#a8d8f0] mb-2">
              WHAT DID YOU LOVE? WHAT SHOULD WE CHANGE?
            </label>
            <textarea
              value={keyFeedback}
              onChange={e => setKeyFeedback(e.target.value)}
              rows={4}
              placeholder="Be honest — what worked, what didn't, what would make this even better..."
              className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#a8d8f0] transition-colors resize-none mt-3"
            />
          </div>

          {/* Follow up idea */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-[#a8d8f0] mb-2">
              ANY OTHER IDEAS FOR LINK'D UP?
            </label>
            <textarea
              value={suggestedFollowUp}
              onChange={e => setSuggestedFollowUp(e.target.value)}
              rows={3}
              placeholder="Themes, venues, collaborations, features — anything goes..."
              className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#a8d8f0] transition-colors resize-none mt-3"
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
            className="w-full bg-[#a8d8f0] text-black font-bold py-4 rounded-xl text-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>

          <p className="text-center text-[#444] text-xs pb-8">
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
