import Link from 'next/link'
import { format } from 'date-fns'
import { Star } from 'lucide-react'

type SurveyResponse = {
  id: string
  surveyTitle: string
  answersJson: unknown
  rating: number | null
  interestTags: string[]
  keyFeedback: string | null
  submittedAt: Date
  contact: { id: string; fullName: string; email: string }
}

export function EventSurveyList({ responses }: { responses: SurveyResponse[] }) {
  if (responses.length === 0) {
    return <p className="text-zinc-500 text-sm">No survey responses for this event.</p>
  }

  return (
    <div className="space-y-3">
      {responses.map((response) => (
        <div key={response.id} className="border border-zinc-800 rounded-lg p-4 bg-zinc-800/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={`/admin/contacts/${response.contact.id}`} className="font-medium text-zinc-200 hover:text-violet-300 transition-colors text-sm">
                {response.contact.fullName}
              </Link>
              <p className="text-xs text-zinc-600 mt-0.5">{response.contact.email} · {format(response.submittedAt, 'MMM d, yyyy')}</p>
            </div>
            {response.rating && (
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className={i < response.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                ))}
              </div>
            )}
          </div>
          {response.keyFeedback && (
            <p className="text-sm text-zinc-400 mt-2 bg-zinc-800/50 rounded p-2">{response.keyFeedback}</p>
          )}
          {response.interestTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {response.interestTags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
