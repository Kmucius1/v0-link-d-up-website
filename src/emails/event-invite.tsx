import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'

interface EventInviteEmailProps {
  firstName: string
  eventName: string
  eventDate: string
  eventTime: string
  locationName: string
  address: string
  rsvpLink: string
  unsubscribeUrl: string
}

export default function EventInviteEmail({
  firstName, eventName, eventDate, eventTime,
  locationName, address, rsvpLink, unsubscribeUrl,
}: EventInviteEmailProps) {
  return (
    <Html><Head />
      <Preview>Join us for another night of connection, creativity, and opportunity.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>LINK'D UP</Text>
          </Section>
          <Section style={heroSection}>
            <Heading style={heading}>You're invited to the next LINK'D UP.</Heading>
            <Text style={subheading}>Connection. Creativity. Community. Opportunity.</Text>
          </Section>
          <Section style={card}>
            <Text style={cardLabel}>SAVE THE DATE</Text>
            <Text style={cardDetail}>{eventName}</Text>
            <Text style={cardDetail}>{eventDate} · {eventTime}</Text>
            <Text style={cardDetail}>{locationName}</Text>
            <Text style={cardDetailMuted}>{address}</Text>
          </Section>
          <Section style={bodySection}>
            <Text style={bodyText}>
              Hey {firstName} — the next LINK'D UP is coming up and you're getting the first invite.
            </Text>
            <Text style={bodyText}>
              This is your invite to come connect with creators, entrepreneurs, artists, business owners, educators, influencers, and people from all kinds of industries.
            </Text>
            <Text style={bodyText}>
              Bring your friends, partners, colleagues, coworkers, and collaborators. Anyone who creates, builds, teaches, performs, or wants to meet great people belongs in this room.
            </Text>
          </Section>
          <Section style={ctaSection}>
            <Button style={primaryButton} href={rsvpLink}>RSVP Now</Button>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>LINK'D UP</Text>
            <Text style={footerMuted}>linkdup.club · @linkdupnetwork</Text>
            <Text style={footerMuted}>Brought to you by DRYP Digital</Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>Unsubscribe or manage preferences</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#000000', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px 16px' }
const logoSection = { textAlign: 'center' as const, padding: '24px 0 8px' }
const logoText = { color: '#a8d8f0', fontSize: '22px', fontWeight: '700', letterSpacing: '4px', margin: '0' }
const heroSection = { textAlign: 'center' as const, padding: '32px 0 24px' }
const heading = { color: '#ffffff', fontSize: '34px', fontWeight: '800', margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: '1.2' }
const subheading = { color: '#a8d8f0', fontSize: '16px', margin: '0' }
const card = { backgroundColor: '#111111', border: '1px solid #1e3a4a', borderRadius: '12px', padding: '24px 28px', margin: '0 0 24px' }
const cardLabel = { color: '#a8d8f0', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 12px' }
const cardDetail = { color: '#ffffff', fontSize: '17px', fontWeight: '600', margin: '0 0 4px' }
const cardDetailMuted = { color: '#888888', fontSize: '15px', margin: '4px 0 0' }
const bodySection = { padding: '8px 0 24px' }
const bodyText = { color: '#cccccc', fontSize: '16px', lineHeight: '1.7', margin: '0 0 16px' }
const ctaSection = { textAlign: 'center' as const, padding: '8px 0 32px' }
const primaryButton = { backgroundColor: '#a8d8f0', color: '#000000', padding: '14px 40px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#1a1a1a', margin: '16px 0' }
const footer = { textAlign: 'center' as const, padding: '16px 0' }
const footerText = { color: '#a8d8f0', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 4px' }
const footerMuted = { color: '#555555', fontSize: '13px', margin: '0 0 4px' }
const unsubscribeLink = { color: '#444444', fontSize: '12px', textDecoration: 'underline' }
