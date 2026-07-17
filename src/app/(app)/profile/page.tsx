import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { ProfileForm } from '@/components/app/ProfileForm'
import { NotificationToggle } from '@/components/app/NotificationToggle'
import { LogoutButton } from '@/components/app/LogoutButton'
import { initials } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const member = await requireMember()
  return (
    <div>
      <AppHeader title="My Profile" color="#8E8E93" />
      <div className="px-4">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5E5CE6] to-[#0A84FF] text-2xl font-bold text-white">
            {initials(member.fullName)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white">{member.fullName}</h2>
            <p className="truncate text-sm text-white/50">
              {member.businessName || member.roleOrIndustry || member.email}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <NotificationToggle />
        </div>

        <h3 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-white/40">Your profile</h3>
        <ProfileForm member={member} />

        <div className="mt-8 border-t border-white/10 pt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
