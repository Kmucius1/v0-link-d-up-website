import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { SavedFeed } from '@/components/app/SavedFeed'

export const dynamic = 'force-dynamic'

export default async function SavedPage() {
  await requireMember()
  return (
    <div>
      <AppHeader title="Saved" back="/settings" color="#2d8cff" />
      <div className="px-3 lg:mx-auto lg:max-w-[630px] lg:px-0 lg:pt-6">
        <SavedFeed />
      </div>
    </div>
  )
}
