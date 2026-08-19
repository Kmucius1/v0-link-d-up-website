import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { MessagesList } from '@/components/app/MessagesList'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  await requireMember()
  return (
    <div>
      <AppHeader title="Messages" color="#2d8cff" />
      <div className="px-3 lg:mx-auto lg:max-w-[520px] lg:px-0 lg:pt-6">
        <MessagesList />
      </div>
    </div>
  )
}
