import { supabaseAdmin } from './supabase-admin'

export async function isAcceptedConnection(memberIdA: string, memberIdB: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('connections')
    .select('id')
    .eq('status', 'accepted')
    .or(`and(requesterId.eq.${memberIdA},recipientId.eq.${memberIdB}),and(requesterId.eq.${memberIdB},recipientId.eq.${memberIdA})`)
    .maybeSingle()
  if (error) console.error('[isAcceptedConnection]', error.message)
  return Boolean(data)
}
