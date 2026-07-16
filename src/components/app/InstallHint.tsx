'use client'

import { useEffect, useState } from 'react'
import { Share, Plus, X, Download } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'linkdup-install-dismissed'

export function InstallHint() {
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return
    if (localStorage.getItem(DISMISS_KEY)) return

    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    setIsIOS(ios)

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    setVisible(true)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!visible) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    dismiss()
  }

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-[#a8d8f0]/25 bg-gradient-to-br from-[#a8d8f0]/10 to-transparent p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#a8d8f0]/15 text-[#a8d8f0]">
          <Download size={18} />
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold text-white">Install the app</p>
          {isIOS ? (
            <p className="mt-0.5 text-zinc-400">
              Tap <Share size={13} className="inline -mt-0.5" /> Share, then{' '}
              <span className="whitespace-nowrap font-medium text-zinc-200">
                Add to Home Screen <Plus size={13} className="inline -mt-0.5" />
              </span>{' '}
              to keep Link&apos;d Up one tap away and get notifications.
            </p>
          ) : deferred ? (
            <div className="mt-2">
              <button
                onClick={install}
                className="rounded-lg bg-[#a8d8f0] px-3 py-1.5 text-xs font-semibold text-black"
              >
                Add to Home Screen
              </button>
            </div>
          ) : (
            <p className="mt-0.5 text-zinc-400">
              Open your browser menu and choose{' '}
              <span className="font-medium text-zinc-200">Install app / Add to Home Screen</span>.
            </p>
          )}
        </div>
        <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
