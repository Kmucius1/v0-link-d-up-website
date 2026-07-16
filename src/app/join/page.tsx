'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function JoinPage() {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [signin, setSignin] = useState({ email: '', password: '' })
  const [reg, setReg] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    roleOrIndustry: '',
    city: '',
    instagram: '',
    email: '',
    password: '',
  })

  async function submitSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/member/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signin),
    })
    if (res.ok) {
      window.location.href = '/home'
      return
    }
    const data = await res.json().catch(() => ({}))
    setError(data.error || 'Could not sign in.')
    setLoading(false)
  }

  async function submitSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/member/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reg),
    })
    if (res.ok) {
      window.location.href = '/home'
      return
    }
    const data = await res.json().catch(() => ({}))
    setError(data.error || 'Could not sign up.')
    setLoading(false)
  }

  const inputCls =
    'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#a8d8f0]/50 focus:outline-none'

  return (
    <div className="flex min-h-dvh flex-col justify-center bg-black px-5 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b1220] to-black text-2xl font-extrabold tracking-tighter">
            <span className="text-[#a8d8f0]">L</span>
            <span className="text-white">U</span>
          </div>
          <h1 className="text-2xl font-bold text-white">LINK&apos;D UP</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tab === 'signup' ? 'Create your member account' : 'Welcome back'}
          </p>
        </div>

        <div className="mb-6 flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
          {(['signup', 'signin'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t)
                setError('')
              }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                tab === t ? 'bg-[#a8d8f0] text-black' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          ))}
        </div>

        {tab === 'signin' ? (
          <form onSubmit={submitSignIn} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={signin.email}
              onChange={(e) => setSignin((p) => ({ ...p, email: e.target.value }))}
              className={inputCls}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={signin.password}
              onChange={(e) => setSignin((p) => ({ ...p, password: e.target.value }))}
              className={inputCls}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#a8d8f0] py-2.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={submitSignUp} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="First name"
                value={reg.firstName}
                onChange={(e) => setReg((p) => ({ ...p, firstName: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Last name"
                value={reg.lastName}
                onChange={(e) => setReg((p) => ({ ...p, lastName: e.target.value }))}
                className={inputCls}
              />
            </div>
            <input
              placeholder="Business / brand (optional)"
              value={reg.businessName}
              onChange={(e) => setReg((p) => ({ ...p, businessName: e.target.value }))}
              className={inputCls}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="What you do"
                value={reg.roleOrIndustry}
                onChange={(e) => setReg((p) => ({ ...p, roleOrIndustry: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="City"
                value={reg.city}
                onChange={(e) => setReg((p) => ({ ...p, city: e.target.value }))}
                className={inputCls}
              />
            </div>
            <input
              placeholder="Instagram (optional)"
              value={reg.instagram}
              onChange={(e) => setReg((p) => ({ ...p, instagram: e.target.value }))}
              className={inputCls}
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={reg.email}
              onChange={(e) => setReg((p) => ({ ...p, email: e.target.value }))}
              className={inputCls}
            />
            <input
              type="password"
              required
              placeholder="Password (min 6 characters)"
              value={reg.password}
              onChange={(e) => setReg((p) => ({ ...p, password: e.target.value }))}
              className={inputCls}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#a8d8f0] py-2.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>
            <p className="text-center text-xs text-zinc-600">
              By joining you agree to keep the Circle a supportive, respectful room.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
