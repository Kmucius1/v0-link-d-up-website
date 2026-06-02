'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EventFormProps = {
  event?: {
    id: string
    eventName: string
    eventSlug: string
    eventDate: Date
    startTime: string
    endTime: string
    locationName: string
    address: string
    description: string | null
    rsvpLink: string | null
    surveyLink: string | null
    facebookEventLink: string | null
    status: string
  }
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = {
      eventName: (form.elements.namedItem('eventName') as HTMLInputElement).value,
      eventSlug: (form.elements.namedItem('eventSlug') as HTMLInputElement).value,
      eventDate: (form.elements.namedItem('eventDate') as HTMLInputElement).value,
      startTime: (form.elements.namedItem('startTime') as HTMLInputElement).value,
      endTime: (form.elements.namedItem('endTime') as HTMLInputElement).value,
      locationName: (form.elements.namedItem('locationName') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      rsvpLink: (form.elements.namedItem('rsvpLink') as HTMLInputElement).value,
      surveyLink: (form.elements.namedItem('surveyLink') as HTMLInputElement).value,
      facebookEventLink: (form.elements.namedItem('facebookEventLink') as HTMLInputElement).value,
      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
    }

    const url = event ? `/api/admin/events/${event.id}` : '/api/admin/events'
    const method = event ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const result = await res.json()
      router.push(`/admin/events/${result.id}`)
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to save event')
    }
    setLoading(false)
  }

  const slugify = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-400 mb-1.5">Event Name *</label>
          <input
            name="eventName"
            required
            defaultValue={event?.eventName}
            onChange={(e) => {
              const slugInput = document.querySelector<HTMLInputElement>('[name="eventSlug"]')
              if (slugInput && !event) slugInput.value = slugify(e.target.value)
            }}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="LINK'D UP Vol. 1"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Event Slug *</label>
          <input name="eventSlug" required defaultValue={event?.eventSlug}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="linkdup-vol-1" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Status</label>
          <select name="status" defaultValue={event?.status || 'draft'}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500">
            <option value="draft">Draft</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Event Date *</label>
          <input type="date" name="eventDate" required defaultValue={event ? formatDateForInput(event.eventDate) : ''}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Start Time *</label>
            <input name="startTime" required defaultValue={event?.startTime} placeholder="7:00 PM"
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">End Time *</label>
            <input name="endTime" required defaultValue={event?.endTime} placeholder="10:00 PM"
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Venue Name *</label>
          <input name="locationName" required defaultValue={event?.locationName} placeholder="The Venue Tampa"
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-400 mb-1.5">Address *</label>
          <input name="address" required defaultValue={event?.address} placeholder="123 Main St, Tampa, FL 33602"
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
          <textarea name="description" rows={3} defaultValue={event?.description || ''}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 resize-none"
            placeholder="Describe the event…" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">RSVP Page URL</label>
          <input name="rsvpLink" type="url" defaultValue={event?.rsvpLink || ''}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="https://linkdup.club/rsvp/…" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Survey URL</label>
          <input name="surveyLink" type="url" defaultValue={event?.surveyLink || ''}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="https://…" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-400 mb-1.5">Facebook Event URL</label>
          <input name="facebookEventLink" type="url" defaultValue={event?.facebookEventLink || ''}
            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
            placeholder="https://facebook.com/events/…" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60">
          {loading ? 'Saving…' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}
