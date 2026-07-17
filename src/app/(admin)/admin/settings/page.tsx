'use client'

import { useState, useEffect } from 'react'
import { format, formatDistanceToNow } from 'date-fns'

type AdminUser = {
  id: string
  email: string
  name: string | null
  createdAt: string
  lastLoginAt: string | null
}

export default function SettingsPage() {
  const [invite, setInvite] = useState({ email: '', name: '', password: '' })
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [inviteError, setInviteError] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)

  function loadUsers() {
    setUsersLoading(true)
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setUsersLoading(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteStatus('loading')
    setInviteError('')
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invite),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteError(data.error || 'Failed to create admin.')
        setInviteStatus('error')
      } else {
        setInviteStatus('success')
        setInvite({ email: '', name: '', password: '' })
        loadUsers()
      }
    } catch {
      setInviteError('Something went wrong.')
      setInviteStatus('error')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Manage your LINK&apos;D UP CRM</p>
      </div>

      {/* Admin Users */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-white">Admin Users</h2>
          <p className="text-zinc-400 text-xs mt-0.5">Everyone with access to this dashboard, and when they last signed in.</p>
        </div>

        {usersLoading ? (
          <p className="text-zinc-500 text-sm">Loading...</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-zinc-200 font-medium">{u.name || u.email}</p>
                  <p className="text-xs text-zinc-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400">
                    {u.lastLoginAt ? `Last signed in ${formatDistanceToNow(new Date(u.lastLoginAt), { addSuffix: true })}` : 'Never signed in'}
                  </p>
                  <p className="text-[11px] text-zinc-600">Account created {format(new Date(u.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Admin */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-white">Add Admin User</h2>
          <p className="text-zinc-400 text-xs mt-0.5">Give someone else access to the CRM dashboard.</p>
        </div>

        {inviteStatus === 'success' && (
          <div className="bg-violet-950/40 border border-violet-800 rounded-lg px-4 py-3 text-violet-300 text-sm">
            Admin account created. They can now log in at linkdup.club/admin/login.
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={invite.name}
                onChange={e => setInvite(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email <span className="text-red-400">*</span></label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={invite.email}
                onChange={e => setInvite(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Temporary Password <span className="text-red-400">*</span></label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Min 8 characters"
              value={invite.password}
              onChange={e => setInvite(p => ({ ...p, password: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600"
            />
          </div>

          {inviteError && (
            <p className="text-red-400 text-sm">{inviteError}</p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={inviteStatus === 'loading'}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {inviteStatus === 'loading' ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Invite Code */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div>
          <h2 className="font-semibold text-white">Invite Code</h2>
          <p className="text-zinc-400 text-xs mt-0.5">Share this with anyone you want to give admin access. They&apos;ll use it on the Sign Up tab of the login page.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3">
          <code className="text-violet-300 text-sm font-mono flex-1 select-all">linkdup-admin</code>
          <button
            onClick={() => navigator.clipboard.writeText('linkdup-admin')}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-white">System Info</h2>
        <div className="text-sm text-zinc-400 space-y-2">
          <div className="flex justify-between py-2 border-b border-zinc-800">
            <span>Database</span>
            <span className="text-green-400 font-medium">Supabase · Connected</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-800">
            <span>Email</span>
            <span className="text-zinc-300">Resend · linkdup@drypdigital.com</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Site</span>
            <a href="https://linkdup.club" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">linkdup.club</a>
          </div>
        </div>
      </div>
    </div>
  )
}
