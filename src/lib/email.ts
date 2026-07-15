import { Resend } from 'resend'

// Lazy init — only instantiated at runtime, never during build
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL
    ? `${process.env.RESEND_FROM_NAME || "LINK'D UP"} <${process.env.RESEND_FROM_EMAIL}>`
    : "LINK'D UP <linkdup@drypdigital.com>"
}

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
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `You're confirmed for ${eventName} — LINK'D UP`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
    <div style="background:#000;">
      <img src="https://www.linkdup.club/images/hero-banner.png" alt="LINK'D UP" width="560" style="width:100%;max-width:560px;height:auto;display:block;" />
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
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `How was ${eventName}? Tell us! — LINK'D UP`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
    <div style="background:#000;">
      <img src="https://www.linkdup.club/images/hero-banner.png" alt="LINK'D UP" width="560" style="width:100%;max-width:560px;height:auto;display:block;" />
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

export async function sendSurveyThankYou({
  to,
  name,
  eventName,
}: {
  to: string
  name: string
  eventName?: string
}) {
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `Thank you! — LINK'D UP`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
    <div style="background:#000;">
      <img src="https://www.linkdup.club/images/hero-banner.png" alt="LINK'D UP" width="560" style="width:100%;max-width:560px;height:auto;display:block;" />
    </div>
    <div style="padding:36px 32px;">
      <p style="color:#e2e8f0;font-size:16px;margin:0 0 24px;">Hey ${name} 👋</p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Thank you for taking the time to share your feedback${eventName ? ` on <strong style="color:#c084fc;">${eventName}</strong>` : ''} — it genuinely helps us make every future LINK'D UP event better.
      </p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        We appreciate you coming out and supporting this community. Nights like this only work because people like you show up ready to connect, create, and build.
      </p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
        We can't wait to see you at the next one. Here's to continuing to build this thing together.
      </p>
      <p style="color:#e2e8f0;font-size:15px;margin:0;">With gratitude,<br /><strong style="color:#c084fc;">The LINK'D UP Team</strong></p>
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
