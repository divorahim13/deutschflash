'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Sanitize null/empty values from AI output
const clean = (val: any): string | null => {
  if (!val || val === 'null' || val === 'none' || val === '-' || val === '') return null
  return String(val).trim()
}

export async function quickAddCard(formData: FormData) {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Kamu belum login. Silakan login terlebih dahulu.' }
  }

  const inputRaw = (formData.get('kata_jerman') as string)?.trim()
  const konteks = (formData.get('konteks') as string)?.trim() ?? ''

  if (!inputRaw) return { error: 'Kata Jerman wajib diisi.' }

  // 2. AI Generation — smart, efficient, all word types supported
  let cardData: any
  try {
    const systemPrompt = `You are a precise German language expert. Return ONLY valid compact JSON, no extra text.`

    const userPrompt = `Create a German flashcard for: "${inputRaw}"${konteks ? ` (context: ${konteks})` : ''}

RULES:
- If input has a typo or misspelling, silently correct it and set "korrektur" to the corrected word
- Detect word type: Nomen, Verb, Adjektiv, Adverb, Präposition, Konjunktion, Phrase
- Only fill grammar fields RELEVANT to the word type (e.g. article/plural only for Nomen; verb fields only for Verb)
- "infinitiv" ONLY if input is a conjugated verb form or Partizip II (e.g. gedauert→dauern, läuft→laufen)
- Use Indonesian for "arti_indo", "back", and "grammar_note"

Return this JSON:
{
  "word": "the correct German word to save",
  "korrektur": "corrected spelling if typo was fixed, else null",
  "arti_indo": "Indonesian meaning (1-6 words max)",
  "front": "short retrieval question in German",
  "back": "Indonesian meaning + 1 short German example sentence",
  "word_type": "Nomen|Verb|Adjektiv|Adverb|Präposition|Konjunktion|Phrase",
  "level": "A1|A2|B1|B2|C1",
  "tags": ["word_type"],
  "article": "der|die|das — Nomen only, else null",
  "plural": "plural form — Nomen only, else null",
  "infinitiv": "base infinitive — only if input is conjugated/Partizip II verb, else null",
  "regular_or_irregular": "regular|irregular — Verb only, else null",
  "trennbar_or_untrennbar": "trennbar|untrennbar — Verb only, else null",
  "transitive_or_intransitive": "transitive|intransitive — Verb only, else null",
  "grammar_note": "one short grammar tip in Indonesian, or null"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 400,
      temperature: 0.2,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('AI tidak menghasilkan konten')
    cardData = JSON.parse(content)
  } catch (error: any) {
    console.error('AI Error:', error)
    return { error: 'Gagal membuat kartu dengan AI: ' + error.message }
  }

  // Use corrected word if AI fixed a typo
  const kataJerman = clean(cardData.word) || inputRaw
  const korrektur = clean(cardData.korrektur)

  // 3. Duplicate Check (using corrected word)
  const { data: existingCard } = await supabase
    .from('cards')
    .select('id, kata_jerman, front, back, arti_indo, tags, article, plural, regular_or_irregular, trennbar_or_untrennbar, transitive_or_intransitive, grammar_note, infinitiv')
    .eq('user_id', user.id)
    .eq('kata_jerman', kataJerman)
    .maybeSingle()

  if (existingCard) {
    return { error: 'Duplicate!', existingCard }
  }

  // 4. Insert into DB
  try {
    const { data: newCard, error: insertError } = await supabase
      .from('cards')
      .insert({
        user_id: user.id,
        kata_jerman: kataJerman,
        arti_indo: cardData.arti_indo,
        front: cardData.front,
        back: cardData.back,
        tags: cardData.tags ?? [cardData.word_type ?? 'Wort'],
        easiness: 2.5,
        interval_days: 1,
        reps: 0,
        lapses: 0,
        next_review: new Date().toISOString(),
        article: clean(cardData.article),
        plural: clean(cardData.plural),
        regular_or_irregular: clean(cardData.regular_or_irregular),
        trennbar_or_untrennbar: clean(cardData.trennbar_or_untrennbar),
        transitive_or_intransitive: clean(cardData.transitive_or_intransitive),
        grammar_note: clean(cardData.grammar_note),
        infinitiv: clean(cardData.infinitiv),
        retrieval_question: clean(cardData.front),
        source_context: null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert Error:', insertError)
      return { error: `Gagal menyimpan kartu: ${insertError.message}` }
    }

    return { success: true, card: newCard, korrektur }
  } catch (error: any) {
    console.error('DB Error:', error)
    return { error: 'Database error: ' + error.message }
  }
}
