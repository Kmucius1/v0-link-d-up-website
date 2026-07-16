import { requireMember } from '@/lib/member-auth'
import { CircleFeed } from '@/components/app/CircleFeed'

export const dynamic = 'force-dynamic'

export default async function CirclePage() {
  const member = await requireMember()
  return (
    <div className="px-4 pt-8">
      <header className="mb-4 px-1">
        <h1 className="text-2xl font-bold text-white">Growth Circle</h1>
        <p className="text-sm text-zinc-500">
          Post what you&apos;re building. Ask the room. Find your next collaborator.
        </p>
      </header>
      <CircleFeed
        me={{ fullName: member.fullName, businessName: member.businessName, avatarUrl: member.avatarUrl }}
      />
    </div>
  )
}
