export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

async function tryPool(label: string, config: object) {
  const pool = new Pool({ ...config, max: 1, connectionTimeoutMillis: 8000 })
  try {
    const { rows } = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
    return { label, ok: true, tables: rows.map((r: { tablename: string }) => r.tablename) }
  } catch (e) {
    return { label, ok: false, error: e instanceof Error ? e.message : String(e) }
  } finally {
    await pool.end().catch(() => {})
  }
}

export async function GET() {
  const results = await Promise.all([
    // Test 1: Vercel pooler URL (tocqldotbvpbfbnfnagx) — stripped
    tryPool('POSTGRES_PRISMA_URL-stripped', {
      connectionString: (process.env.POSTGRES_PRISMA_URL ?? '').replace(/[?&]sslmode=[^&]*/g,'').replace(/[?&]pgbouncer=[^&]*/g,'').replace(/&&+/g,'&').replace(/\?&/,'?').replace(/[?&]$/,''),
      ssl: { rejectUnauthorized: false },
    }),
    // Test 2: Direct host for tocqldotbvpbfbnfnagx
    tryPool('POSTGRES_HOST-direct', {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      port: 5432,
      ssl: { rejectUnauthorized: false },
    }),
    // Test 3: vrpgfglndmgpbyfljmyn direct
    tryPool('vrpg-direct', {
      host: 'db.vrpgfglndmgpbyfljmyn.supabase.co',
      user: 'postgres',
      password: process.env.VRPG_PW ?? 'Drypmoneytime123',
      database: 'postgres',
      port: 5432,
      ssl: { rejectUnauthorized: false },
    }),
  ])
  return NextResponse.json(results)
}
