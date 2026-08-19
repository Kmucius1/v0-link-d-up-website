import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { CreateHighlightForm } from '@/components/app/CreateHighlightForm'

export const dynamic = 'force-dynamic'

export default async function NewHighlightPage() {
  await requireMember()
  return (
    <div>
      <AppHeader title="New highlight" back="/profile" color="#a8d8f0" />
      <div className="lg:mx-auto lg:max-w-md">
        <CreateHighlightForm />
      </div>
    </div>
  )
}
