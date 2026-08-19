'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const inputCls =
    'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#a8d8f0]/50 focus:outline-none'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/member/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not reset password.')
        return
      }
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-zinc-400">This reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="inline-block text-sm font-medium text-[#a8d8f0] hover:underline">
          Request a new link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-zinc-400">Your password has been reset.</p>
        <Link href="/join" className="inline-block text-sm font-medium text-[#a8d8f0] hover:underline">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        required
        placeholder="New password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#a8d8f0] py-2.5 text-sm font-semibold text-black disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Set new password
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-black px-5 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b1220] to-black text-2xl font-extrabold tracking-tighter">
            <span className="text-[#a8d8f0]">L</span>
            <span className="text-white">U</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set a new password</h1>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-zinc-500">Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
