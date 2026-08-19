import { requireMember } from '@/lib/member-auth'
import { BottomNav } from '@/components/app/BottomNav'
import { DesktopSidebar } from '@/components/app/DesktopSidebar'
import { ServiceWorkerRegister } from '@/components/app/ServiceWorkerRegister'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireMember()

  return (
    <div
      className="min-h-dvh bg-[#0b0f16] text-white"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", system-ui, sans-serif',
        backgroundImage:
          'radial-gradient(circle at 50% -10%, rgba(28,117,255,.14), transparent 28%), linear-gradient(180deg, #0d1118 0%, #090c11 45%, #0b0f16 100%)',
      }}
    >
      <ServiceWorkerRegister />
      <DesktopSidebar />
      <main className="mx-auto min-h-dvh w-full max-w-md pb-24 pt-[max(env(safe-area-inset-top),8px)] lg:mx-0 lg:max-w-none lg:pb-10 lg:pl-[244px]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
