export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sendCampaign } from '@/lib/campaign-send'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const result = await sendCampaign(id)
    return NextResponse.json({ ok: true, ...result })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send campaign'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
