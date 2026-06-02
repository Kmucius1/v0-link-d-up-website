export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRsvpConfirmation } from '@/lib/email'
import { format } from 'date-fns'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      businessName,
      roleOrIndustry,
      instagram,
      linkedin,
      website,
      city,
      consentToEmail,
      howDidYouHear,
      numberOfGuests,
      eventId,
      source,
    } = body

    if (!email || !firstName || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fullName = `${firstName} ${lastName}`.trim()

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    // Upsert contact — deduplicate by email
    const contact = await prisma.contact.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        firstName,
        lastName,
        fullName,
        phone: phone || undefined,
        businessName: businessName || undefined,
        roleOrIndustry: roleOrIndustry || undefined,
        instagram: instagram || undefined,
        linkedin: linkedin || undefined,
        website: website || undefined,
        city: city || undefined,
        consentToEmail: consentToEmail ?? undefined,
        lastRsvpAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        firstName,
        lastName,
        fullName,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        businessName: businessName || null,
        roleOrIndustry: roleOrIndustry || null,
        instagram: instagram || null,
        linkedin: linkedin || null,
        website: website || null,
        city: city || null,
        consentToEmail: consentToEmail ?? false,
        contactSource: source || 'website',
        lastRsvpAt: new Date(),
      },
    })

    // Upsert RSVP
    const rsvp = await prisma.rsvp.upsert({
      where: { contactId_eventId: { contactId: contact.id, eventId } },
      update: {
        rsvpStatus: 'confirmed',
        numberOfGuests: numberOfGuests || 1,
        howDidYouHear: howDidYouHear || undefined,
        updatedAt: new Date(),
      },
      create: {
        contactId: contact.id,
        eventId,
        rsvpStatus: 'confirmed',
        numberOfGuests: numberOfGuests || 1,
        howDidYouHear: howDidYouHear || null,
      },
    })

    // Send confirmation email
    if (contact.consentToEmail || consentToEmail) {
      try {
        await sendRsvpConfirmation({
          to: contact.email,
          name: firstName,
          eventName: event.eventName,
          eventDate: format(event.eventDate, 'EEEE, MMMM d, yyyy'),
          eventTime: `${event.startTime} – ${event.endTime}`,
          locationName: event.locationName,
          address: event.address,
        })

        await prisma.emailLog.create({
          data: {
            contactId: contact.id,
            eventId,
            emailType: 'confirmation',
            subject: `You're confirmed for ${event.eventName} — LINK'D UP`,
            status: 'sent',
          },
        })
      } catch {
        await prisma.emailLog.create({
          data: {
            contactId: contact.id,
            eventId,
            emailType: 'confirmation',
            subject: `You're confirmed for ${event.eventName} — LINK'D UP`,
            status: 'failed',
            errorMessage: 'Email delivery failed',
          },
        })
      }
    }

    return NextResponse.json({ contact, rsvp }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'RSVP failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}