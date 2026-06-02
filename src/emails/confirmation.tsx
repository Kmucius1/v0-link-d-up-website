import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ConfirmationEmailProps {
  firstName: string
  eventName: string
  eventDate: string
  eventTime: string
  locationName: string
  address: string
  facebookEventLink?: string
  unsubscribeUrl: string
}

export default function ConfirmationEmail({
  firstName,
  eventName,
  eventDate,
  eventTime,
  locationName,
  address,
  facebookEventLink,
  unsubscribeUrl,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You're on the list for {eventDate} at {locationName}.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Text style={logoText}>LINK'D UP</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heading}>You're RSVP'd.</Heading>
            <Text style={subheading}>
              You're officially on the list for <strong>{eventName}</strong>.
            </Text>
          </Section>

          {/* Event Details Card */}
          <Section style={card}>
            <Text style={cardLabel}>EVENT DETAILS</Text>
            <Text style={cardDetail}>{eventDate}</Text>
            <Text style={cardDetail}>{eventTime}</Text>
            <Text style={cardDetail}>{locationName}</Text>
            <Text style={cardDetailMuted}>{address}</Text>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={bodyText}>
              Hey {firstName}, we can't wait to see you.
            </Text>
            <Text style={bodyText}>
              LINK'D UP is a night built for artists, creators, entrepreneurs, business owners, educators, influencers, musicians, and anyone ready to connect, collaborate, and create real opportunities.
            </Text>
            <Text style={bodyText}>
              Expect beer, wine, live music, art, networking, and a room full of people ready to build together.
            </Text>
            <Text style={bodyText}>
              <strong>Bring your people.</strong> Friends, partners, colleagues, coworkers, collaborators — anyone who creates, builds, teaches, performs, or wants to meet great people is welcome here.
            </Text>
          </Section>

          {/* CTAs */}
          <Section style={ctaSection}>
            <Button style={primaryButton} href={facebookEventLink || 'https://linkdup.club'}>
              Join the Facebook Event
            </Button>
            <Button style={secondaryButton} href="https://linkdup.club">
              Invite a Friend
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>LINK'D UP</Text>
            <Text style={footerMuted}>linkdup.club · @linkdupnetwork</Text>
            <Text style={footerMuted}>Brought to you by DRYP Digital</Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe or manage preferences
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '24px 16px',
}

const logoSection = {
  textAlign: 'center' as const,
  padding: '24px 0 8px',
}

const logoText = {
  color: '#a8d8f0',
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '4px',
  margin: '0',
}

const heroSection = {
  textAlign: 'center' as const,
  padding: '32px 0 24px',
}

const heading = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '800',
  margin: '0 0 12px',
  letterSpacing: '-0.5px',
}

const subheading = {
  color: '#a8d8f0',
  fontSize: '17px',
  margin: '0',
  lineHeight: '1.5',
}

const card = {
  backgroundColor: '#111111',
  border: '1px solid #1e3a4a',
  borderRadius: '12px',
  padding: '24px 28px',
  margin: '0 0 24px',
}

const cardLabel = {
  color: '#a8d8f0',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0 0 12px',
}

const cardDetail = {
  color: '#ffffff',
  fontSize: '17px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const cardDetailMuted = {
  color: '#888888',
  fontSize: '15px',
  margin: '4px 0 0',
}

const bodySection = {
  padding: '8px 0 24px',
}

const bodyText = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '0 0 16px',
}

const ctaSection = {
  textAlign: 'center' as const,
  padding: '8px 0 32px',
}

const primaryButton = {
  backgroundColor: '#a8d8f0',
  color: '#000000',
  padding: '14px 32px',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '0 8px 12px',
}

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#a8d8f0',
  padding: '13px 32px',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
  border: '1px solid #a8d8f0',
  margin: '0 8px 12px',
}

const hr = {
  borderColor: '#1a1a1a',
  margin: '16px 0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '16px 0',
}

const footerText = {
  color: '#a8d8f0',
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0 0 4px',
}

const footerMuted = {
  color: '#555555',
  fontSize: '13px',
  margin: '0 0 4px',
}

const unsubscribeLink = {
  color: '#444444',
  fontSize: '12px',
  textDecoration: 'underline',
}
