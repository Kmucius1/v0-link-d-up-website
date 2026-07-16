import webpush from 'web-push'
import { supabaseAdmin } from './supabase-admin'

let configured = false

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || ''

function ensureConfigured() {
  if (configured) return true
  const publicKey = VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY || ''
  if (!publicKey || !privateKey) return false
  const subject = process.env.VAPID_SUBJECT || 'mailto:hello@linkdup.club'
  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
  return true
}

export type PushPayload = {
  title: string
  body: string
  url?: string
  icon?: string
  tag?: string
}

/**
 * Send a push notification to every stored subscription (optionally filtered to
 * one member). Prunes dead subscriptions (404/410). Returns a delivery summary.
 */
export async function broadcastPush(
  payload: PushPayload,
  opts: { memberId?: string } = {}
): Promise<{ sent: number; failed: number; total: number; skipped?: string }> {
  if (!ensureConfigured()) {
    return { sent: 0, failed: 0, total: 0, skipped: 'VAPID keys not configured' }
  }

  let query = supabaseAdmin.from('push_subscriptions').select('*')
  if (opts.memberId) query = query.eq('memberId', opts.memberId)
  const { data: subs } = await query
  if (!subs || subs.length === 0) return { sent: 0, failed: 0, total: 0 }

  const body = JSON.stringify(payload)
  let sent = 0
  let failed = 0
  const dead: string[] = []

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          body
        )
        sent++
      } catch (err: unknown) {
        failed++
        const statusCode = (err as { statusCode?: number })?.statusCode
        if (statusCode === 404 || statusCode === 410) dead.push(s.endpoint)
      }
    })
  )

  if (dead.length) {
    await supabaseAdmin.from('push_subscriptions').delete().in('endpoint', dead)
  }

  return { sent, failed, total: subs.length }
}
