export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      contactId,
      eventId,
      surveyTitle,
      answers,
      rating,
      interestTags,
      keyFeedback,
      suggestedFollowUp,
    } = body

    if (!contactId || !surveyTitle || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    return NextResponse.json(surveyResult.data, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Survey submission failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
