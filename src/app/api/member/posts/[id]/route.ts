export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMember } from '@/lib/member-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

const VALID_KINDS = ['update', 'ask', 'offer']
const VALID_MEDIA_TYPES = ['image', 'video']
const VALID_ASPECT_RATIOS = ['square', 'portrait', 'landscape', 'story']

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params

  const { data: post } = await supabaseAdmin.from('posts').select('*').eq('id', postId).maybeSingle()
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

  const [{ data: author }, { count: likeCount }, { count: commentCount }, { data: myLike }, { data: mySave }, { data: connection }] = await Promise.all([
    supabaseAdmin
      .from('members')
      .select('id, firstName, fullName, businessName, roleOrIndustry, instagram, avatarUrl, avatarPositionX, avatarPositionY')
      .eq('id', post.memberId)
      .maybeSingle(),
    supabaseAdmin.from('post_likes').select('id', { count: 'exact', head: true }).eq('postId', postId),
    supabaseAdmin.from('post_comments').select('id', { count: 'exact', head: true }).eq('postId', postId),
    supabaseAdmin.from('post_likes').select('id').eq('postId', postId).eq('memberId', member.id).maybeSingle(),
    supabaseAdmin.from('post_saves').select('id').eq('postId', postId).eq('memberId', member.id).maybeSingle(),
    post.memberId !== member.id
      ? supabaseAdmin
          .from('connections')
          .select('id, requesterId, recipientId, status')
          .or(`and(requesterId.eq.${member.id},recipientId.eq.${post.memberId}),and(requesterId.eq.${post.memberId},recipientId.eq.${member.id})`)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const connectionStatus = !connection
    ? 'none'
    : connection.status === 'accepted'
      ? 'accepted'
      : connection.requesterId === member.id
        ? 'pending_sent'
        : 'pending_received'

  return NextResponse.json({
    post: {
      ...post,
      author: author ? { ...author, connectionId: connection?.id ?? null, connectionStatus } : null,
      likeCount: likeCount ?? 0,
      commentCount: commentCount ?? 0,
      likedByMe: Boolean(myLike),
      savedByMe: Boolean(mySave),
      mine: post.memberId === member.id,
    },
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params

  const { data: post } = await supabaseAdmin.from('posts').select('id, memberId, body, imageUrl').eq('id', postId).maybeSingle()
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  if (post.memberId !== member.id) return NextResponse.json({ error: 'Not allowed.' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const text = typeof body.body === 'string' ? body.body.trim() : undefined
  const kind = VALID_KINDS.includes(body.kind) ? body.kind : undefined
  const hasImageField = Object.prototype.hasOwnProperty.call(body, 'imageUrl')
  const imageUrl = hasImageField ? (typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : null) : undefined
  const mediaType = VALID_MEDIA_TYPES.includes(body.mediaType) ? body.mediaType : undefined
  const aspectRatio = VALID_ASPECT_RATIOS.includes(body.aspectRatio) ? body.aspectRatio : undefined

  if (text !== undefined && text.length > 2000) {
    return NextResponse.json({ error: 'Post is too long (2000 char max).' }, { status: 400 })
  }
  const resultingText = text !== undefined ? text : post.body
  const resultingImage = imageUrl !== undefined ? imageUrl : post.imageUrl
  if (!resultingText && !resultingImage) {
    return NextResponse.json({ error: 'Post needs text or a photo/video.' }, { status: 400 })
  }

  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (text !== undefined) update.body = text
  if (kind !== undefined) update.kind = kind
  if (imageUrl !== undefined) update.imageUrl = imageUrl
  if (mediaType !== undefined) update.mediaType = imageUrl === null ? 'image' : mediaType
  if (aspectRatio !== undefined) update.aspectRatio = aspectRatio

  const { data: updated, error } = await supabaseAdmin.from('posts').update(update).eq('id', postId).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, post: updated })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  const { id: postId } = await params

  const { data: post } = await supabaseAdmin.from('posts').select('id, memberId').eq('id', postId).maybeSingle()
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  if (post.memberId !== member.id) return NextResponse.json({ error: 'Not allowed.' }, { status: 403 })

  await Promise.all([
    supabaseAdmin.from('post_likes').delete().eq('postId', postId),
    supabaseAdmin.from('post_comments').delete().eq('postId', postId),
    supabaseAdmin.from('post_saves').delete().eq('postId', postId),
  ])
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
