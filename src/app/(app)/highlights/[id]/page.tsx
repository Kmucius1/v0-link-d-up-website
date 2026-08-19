import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { HighlightViewer } from '@/components/app/HighlightViewer'

export const dynamic = 'force-dynamic'

export default async function HighlightPage({ params }: { params: Promise<{ id: string }> }) {
  await requireMember()
  const { id } = await params
  return (
    <div>
      <AppHeader title="Highlight" back="/profile" color="#a8d8f0" />
      <div className="lg:mx-auto lg:max-w-[520px]">
        <HighlightViewer id={id} />
      </div>
    </div>
  )
}
