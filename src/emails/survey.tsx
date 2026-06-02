import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'

interface SurveyEmailProps {
  firstName: string
  surveyLink: string
  unsubscribeUrl: string
}

export default function SurveyEmail({ firstName, surveyLink, unsubscribeUrl }: SurveyEmailProps) {
  return (
    <Html><Head />
      <Preview>Tell us what you want this community to become.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>LINK'D UP</Text>
          </Section>
          <Section style={heroSection}>
            <Heading style={heading}>Help shape the next LINK'D UP.</Heading>
            <Text style={subheading}>Your voice builds this community.</Text>
          </Section>
          <Section style={bodySection}>
            <Text style={bodyText}>
              Hey {firstName} — LINK'D UP is being built for the people who create, build, teach, connect, perform, sell, lead, and grow.
            </Text>
            <Text style={bodyText}>We want to know what you want next:</Text>
          </Section>
          <Section style={gridSection}>
            {[
              'More mixers?',
              'Guest speakers?',
              'Workshops?',
              'Art nights?',
              'Creator meetups?',
              'Business referral events?',
              'Live music?',
              'Vendor opportunities?',
              'Sponsor opportunities?',
              'Member features?',
            ].map((item) => (
              <Text key={item} style={gridItem}>→ {item}</Text>
            ))}
          </Section>
          <Section style={bodySection}>
            <Text style={bodyText}>Your feedback helps shape the next event and what this community becomes.</Text>
          </Section>
          <Section style={ctaSection}>
            <Button style={primaryButton} href={surveyLink}>Share Your Ideas</Button>
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
const heading = { color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '0 0 12px', letterSpacing: '-0.5px' }
const subheading = { color: '#a8d8f0', fontSize: '17px', margin: '0' }
const bodySection = { padding: '8px 0 16px' }
const bodyText = { color: '#cccccc', fontSize: '16px', lineHeight: '1.7', margin: '0 0 16px' }
const gridSection = { backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px 24px', margin: '0 0 24px' }
const gridItem = { color: '#a8d8f0', fontSize: '15px', margin: '0 0 8px', lineHeight: '1.5' }
const ctaSection = { textAlign: 'center' as const, padding: '8px 0 32px' }
const primaryButton = { backgroundColor: '#a8d8f0', color: '#000000', padding: '14px 32px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#1a1a1a', margin: '16px 0' }
const footer = { textAlign: 'center' as const, padding: '16px 0' }
const footerText = { color: '#a8d8f0', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 4px' }
const footerMuted = { color: '#555555', fontSize: '13px', margin: '0 0 4px' }
const unsubscribeLink = { color: '#444444', fontSize: '12px', textDecoration: 'underline' }
