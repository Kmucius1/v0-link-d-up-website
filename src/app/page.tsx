import Link from 'next/link'

const audiences = [
  'Artists', 'Musicians', 'Entrepreneurs', 'Business Owners',
  'Creators', 'Influencers', 'Educators', 'Coaches',
  'Designers', 'Photographers', 'Videographers', 'Writers',
  'Marketing Pros', 'Real Estate Pros', 'Tattoo Artists',
  'Wellness Creators', 'Media Professionals', 'Students',
  'Sales Professionals', 'Service Providers',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-[#a8d8f0] font-bold tracking-[0.3em] text-lg">LINK'D UP</span>
        <Link
          href="/rsvp"
          className="text-sm font-semibold bg-[#a8d8f0] text-black px-5 py-2.5 rounded-full hover:bg-white transition-colors"
        >
          RSVP Now
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-[#1e3a4a] text-[#a8d8f0] text-xs font-bold tracking-[0.2em] px-4 py-2 rounded-full mb-8">
          CLEARWATER, FL · JUNE 4TH
        </div>
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
          Connection.<br />
          <span className="text-[#a8d8f0]">Community.</span><br />
          Opportunity.
        </h1>
        <p className="text-xl text-[#888] max-w-2xl mx-auto leading-relaxed mb-10">
          LINK'D UP is a modern networking community for anyone who creates, builds, teaches, performs, sells, or wants to connect with extraordinary people.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/rsvp"
            className="inline-block bg-[#a8d8f0] text-black font-bold px-10 py-4 rounded-full text-lg hover:bg-white transition-colors"
          >
            RSVP for June 4th →
          </Link>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[#a8d8f0] text-[#a8d8f0] font-semibold px-10 py-4 rounded-full text-lg hover:bg-[#1e3a4a] transition-colors"
          >
            Join the Facebook Event
          </a>
        </div>
      </section>

      {/* Event Details */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-[#a8d8f0] text-xs font-bold tracking-[0.2em] mb-2">DATE</p>
            <p className="text-white font-bold text-lg">Thursday, June 4th</p>
          </div>
          <div>
            <p className="text-[#a8d8f0] text-xs font-bold tracking-[0.2em] mb-2">TIME</p>
            <p className="text-white font-bold text-lg">7:00 PM – 9:00 PM</p>
          </div>
          <div>
            <p className="text-[#a8d8f0] text-xs font-bold tracking-[0.2em] mb-2">LOCATION</p>
            <p className="text-white font-bold text-lg">The Ring Workspace</p>
            <p className="text-[#888] text-sm mt-1">600 Cleveland St, Clearwater, FL</p>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-[#a8d8f0] text-xs font-bold tracking-[0.2em] mb-6">WHAT TO EXPECT</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {['Beer & Wine', 'Live Music', 'Art', 'Networking', 'Referrals', 'Collaboration'].map((item) => (
            <div key={item} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-5 py-4 text-white font-medium">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Audience */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <p className="text-[#a8d8f0] text-xs font-bold tracking-[0.2em] mb-3">WHO THIS IS FOR</p>
        <h2 className="text-3xl font-black mb-8">Anyone is invited.</h2>
        <div className="flex flex-wrap gap-2">
          {audiences.map((label) => (
            <span key={label} className="bg-[#111] border border-[#1a1a1a] text-[#ccc] text-sm px-4 py-2 rounded-full">
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-[#0d0d0d] border border-[#1e3a4a] rounded-2xl p-12">
          <h2 className="text-4xl font-black mb-4">Ready to get LINK'D UP?</h2>
          <p className="text-[#888] mb-8 text-lg">Secure your spot for June 4th. Spots are limited.</p>
          <Link
            href="/rsvp"
            className="inline-block bg-[#a8d8f0] text-black font-bold px-12 py-4 rounded-full text-lg hover:bg-white transition-colors"
          >
            RSVP Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 text-center text-[#555] text-sm">
        <p className="font-bold text-[#a8d8f0] tracking-[0.3em] mb-1">LINK'D UP</p>
        <p>linkdup.club · @linkdupnetwork</p>
        <p className="mt-1">Brought to you by DRYP Digital</p>
      </footer>
    </div>
  )
}
