import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { requireMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { AppHeader } from '@/components/app/AppHeader'
import { initials } from '@/lib/format'
import { MessageCircle, Link2, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMember()
  const { id } = await params

  if (id === me.id) redirect('/profile')

  const [{ data: person }, { data: posts }] = await Promise.all([
    supabaseAdmin
      .from('members')
      .select('id, fullName, businessName, roleOrIndustry, city, bio, instagram, website, avatarUrl, status')
      .eq('id', id)
      .maybeSingle(),
    supabaseAdmin
      .from('posts')
      .select('id, imageUrl, body')
      .eq('memberId', id)
      .order('createdAt', { ascending: false })
      .limit(9),
  ])

  if (!person || person.status === 'suspended') notFound()

  return (
    <div className="pb-10 lg:mx-auto lg:max-w-md">
      <AppHeader title={person.fullName} color="#5DA8FF" />
      <section className="px-4 pt-4">
        <div className="flex items-center gap-5">
          <div className="flex h-[94px] w-[94px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#22324a] to-[#121722] text-2xl font-bold text-white ring-1 ring-white/10">
            {person.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={person.avatarUrl} alt={person.fullName} className="h-full w-full object-cover" />
            ) : (
              initials(person.fullName)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-white">{person.fullName}</p>
            {(person.businessName || person.roleOrIndustry) && (
              <p className="truncate text-sm text-white/60">{person.businessName || person.roleOrIndustry}</p>
            )}
            {person.city && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
                <MapPin size={12} /> {person.city}
              </p>
            )}
          </div>
        </div>

        {person.bio && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/85">{person.bio}</p>}
        {person.website && (
          <a
            href={person.website.startsWith('http') ? person.website : `https://${person.website}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#5da8ff]"
          >
            <Link2 size={14} /> {person.website}
          </a>
        )}

        <Link
          href={`/messages/${person.id}`}
          className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2d8cff] text-sm font-bold text-white active:bg-[#1c73dd]"
        >
          <MessageCircle size={17} /> Message
        </Link>
      </section>

      <div className="mt-6 grid grid-cols-3 gap-[2px] border-t border-white/10 bg-[#0b0f16]">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="aspect-square overflow-hidden bg-[#151a22]">
              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-3 text-center text-[10px] leading-4 text-white/65">
                  {post.body?.slice(0, 95)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-3 py-12 text-center text-sm text-white/40">No posts yet.</div>
        )}
      </div>
    </div>
  )
}
