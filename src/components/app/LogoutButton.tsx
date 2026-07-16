'use client'

import { LogOut } from 'lucide-react'

export function LogoutButton() {
  async function logout() {
    await fetch('/api/member/logout', { method: 'POST' })
    window.location.href = '/join'
  }
  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white"
    >
      <LogOut size={15} /> Sign out
    </button>
  )
}
