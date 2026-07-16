import { requireMember } from '@/lib/member-auth'
import { UpdatesFeed } from '@/components/app/UpdatesFeed'
import { NotificationToggle } from '@/components/app/NotificationToggle'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  await requireMember()
  return (
    <div className="px-4 pt-8">
      <header className="mb-4 flex items-start justify-between gap-3 px-1">
        <div>
          <h1 className="text-2xl font-bold text-white">AI &amp; Updates</h1>
          <p className="text-sm text-zinc-500">Your edge — new AI, growth plays &amp; Link&apos;d Up news.</p>
        </div>
      </header>
      <div className="mb-4">
        <NotificationToggle variant="inline" />
      </div>
      <UpdatesFeed />
    </div>
  )
}
