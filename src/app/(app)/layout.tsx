import { requireMember } from '@/lib/member-auth'
import { BottomNav } from '@/components/app/BottomNav'
import { ServiceWorkerRegister } from '@/components/app/ServiceWorkerRegister'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireMember()
  return (
    <div className="min-h-dvh bg-black text-white">
      <ServiceWorkerRegister />
      <div className="mx-auto min-h-dvh max-w-lg pb-24">{children}</div>
      <BottomNav />
    </div>
  )
}
