import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { CircleFeed } from '@/components/app/CircleFeed'

export const dynamic = 'force-dynamic'

export default async function CirclePage() {
  const member = await requireMember()
  return (
    <div>
      <AppHeader title="Growth Circle" subtitle="Post · ask the room · find collaborators" color="#34C759" />
      <div className="px-3">
        <CircleFeed
          me={{ fullName: member.fullName, businessName: member.businessName, avatarUrl: member.avatarUrl }}
        />
      </div>
    </div>
  )
}
