export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { APP_URL } from '@/lib/resend'

const GRAPH = 'https://graph.facebook.com/v21.0'

export async function GET(req: NextRequest) {
  const admin = await requireAdminAuth()

  const code = req.nextUrl.searchParams.get('code')
  const oauthError = req.nextUrl.searchParams.get('error_description')
  if (oauthError) {
    return NextResponse.redirect(`${APP_URL}/admin/social?error=${encodeURIComponent(oauthError)}`)
  }
  if (!code) {
    return NextResponse.redirect(`${APP_URL}/admin/social?error=Missing+authorization+code`)
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) {
    return NextResponse.redirect(`${APP_URL}/admin/social?error=Meta+app+not+configured`)
  }

  try {
    const redirectUri = `${APP_URL}/api/admin/social/callback`

    // 1. Exchange code for a short-lived user access token
    const tokenRes = await fetch(
      `${GRAPH}/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    )
    const tokenData = await tokenRes.json()
    if (tokenData.error) throw new Error(tokenData.error.message)
    const shortLivedToken = tokenData.access_token as string

    // 2. Exchange for a long-lived user access token (~60 days)
    const longLivedRes = await fetch(
      `${GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
    )
    const longLivedData = await longLivedRes.json()
    if (longLivedData.error) throw new Error(longLivedData.error.message)
    const longLivedToken = longLivedData.access_token as string
    const expiresInSeconds = longLivedData.expires_in as number | undefined

    // 3. List Pages this user manages, with their Page Access Tokens
    const pagesRes = await fetch(
      `${GRAPH}/me/accounts?fields=id,name,access_token,link&access_token=${longLivedToken}`
    )
    const pagesData = await pagesRes.json()
    if (pagesData.error) throw new Error(pagesData.error.message)
    const pages = (pagesData.data || []) as { id: string; name: string; access_token: string; link?: string }[]

    if (pages.length === 0) {
      return NextResponse.redirect(`${APP_URL}/admin/social?error=No+Facebook+Pages+found+for+this+account`)
    }

    const target =
      pages.find((p) => p.name.toLowerCase().includes('linkdup') || p.link?.toLowerCase().includes('linkdupnetwork')) ||
      (pages.length === 1 ? pages[0] : null)

    if (!target) {
      const names = pages.map((p) => p.name).join(', ')
      return NextResponse.redirect(`${APP_URL}/admin/social?error=${encodeURIComponent(`Couldn't find Linkdupnetwork among your pages: ${names}`)}`)
    }

    // 4. Look up the linked Instagram Business Account, if any
    const igRes = await fetch(
      `${GRAPH}/${target.id}?fields=instagram_business_account{id,username}&access_token=${target.access_token}`
    )
    const igData = await igRes.json()
    const igAccount = igData.instagram_business_account as { id: string; username: string } | undefined

    const expiresAt = expiresInSeconds ? new Date(Date.now() + expiresInSeconds * 1000).toISOString() : null

    // Replace any existing connection with this fresh one
    await supabaseAdmin.from('social_connections').delete().neq('id', '')
    await supabaseAdmin.from('social_connections').insert({
      id: crypto.randomUUID(),
      platform: 'facebook',
      pageId: target.id,
      pageName: target.name,
      pageAccessToken: target.access_token,
      igBusinessId: igAccount?.id || null,
      igUsername: igAccount?.username || null,
      connectedAt: new Date().toISOString(),
      expiresAt,
      connectedBy: admin.email,
    })

    return NextResponse.redirect(`${APP_URL}/admin/social?connected=1`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Connection failed'
    return NextResponse.redirect(`${APP_URL}/admin/social?error=${encodeURIComponent(msg)}`)
  }
}
