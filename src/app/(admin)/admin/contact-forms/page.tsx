import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { MessageSquare } from 'lucide-react'

export default async function ContactFormsPage() {
  const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Forms</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{submissions.length.toLocaleString()} submissions</p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <MessageSquare size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No contact form submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-100">{s.firstName} {s.lastName}</p>
                  <p className="text-sm text-zinc-400">{s.email}{s.phone ? ` · ${s.phone}` : ''}</p>
                  {s.subject && <p className="text-xs text-violet-400 mt-1 font-medium">{s.subject}</p>}
                </div>
                <p className="text-xs text-zinc-600 shrink-0">{format(s.createdAt, 'MMM d, yyyy h:mm a')}</p>
              </div>
              <p className="text-sm text-zinc-300 mt-3 whitespace-pre-wrap leading-relaxed">{s.message}</p>
              {s.source && <p className="text-xs text-zinc-600 mt-2">Source: {s.source}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
