'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/StatsCard'
import { ProgressChart } from '@/components/ProgressChart'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Clock, 
  Target, 
  Flame, 
  Sparkles, 
  Play, 
  Plus, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

export default function Dashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchStats = async () => {
    const res = await fetch('/api/stats')
    const data = await res.json()
    if (!data.error) setStats(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()

    // Realtime subscription
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => {
        fetchStats()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'review_logs' }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">{t.review.loading}</p>
      </div>
    )
  }

  const dailyGoal = 20
  const dailyProgress = Math.min((stats?.weeklyGoal / dailyGoal) * 100, 100)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">{t.dashboard.title}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/add" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5">
              <Plus size={18} />
              {t.dashboard.addCard}
            </Button>
          </Link>
          <Link href="/review" className="flex-1 md:flex-none">
            <Button className="w-full gap-2 bg-primary shadow-lg shadow-primary/20">
              <Play size={18} />
              {t.dashboard.studyNow}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Stats & Chart */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title={t.dashboard.totalVocab} 
              value={stats.totalVocab} 
              icon={BookOpen} 
              subValue="Words"
            />
            <StatsCard 
              title={t.dashboard.dueToday} 
              value={stats.todayReviews} 
              icon={Clock} 
              className={stats.todayReviews > 0 ? "border-amber-500/20" : ""}
            />
            <StatsCard 
              title={t.dashboard.accuracy} 
              value={`${stats.accuracy}%`} 
              icon={Target} 
              trend={stats.accuracy > 80 ? "up" : "neutral"}
            />
          </div>

          {/* Progress Chart */}
          <ProgressChart data={stats.chartData} />

          {/* Gamification / Daily Goal */}
          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
             <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">{t.dashboard.dailyGoal}</CardTitle>
                  <div className="flex items-center gap-1 text-primary">
                    <Flame size={18} fill="currentColor" />
                    <span className="font-bold">{stats.streak} {t.dashboard.streak}</span>
                  </div>
                </div>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-xs sm:text-sm">{stats.weeklyGoal} / {dailyGoal} cards learned today</span>
                      <span className="font-bold">{Math.round(dailyProgress)}%</span>
                   </div>
                   <Progress value={dailyProgress} className="h-3 grow" />
                   {dailyProgress >= 100 && (
                     <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
                       <CheckCircle2 size={14} /> {t.dashboard.goalAchieved}
                     </p>
                   )}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Weak Words & Sidebar */}
        <div className="space-y-8">
          {/* Weak Words List */}
          <Card className="border-border/40 glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" />
                {t.dashboard.problemWords}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  {stats.weakWords.length > 0 ? stats.weakWords.map((word: any) => (
                    <div key={word.id} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="font-bold text-sm">{word.kata_jerman}</div>
                        <div className="text-xs text-muted-foreground">{word.arti_indo}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                          {word.lapses} lapses
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No weak words yet. Keep studying!
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>

          {/* Tips / Mini Promo */}
          <Card className="bg-muted/30 border-none">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                 <TrendingUp size={16} />
                 {t.dashboard.proTip}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.dashboard.proTipContent || "Reviewing cards in the morning increases retention by up to 20%. Set a reminder to hit your daily goal early!"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <BarChart3 size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded text-white">Goethe A2</span>
               </div>
               <h3 className="font-bold text-lg mb-2">{t.dashboard.masterLevel}</h3>
               <p className="text-xs text-white/80 mb-4 leading-relaxed">
                 You are currently targeting A2 vocabulary. Finish 200 more cards to unlock the B1 set!
               </p>
               <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                 {t.dashboard.curriculum}
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
