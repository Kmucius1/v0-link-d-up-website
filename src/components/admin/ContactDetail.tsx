'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  ArrowLeft, Mail, Phone, Building, Globe, MapPin, AtSign, Bookmark,
  Tag, CheckCircle, XCircle, User, Calendar, MessageSquare, StickyNote,
  MailOpen, Star, Plus
} from 'lucide-react'

type ContactWithRelations = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string | null
  businessName: string | null
  roleOrIndustry: string | null
  instagram: string | null
  linkedin: string | null
  website: string | null
  city: string | null
  contactSource: string | null
  consentToEmail: boolean
  unsubscribed: boolean
  createdAt: Date
  updatedAt: Date
  lastRsvpAt: Date | null
  lastSurveyAt: Date | null
  rsvps: Array<{
    id: string
    rsvpStatus: string
    numberOfGuests: number
    howDidYouHear: string | null
    checkedIn: boolean
    attended: boolean
    createdAt: Date
    event: { id: string; eventName: string; eventDate: Date; locationName: string }
  }>
  surveyResponses: Array<{
    id: string
    surveyTitle: string
    answersJson: unknown
    rating: number | null
    interestTags: string[]
    keyFeedback: string | null
    submittedAt: Date
    event: { eventName: string } | null
  }>
  emailLogs: Array<{
    id: string
    emailType: string
    subject: string
    status: string
    sentAt: Date
    openedAt: Date | null
    clickedAt: Date | null
    event: { eventName: string } | null
  }>
  notes: Array<{
    id: string
    note: string
    createdBy: string
    createdAt: Date
  }>
  tags: Array<{ id: string; tag: string }>
  opportunities: Array<{
    id: string
    opportunityType: string
    status: string
    notes: string | null
    createdAt: Date
    event: { eventName: string } | null
  }>
}

const TABS = ['Overview', 'RSVPs', 'Surveys', 'Notes', 'Email Activity', 'Opportunities'] as const
type Tab = typeof TABS[number]

const OPPORTUNITY_TYPES = [
  'Sponsor', 'Vendor', 'Speaker', 'Artist', 'Musician / Performer',
  'Collaborator', 'Community Partner', 'Referral Partner', 'Volunteer', 'Future Host',
]

