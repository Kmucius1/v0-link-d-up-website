import { requireMember } from '@/lib/member-auth'
import { ProfileForm } from '@/components/app/ProfileForm'
import { NotificationToggle } from '@/components/app/NotificationToggle'
import { LogoutButton } from '@/components/app/LogoutButton'
import { initials } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const member = await requireMember()
  return (
    <div className="px-4 pt-8">
      <header className="mb-6 flex items-center gap-4 px-1">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a8d8f0]/30 to-violet-500/20 text-xl font-bold text-white">
          {initials(member.fullName)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-white">{member.fullName}</h1>
          <p className="truncate text-sm text-zinc-500">
            {member.businessName || member.roleOrIndustry || member.email}
          </p>
        </div>
      </header>

      <div className="mb-6">
        <NotificationToggle />
      </div>

      <h2 className="mb-3 px-1 text-sm font-semibold text-zinc-400">Your profile</h2>
      <ProfileForm member={member} />

      <div className="mt-8 border-t border-white/10 pt-6">
        <LogoutButton />
      </div>
    </div>
  )
}
