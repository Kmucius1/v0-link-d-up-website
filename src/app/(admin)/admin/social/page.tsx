import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import { Share2 } from 'lucide-react'

function PlatformBadge({ platform }: { platform: string }) {
  const isFacebook = platform === 'facebook'
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
        isFacebook ? 'bg-blue-500/20 text-blue-400' : 'bg-fuchsia-500/20 text-fuchsia-400'
      }`}
    >
      {isFacebook ? 'FB' : 'IG'}
    </span>
  )
}
import SocialComposer from '@/components/admin/SocialComposer'
import DisconnectSocialButton from '@/components/admin/DisconnectSocialButton'

export const dynamic = 'force-dynamic'

export default async function SocialPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>
}) {
  const params = await searchParams

  const { data: connection } = await supabaseAdmin
    .from('social_connections')
    .select('*')
    .order('connectedAt', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: posts } = await supabaseAdmin
    .from('social_posts')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(30)

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Media</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Post to Facebook & Instagram directly from the dashboard</p>
      </div>

      {params.connected && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
          Connected successfully.
        </div>
      )}
      {params.error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {params.error}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        {connection ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-200">
                <PlatformBadge platform="facebook" />
                <span className="font-medium">{connection.pageName}</span>
              </div>
              {connection.igUsername && (
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <PlatformBadge platform="instagram" />
                  <span className="font-medium">@{connection.igUsername}</span>
                </div>
              )}
              <span className="text-xs text-zinc-600">Connected {format(connection.connectedAt, 'MMM d, yyyy')}</span>
            </div>
            <DisconnectSocialButton />
          </div>
        ) : (
          <div className="text-center py-6">
            <Share2 size={28} className="text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium mb-1">No account connected</p>
            <p className="text-zinc-600 text-sm mb-4">Connect Facebook & Instagram to post from here.</p>
            <a
              href="/api/admin/social/connect"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Connect Facebook & Instagram
            </a>
          </div>
        )}
      </div>

      {connection && <SocialComposer hasInstagram={!!connection.igBusinessId} />}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800">
          <h2 className="font-semibold text-white text-sm">Post History</h2>
        </div>
        {(posts ?? []).length === 0 ? (
          <p className="text-zinc-600 text-sm px-5 py-8 text-center">No posts yet.</p>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {(posts ?? []).map((post) => (
              <div key={post.id} className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PlatformBadge platform={post.platform} />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        post.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-xs text-zinc-600">{format(post.createdAt, 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  {post.message && <p className="text-sm text-zinc-300 truncate">{post.message}</p>}
                  {post.errorMessage && <p className="text-xs text-red-400 mt-1">{post.errorMessage}</p>}
                </div>
                {post.permalink && (
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:underline shrink-0">
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
