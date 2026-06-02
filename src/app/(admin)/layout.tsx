import { requireAdminAuth } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAuth()
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
