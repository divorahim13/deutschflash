export type Card = {
  id: string
  user_id: string
  kata_jerman: string
  arti_indo: string
  front: string
  back: string
  tags: string[]
  easiness: number
  interval_days: number
  next_review: string
  reps: number
  lapses: number
  created_at?: string
  article?: string
  plural?: string
  regular_or_irregular?: string
  trennbar_or_untrennbar?: string
  transitive_or_intransitive?: string
  grammar_note?: string
  retrieval_question?: string
  source_context?: string
  infinitiv?: string
}

export type ReviewLog = {
  id: string
  user_id: string
  card_id: string
  rating: number
  created_at: string
}

export type DashboardStats = {
  totalVocab: number
  todayReviews: number
  accuracy: number
  weakWords: Partial<Card>[]
  chartData: { date: string; reps: number }[]
  streak: number
  weeklyGoal: number
}
