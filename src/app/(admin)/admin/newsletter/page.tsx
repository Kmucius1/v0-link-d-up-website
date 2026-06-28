import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import { Mail } from 'lucide-react'

export default async function NewsletterPage() {
  const { data: signups } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('*')
    .order('createdAt', { ascending: false })

  const list = signups ?? []

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter Signups</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{list.length.toLocaleString()} subscribers</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Mail size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No newsletter signups yet.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Signed Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3 text-zinc-200 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.firstName || s.lastName ? `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() : '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{s.source || '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{format(s.createdAt, 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
