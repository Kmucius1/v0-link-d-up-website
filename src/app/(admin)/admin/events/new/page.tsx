import { EventForm } from '@/components/admin/EventForm'

export default function NewEventPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">New Event</h1>
      <EventForm />
    </div>
  )
}
