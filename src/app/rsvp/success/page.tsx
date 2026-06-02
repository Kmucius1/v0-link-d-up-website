export default function RsvpSuccessPage() {
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=LINK'D+UP&dates=20260604T230000Z/20260605T010000Z&details=A+modern+networking+community+for+creators,+artists,+and+entrepreneurs.&location=The+Ring+Workspace,+600+Cleveland+St,+Clearwater,+FL`
  const facebookUrl = 'https://www.facebook.com'
  const instagramUrl = 'https://www.instagram.com/linkdupnetwork'

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <p className="text-[#a8d8f0] font-bold tracking-[0.4em] text-sm mb-16">LINK'D UP</p>

      {/* Main */}
      <div className="max-w-lg w-full text-center">
        {/* Check */}
        <div className="w-20 h-20 rounded-full bg-[#1e3a4a] border border-[#a8d8f0]/30 flex items-center justify-center mx-auto mb-8">
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
            <path d="M2 12L12 22L30 2" stroke="#a8d8f0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
          You're <span className="text-[#a8d8f0]">LINK'D UP.</span>
        </h1>

        <p className="text-[#888] text-xl mb-10 leading-relaxed">
          You're officially on the list. We can't wait to see you.
        </p>

        {/* Event Card */}
        <div className="bg-[#0d0d0d] border border-[#1e3a4a] rounded-2xl p-8 mb-10 text-left">
          <p className="text-[#a8d8f0] text-xs font-bold tracking-[0.2em] mb-5">YOUR EVENT DETAILS</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-[#a8d8f0] mt-0.5">📅</span>
              <div>
                <p className="text-white font-semibold">Thursday, June 4th</p>
                <p className="text-[#888] text-sm">7:00 PM – 9:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#a8d8f0] mt-0.5">📍</span>
              <div>
                <p className="text-white font-semibold">The Ring Workspace</p>
                <p className="text-[#888] text-sm">600 Cleveland St, Clearwater, FL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm email note */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl px-6 py-4 mb-10">
          <p className="text-[#888] text-sm">
            A confirmation email is on its way. Check your inbox (and spam just in case).
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#a8d8f0] text-black font-bold py-4 rounded-xl text-base hover:bg-white transition-colors"
          >
            Add to Calendar
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-[#a8d8f0] text-[#a8d8f0] font-semibold py-4 rounded-xl text-base hover:bg-[#1e3a4a] transition-colors"
          >
            Join the Facebook Event
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-[#1a1a1a] text-[#888] font-semibold py-4 rounded-xl text-base hover:border-[#333] hover:text-white transition-colors"
          >
            Follow @linkdupnetwork on Instagram
          </a>
        </div>

        {/* Share prompt */}
        <p className="text-[#555] text-sm mt-8">
          Know someone who should be in the room?<br />
          <span className="text-[#a8d8f0]">Send them the link → linkdup.club/rsvp</span>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-[#333] text-xs">
        <p>LINK'D UP · linkdup.club · @linkdupnetwork</p>
        <p className="mt-1">Brought to you by DRYP Digital</p>
      </div>
    </div>
  )
}
