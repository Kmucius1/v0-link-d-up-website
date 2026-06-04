'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function UnsubscribeContent() {
  const params = useSearchParams()
  const contactId = params.get('id')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!contactId) return
    setStatus('loading')
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId }),
    })
      .then(r => r.ok ? setStatus('done') : setStatus('error'))
      .catch(() => setStatus('error'))
  }, [contactId])

  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F7F7] flex flex-col items-center justify-center px-6">
      <p className="text-[#7F90A8] font-bold tracking-[0.4em] text-sm mb-12">LINK'D UP</p>
      <div className="max-w-md text-center">
        {status === 'loading' && <p className="text-[#AEB9C8]">Processing...</p>}
        {status === 'done' && (
          <>
            <h1 className="text-3xl font-black mb-4">You've been unsubscribed.</h1>
            <p className="text-[#AEB9C8] mb-8">You won't receive any more emails from LINK'D UP. If this was a mistake, you can re-subscribe by RSVPing again at linkdup.club/rsvp.</p>
            <a href="/" className="text-[#7F90A8] hover:underline text-sm">← Return home</a>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-3xl font-black mb-4">Something went wrong.</h1>
            <p className="text-[#AEB9C8]">Please try again or contact us at hello@drypdigital.com.</p>
          </>
        )}
        {status === 'idle' && !contactId && (
          <>
            <h1 className="text-3xl font-black mb-4">Invalid link.</h1>
            <p className="text-[#AEB9C8]">This unsubscribe link appears to be invalid.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  )
}
