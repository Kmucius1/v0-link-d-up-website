import { render } from '@react-email/render'
import { resend, FROM, APP_URL } from './resend'
import { db } from './db'
import ConfirmationEmail from '@/emails/confirmation'
import ReminderEmail from '@/emails/reminder'
import DayOfEmail from '@/emails/day-of'
import ThankYouEmail from '@/emails/thank-you'
import SurveyEmail from '@/emails/survey'
import EventInviteEmail from '@/emails/event-invite'

function unsubUrl(contactId: string) {
  return `${APP_URL}/unsubscribe?id=${contactId}`
}

async function logEmail({
  contactId, eventId, emailType, subject, status, errorMessage,
}: {
  contactId: string
  eventId?: string
  emailType: string
  subject: string
  status: string
  errorMessage?: string
}) {
  await db.emailLog.create({
    data: { contactId, eventId, emailType, subject, status, errorMessage },
  })
}

export async function sendConfirmationEmail(contactId: string, eventId: string) {
  const [contact, event] = await Promise.all([
    db.contact.findUnique({ where: { id: contactId } }),
    db.event.findUnique({ where: { id: eventId } }),
  ])
  if (!contact || !event || !contact.consentToEmail || contact.unsubscribed) return

  const subject = `You're RSVP'd for LINK'D UP`
  const html = await render(ConfirmationEmail({
    firstName: contact.firstName,
    eventName: event.eventName,
    eventDate: new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    eventTime: `${event.startTime} – ${event.endTime}`,
    locationName: event.locationName,
    address: event.address,
    facebookEventLink: event.facebookEventLink ?? undefined,
    unsubscribeUrl: unsubUrl(contactId),
  }))

  const { error } = await resend.emails.send({
    from: FROM,
    to: contact.email,
    subject,
    html,
  })

  await logEmail({ contactId, eventId, emailType: 'confirmation', subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
}

export async function sendReminderEmail(contactId: string, eventId: string) {
  const [contact, event] = await Promise.all([
    db.contact.findUnique({ where: { id: contactId } }),
    db.event.findUnique({ where: { id: eventId } }),
  ])
  if (!contact || !event || !contact.consentToEmail || contact.unsubscribed) return

  const subject = `LINK'D UP is almost here`
  const html = await render(ReminderEmail({
    firstName: contact.firstName,
    eventName: event.eventName,
    eventDate: new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    eventTime: `${event.startTime} – ${event.endTime}`,
    locationName: event.locationName,
    address: event.address,
    eventDetailLink: `${APP_URL}/events/${event.eventSlug}`,
    unsubscribeUrl: unsubUrl(contactId),
  }))

  const { error } = await resend.emails.send({ from: FROM, to: contact.email, subject, html })
  await logEmail({ contactId, eventId, emailType: 'reminder', subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
}

export async function sendDayOfEmail(contactId: string, eventId: string) {
  const [contact, event] = await Promise.all([
    db.contact.findUnique({ where: { id: contactId } }),
    db.event.findUnique({ where: { id: eventId } }),
  ])
  if (!contact || !event || !contact.consentToEmail || contact.unsubscribed) return

  const subject = `Today's the day: LINK'D UP starts at ${event.startTime}`
  const html = await render(DayOfEmail({
    firstName: contact.firstName,
    eventTime: event.startTime,
    locationName: event.locationName,
    address: event.address,
    eventDetailLink: `${APP_URL}/events/${event.eventSlug}`,
    unsubscribeUrl: unsubUrl(contactId),
  }))

  const { error } = await resend.emails.send({ from: FROM, to: contact.email, subject, html })
  await logEmail({ contactId, eventId, emailType: 'day-of', subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
}

export async function sendThankYouEmail(contactId: string, eventId: string) {
  const [contact, event] = await Promise.all([
    db.contact.findUnique({ where: { id: contactId } }),
    db.event.findUnique({ where: { id: eventId } }),
  ])
  if (!contact || !event || !contact.consentToEmail || contact.unsubscribed) return

  const subject = `Thank you for being part of LINK'D UP`
  const html = await render(ThankYouEmail({
    firstName: contact.firstName,
    surveyLink: event.surveyLink || `${APP_URL}/survey`,
    unsubscribeUrl: unsubUrl(contactId),
  }))

  const { error } = await resend.emails.send({ from: FROM, to: contact.email, subject, html })
  await logEmail({ contactId, eventId, emailType: 'thank-you', subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
}

export async function sendSurveyEmail(contactId: string, eventId?: string, surveyLink?: string) {
  const contact = await db.contact.findUnique({ where: { id: contactId } })
  if (!contact || !contact.consentToEmail || contact.unsubscribed) return

  const subject = `Help shape the next LINK'D UP`
  const html = await render(SurveyEmail({
    firstName: contact.firstName,
    surveyLink: surveyLink || `${APP_URL}/survey`,
    unsubscribeUrl: unsubUrl(contactId),
  }))

  const { error } = await resend.emails.send({ from: FROM, to: contact.email, subject, html })
  await logEmail({ contactId, eventId, emailType: 'survey', subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
}

export async function sendEventInviteEmail(contactId: string, eventId: string) {
  const [contact, event] = await Promise.all([
    db.contact.findUnique({ where: { id: contactId } }),
    db.event.findUnique({ where: { id: eventId } }),
  ])
  if (!contact || !event || !contact.consentToEmail || contact.unsubscribed) return

  const subject = `You're invited to the next LINK'D UP`
  const html = await render(EventInviteEmail({
    firstName: contact.firstName,
    eventName: event.eventName,
    eventDate: new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    eventTime: `${event.startTime} – ${event.endTime}`,
    locationName: event.locationName,
    address: event.address,
    rsvpLink: event.rsvpLink || `${APP_URL}/rsvp/${event.eventSlug}`,
    unsubscribeUrl: unsubUrl(contactId),
  }))

  const { error } = await resend.emails.send({ from: FROM, to: contact.email, subject, html })
  await logEmail({ contactId, eventId, emailType: 'event-invite', subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
}

export async function sendCampaignEmail({
  contactId,
  subject,
  htmlBody,
  emailType = 'campaign',
  eventId,
}: {
  contactId: string
  subject: string
  htmlBody: string
  emailType?: string
  eventId?: string
}) {
  const contact = await db.contact.findUnique({ where: { id: contactId } })
  if (!contact || !contact.consentToEmail || contact.unsubscribed) return { skipped: true }

  const { error } = await resend.emails.send({ from: FROM, to: contact.email, subject, html: htmlBody })
  await logEmail({ contactId, eventId, emailType, subject, status: error ? 'failed' : 'sent', errorMessage: error?.message })
  return { error }
}
