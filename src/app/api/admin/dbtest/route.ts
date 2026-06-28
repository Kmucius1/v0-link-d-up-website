export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

async function tryHttps(label: string, url: string) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
    return { label, ok: true, status: r.status }
  } catch (e) {
    return { label, ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export async function GET() {
  const results = await Promise.all([
    tryHttps('vrpg-rest-api', 'https://vrpgfglndmgpbyfljmyn.supabase.co/rest/v1/'),
    tryHttps('zemilocs-rest-api', 'https://fkpxkucqxkcooqmpjlub.supabase.co/rest/v1/'),
    tryHttps('tock-rest-api', 'https://tocqldotbvpbfbnfnagx.supabase.co/rest/v1/'),
  ])
  return NextResponse.json(results)
}
