import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { UpdatesTabs } from '@/components/app/UpdatesTabs'
import { NotificationToggle } from '@/components/app/NotificationToggle'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  await requireMember()
  return (
    <div>
      <AppHeader title="Activity" subtitle="Likes · comments · connection requests" color="#5E5CE6" />
      <div className="px-3 lg:mx-auto lg:max-w-md">
        <div className="mb-3">
          <NotificationToggle variant="inline" />
        </div>
        <UpdatesTabs />
      </div>
    </div>
  )
}
