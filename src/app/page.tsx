import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'

const FB_EVENT = 'https://facebook.com/events/s/linkd-up-clearwater-fl/1626917025046995/'
const MAPS = 'https://www.google.com/maps/place/The+Ring+Clearwater+FL'
const FB_PAGE = 'https://facebook.com/Linkdupnetwork'
const IG = 'https://instagram.com/linkdupnetwork'

const values = [
  { title: 'Exposure', body: 'Get in front of creators, business owners, and media people who can help move your name.' },
  { title: 'Collaboration', body: 'Find people to create content, events, campaigns, and projects with.' },
  { title: 'Opportunity', body: 'Your next client, booking, brand deal, or creative partner could start with one conversation.' },
  { title: 'Community', body: 'This is not random networking. It is a scene for people building something.' },
  { title: 'Momentum', body: 'The right room gives you energy, clarity, confidence, and new direction.' },
  { title: 'Connection', body: 'You do not need more cold DMs. You need better rooms.' },
]

const partners = [
  { title: 'Community Sponsor', body: "Get your brand seen by the Link'd Up network." },
  { title: 'Media Partner', body: 'Help capture, promote, and share the event experience.' },
  { title: 'Venue Partner', body: 'Host the room where connections happen.' },
  { title: 'Brand Partner', body: 'Showcase your product, service, or business to the community.' },
  { title: 'Talent Partner', body: 'Connect models, creators, artists, and media professionals.' },
]

const testimonials = [
  '"This is the kind of room I\'ve been looking for."',
  '"It feels like business, culture, and creativity all in one place."',
  '"Way better than a regular networking event."',
  '"You can actually meet people you want to work with here."',
  '"One conversation could turn into a whole opportunity."',
]

