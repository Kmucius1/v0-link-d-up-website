'use client'

import { useState } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const inputCls =
    'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#a8d8f0]/50 focus:outline-none'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirm) {
      setError('New passwords do not match.')
      return
    }
    setSaving(true)
    const res = await fetch('/api/member/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
      setTimeout(() => setSaved(false), 2500)
    } else {
      setError((await res.json().catch(() => ({}))).error || 'Could not change password.')
    }
  }

  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-[15px] text-white">Change password</span>
        <ChevronDown size={18} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <form onSubmit={submit} className="space-y-3 px-4 pb-4">
          <input
            type="password"
            required
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            required
            placeholder="New password (min 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputCls}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#a8d8f0] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
            {saved ? 'Password updated' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  )
}
