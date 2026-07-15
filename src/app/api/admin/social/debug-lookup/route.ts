export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'META_APP_ID or META_APP_SECRET missing at runtime' }, { status: 500 })
  }
  const res = await fetch(
    `https://graph.facebook.com/Linkdupnetwork?fields=id,name,link,fan_count&access_token=${appId}|${appSecret}`
  )
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
