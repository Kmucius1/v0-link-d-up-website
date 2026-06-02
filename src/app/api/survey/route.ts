import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const [survey] = await Promise.all([
      prisma.surveyResponse.create({
        data: {
          contactId,
          eventId: eventId || null,
          surveyTitle,
          answersJson: answers,
          rating: rating || null,
          interestTags: interestTags || [],
          keyFeedback: keyFeedback || null,
          suggestedFollowUp: suggestedFollowUp || null,
        },
      }),
      prisma.contact.update({
        where: { id: contactId },
        data: { lastSurveyAt: new Date() },
      }),
    ])

    return NextResponse.json(survey, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Survey submission failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
