import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EventForm } from '@/components/admin/EventForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/admin/events/${id}`} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Event</h1>
      </div>
      <EventForm event={event} />
    </div>
  )
}
