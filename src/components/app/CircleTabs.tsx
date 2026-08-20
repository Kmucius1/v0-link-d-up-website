'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DiscoverGrid } from '@/components/app/DiscoverGrid'
import { CircleFeed } from '@/components/app/CircleFeed'

type Me = { fullName: string; businessName: string | null; avatarUrl: string | null; avatarPositionX?: number | null; avatarPositionY?: number | null }

export function CircleTabs({ me }: { me: Me }) {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'discover' | 'circle'>(searchParams.get('compose') ? 'circle' : 'discover')

  return (
    <div>
      <div className="-mx-3 mb-3 flex border-b border-white/8 px-3 lg:mx-0 lg:px-0">
        {(['discover', 'circle'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative flex-1 py-3 text-xs font-semibold ${tab === key ? 'text-white' : 'text-white/38'}`}
          >
            {key === 'discover' ? 'Discover' : 'My Circle'}
            {tab === key && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#2d8cff]" />}
          </button>
        ))}
      </div>
      {tab === 'discover' ? <DiscoverGrid /> : <CircleFeed me={me} />}
    </div>
  )
}
