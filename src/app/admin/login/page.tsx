'use client'

import { useState } from 'react'
import { Link2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')

  // Sign in state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Sign up state
  const [reg, setReg] = useState({ name: '', email: '', password: '', confirmPassword: '', inviteCode: '' })
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        window.location.href = '/admin/dashboard'
        return
      }
      const data = await res.json().catch(() => ({}))
      setLoginError(data.error || 'Invalid email or password')
    } catch {
      setLoginError('Server error — please try again.')
    }
    setLoginLoading(false)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setRegError('')
    if (reg.password !== reg.confirmPassword) {
      setRegError('Passwords do not match.')
      return
    }
    if (reg.password.length < 8) {
      setRegError('Password must be at least 8 characters.')
      return
    }
    setRegLoading(true)
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: reg.email, password: reg.password, name: reg.name, inviteCode: reg.inviteCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || 'Registration failed.')
        setRegLoading(false)
        return
      }
      setRegSuccess(true)
    } catch {
      setRegError('Server error — please try again.')
    }
    setRegLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
            <Link2 size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LINK&apos;D UP CRM</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {tab === 'signin' ? 'Sign in to your dashboard' : 'Create your admin account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setTab('signin'); setLoginError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'signin'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setRegError(''); setRegSuccess(false) }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'signup'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                placeholder="admin@linkdup.club"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                placeholder="••••••••"
              />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60"
            >
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          regSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-violet-600/20 border border-violet-600/40 flex items-center justify-center mx-auto">
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <path d="M2 9L9 16L22 2" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white font-semibold">Account created!</p>
              <p className="text-zinc-400 text-sm">You can now sign in with your email and password.</p>
              <button
                onClick={() => { setTab('signin'); setEmail(reg.email); setRegSuccess(false) }}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-lg text-sm"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={reg.name}
                  onChange={e => setReg(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  required
                  value={reg.email}
                  onChange={e => setReg(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  required
                  value={reg.password}
                  onChange={e => setReg(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  required
                  value={reg.confirmPassword}
                  onChange={e => setReg(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="Re-enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Invite Code <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={reg.inviteCode}
                  onChange={e => setReg(p => ({ ...p, inviteCode: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
                  placeholder="Get this from an existing admin"
                />
              </div>
              {regError && <p className="text-red-400 text-sm">{regError}</p>}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60"
              >
                {regLoading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )
        )}

      </div>
    </div>
  )
}