const faqs = [
  { q: "Who is Link'd Up for?", a: 'Anyone who creates, builds, teaches, performs, sells, promotes, or wants to meet great people. Artists, entrepreneurs, creatives, professionals — all welcome.' },
  { q: 'Do I need to own a business?', a: 'No. You just need to be building something, creating something, or looking to connect.' },
  { q: 'Is this only for Clearwater?', a: "The first event is in Clearwater, FL, but Link'd Up is growing and expanding." },
  { q: 'What should I bring?', a: 'Bring yourself, your energy, business cards if you have them, and bring a friend.' },
  { q: 'Can photographers and videographers attend?', a: 'Absolutely — they are one of the most valuable people in the room.' },
  { q: 'Can brands sponsor the event?', a: 'Yes. Reach out to become a partner and get your brand in the room.' },
  { q: 'Is this a business event or social event?', a: "Both. Link'd Up is where business and culture meet. Come ready to connect, not just network." },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F7F7]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#7F90A8]/10">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Image src="/images/linkdup-logo-light.png" alt="Link'd Up" width={120} height={36} className="object-contain" priority />
          <div className="hidden md:flex items-center gap-8 text-sm text-[#AEB9C8]">
            <a href="#event" className="hover:text-[#F7F7F7] transition-colors">Event</a>
            <a href="#why" className="hover:text-[#F7F7F7] transition-colors">Why Attend</a>
            <a href="#partners" className="hover:text-[#F7F7F7] transition-colors">Partners</a>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link href="/home" className="whitespace-nowrap rounded-full border border-[#7F90A8]/40 px-3.5 py-2 text-sm font-medium text-[#F7F7F7] transition-colors hover:bg-[#7F90A8]/10 sm:border-0 sm:px-0 sm:py-0 sm:text-[#AEB9C8] sm:hover:text-[#F7F7F7]">
              <span className="sm:hidden">Log In</span>
              <span className="hidden sm:inline">Member Login</span>
            </Link>
            <Link href="/rsvp" className="whitespace-nowrap rounded-full bg-[#7F90A8] px-4 py-2 text-sm font-semibold text-[#050505] transition-colors hover:bg-[#AEB9C8] sm:px-5 sm:py-2.5">
              RSVP
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20">
        <div className="relative w-full aspect-[1672/941]">
          <Image src="/images/hero-banner.png" alt="Link'd Up" fill className="object-cover" priority />
        </div>
        <div className="flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-6">Where the Creative World Meets Business</p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight mb-6 text-[#F7F7F7]">
              More Than<br />Networking
            </h1>
            <p className="text-lg sm:text-xl text-[#AEB9C8] max-w-2xl mx-auto leading-relaxed mb-10">
              Link&apos;d Up is where the creative world and business world come together. Built for the people creating culture, making moves, and building real things.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rsvp" className="bg-[#7F90A8] hover:bg-[#AEB9C8] text-[#050505] font-semibold px-8 py-4 rounded-full text-base transition-colors">
                RSVP Now — It&apos;s Free
              </Link>
              <a href={FB_EVENT} target="_blank" rel="noopener noreferrer" className="border border-[#7F90A8]/40 text-[#AEB9C8] hover:border-[#7F90A8] hover:text-[#F7F7F7] font-medium px-8 py-4 rounded-full text-base transition-colors">
                View Facebook Event
              </a>
            </div>
            <p className="mt-6 text-sm text-[#AEB9C8]">
              Already a member?{' '}
              <Link href="/home" className="font-semibold text-[#F7F7F7] underline underline-offset-4 hover:text-[#7F90A8]">
                Open the app →
              </Link>
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10 text-sm text-[#AEB9C8]">
              {['Meet your next collaborator', 'Meet your next client', 'Meet your next creative partner', 'Meet your next referral source'].map(t => (
                <span key={t} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#7F90A8] inline-block" />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section id="event" className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Next Event</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F7] mb-3">Our Next Event Is Here</h2>
        <p className="text-[#AEB9C8] text-lg max-w-2xl mb-10">A room full of creators, media minds, entrepreneurs, models, photographers, videographers, influencers, artists, and people ready to connect.</p>
        <div className="bg-[#171717] border border-[#7F90A8]/20 rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Date</p>
            <p className="text-[#F7F7F7] text-xl font-semibold">Thursday, July 16</p>
            <p className="text-[#AEB9C8] text-sm mt-1">6:00 PM – 8:30 PM</p>
          </div>
          <div>
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Location</p>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="text-[#F7F7F7] text-xl font-semibold hover:text-[#AEB9C8] transition-colors block">The Ring — Clearwater, FL</a>
            <p className="text-[#AEB9C8] text-sm mt-1">600 Cleveland St</p>
          </div>
          <div>
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Who</p>
            <p className="text-[#F7F7F7] text-xl font-semibold">Next-Gen Professionals</p>
            <p className="text-[#AEB9C8] text-sm mt-1">Creators, entrepreneurs & media minds</p>
          </div>
        </div>
        <blockquote className="text-center text-[#F7F7F7] text-xl font-medium italic mt-10 mb-4">
          &ldquo;The bigger the room, the bigger the opportunity.&rdquo;
        </blockquote>
        <p className="text-center text-[#AEB9C8] text-sm">
          <Link href="/rsvp" className="text-[#7F90A8] hover:text-[#AEB9C8] underline underline-offset-4 transition-colors">RSVP directly here</Link>
          {' '}or{' '}
          <a href={FB_EVENT} target="_blank" rel="noopener noreferrer" className="text-[#7F90A8] hover:text-[#AEB9C8] underline underline-offset-4 transition-colors">RSVP on Facebook</a>
        </p>
      </section>

      {/* Why Attend */}
      <section id="why" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#7F90A8]/10">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Why It Matters</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F7] mb-3">The Bigger the Room, the Bigger the Opportunity</h2>
        <p className="text-[#AEB9C8] text-lg max-w-2xl mb-12">One conversation can lead to your next partnership, campaign, client, booking, collaboration, referral, or brand deal.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {[
            { title: 'Real Exposure', body: 'Get seen by people who create, hire, book, share, promote, and build.' },
            { title: 'Creative Collaborations', body: 'Meet people to shoot with, film with, design with, launch with, and grow with.' },
            { title: 'Referral Partnerships', body: 'Build relationships with people who can send real opportunities your way.' },
            { title: 'Meaningful Connections', body: 'Connect with people who understand your world and want to grow too.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-[#171717] border border-[#7F90A8]/20 rounded-xl p-6">
              <h3 className="text-[#F7F7F7] font-semibold text-lg mb-2">{title}</h3>
              <p className="text-[#AEB9C8] text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">The Value</p>
        <h2 className="text-3xl font-bold text-[#F7F7F7] mb-10">Why You Need To Be In The Room</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map(({ title, body }) => (
            <div key={title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#7F90A8]/5 transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#7F90A8] mt-2 shrink-0" />
              <div>
                <h3 className="text-[#F7F7F7] font-semibold mb-1">{title}</h3>
                <p className="text-[#AEB9C8] text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#7F90A8]/10">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Partners</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F7] mb-3">Partner With Link&apos;d Up</h2>
        <p className="text-[#AEB9C8] text-lg max-w-2xl mb-12">Put your brand in the room with creators, entrepreneurs, media professionals, influencers, artists, and business owners.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {partners.map(({ title, body }) => (
            <div key={title} className="bg-[#171717] border border-[#7F90A8]/20 rounded-xl p-6">
              <h3 className="text-[#F7F7F7] font-semibold mb-2">{title}</h3>
              <p className="text-[#AEB9C8] text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="mailto:hello@linkdup.com" className="inline-block bg-[#7F90A8] hover:bg-[#AEB9C8] text-[#050505] font-semibold px-8 py-3 rounded-full transition-colors">
            Become a Partner
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#7F90A8]/10">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">What Members Are Saying</p>
        <h2 className="text-3xl font-bold text-[#F7F7F7] mb-10">Built for People Who Are Actually Building</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((quote, i) => (
            <div key={i} className="bg-[#171717] border border-[#7F90A8]/20 rounded-xl p-6">
              <p className="text-[#F7F7F7] text-sm leading-relaxed italic">{quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#7F90A8]/10 text-center">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Join The Movement</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-[#F7F7F7] mb-4">Let&apos;s Connect This World</h2>
        <p className="text-[#AEB9C8] text-lg max-w-xl mx-auto mb-10">If you&apos;re building something, creating something, promoting something, or becoming something — this room is for you.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/rsvp" className="bg-[#7F90A8] hover:bg-[#AEB9C8] text-[#050505] font-semibold px-10 py-4 rounded-full text-base transition-colors">
            Save Your Spot
          </Link>
          <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="border border-[#7F90A8]/40 text-[#AEB9C8] hover:border-[#7F90A8] hover:text-[#F7F7F7] font-medium px-10 py-4 rounded-full text-base transition-colors">
            Follow on Facebook
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-[#7F90A8]/10 text-center">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Stay Connected</p>
        <h2 className="text-3xl font-bold text-[#F7F7F7] mb-3">Get Notified About Future Events</h2>
        <p className="text-[#AEB9C8] mb-8">No spam. Just announcements when the next event drops.</p>
        <NewsletterForm />
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-[#7F90A8]/10">
        <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">FAQ</p>
        <h2 className="text-3xl font-bold text-[#F7F7F7] mb-10">Questions Before You Get Link&apos;d Up?</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-[#171717] border border-[#7F90A8]/20 rounded-xl p-6">
              <h3 className="text-[#F7F7F7] font-semibold mb-2">{q}</h3>
              <p className="text-[#AEB9C8] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-[#7F90A8]/15 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div>
            <Image src="/images/linkdup-logo-light.png" alt="Link'd Up" width={100} height={30} className="object-contain mb-3" />
            <p className="text-[#AEB9C8] text-xs leading-relaxed">Let&apos;s connect this world.</p>
          </div>
          <div>
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Explore</p>
            <div className="space-y-2 text-sm text-[#AEB9C8]">
              <a href="#event" className="block hover:text-[#F7F7F7] transition-colors">Next Event</a>
              <a href="#why" className="block hover:text-[#F7F7F7] transition-colors">Why Attend</a>
              <a href="#partners" className="block hover:text-[#F7F7F7] transition-colors">Partners</a>
            </div>
          </div>
          <div>
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Connect</p>
            <div className="space-y-2 text-sm text-[#AEB9C8]">
              <Link href="/rsvp" className="block hover:text-[#F7F7F7] transition-colors">RSVP</Link>
              <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="block hover:text-[#F7F7F7] transition-colors">Facebook</a>
              <a href={IG} target="_blank" rel="noopener noreferrer" className="block hover:text-[#F7F7F7] transition-colors">Instagram</a>
            </div>
          </div>
          <div>
            <p className="text-[#7F90A8] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Contact</p>
            <a href="mailto:hello@linkdup.com" className="text-sm text-[#AEB9C8] hover:text-[#F7F7F7] transition-colors block">hello@linkdup.com</a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 pt-6 border-t border-[#7F90A8]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#AEB9C8]">
          <span>© 2026 Link&apos;d Up. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-[#7F90A8]/70 hover:text-[#7F90A8] transition-colors">Member App</Link>
            <Link href="/admin/login" className="text-[#7F90A8]/50 hover:text-[#7F90A8] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
