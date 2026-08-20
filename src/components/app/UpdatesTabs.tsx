'use client'

import { useState } from 'react'
import { ActivityFeed } from '@/components/app/ActivityFeed'
import { UpdatesFeed } from '@/components/app/UpdatesFeed'

export function UpdatesTabs() {
  const [tab, setTab] = useState<'activity' | 'news'>('activity')

  return (
    <div>
      <div className="mb-4 flex border-b border-white/8">
        {(['activity', 'news'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative flex-1 py-2.5 text-xs font-semibold ${tab === key ? 'text-white' : 'text-white/38'}`}
          >
            {key === 'activity' ? 'Activity' : 'News'}
            {tab === key && <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-[#2d8cff]" />}
          </button>
        ))}
      </div>
      {tab === 'activity' ? <ActivityFeed /> : <UpdatesFeed />}
    </div>
  )
}
