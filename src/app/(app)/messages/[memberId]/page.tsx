import { notFound } from 'next/navigation'
import { requireMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AppHeader } from '@/components/app/AppHeader'
import { MessageThread } from '@/components/app/MessageThread'

export const dynamic = 'force-dynamic'

export default async function MessageThreadPage({ params }: { params: Promise<{ memberId: string }> }) {
  const me = await requireMember()
  const { memberId } = await params

  const { data: counterpart } = await supabaseAdmin
    .from('members')
    .select('id, fullName, businessName, avatarUrl')
    .eq('id', memberId)
    .maybeSingle()
  if (!counterpart) notFound()

  return (
    <div>
      <AppHeader title={counterpart.fullName} subtitle={counterpart.businessName ?? undefined} color="#2d8cff" back="/messages" />
      <div className="lg:mx-auto lg:max-w-[520px] lg:pt-6">
        <MessageThread meId={me.id} counterpartId={counterpart.id} />
      </div>
    </div>
  )
}
