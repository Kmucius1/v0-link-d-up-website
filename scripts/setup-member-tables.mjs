/**
 * Creates the member-app tables (members, posts, comments, likes, updates,
 * push_subscriptions), a public storage bucket for photo uploads, and seeds a
 * few starter updates.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." \
 *   SUPABASE_URL="https://xxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." \
 *   node scripts/setup-member-tables.mjs
 *
 * Safe to re-run — everything uses IF NOT EXISTS.
 */
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'

// Load .env.local (simple parser — no dotenv dependency required).
try {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
  }
} catch {
  /* ignore */
}

const raw =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  ''

if (!raw) {
  console.error('✗ No DATABASE_URL / POSTGRES_PRISMA_URL found in env.')
  process.exit(1)
}

const connectionString = raw
  .replace(/[?&]sslmode=[^&]*/g, '')
  .replace(/[?&]pgbouncer=[^&]*/g, '')
  .replace(/[?&]connection_limit=[^&]*/g, '')
  .replace(/&&+/g, '&')
  .replace(/\?&/, '?')
  .replace(/[?&]$/, '')

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 2 })

const DDL = `
CREATE TABLE IF NOT EXISTS "members" (
  "id" text PRIMARY KEY,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "firstName" text NOT NULL,
  "lastName" text,
  "fullName" text NOT NULL,
  "businessName" text,
  "roleOrIndustry" text,
  "city" text,
  "instagram" text,
  "website" text,
  "bio" text,
  "avatarUrl" text,
  "contactId" text,
  "status" text NOT NULL DEFAULT 'active',
  "role" text NOT NULL DEFAULT 'member',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "lastSeenAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "posts" (
  "id" text PRIMARY KEY,
  "memberId" text NOT NULL,
  "body" text NOT NULL DEFAULT '',
  "imageUrl" text,
  "kind" text NOT NULL DEFAULT 'update',
  "city" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "posts_createdAt_idx" ON "posts" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "posts_memberId_idx" ON "posts" ("memberId");

CREATE TABLE IF NOT EXISTS "post_comments" (
  "id" text PRIMARY KEY,
  "postId" text NOT NULL,
  "memberId" text NOT NULL,
  "body" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "post_comments_postId_idx" ON "post_comments" ("postId");

CREATE TABLE IF NOT EXISTS "post_likes" (
  "id" text PRIMARY KEY,
  "postId" text NOT NULL,
  "memberId" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "post_likes_postId_memberId_key" ON "post_likes" ("postId", "memberId");

CREATE TABLE IF NOT EXISTS "updates" (
  "id" text PRIMARY KEY,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "category" text NOT NULL DEFAULT 'ai',
  "link" text,
  "imageUrl" text,
  "pinned" boolean NOT NULL DEFAULT false,
  "published" boolean NOT NULL DEFAULT true,
  "createdBy" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "updates_createdAt_idx" ON "updates" ("createdAt" DESC);

CREATE TABLE IF NOT EXISTS "push_subscriptions" (
  "id" text PRIMARY KEY,
  "memberId" text,
  "endpoint" text UNIQUE NOT NULL,
  "p256dh" text NOT NULL,
  "auth" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
`

const SEED_UPDATES = [
  {
    title: 'Welcome to the LINK’D UP app 🎉',
    body: "You're in. This is your home base — the Growth Circle to post about your business and find collaborators, plus AI & growth drops to keep you ahead. Turn on notifications so you never miss a room.",
    category: 'announcement',
    pinned: true,
  },
  {
    title: '3 AI tools every creator should be using this month',
    body: "1) A transcription tool to turn every voice note into content. 2) An AI image editor for fast thumbnails. 3) A scheduling assistant that drafts your captions. Start with one, master it, then stack.",
    category: 'ai',
    pinned: false,
  },
  {
    title: 'The one post that fills every room',
    body: "Don't just say 'come to the event.' Post the ONE person you want in the room and why. Specific invites convert. Try it in the Growth Circle today.",
    category: 'growth',
    pinned: false,
  },
]

async function run() {
  console.log('→ Creating member-app tables…')
  await pool.query(DDL)
  console.log('✓ Tables ready.')

  // Seed updates only if empty
  const { rows } = await pool.query('SELECT count(*)::int AS c FROM "updates"')
  if (rows[0].c === 0) {
    for (const u of SEED_UPDATES) {
      await pool.query(
        `INSERT INTO "updates" ("id","title","body","category","pinned","published","createdAt","updatedAt")
         VALUES ($1,$2,$3,$4,$5,true,now(),now())`,
        [crypto.randomUUID(), u.title, u.body, u.category, u.pinned]
      )
    }
    console.log(`✓ Seeded ${SEED_UPDATES.length} starter updates.`)
  } else {
    console.log(`• Updates already exist (${rows[0].c}) — skipping seed.`)
  }

  await pool.end()

  // Create the public storage bucket for member photo uploads.
  const supaUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.MEMBER_UPLOAD_BUCKET || 'member-uploads'
  if (supaUrl && supaKey) {
    const supabase = createClient(supaUrl, supaKey, { auth: { persistSession: false } })
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: '8MB',
    })
    if (error && !/already exists/i.test(error.message)) {
      console.warn(`! Could not create bucket "${bucket}": ${error.message}`)
    } else {
      console.log(`✓ Storage bucket "${bucket}" ready (public).`)
    }
  } else {
    console.log('• Skipped bucket creation (no SUPABASE_URL / SERVICE_ROLE_KEY in env).')
  }

  console.log('\n✅ Member app database setup complete.')
}

run().catch((e) => {
  console.error('✗ Setup failed:', e.message)
  process.exit(1)
})
