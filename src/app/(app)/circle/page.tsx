import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { CircleTabs } from '@/components/app/CircleTabs'

export const dynamic = 'force-dynamic'

export default async function CirclePage() {
  const member = await requireMember()
  return (
    <div>
      <AppHeader title="Growth Circle" subtitle="Discover · post · connect" color="#5DA8FF" />
      <div className="px-3 lg:mx-auto lg:max-w-[630px] lg:px-0 lg:pt-6">
        <CircleTabs
          me={{
            fullName: member.fullName,
            businessName: member.businessName,
            avatarUrl: member.avatarUrl,
            avatarPositionX: member.avatarPositionX,
            avatarPositionY: member.avatarPositionY,
          }}
        />
      </div>
    </div>
  )
}
