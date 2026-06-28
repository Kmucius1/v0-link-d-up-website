export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  const url = process.env.POSTGRES_PRISMA_URL ?? ''
  if (!url) return NextResponse.json({ error: 'no POSTGRES_PRISMA_URL' })
  const stripped = url
    .replace(/[?&]sslmode=[^&]*/g, '')
    .replace(/[?&]pgbouncer=[^&]*/g, '')
    .replace(/&&+/g, '&').replace(/\?&/, '?').replace(/[?&]$/, '')
  const pool = new Pool({ connectionString: stripped, ssl: { rejectUnauthorized: false }, max: 1, connectionTimeoutMillis: 8000 })
  try {
    const { rows } = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
    return NextResponse.json({ ok: true, tables: rows.map((r: { tablename: string }) => r.tablename) })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) })
  } finally {
    await pool.end()
  }
}
