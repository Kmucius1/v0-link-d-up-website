import { requireMember } from '@/lib/member-auth'
import { BottomNav } from '@/components/app/BottomNav'
import { ServiceWorkerRegister } from '@/components/app/ServiceWorkerRegister'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireMember()
  return (
    <div
      className="min-h-dvh bg-black text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", system-ui, sans-serif',
      }}
    >
      <ServiceWorkerRegister />
      <div className="mx-auto min-h-dvh max-w-md px-1 pb-28 pt-[max(env(safe-area-inset-top),8px)]">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
