export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { APP_URL } from '@/lib/resend'

const SCOPES = [
  'pages_show_list',
  'pages_manage_posts',
  'pages_read_engagement',
  'business_management',
  'instagram_basic',
  'instagram_content_publish',
].join(',')

export async function GET() {
  await requireAdminAuth()

  const appId = process.env.META_APP_ID
  if (!appId) {
    return NextResponse.json({ error: 'META_APP_ID is not configured' }, { status: 500 })
  }

  const redirectUri = `${APP_URL}/api/admin/social/callback`
  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${SCOPES}&response_type=code`

  return NextResponse.redirect(authUrl)
}
