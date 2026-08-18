import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { UpdatesFeed } from '@/components/app/UpdatesFeed'
import { NotificationToggle } from '@/components/app/NotificationToggle'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  await requireMember()
  return (
    <div>
      <AppHeader title="Activity & Updates" subtitle="LINK'D UP news · AI · growth" color="#5DA8FF" />
      <div className="px-3">
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.025] p-1">
          <NotificationToggle variant="inline" />
        </div>
        <UpdatesFeed />
      </div>
    </div>
  )
}
