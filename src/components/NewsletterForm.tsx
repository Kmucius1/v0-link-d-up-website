'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, source: 'homepage' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <p className="text-[#7F90A8] font-semibold text-lg">You&apos;re on the list.</p>
        <p className="text-[#AEB9C8] text-sm mt-1">We&apos;ll keep you posted on future events.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        className="flex-1 bg-[#171717] border border-[#7F90A8]/20 rounded-full px-5 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors text-sm"
      />
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="flex-[2] bg-[#171717] border border-[#7F90A8]/20 rounded-full px-5 py-3 text-[#F7F7F7] placeholder-[#7F90A8]/40 focus:outline-none focus:border-[#7F90A8] transition-colors text-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#7F90A8] hover:bg-[#AEB9C8] text-[#050505] font-semibold px-6 py-3 rounded-full text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Joining...' : 'Stay In The Loop'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-1 w-full text-center">Something went wrong. Try again.</p>
      )}
    </form>
  )
}
