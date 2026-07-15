import { supabaseAdmin } from './supabase-admin'
import { getResend, getFrom } from './resend'

type Campaign = {
  id: string
  name: string
  subject: string
  bodyHtml: string
  audienceTag: string | null
  eventId: string | null
}

type Recipient = {
  id: string
  email: string
  firstName: string
}

function wrapCampaignHtml(bodyHtml: string, contactId: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
    <div style="background:linear-gradient(135deg,#7c3aed,#a21caf);padding:32px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.5px;">LINK'D UP</h1>
    </div>
    <div style="padding:32px;color:#e2e8f0;font-size:15px;line-height:1.6;">
      ${bodyHtml}
    </div>
    <div style="padding:20px 32px;border-top:1px solid #1e1e1e;text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0 0 8px;">
        LINK'D UP by DRYP Digital · <a href="https://www.linkdup.club" style="color:#7c3aed;text-decoration:none;">linkdup.club</a>
      </p>
      <p style="color:#334155;font-size:11px;margin:0;">
        <a href="https://www.linkdup.club/unsubscribe?id=${contactId}" style="color:#475569;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

async function resolveAudience(campaign: Campaign): Promise<Recipient[]> {
  if (campaign.eventId) {
    const { data: rsvps } = await supabaseAdmin
      .from('rsvps')
      .select('contacts(id, email, firstName, consentToEmail, unsubscribed)')
      .eq('eventId', campaign.eventId)
      .eq('rsvpStatus', 'confirmed')
    return (rsvps ?? [])
      .map((r) => r.contacts as unknown as { id: string; email: string; firstName: string; consentToEmail: boolean; unsubscribed: boolean })
      .filter((c) => c && c.consentToEmail && !c.unsubscribed)
      .map((c) => ({ id: c.id, email: c.email, firstName: c.firstName }))
  }

  const { data: contacts } = await supabaseAdmin
    .from('contacts')
    .select('id, email, firstName, consentToEmail, unsubscribed')
    .eq('consentToEmail', true)
    .eq('unsubscribed', false)
  return (contacts ?? []).map((c) => ({ id: c.id, email: c.email, firstName: c.firstName }))
}

export async function sendCampaign(campaignId: string) {
  const { data: campaign, error: campaignError } = await supabaseAdmin
    .from('email_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()
  if (campaignError || !campaign) throw new Error('Campaign not found')

  await supabaseAdmin.from('email_campaigns').update({ status: 'sending' }).eq('id', campaignId)

  const recipients = await resolveAudience(campaign)

  let sent = 0
  let failed = 0

  for (const recipient of recipients) {
    const personalizedHtml = wrapCampaignHtml(
      campaign.bodyHtml.replace(/\{\{firstName\}\}/g, recipient.firstName || 'there'),
      recipient.id
    )
    try {
      const { error: sendError } = await getResend().emails.send({
        from: getFrom(),
        to: recipient.email,
        subject: campaign.subject,
        html: personalizedHtml,
      })
      if (sendError) throw new Error(sendError.message)

      await supabaseAdmin.from('email_logs').insert({
        id: crypto.randomUUID(),
        contactId: recipient.id,
        eventId: campaign.eventId,
        emailType: 'campaign',
        subject: campaign.subject,
        status: 'sent',
      })
      sent++
    } catch (err) {
      await supabaseAdmin.from('email_logs').insert({
        id: crypto.randomUUID(),
        contactId: recipient.id,
        eventId: campaign.eventId,
        emailType: 'campaign',
        subject: campaign.subject,
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'Email delivery failed',
      })
      failed++
    }
  }

  await supabaseAdmin
    .from('email_campaigns')
    .update({ status: 'sent', sentAt: new Date().toISOString() })
    .eq('id', campaignId)

  return { total: recipients.length, sent, failed }
}
