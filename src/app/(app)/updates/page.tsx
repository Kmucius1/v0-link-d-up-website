import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { UpdatesFeed } from '@/components/app/UpdatesFeed'
import { NotificationToggle } from '@/components/app/NotificationToggle'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  await requireMember()
  return (
    <div>
      <AppHeader title="AI & Updates" subtitle="New AI · growth plays · Link'd Up news" color="#5E5CE6" />
      <div className="px-3">
        <div className="mb-3">
          <NotificationToggle variant="inline" />
        </div>
        <UpdatesFeed />
      </div>
    </div>
  )
}
