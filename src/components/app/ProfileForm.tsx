'use client'

import { useState } from 'react'
import type { Member } from '@/lib/member-auth'
import { Loader2, Check } from 'lucide-react'

const fields: { key: keyof Member; label: string; placeholder: string; full?: boolean }[] = [
  { key: 'firstName', label: 'First name', placeholder: 'Jordan' },
  { key: 'lastName', label: 'Last name', placeholder: 'Rivera' },
  { key: 'businessName', label: 'Business / brand', placeholder: 'Rivera Studios', full: true },
  { key: 'roleOrIndustry', label: 'What you do', placeholder: 'Photographer' },
  { key: 'city', label: 'City', placeholder: 'Clearwater' },
  { key: 'instagram', label: 'Instagram', placeholder: 'yourhandle' },
  { key: 'website', label: 'Website', placeholder: 'yoursite.com' },
]

export function ProfileForm({ member }: { member: Member }) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of fields) init[f.key] = (member[f.key] as string) ?? ''
    init.bio = member.bio ?? ''
    return init
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set(key: string, value: string) {
    setForm((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    const res = await fetch('/api/member/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key} className={f.full ? 'col-span-2' : ''}>
            <label className="mb-1 block text-xs font-medium text-zinc-400">{f.label}</label>
            <input
              value={form[f.key] ?? ''}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#a8d8f0]/50 focus:outline-none"
            />
          </div>
        ))}
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-zinc-400">Bio</label>
          <textarea
            value={form.bio ?? ''}
            onChange={(e) => set('bio', e.target.value)}
            rows={3}
            placeholder="A line or two about what you're building…"
            className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#a8d8f0]/50 focus:outline-none"
          />
        </div>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-[#a8d8f0] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
        {saved ? 'Saved' : 'Save profile'}
      </button>
    </div>
  )
}
