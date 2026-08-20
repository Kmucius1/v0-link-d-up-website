import Link from 'next/link'
import { requireMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ProfileForm } from '@/components/app/ProfileForm'
import { ProfileActions } from '@/components/app/ProfileActions'
import { HighlightsRow } from '@/components/app/HighlightsRow'
import { initials } from '@/lib/format'
import { Grid3X3, Link2, MapPin, Play, PlaySquare, UserSquare2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

type SuggestedMember = {
  id: string
  fullName: string
  businessName: string | null
  roleOrIndustry: string | null
  avatarUrl: string | null
  avatarPositionX: number | null
  avatarPositionY: number | null
  instagram: string | null
  website: string | null
}

export default async function ProfilePage() {
  const member = await requireMember()

  const [{ count: postCount }, { count: linkCount }, suggestionsResult, postsResult] = await Promise.all([
    supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).eq('memberId', member.id),
    supabaseAdmin
      .from('connections')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'accepted')
      .or(`requesterId.eq.${member.id},recipientId.eq.${member.id}`),
    supabaseAdmin
      .from('members')
      .select('id,fullName,businessName,roleOrIndustry,avatarUrl,avatarPositionX,avatarPositionY,instagram,website')
      .neq('id', member.id)
      .eq('status', 'active')
      .limit(6),
    supabaseAdmin
      .from('posts')
      .select('id,imageUrl,mediaType,body')
      .eq('memberId', member.id)
      .order('createdAt', { ascending: false })
      .limit(9),
  ])

  const suggestions = (suggestionsResult.data ?? []) as SuggestedMember[]
  const posts = postsResult.data ?? []

  return (
    <div className="pb-6 lg:mx-auto lg:max-w-md">
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <div className="text-[22px] font-black tracking-[0.08em] text-white">LINK&apos;D <span className="text-[#2d8cff]">UP</span></div>
        <Link href="/settings" className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70">Menu</Link>
      </div>

      <section className="px-4">
        <div className="flex items-center gap-5">
          <div className="relative flex h-[94px] w-[94px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7fbaff] via-[#2d8cff] to-[#d6dde8] p-[2px] shadow-[0_0_26px_rgba(45,140,255,.22)]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#121722] text-2xl font-bold text-white">
              {member.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.avatarUrl}
                  alt={member.fullName}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${member.avatarPositionX ?? 50}% ${member.avatarPositionY ?? 50}%` }}
                />
              ) : initials(member.fullName)}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-3 text-center">
            <div><div className="text-lg font-bold text-white">{postCount ?? 0}</div><div className="text-[11px] text-white/45">Posts</div></div>
            <div><div className="text-lg font-bold text-white">{linkCount ?? 0}</div><div className="text-[11px] text-white/45">Links</div></div>
            <div><div className="text-lg font-bold text-white">LINK&apos;D</div><div className="text-[11px] text-white/45">Member</div></div>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-[17px] font-bold text-white">{member.fullName}</h1>
          <p className="mt-0.5 text-sm font-medium text-white/72">{member.businessName || member.roleOrIndustry || 'LINK’D UP Member'}</p>
          {member.bio && <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-white/82">{member.bio}</p>}
          {member.city && <p className="mt-1.5 flex items-center gap-1 text-sm text-[#9db2cc]"><MapPin size={14} />{member.city}</p>}
          {member.website && <a href={member.website.startsWith('http') ? member.website : `https://${member.website}`} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#4c9dff]"><Link2 size={14} />{member.website.replace(/^https?:\/\//, '')}</a>}
        </div>
      </section>

      <div className="mt-4"><ProfileActions email={member.email} /></div>

      {suggestions.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-[15px] font-bold text-white">Discover people</h2>
            <Link href="/circle" className="text-xs font-semibold text-[#4c9dff]">See all</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {suggestions.map((person) => (
              <Link key={person.id} href={`/members/${person.id}`} className="w-[150px] shrink-0 rounded-2xl border border-white/10 bg-[#151a22] p-3 text-center shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#22324a] to-[#121722] text-lg font-bold text-white">
                  {person.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.avatarUrl}
                      alt={person.fullName}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `${person.avatarPositionX ?? 50}% ${person.avatarPositionY ?? 50}%` }}
                    />
                  ) : initials(person.fullName)}
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-white">{person.fullName}</p>
                <p className="h-4 truncate text-[11px] text-white/45">{person.businessName || person.roleOrIndustry || 'LINK’D UP'}</p>
                <span className="mt-3 flex h-8 items-center justify-center rounded-lg bg-[#1877f2] px-3 text-xs font-bold text-white">
                  Get Link&apos;d
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <HighlightsRow memberId={member.id} own />

      <div className="mt-1 grid grid-cols-3 border-y border-white/10">
        <button className="flex h-12 items-center justify-center border-b-2 border-[#2d8cff] text-white"><Grid3X3 size={22} /></button>
        <button className="flex h-12 items-center justify-center text-white/45"><PlaySquare size={22} /></button>
        <button className="flex h-12 items-center justify-center text-white/45"><UserSquare2 size={22} /></button>
      </div>

      <div className="grid grid-cols-3 gap-[2px] bg-[#0b0f16]">
        {posts.length > 0 ? posts.map((post) => (
          <Link key={post.id} href={`/circle/post/${post.id}`} className="relative aspect-square overflow-hidden bg-[#151a22]">
            {post.imageUrl && post.mediaType === 'video' ? (
              <>
                <video src={post.imageUrl} className="h-full w-full object-cover" muted />
                <Play size={18} className="absolute right-1.5 top-1.5 fill-white text-white drop-shadow" />
              </>
            ) : post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center p-3 text-center text-[10px] leading-4 text-white/65">{post.body?.slice(0, 95)}</div>
            )}
          </Link>
        )) : (
          <div className="col-span-3 py-12 text-center text-sm text-white/40">Your posts will show here.</div>
        )}
      </div>

      <section id="edit-profile" className="mx-4 mt-8 rounded-2xl border border-white/10 bg-[#121720] p-4">
        <h2 className="text-base font-bold text-white">Edit profile</h2>
        <p className="mt-1 text-xs text-white/45">Keep your LINK&apos;D UP profile current so people know how to connect with you.</p>
        <div className="mt-4"><ProfileForm member={member} /></div>
      </section>
    </div>
  )
}
