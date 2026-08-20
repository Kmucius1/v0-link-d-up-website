'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PostCard, type Post } from '@/components/app/CircleFeed'

export function SinglePost({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()

  async function load(): Promise<boolean> {
    const res = await fetch(`/api/member/posts/${postId}`)
    if (res.ok) {
      setPost((await res.json()).post)
      setLoading(false)
      return true
    }
    setNotFound(true)
    setLoading(false)
    return false
  }

  useEffect(() => {
    load()
  }, [postId])

  if (loading) {
    return (
      <div className="flex justify-center py-14 text-white/30">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (notFound || !post) {
    return <div className="py-16 text-center text-sm text-white/40">This post is gone.</div>
  }

  return (
    <PostCard
      post={post}
      onChange={() => {
        load().then((ok) => {
          if (!ok) router.replace('/circle')
        })
      }}
    />
  )
}
