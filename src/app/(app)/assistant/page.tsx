import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { Assistant } from '@/components/app/Assistant'

export const dynamic = 'force-dynamic'

export default async function AssistantPage() {
  const member = await requireMember()
  return (
    <div>
      <AppHeader title="Assistant" subtitle="LINQ · your Link'd Up AI" color="#5E5CE6" />
      <Assistant firstName={member.firstName} />
    </div>
  )
}
