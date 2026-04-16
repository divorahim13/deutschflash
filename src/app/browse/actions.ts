'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAllCards() {
  const supabase = await createClient()

  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Get all cards ordered by newest first
  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('Error fetching cards details:', error.code, error.message, error.details);
    return { error: `DB Error [${error.code}]: ${error.message}` }
  }

  return { cards }
}
