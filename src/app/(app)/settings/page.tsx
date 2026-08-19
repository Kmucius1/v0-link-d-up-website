import Link from 'next/link'
import { requireMember } from '@/lib/member-auth'
import { AppHeader } from '@/components/app/AppHeader'
import { NotificationToggle } from '@/components/app/NotificationToggle'
import { LogoutButton } from '@/components/app/LogoutButton'
import { ChangePasswordForm } from '@/components/app/ChangePasswordForm'
import { UserRound, MessageCircle, Bookmark, Bell, HelpCircle, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

function Row({ href, icon: Icon, label, sub }: { href: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string; sub?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
      <Icon size={19} className="text-white/70" />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] text-white">{label}</p>
        {sub && <p className="text-xs text-white/40">{sub}</p>}
      </div>
      <ChevronRight size={17} className="text-white/25" />
    </Link>
  )
}

export default async function SettingsPage() {
  await requireMember()

  return (
    <div className="pb-10 lg:mx-auto lg:max-w-md">
      <AppHeader title="Settings and activity" back="/profile" color="#a8d8f0" />

      <p className="px-4 pb-2 pt-5 text-xs font-bold uppercase tracking-wide text-white/35">Your account</p>
      <div className="border-t border-white/8">
        <Row href="/profile#edit-profile" icon={UserRound} label="Edit profile" sub="Photo, bio, link in bio, and more" />
        <ChangePasswordForm />
      </div>

      <p className="px-4 pb-2 pt-6 text-xs font-bold uppercase tracking-wide text-white/35">How you use Link&apos;d Up</p>
      <div className="border-t border-white/8">
        <Row href="/messages" icon={MessageCircle} label="Messages" />
        <Row href="/saved" icon={Bookmark} label="Saved" />
        <div className="border-b border-white/8 px-4 py-3.5">
          <NotificationToggle variant="inline" />
        </div>
      </div>

      <p className="px-4 pb-2 pt-6 text-xs font-bold uppercase tracking-wide text-white/35">Support</p>
      <div className="border-t border-white/8">
        <a href="mailto:admin@linkdup.club" className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
          <HelpCircle size={19} className="text-white/70" />
          <div className="min-w-0 flex-1"><p className="text-[15px] text-white">Contact support</p></div>
          <ChevronRight size={17} className="text-white/25" />
        </a>
      </div>

      <div className="px-4 pt-6"><LogoutButton /></div>
    </div>
  )
}
