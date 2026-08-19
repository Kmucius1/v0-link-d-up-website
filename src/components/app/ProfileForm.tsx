'use client'

import { useRef, useState } from 'react'
import type { Member } from '@/lib/member-auth'
import { initials } from '@/lib/format'
import { Loader2, Check, Camera } from 'lucide-react'

const fields: { key: keyof Member; label: string; placeholder: string; full?: boolean }[] = [
  { key: 'firstName', label: 'First name', placeholder: 'Jordan' },
  { key: 'lastName', label: 'Last name', placeholder: 'Rivera' },
  { key: 'businessName', label: 'Business / brand', placeholder: 'Rivera Studios', full: true },
  { key: 'roleOrIndustry', label: 'What you do', placeholder: 'Photographer' },
  { key: 'city', label: 'City', placeholder: 'Clearwater' },
  { key: 'instagram', label: 'Instagram', placeholder: 'yourhandle' },
  { key: 'website', label: 'Link in bio', placeholder: 'yoursite.com' },
]

export function ProfileForm({ member }: { member: Member }) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of fields) init[f.key] = (member[f.key] as string) ?? ''
    init.bio = member.bio ?? ''
    init.avatarUrl = member.avatarUrl ?? ''
    return init
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  function set(key: string, value: string) {
    setForm((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  async function save(overrides?: Record<string, string>) {
    setSaving(true)
    setError('')
    const res = await fetch('/api/member/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ...overrides }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      setError((await res.json().catch(() => ({}))).error || 'Could not save changes.')
    }
  }

  async function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/member/upload', { method: 'POST', body: fd })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setForm((p) => ({ ...p, avatarUrl: data.url }))
      await save({ avatarUrl: data.url })
    } else {
      setError(data.error || 'Could not upload photo.')
    }
    setUploadingAvatar(false)
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#22324a] to-[#121722] text-xl font-bold text-white ring-1 ring-white/10">
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatarUrl} alt="Profile photo" className="h-full w-full object-cover" />
            ) : (
              initials(`${form.firstName} ${form.lastName}`.trim() || 'Member')
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#121720] bg-[#2d8cff] text-white disabled:opacity-60"
          >
            {uploadingAvatar ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" onChange={onAvatarFile} className="hidden" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Profile photo</p>
          <button type="button" onClick={() => avatarInputRef.current?.click()} className="text-xs font-medium text-[#5da8ff]">
            Change photo
          </button>
        </div>
      </div>

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
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        onClick={() => save()}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-[#a8d8f0] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
        {saved ? 'Saved' : 'Save profile'}
      </button>
    </div>
  )
}
