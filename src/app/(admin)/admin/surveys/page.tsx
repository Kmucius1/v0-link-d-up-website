import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import Link from 'next/link'
import { MessageSquare, Star } from 'lucide-react'

export default async function SurveysPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; page?: string }>
}) {
  const params = await searchParams
  const pageNum = parseInt(params.page || '1')
  const perPage = 30

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, eventName')
    .order('eventDate', { ascending: false })

  let query = supabaseAdmin
    .from('survey_responses')
    .select('*, contacts(id, fullName, email), events(id, eventName)', { count: 'exact' })
    .order('submittedAt', { ascending: false })
    .range((pageNum - 1) * perPage, pageNum * perPage - 1)

  if (params.event) query = query.eq('eventId', params.event)

  const { data: rawSurveys, count } = await query
  const total = count ?? 0

  const surveys = (rawSurveys ?? []).map((s) => ({
    ...s,
    contact: s.contacts as { id: string; fullName: string; email: string },
    event: s.events as { id: string; eventName: string } | null,
  }))

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Survey Responses</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{total.toLocaleString()} total responses</p>
        </div>
      </div>

      {/* Filter by event */}
      <form method="GET" className="flex items-center gap-3">
        <select name="event" defaultValue={params.event || ''}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-violet-500">
          <option value="">All Events</option>
          {(events ?? []).map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}
        </select>
        <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">Filter</button>
        {params.event && <Link href="/admin/surveys" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-medium rounded-lg transition-colors">Clear</Link>}
      </form>

      {surveys.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <MessageSquare size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No survey responses yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {surveys.map((survey) => {
              const answers = survey.answersJson as Record<string, string>
              return (
                <div key={survey.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/admin/contacts/${survey.contact.id}`} className="font-semibold text-white hover:text-violet-300 transition-colors">
                          {survey.contact.fullName}
                        </Link>
                        {survey.event && (
                          <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">
                            {survey.event.eventName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{survey.contact.email} · Submitted {format(survey.submittedAt, 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {survey.rating && Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < survey.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                      ))}
                    </div>
                  </div>

                  {survey.keyFeedback && (
                    <p className="text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-3 mb-3">{survey.keyFeedback}</p>
                  )}

                  {survey.interestTags && survey.interestTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {survey.interestTags.map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}

                  {answers && Object.entries(answers).length > 0 && (
                    <details>
                      <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">View all answers ({Object.keys(answers).length})</summary>
                      <div className="mt-3 space-y-3 pl-3 border-l border-zinc-800">
                        {Object.entries(answers).map(([q, a]) => a && (
                          <div key={q}>
                            <p className="text-xs text-zinc-500 font-medium">{q}</p>
                            <p className="text-sm text-zinc-300 mt-0.5">{a}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-zinc-500">Page {pageNum} of {totalPages}</p>
              <div className="flex gap-2">
                {pageNum > 1 && <Link href={`?${params.event ? `event=${params.event}&` : ''}page=${pageNum - 1}`} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">← Prev</Link>}
                {pageNum < totalPages && <Link href={`?${params.event ? `event=${params.event}&` : ''}page=${pageNum + 1}`} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">Next →</Link>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
