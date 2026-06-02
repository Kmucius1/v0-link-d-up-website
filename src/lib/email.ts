import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL
  ? `${process.env.RESEND_FROM_NAME || "LINK'D UP"} <${process.env.RESEND_FROM_EMAIL}>`
  : "LINK'D UP <hello@drypdigital.com>"

export async function sendRsvpConfirmation({
  to,
  name,
  eventName,
  eventDate,
  eventTime,
  locationName,
  address,
}: {
  to: string
  name: string
  eventName: string
  eventDate: string
  eventTime: string
  locationName: string
  address: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `You're confirmed for ${eventName} — LINK'D UP`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
    <div style="background:linear-gradient(135deg,#7c3aed,#a21caf);padding:40px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.5px;">LINK'D UP</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Where community connects</p>
    </div>
    <div style="padding:36px 32px;">
      <p style="color:#e2e8f0;font-size:16px;margin:0 0 24px;">Hey ${name} 👋</p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
        You're confirmed for <strong style="color:#c084fc;">${eventName}</strong>. We can't wait to see you there!
      </p>
      <div style="background:#1a1a2e;border:1px solid #2d2d44;border-radius:12px;padding:24px;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;background:rgba(124,58,237,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:20px;">📅</span>
          </div>
          <div>
            <p style="color:#a78bfa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 2px;">Date & Time</p>
            <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0;">${eventDate} · ${eventTime}</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;background:rgba(124,58,237,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:20px;">📍</span>
          </div>
          <div>
            <p style="color:#a78bfa;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 2px;">Location</p>
            <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0 0 2px;">${locationName}</p>
            <p style="color:#64748b;font-size:13px;margin:0;">${address}</p>
          </div>
        </div>
      </div>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 8px;">
        LINK'D UP is for creators, entrepreneurs, artists, musicians, business owners, and anyone who builds, teaches, performs, or wants to connect. Come ready to meet real people.
      </p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #1e1e1e;text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">
        LINK'D UP by DRYP Digital · <a href="https://www.linkdup.club" style="color:#7c3aed;text-decoration:none;">linkdup.club</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  })
}

export async function sendSurveyRequest({
  to,
  name,
  eventName,
  surveyUrl,
}: {
  to: string
  name: string
  eventName: string
  surveyUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `How was ${eventName}? Tell us! — LINK'D UP`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
    <div style="background:linear-gradient(135deg,#7c3aed,#a21caf);padding:40px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0;">LINK'D UP</h1>
    </div>
    <div style="padding:36px 32px;">
      <p style="color:#e2e8f0;font-size:16px;margin:0 0 20px;">Hey ${name}!</p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Thanks for coming out to <strong style="color:#c084fc;">${eventName}</strong>. We'd love to hear what you thought — your feedback shapes every event we do.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${surveyUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a21caf);color:#fff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
          Share Your Feedback →
        </a>
      </div>
      <p style="color:#334155;font-size:13px;margin:0;">Takes about 2 minutes. No fluff, just the real stuff.</p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #1e1e1e;text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">LINK'D UP by DRYP Digital · <a href="https://www.linkdup.club" style="color:#7c3aed;text-decoration:none;">linkdup.club</a></p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  })
}
