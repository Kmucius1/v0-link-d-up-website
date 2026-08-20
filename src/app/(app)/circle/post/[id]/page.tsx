import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { SinglePost } from '@/components/app/SinglePost'

export const dynamic = 'force-dynamic'

export default async function SinglePostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireMember()
  const { id } = await params

  return (
    <div>
      <AppHeader title="Post" color="#5DA8FF" back="/circle" />
      <div className="px-3 lg:mx-auto lg:max-w-[630px] lg:px-0 lg:pt-6">
        <SinglePost postId={id} />
      </div>
    </div>
  )
}
