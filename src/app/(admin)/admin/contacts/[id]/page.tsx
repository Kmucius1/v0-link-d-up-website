import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import { ContactDetail } from '@/components/admin/ContactDetail'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: raw } = await supabaseAdmin
    .from('contacts')
    .select(`
      *,
      rsvps(*, events(*)),
      survey_responses(*, events(*)),
      contact_notes(*),
      contact_tags(*),
      opportunities(*, events(*))
    `)
    .eq('id', id)
    .single()

  if (!raw) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contact = {
    ...raw,
    rsvps: ((raw as any).rsvps ?? []).map((r: any) => ({ ...r, event: r.events })),
    surveyResponses: ((raw as any).survey_responses ?? []).map((s: any) => ({ ...s, event: s.events })),
    emailLogs: [],
    notes: (raw as any).contact_notes ?? [],
    tags: (raw as any).contact_tags ?? [],
    opportunities: ((raw as any).opportunities ?? []).map((o: any) => ({ ...o, event: o.events })),
  }

  return <ContactDetail contact={contact} />
}
