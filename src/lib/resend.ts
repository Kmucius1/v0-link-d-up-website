import { Resend } from 'resend'

// Lazy — only instantiated at runtime (not during next build)
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export function getFrom(): string {
  const email = process.env.RESEND_FROM_EMAIL || 'linkdup@drypdigital.com'
  const name = process.env.RESEND_FROM_NAME || "LINK'D UP"
  return `${name} <${email}>`
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://linkdup.club'
