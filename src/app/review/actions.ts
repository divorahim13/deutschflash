'use server'

import { createClient } from '@/lib/supabase/server'
import { addDays } from 'date-fns'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getReviewCards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Fetch 10 new cards (reps = 0)
  const { data: newCards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('reps', 0)
    .limit(10)

  // Fetch 20 due cards (next_review <= now)
  const { data: dueCards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())
    .gt('reps', 0)
    .order('interval_days', { ascending: true })
    .limit(20)

  // Combine and shuffle
  const combined = [...(newCards || []), ...(dueCards || [])]
  return { cards: combined.sort(() => Math.random() - 0.5) }
}

export async function rateCard(cardId: string, rating: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card) return { error: 'Card not found' }

  let { easiness, interval_days, reps, lapses } = card

  // FSRS Simple Logic
  if (rating < 3) {
    // Again / Hard (fail-ish)
    interval_days = Math.max(1, Math.floor(interval_days * 0.5))
    lapses++
    easiness = Math.max(1.3, easiness - 0.2)
  } else {
    // Good / Easy
    interval_days = Math.max(1, Math.floor(interval_days * rating))
    easiness = Math.min(4.0, easiness + 0.1)
  }

  reps++
  const nextReview = addDays(new Date(), interval_days).toISOString()

  const { error } = await supabase
    .from('cards')
    .update({
      easiness,
      interval_days,
      reps,
      lapses,
      next_review: nextReview,
    })
    .eq('id', cardId)

  if (error) return { error: error.message }

  // Record the review in the logs
  await supabase
    .from('review_logs')
    .insert({
      user_id: user.id,
      card_id: cardId,
      rating,
    })

  return { success: true, nextReview }
}

export async function checkSentence(kata: string, sentence: string) {
  try {
    const prompt = `Evaluate this German sentence for the word '${kata}': "${sentence}".
Check if it makes sense and is grammatically correct for A2 level.
Return JSON: { "correct": boolean, "feedback": "Brief feedback in Indonesian", "correction": "Corrected version if wrong" }`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'You are a German teacher.' }, { role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    return content ? JSON.parse(content) : { error: 'AI Error' }
  } catch (err) {
    return { error: 'Failed to evaluate sentence' }
  }
}
