import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { startOfDay, subDays, format } from 'date-fns'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Total Vocab
  const { count: totalVocab } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // 2. Today Reviews
  const { count: todayReviews } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())

  // 3. Accuracy % (Average easiness or reps vs lapses)
  const { data: accuracyData } = await supabase
    .from('cards')
    .select('reps, lapses')
    .eq('user_id', user.id)

  let totalReps = 0
  let totalLapses = 0
  accuracyData?.forEach(c => {
    totalReps += c.reps
    totalLapses += c.lapses
  })
  const accuracy = totalReps > 0 ? Math.round((totalReps / (totalReps + totalLapses)) * 100) : 100

  // 4. Weak Words
  const { data: weakWords } = await supabase
    .from('cards')
    .select('id, kata_jerman, arti_indo, lapses')
    .eq('user_id', user.id)
    .gt('lapses', 0)
    .order('lapses', { ascending: false })
    .limit(10)

  // 5. Progress Chart (Last 7 days)
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const day = subDays(new Date(), i)
    const dayStr = format(day, 'yyyy-MM-dd')
    const start = startOfDay(day).toISOString()
    const end = startOfDay(subDays(day, -1)).toISOString()

    const { count } = await supabase
      .from('review_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', start)
      .lt('created_at', end)

    chartData.push({ date: format(day, 'MMM dd'), reps: count || 0 })
  }

  // 6. Streak
  // Simple streak: find consecutive days with logs starting from today
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const day = subDays(new Date(), i)
    const start = startOfDay(day).toISOString()
    const end = startOfDay(subDays(day, -1)).toISOString()
    const { count } = await supabase
      .from('review_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', start)
      .lt('created_at', end)
    
    if (count && count > 0) streak++
    else if (i === 0) continue // Skip today if no logs yet
    else break
  }

  // 7. Daily Goal Progress (Today's logs)
  const { count: logsToday } = await supabase
    .from('review_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfDay(new Date()).toISOString())

  return NextResponse.json({
    totalVocab: totalVocab || 0,
    todayReviews: todayReviews || 0,
    accuracy,
    weakWords: weakWords || [],
    chartData,
    streak,
    weeklyGoal: logsToday || 0
  })
}
