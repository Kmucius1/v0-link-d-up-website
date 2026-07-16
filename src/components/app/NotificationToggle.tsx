'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { pushSupported, currentSubscription, enablePush, disablePush } from '@/lib/push-client'

export function NotificationToggle({ variant = 'card' }: { variant?: 'card' | 'inline' }) {
  const [supported, setSupported] = useState(true)
  const [on, setOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!pushSupported()) {
      setSupported(false)
      return
    }
    currentSubscription().then((s) => setOn(!!s))
  }, [])

  async function toggle() {
    setBusy(true)
    setMsg('')
    if (on) {
      await disablePush()
      setOn(false)
      setMsg('Notifications turned off.')
    } else {
      const result = await enablePush()
      if (result === 'subscribed') {
        setOn(true)
        setMsg("You're in — we'll ping you with new drops.")
      } else if (result === 'denied') {
        setMsg('Notifications are blocked. Enable them in your browser settings.')
      } else if (result === 'unsupported') {
        setSupported(false)
      } else {
        setMsg('Could not enable notifications. Try again.')
      }
    }
    setBusy(false)
  }

  if (!supported) {
    return (
      <p className="text-xs text-zinc-500">
        Notifications aren&apos;t supported here. On iPhone, add the app to your Home Screen first, then open it.
      </p>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={toggle}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 disabled:opacity-60"
      >
        {on ? <BellRing size={14} className="text-[#a8d8f0]" /> : <Bell size={14} />}
        {busy ? '…' : on ? 'Notifications on' : 'Turn on notifications'}
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a8d8f0]/15 text-[#a8d8f0]">
          {on ? <BellRing size={19} /> : <BellOff size={19} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Push notifications</p>
          <p className="text-xs text-zinc-400">Get pinged on new updates &amp; Circle activity.</p>
        </div>
        <button
          onClick={toggle}
          disabled={busy}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
            on ? 'bg-white/10 text-zinc-300' : 'bg-[#a8d8f0] text-black'
          }`}
        >
          {busy ? '…' : on ? 'On' : 'Enable'}
        </button>
      </div>
      {msg && <p className="mt-2 text-xs text-zinc-400">{msg}</p>}
    </div>
  )
}
