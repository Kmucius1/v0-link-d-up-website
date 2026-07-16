export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendSurveyThankYou } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      contactId: providedContactId,
      firstName,
      lastName,
      email,
      eventId,
      surveyTitle,
      answers,
      rating,
      interestTags,
      keyFeedback,
      suggestedFollowUp,
    } = body

    if (!providedContactId && !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!surveyTitle || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let contactId = providedContactId as string | undefined

    if (!contactId) {
      const normalizedEmail = (email as string).toLowerCase().trim()
      const { data: existingContact } = await supabaseAdmin
        .from('contacts')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle()

      if (existingContact) {
        contactId = existingContact.id
        await supabaseAdmin
          .from('contacts')
          .update({
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            fullName: firstName ? `${firstName} ${lastName || ''}`.trim() : undefined,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', contactId)
      } else {
        const { data: newContact, error: createError } = await supabaseAdmin
          .from('contacts')
          .insert({
            id: crypto.randomUUID(),
            firstName: firstName || '',
            lastName: lastName || '',
            fullName: `${firstName || ''} ${lastName || ''}`.trim() || normalizedEmail,
            email: normalizedEmail,
            consentToEmail: true,
            contactSource: 'survey',
          })
          .select('id')
          .single()
        if (createError || !newContact) {
          return NextResponse.json({ error: createError?.message || 'Failed to create contact' }, { status: 500 })
        }
        contactId = newContact.id
      }
    }

    const [surveyResult, contactResult] = await Promise.all([
      supabaseAdmin
        .from('survey_responses')
        .insert({
          id: crypto.randomUUID(),
          contactId,
          eventId: eventId || null,
          surveyTitle,
          answersJson: answers,
          rating: rating || null,
          interestTags: interestTags || [],
          keyFeedback: keyFeedback || null,
          suggestedFollowUp: suggestedFollowUp || null,
        })
        .select()
        .single(),
      supabaseAdmin
        .from('contacts')
        .update({ lastSurveyAt: new Date().toISOString() })
        .eq('id', contactId),
    ])

    if (surveyResult.error) return NextResponse.json({ error: surveyResult.error.message }, { status: 500 })
    if (contactResult.error) return NextResponse.json({ error: contactResult.error.message }, { status: 500 })

    const [{ data: contact }, { data: event }] = await Promise.all([
      supabaseAdmin.from('contacts').select('email, firstName, consentToEmail, unsubscribed').eq('id', contactId).single(),
      eventId
        ? supabaseAdmin.from('events').select('eventName').eq('id', eventId).single()
        : Promise.resolve({ data: null }),
    ])

    if (contact && contact.consentToEmail && !contact.unsubscribed) {
      try {
        const { error: sendError } = await sendSurveyThankYou({
          to: contact.email,
          name: contact.firstName,
          eventName: event?.eventName,
        })
        if (sendError) throw new Error(sendError.message)

        await supabaseAdmin.from('email_logs').insert({
          id: crypto.randomUUID(),
          contactId,
          eventId: eventId || null,
          emailType: 'survey_thank_you',
          subject: 'Thank you! — LINK\'D UP',
          status: 'sent',
        })
      } catch (sendErr) {
        await supabaseAdmin.from('email_logs').insert({
          id: crypto.randomUUID(),
          contactId,
          eventId: eventId || null,
          emailType: 'survey_thank_you',
          subject: 'Thank you! — LINK\'D UP',
          status: 'failed',
          errorMessage: sendErr instanceof Error ? sendErr.message : 'Email delivery failed',
        })
      }
    }

    return NextResponse.json(surveyResult.data, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Survey submission failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
