import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { Mail, Plus, Send } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-700 text-zinc-300',
  sending: 'bg-yellow-500/20 text-yellow-400',
  sent: 'bg-emerald-500/20 text-emerald-400',
  failed: 'bg-red-500/20 text-red-400',
}

export default async function CampaignsPage() {
  const campaigns = await prisma.emailCampaign.findMany({ orderBy: { createdAt: 'desc' } })

  const audienceOptions = [
    'All LINK\'D UP Contacts',
    'RSVP\'d for a specific event',
    'Attended a specific event',
    'Did not attend',
    'Survey Responders',
    'Interested in Sponsoring',
    'Interested in Vending',
    'Interested in Speaking',
    'Interested in Performing',
    'Interested in Art',
    'Interested in Collaborating',
    'Creators',
    'Business Owners',
    'Artists',
    'Entrepreneurs',
    'Students / Young Professionals',
  ]

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Campaigns</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{campaigns.length} total campaigns</p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Plus size={14} /> New Campaign
        </Link>
      </div>

      {/* Audience segments info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Mail size={14} className="text-fuchsia-400" /> Available Audience Segments
        </h2>
        <div className="flex flex-wrap gap-2">
          {audienceOptions.map((opt) => (
            <span key={opt} className="text-xs px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-full">{opt}</span>
          ))}
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Mail size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No campaigns yet</p>
          <p className="text-zinc-600 text-sm mt-1">Create email campaigns to reach your LINK'D UP community.</p>
          <Link href="/admin/campaigns/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={13} /> Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{campaign.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[campaign.status] || STATUS_COLORS.draft}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">{campaign.subject}</p>
                  {campaign.audienceTag && (
                    <p className="text-xs text-zinc-600 mt-1">Audience: {campaign.audienceTag}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {campaign.status === 'draft' && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg transition-colors">
                      <Send size={11} /> Send
                    </button>
                  )}
                  {campaign.sentAt && (
                    <p className="text-xs text-zinc-500">Sent {format(campaign.sentAt, 'MMM d, yyyy')}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
