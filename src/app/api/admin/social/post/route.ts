export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

const GRAPH = 'https://graph.facebook.com/v21.0'

export async function POST(req: NextRequest) {
  await requireAdminAuth()

  const { message, imageUrl, platforms } = await req.json()
  if (!message && !imageUrl) {
    return NextResponse.json({ error: 'A message or image is required' }, { status: 400 })
  }
  const targets: string[] = Array.isArray(platforms) && platforms.length ? platforms : ['facebook']

  const { data: connection } = await supabaseAdmin
    .from('social_connections')
    .select('*')
    .order('connectedAt', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!connection) {
    return NextResponse.json({ error: 'No connected Facebook/Instagram account. Connect it first.' }, { status: 400 })
  }

  const results: Record<string, { ok: boolean; error?: string; permalink?: string }> = {}

  if (targets.includes('facebook')) {
    try {
      const endpoint = imageUrl
        ? `${GRAPH}/${connection.pageId}/photos`
        : `${GRAPH}/${connection.pageId}/feed`
      const body = imageUrl
        ? { url: imageUrl, caption: message || '', access_token: connection.pageAccessToken }
        : { message, access_token: connection.pageAccessToken }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      const postId = data.post_id || data.id
      const permalink = `https://www.facebook.com/${postId}`
      await supabaseAdmin.from('social_posts').insert({
        id: crypto.randomUUID(),
        platform: 'facebook',
        message: message || null,
        imageUrl: imageUrl || null,
        status: 'sent',
        externalPostId: postId,
        permalink,
        postedAt: new Date().toISOString(),
      })
      results.facebook = { ok: true, permalink }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Facebook post failed'
      await supabaseAdmin.from('social_posts').insert({
        id: crypto.randomUUID(),
        platform: 'facebook',
        message: message || null,
        imageUrl: imageUrl || null,
        status: 'failed',
        errorMessage,
      })
      results.facebook = { ok: false, error: errorMessage }
    }
  }

  if (targets.includes('instagram')) {
    if (!connection.igBusinessId) {
      results.instagram = { ok: false, error: 'No Instagram Business account linked to this Page' }
    } else if (!imageUrl) {
      results.instagram = { ok: false, error: 'Instagram requires an image' }
    } else {
      try {
        const containerRes = await fetch(`${GRAPH}/${connection.igBusinessId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imageUrl,
            caption: message || '',
            access_token: connection.pageAccessToken,
          }),
        })
        const containerData = await containerRes.json()
        if (containerData.error) throw new Error(containerData.error.message)

        const publishRes = await fetch(`${GRAPH}/${connection.igBusinessId}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: connection.pageAccessToken,
          }),
        })
        const publishData = await publishRes.json()
        if (publishData.error) throw new Error(publishData.error.message)

        await supabaseAdmin.from('social_posts').insert({
          id: crypto.randomUUID(),
          platform: 'instagram',
          message: message || null,
          imageUrl,
          status: 'sent',
          externalPostId: publishData.id,
          postedAt: new Date().toISOString(),
        })
        results.instagram = { ok: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Instagram post failed'
        await supabaseAdmin.from('social_posts').insert({
          id: crypto.randomUUID(),
          platform: 'instagram',
          message: message || null,
          imageUrl,
          status: 'failed',
          errorMessage,
        })
        results.instagram = { ok: false, error: errorMessage }
      }
    }
  }

  return NextResponse.json({ ok: true, results })
}
