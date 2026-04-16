'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.session) {
    redirect('/dashboard')
  } else {
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) {
      return { msg: 'Account created! Please log in.' }
    }
    redirect('/dashboard')
  }
}
