'use client'

import { Share2, Mail } from 'lucide-react'

export function ProfileActions({ email }: { email: string }) {
  async function shareProfile() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: "LINK'D UP profile", url }).catch(() => undefined)
      return
    }
    await navigator.clipboard?.writeText(url)
    window.alert('Profile link copied.')
  }

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      <a href="#edit-profile" className="flex h-10 items-center justify-center rounded-xl border border-white/10 bg-[#171c24] text-[13px] font-semibold text-white active:bg-white/10">
        Edit profile
      </a>
      <button onClick={shareProfile} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#171c24] text-[13px] font-semibold text-white active:bg-white/10">
        <Share2 size={15} /> Share
      </button>
      <a href={`mailto:${email}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#171c24] text-[13px] font-semibold text-white active:bg-white/10">
        <Mail size={15} /> Contact
      </a>
    </div>
  )
}
