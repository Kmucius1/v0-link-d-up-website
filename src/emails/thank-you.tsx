import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'

interface ThankYouEmailProps {
  firstName: string
  surveyLink: string
  unsubscribeUrl: string
}

export default function ThankYouEmail({ firstName, surveyLink, unsubscribeUrl }: ThankYouEmailProps) {
  return (
    <Html><Head />
      <Preview>Help us shape what comes next.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>LINK'D UP</Text>
          </Section>
          <Section style={heroSection}>
            <Heading style={heading}>Thank you for being part of LINK'D UP.</Heading>
          </Section>
          <Section style={bodySection}>
            <Text style={bodyText}>
              Hey {firstName} — thank you for showing up and being part of something real.
            </Text>
            <Text style={bodyText}>
              This community is being shaped by the people in it. We want your honest thoughts, ideas, and feedback so future events can be even better.
            </Text>
            <Text style={bodyText}>
              Tell us what you loved, what we should change, what we should add, and what you want to see next. Every response helps us build something that actually serves you.
            </Text>
          </Section>
          <Section style={ctaSection}>
            <Button style={primaryButton} href={surveyLink}>Take the Feedback Survey</Button>
          </Section>
          <Hr style={divider} />
          <Section style={teaseSection}>
            <Text style={teaseLabel}>WHAT'S NEXT</Text>
            <Text style={teaseText}>
              The next LINK'D UP is already in the works. Stay connected — you'll get the invite first.
            </Text>
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
const heading = { color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: '0', letterSpacing: '-0.5px', lineHeight: '1.3' }
const bodySection = { padding: '8px 0 24px' }
const bodyText = { color: '#cccccc', fontSize: '16px', lineHeight: '1.7', margin: '0 0 16px' }
const ctaSection = { textAlign: 'center' as const, padding: '8px 0 32px' }
const primaryButton = { backgroundColor: '#a8d8f0', color: '#000000', padding: '14px 32px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }
const divider = { borderColor: '#1a1a1a', margin: '8px 0 24px' }
const teaseSection = { backgroundColor: '#0a0a0a', border: '1px solid #111', borderRadius: '12px', padding: '24px 28px', margin: '0 0 24px' }
const teaseLabel = { color: '#a8d8f0', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 10px' }
const teaseText = { color: '#aaaaaa', fontSize: '15px', lineHeight: '1.6', margin: '0' }
const hr = { borderColor: '#1a1a1a', margin: '16px 0' }
const footer = { textAlign: 'center' as const, padding: '16px 0' }
const footerText = { color: '#a8d8f0', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 4px' }
const footerMuted = { color: '#555555', fontSize: '13px', margin: '0 0 4px' }
const unsubscribeLink = { color: '#444444', fontSize: '12px', textDecoration: 'underline' }
