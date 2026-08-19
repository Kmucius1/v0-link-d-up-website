export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

const BUCKET = process.env.MEMBER_UPLOAD_BUCKET || 'member-uploads'
const MAX_IMAGE_BYTES = 15 * 1024 * 1024
const MAX_VIDEO_BYTES = 45 * 1024 * 1024 // stays under the project's 50MB storage cap
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']

/**
 * Issues a Supabase signed upload URL so media goes straight from the browser
 * to storage — routing bytes through a normal POST body here would hit
 * Vercel's ~4.5MB function payload limit long before a real photo or video does.
 */
export async function POST(req: NextRequest) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  try {
    const { filename, contentType, size } = await req.json()
    const isImage = ALLOWED_IMAGE_TYPES.includes(contentType)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType)
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 })
    }
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (typeof size === 'number' && size > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? 'Video is too large (45MB max).' : 'Image is too large (15MB max).' },
        { status: 400 }
      )
    }

    const ext = (String(filename).split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
    const path = `posts/${member.id}/${crypto.randomUUID()}.${ext}`

    const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path)
    if (error || !data) {
      console.error('[member/upload/sign]', error?.message)
      return NextResponse.json({ error: 'Could not prepare upload.' }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({
      ok: true,
      bucket: BUCKET,
      path: data.path,
      token: data.token,
      publicUrl: publicUrlData.publicUrl,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[member/upload/sign]', msg)
    return NextResponse.json({ error: 'Could not prepare upload.' }, { status: 500 })
  }
}
