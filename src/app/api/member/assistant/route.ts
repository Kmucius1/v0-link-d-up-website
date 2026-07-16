export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'

// Cheapest-first: free models first, then a near-free ($0.01/M) reliable last
// resort so the assistant always answers even when free tiers are rate-limited.
// Override the primary with OPENROUTER_MODEL.
const MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free'
const FALLBACK_MODELS = [...new Set([
  MODEL,
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'inclusionai/ling-2.6-flash', // paid but ~$0.01/M in — effectively free, always available
])]

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'The assistant isn’t configured yet (missing OpenRouter key).' },
      { status: 503 }
    )
  }

  let messages: Msg[] = []
  try {
    const body = await req.json()
    messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const system: Msg = {
    role: 'system',
    content: `You are LINQ, the friendly personal assistant inside the LINK'D UP app — a community for creators, entrepreneurs, artists and business owners (Clearwater / Tampa Bay area).
You're talking to ${member.fullName}${member.businessName ? ` from ${member.businessName}` : ''}${member.roleOrIndustry ? ` (${member.roleOrIndustry})` : ''}.
Help them grow their business, network, use AI tools, create content, and take their next best step.
Be warm, direct, and practical. Keep answers short and skimmable — use tight bullet points or 2-4 sentences. No fluff. Give specific, doable actions. If they ask something off-topic, help briefly and steer back to growth.`,
  }

  const payload = (model: string) => ({
    model,
    messages: [system, ...messages],
    temperature: 0.7,
    max_tokens: 700,
  })

  let lastErr = ''
  for (const model of FALLBACK_MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://linkdup.club',
          'X-Title': "LINK'D UP",
        },
        body: JSON.stringify(payload(model)),
      })
      if (!res.ok) {
        lastErr = `${res.status} ${await res.text().catch(() => '')}`.slice(0, 200)
        // 429/402 → try next free model
        if (res.status === 429 || res.status === 402 || res.status === 404) continue
        break
      }
      const data = await res.json()
      const reply: string = data?.choices?.[0]?.message?.content?.trim() || ''
      if (reply) return NextResponse.json({ reply, model })
      lastErr = 'Empty response'
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e)
    }
  }

  console.error('[assistant]', lastErr)
  return NextResponse.json(
    { error: 'The assistant is busy right now — try again in a moment.' },
    { status: 502 }
  )
}