const OPP_STATUS_COLORS: Record<string, string> = {
  potential: 'bg-yellow-500/20 text-yellow-400',
  contacted: 'bg-blue-500/20 text-blue-400',
  confirmed: 'bg-emerald-500/20 text-emerald-400',
  declined: 'bg-red-500/20 text-red-400',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export function ContactDetail({ contact }: { contact: ContactWithRelations }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [addingOpportunity, setAddingOpportunity] = useState(false)
  const [oppType, setOppType] = useState(OPPORTUNITY_TYPES[0])
  const [oppNotes, setOppNotes] = useState('')

  async function submitNote() {
    if (!noteText.trim()) return
    setAddingNote(true)
    await fetch(`/api/admin/contacts/${contact.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: noteText, createdBy: 'Admin' }),
    })
    setNoteText('')
    setAddingNote(false)
    window.location.reload()
  }

  async function addTag() {
    if (!newTag.trim()) return
    await fetch(`/api/admin/contacts/${contact.id}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: newTag.trim() }),
    })
    setNewTag('')
    window.location.reload()
  }

  async function removeTag(tagId: string) {
    await fetch(`/api/admin/contacts/${contact.id}/tags/${tagId}`, { method: 'DELETE' })
    window.location.reload()
  }

  async function addOpportunity() {
    await fetch(`/api/admin/contacts/${contact.id}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityType: oppType, notes: oppNotes }),
    })
    setAddingOpportunity(false)
    setOppNotes('')
    window.location.reload()
  }

  const answers = contact.surveyResponses[0]?.answersJson as Record<string, string> | null

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/contacts" className="mt-1 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {getInitials(contact.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{contact.fullName}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {contact.businessName && <span className="text-zinc-400 text-sm">{contact.businessName}</span>}
              {contact.roleOrIndustry && <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full">{contact.roleOrIndustry}</span>}
              {contact.city && <span className="text-zinc-500 text-xs flex items-center gap-1"><MapPin size={10} />{contact.city}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${contact.consentToEmail && !contact.unsubscribed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
              {contact.consentToEmail && !contact.unsubscribed ? <CheckCircle size={11} /> : <XCircle size={11} />}
              {contact.consentToEmail && !contact.unsubscribed ? 'Email OK' : 'No Email'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-violet-300 border-violet-500'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Contact Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-zinc-400">Contact Info</h3>
              <div className="space-y-3">
                <InfoRow icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
                {contact.phone && <InfoRow icon={Phone} label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />}
                {contact.businessName && <InfoRow icon={Building} label="Business" value={contact.businessName} />}
                {contact.roleOrIndustry && <InfoRow icon={User} label="Role / Industry" value={contact.roleOrIndustry} />}
                {contact.city && <InfoRow icon={MapPin} label="City" value={contact.city} />}
                {contact.website && <InfoRow icon={Globe} label="Website" value={contact.website} href={contact.website} />}
                {contact.instagram && <InfoRow icon={AtSign} label="Instagram" value={`@${contact.instagram.replace('@','')}`} href={`https://instagram.com/${contact.instagram.replace('@','')}`} />}
                {contact.linkedin && <InfoRow icon={Bookmark} label="LinkedIn" value={contact.linkedin} href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://linkedin.com/in/${contact.linkedin}`} />}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-zinc-400">Activity Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-xl font-bold text-violet-300">{contact.rsvps.length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Events RSVPd</p>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-xl font-bold text-fuchsia-300">{contact.rsvps.filter(r => r.attended).length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Attended</p>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-xl font-bold text-purple-300">{contact.surveyResponses.length}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Surveys</p>
                </div>
              </div>
              {contact.lastRsvpAt && (
                <p className="text-xs text-zinc-500 mt-3">Last RSVP: {format(contact.lastRsvpAt, 'MMMM d, yyyy')}</p>
              )}
              {contact.contactSource && (
                <p className="text-xs text-zinc-500 mt-1">Source: {contact.contactSource}</p>
              )}
            </div>
          </div>

          {/* Tags + Opportunities sidebar */}
          <div className="space-y-5">
            {/* Tags */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Tag size={13} className="text-fuchsia-400" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {contact.tags.map((t) => (
                  <span key={t.id} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full">
                    {t.tag}
                    <button onClick={() => removeTag(t.id)} className="hover:text-red-400 transition-colors ml-0.5">
                      <XCircle size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag…"
                  className="flex-1 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-xs placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
                <button onClick={addTag} className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs transition-colors">
                  Add
                </button>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-3 text-sm">Dates</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Joined</span>
                  <span className="text-zinc-300">{format(contact.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Last Updated</span>
                  <span className="text-zinc-300">{format(contact.updatedAt, 'MMM d, yyyy')}</span>
                </div>
                {contact.lastRsvpAt && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last RSVP</span>
                    <span className="text-zinc-300">{format(contact.lastRsvpAt, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {contact.lastSurveyAt && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last Survey</span>
                    <span className="text-zinc-300">{format(contact.lastSurveyAt, 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'RSVPs' && (
        <div className="space-y-3">
          {contact.rsvps.length === 0 ? (
            <EmptyState icon={Calendar} message="No RSVPs yet" />
          ) : contact.rsvps.map((rsvp) => (
            <div key={rsvp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/events/${rsvp.event.id}`} className="font-semibold text-white hover:text-violet-300 transition-colors">
                    {rsvp.event.eventName}
                  </Link>
                  <p className="text-sm text-zinc-500 mt-0.5">{format(rsvp.event.eventDate, 'MMMM d, yyyy')} · {rsvp.event.locationName}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  rsvp.rsvpStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                  rsvp.rsvpStatus === 'waitlisted' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {rsvp.rsvpStatus}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800 text-sm">
                <span className="text-zinc-400">Guests: <strong className="text-white">{rsvp.numberOfGuests}</strong></span>
                {rsvp.howDidYouHear && <span className="text-zinc-400">Heard via: <strong className="text-white">{rsvp.howDidYouHear}</strong></span>}
                <div className="flex gap-3 ml-auto">
                  <StatusBadge label="Checked In" active={rsvp.checkedIn} />
                  <StatusBadge label="Attended" active={rsvp.attended} />
                </div>
              </div>
              <p className="text-xs text-zinc-600 mt-2">RSVP'd {format(rsvp.createdAt, 'MMM d, yyyy')}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Surveys' && (
        <div className="space-y-4">
          {contact.surveyResponses.length === 0 ? (
            <EmptyState icon={MessageSquare} message="No survey responses yet" />
          ) : contact.surveyResponses.map((survey) => {
            const answers = survey.answersJson as Record<string, string>
            return (
              <div key={survey.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{survey.surveyTitle}</h3>
                    {survey.event && <p className="text-sm text-zinc-500">For: {survey.event.eventName}</p>}
                    <p className="text-xs text-zinc-600 mt-0.5">Submitted {format(survey.submittedAt, 'MMMM d, yyyy')}</p>
                  </div>
                  {survey.rating && (
                    <div className="flex items-center gap-1 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < survey.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                      ))}
                    </div>
                  )}
                </div>
                {survey.keyFeedback && (
                  <div className="p-3 bg-zinc-800/50 rounded-lg mb-3">
                    <p className="text-xs text-zinc-400 font-medium mb-1">Key Feedback</p>
                    <p className="text-sm text-zinc-300">{survey.keyFeedback}</p>
                  </div>
                )}
                {survey.interestTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {survey.interestTags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                {answers && Object.entries(answers).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">View all answers ({Object.entries(answers).length})</summary>
                    <div className="mt-3 space-y-3">
                      {Object.entries(answers).map(([question, answer]) => (
                        <div key={question}>
                          <p className="text-xs text-zinc-500">{question}</p>
                          <p className="text-sm text-zinc-300 mt-0.5">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'Notes' && (
        <div className="space-y-4">
          {/* Add note */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Add Note</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add an internal note about this contact… (collaboration ideas, follow-up reminders, sponsor potential, etc.)"
              rows={3}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={submitNote}
                disabled={addingNote || !noteText.trim()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {addingNote ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>

          {contact.notes.length === 0 ? (
            <EmptyState icon={StickyNote} message="No notes yet" />
          ) : contact.notes.map((note) => (
            <div key={note.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-zinc-200 text-sm whitespace-pre-wrap">{note.note}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                <p className="text-xs text-zinc-600">by {note.createdBy} · {format(note.createdAt, 'MMM d, yyyy')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Email Activity' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 shrink-0">
              {contact.consentToEmail && !contact.unsubscribed ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">Email Consent: {contact.consentToEmail ? 'Yes' : 'No'}</p>
              {contact.unsubscribed && <p className="text-xs text-red-400">Unsubscribed</p>}
            </div>
          </div>
          {contact.emailLogs.length === 0 ? (
            <EmptyState icon={MailOpen} message="No emails sent yet" />
          ) : contact.emailLogs.map((log) => (
            <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-200 text-sm">{log.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full capitalize">{log.emailType}</span>
                    {log.event && <span className="text-xs text-zinc-500">· {log.event.eventName}</span>}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                  log.status === 'sent' || log.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                  log.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-zinc-700 text-zinc-400'
                }`}>{log.status}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                <span>Sent {format(log.sentAt, 'MMM d, yyyy h:mm a')}</span>
                {log.openedAt && <span className="text-emerald-600">Opened</span>}
                {log.clickedAt && <span className="text-blue-600">Clicked</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Opportunities' && (
        <div className="space-y-4">
          {!addingOpportunity && (
            <button
              onClick={() => setAddingOpportunity(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={14} /> Track Opportunity
            </button>
          )}

          {addingOpportunity && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-white">New Opportunity</h3>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Type</label>
                <select
                  value={oppType}
                  onChange={(e) => setOppType(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500"
                >
                  {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Notes</label>
                <textarea
                  value={oppNotes}
                  onChange={(e) => setOppNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 resize-none"
                  placeholder="Details about this opportunity…"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={addOpportunity} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">Save</button>
                <button onClick={() => setAddingOpportunity(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {contact.opportunities.length === 0 ? (
            <EmptyState icon={Star} message="No opportunities tracked yet" />
          ) : contact.opportunities.map((opp) => (
            <div key={opp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{opp.opportunityType}</p>
                  {opp.event && <p className="text-xs text-zinc-500 mt-0.5">Event: {opp.event.eventName}</p>}
                  {opp.notes && <p className="text-sm text-zinc-400 mt-2">{opp.notes}</p>}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 capitalize ${OPP_STATUS_COLORS[opp.status] || 'bg-zinc-700 text-zinc-400'}`}>
                  {opp.status}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-2">{format(opp.createdAt, 'MMM d, yyyy')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-zinc-500 shrink-0" />
      <span className="text-xs text-zinc-500 w-20 shrink-0">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-400 hover:underline truncate">{value}</a>
      ) : (
        <span className="text-sm text-zinc-300 truncate">{value}</span>
      )}
    </div>
  )
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`flex items-center gap-1 text-xs ${active ? 'text-emerald-400' : 'text-zinc-600'}`}>
      {active ? <CheckCircle size={11} /> : <XCircle size={11} />}
      {label}
    </span>
  )
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
      <Icon size={28} className="text-zinc-700 mx-auto mb-2" />
      <p className="text-zinc-500 text-sm">{message}</p>
    </div>
  )
}
