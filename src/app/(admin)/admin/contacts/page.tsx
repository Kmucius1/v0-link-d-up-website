import { supabaseAdmin } from '@/lib/supabase-admin'
import { format } from 'date-fns'
import Link from 'next/link'
import { Users, Search } from 'lucide-react'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const pageNum = parseInt(page || '1')
  const perPage = 50

  let query = supabaseAdmin
    .from('contacts')
    .select('*, rsvps(count)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range((pageNum - 1) * perPage, pageNum * perPage - 1)

  if (q) {
    query = query.or(
      `fullName.ilike.%${q}%,email.ilike.%${q}%,businessName.ilike.%${q}%,roleOrIndustry.ilike.%${q}%`
    )
  }

  const { data: rawContacts, count } = await query
  const total = count ?? 0

  const contacts = (rawContacts ?? []).map((c) => ({
    ...c,
    _count: {
      rsvps: (c.rsvps as Array<{ count: number }>)?.[0]?.count ?? 0,
    },
  }))

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{total.toLocaleString()} total community members</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, business, or industry…"
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
        />
      </form>

      {contacts.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Users size={32} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">{q ? 'No contacts found' : 'No contacts yet'}</p>
          <p className="text-zinc-600 text-sm mt-1">Contacts are added automatically when someone RSVPs on linkdup.club</p>
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Business / Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">City</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">RSVPs</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/contacts/${contact.id}`} className="group">
                        <p className="font-medium text-zinc-200 group-hover:text-violet-300 transition-colors">{contact.fullName}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{contact.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {contact.businessName && <p className="text-zinc-300">{contact.businessName}</p>}
                      {contact.roleOrIndustry && <p className="text-xs text-zinc-500 mt-0.5">{contact.roleOrIndustry}</p>}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{contact.city || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold">
                        {contact._count.rsvps}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs hidden lg:table-cell">
                      {format(contact.createdAt, 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-zinc-500">Page {pageNum} of {totalPages} · {total} contacts</p>
              <div className="flex gap-2">
                {pageNum > 1 && (
                  <Link href={`?${q ? `q=${q}&` : ''}page=${pageNum - 1}`}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
                    ← Prev
                  </Link>
                )}
                {pageNum < totalPages && (
                  <Link href={`?${q ? `q=${q}&` : ''}page=${pageNum + 1}`}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
