import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  if (supabaseUrl.includes('placeholder') && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Supabase URL is missing! Ensure NEXT_PUBLIC_SUPABASE_URL is set in .env.local')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
