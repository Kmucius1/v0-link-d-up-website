import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ContactDetail } from '@/components/admin/ContactDetail'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      rsvps: {
        include: { event: true },
        orderBy: { createdAt: 'desc' },
      },
      surveyResponses: {
        include: { event: true },
        orderBy: { submittedAt: 'desc' },
      },
      emailLogs: {
        include: { event: true },
        orderBy: { sentAt: 'desc' },
      },
      notes: { orderBy: { createdAt: 'desc' } },
      tags: true,
      opportunities: {
        include: { event: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!contact) notFound()

  return <ContactDetail contact={contact} />
}
