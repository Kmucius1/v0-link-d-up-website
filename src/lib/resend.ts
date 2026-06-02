import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@linkdup.club'
export const FROM_NAME = process.env.RESEND_FROM_NAME || "LINK'D UP"
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://linkdup.club'
