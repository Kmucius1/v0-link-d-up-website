export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
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

    // Fetch event
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    if (eventError || !event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    // Upsert contact — deduplicate by email
    const normalizedEmail = email.toLowerCase().trim()
    const { data: existingContact } = await supabaseAdmin
      .from('contacts')
      .select('id, consentToEmail')
      .eq('email', normalizedEmail)
      .maybeSingle()

    let contact
    if (existingContact) {
      const updateFields: Record<string, unknown> = {
        firstName,
        lastName,
        fullName,
        lastRsvpAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      if (phone) updateFields.phone = phone
      if (businessName) updateFields.businessName = businessName
      if (roleOrIndustry) updateFields.roleOrIndustry = roleOrIndustry
      if (instagram) updateFields.instagram = instagram
      if (linkedin) updateFields.linkedin = linkedin
      if (website) updateFields.website = website
      if (city) updateFields.city = city
      if (consentToEmail != null) updateFields.consentToEmail = consentToEmail

      const { data, error } = await supabaseAdmin
        .from('contacts')
        .update(updateFields)
        .eq('id', existingContact.id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      contact = data
    } else {
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .insert({
          id: crypto.randomUUID(),
          firstName,
          lastName,
          fullName,
          email: normalizedEmail,
          phone: phone || null,
          businessName: businessName || null,
          roleOrIndustry: roleOrIndustry || null,
          instagram: instagram || null,
          linkedin: linkedin || null,
          website: website || null,
          city: city || null,
          consentToEmail: consentToEmail ?? false,
          contactSource: source || 'website',
          lastRsvpAt: new Date().toISOString(),
        })
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      contact = data
    }

    // Upsert RSVP
    const { data: existingRsvp } = await supabaseAdmin
      .from('rsvps')
      .select('id')
      .eq('contactId', contact.id)
      .eq('eventId', eventId)
      .maybeSingle()

    let rsvp
    if (existingRsvp) {
      const rsvpUpdate: Record<string, unknown> = {
        rsvpStatus: 'confirmed',
        numberOfGuests: numberOfGuests || 1,
        updatedAt: new Date().toISOString(),
      }
      if (howDidYouHear) rsvpUpdate.howDidYouHear = howDidYouHear

      const { data, error } = await supabaseAdmin
        .from('rsvps')
        .update(rsvpUpdate)
        .eq('id', existingRsvp.id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      rsvp = data
    } else {
      const { data, error } = await supabaseAdmin
        .from('rsvps')
        .insert({
          id: crypto.randomUUID(),
          contactId: contact.id,
          eventId,
          rsvpStatus: 'confirmed',
          numberOfGuests: numberOfGuests || 1,
          howDidYouHear: howDidYouHear || null,
        })
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      rsvp = data
    }

    // Send confirmation email
    if (contact.consentToEmail || consentToEmail) {
      try {
        const { error: sendError } = await sendRsvpConfirmation({
          to: contact.email,
          name: firstName,
          eventName: event.eventName,
          eventDate: format(event.eventDate, 'EEEE, MMMM d, yyyy'),
          eventTime: `${event.startTime} – ${event.endTime}`,
          locationName: event.locationName,
          address: event.address,
        })
        if (sendError) throw new Error(sendError.message)

        await supabaseAdmin.from('email_logs').insert({
          id: crypto.randomUUID(),
          contactId: contact.id,
          eventId,
          emailType: 'confirmation',
          subject: `You're confirmed for ${event.eventName} — LINK'D UP`,
          status: 'sent',
        })
      } catch (sendErr) {
        await supabaseAdmin.from('email_logs').insert({
          id: crypto.randomUUID(),
          contactId: contact.id,
          eventId,
          emailType: 'confirmation',
          subject: `You're confirmed for ${event.eventName} — LINK'D UP`,
          status: 'failed',
          errorMessage: sendErr instanceof Error ? sendErr.message : 'Email delivery failed',
        })
      }
    }

    return NextResponse.json({ contact, rsvp }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'RSVP failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
