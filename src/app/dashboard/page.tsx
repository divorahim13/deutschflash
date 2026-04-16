import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Play, BarChart3, Clock, BookOpen } from 'lucide-react'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch quick stats
  const { count: totalCards } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })

  const { count: dueToday } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: addedToday } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())

  // Fetch recent cards
  const { data: recentCards, error: recentError } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)
    
  if (recentError) {
    console.log("Dashboard recent cards error details:", recentError.code, recentError.message, recentError.details);
  }
  
  const safeRecentCards = recentCards || [];

  const dailyTarget = 20;
  const addedCount = addedToday || 0;
  const dailyPercentage = Math.min(100, Math.round((addedCount / dailyTarget) * 100));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Willkommen, {user.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground">Targetmu: 20 Kata/Hari untuk ke Jerman! 🇩🇪</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0 justify-end md:justify-start">
          <Link href="/browse">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
              <BookOpen size={18} />
              Koleksi
            </Button>
          </Link>
          <Link href="/add">
            <Button variant="outline" className="gap-2">
              <Plus size={18} />
              Add Card
            </Button>
          </Link>
          <Link href="/review">
            <Button className="gap-2 bg-primary">
              <Play size={18} />
              Study Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Clock size={16} />
            <span>Due Today</span>
          </div>
          <div className="text-3xl font-bold">{dueToday || 0}</div>
          <p className="text-xs text-muted-foreground mt-2">Finish these to maintain your streak.</p>
        </div>
        
        <div className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <BarChart3 size={16} />
            <span>Total Vocabulary</span>
          </div>
          <div className="text-3xl font-bold">{totalCards || 0}</div>
          <p className="text-xs text-muted-foreground mt-2">Words collected in total.</p>
        </div>

        <div className="p-6 rounded-2xl border bg-primary/5 border-primary/20 flex flex-col gap-2 relative overflow-hidden">
          {addedCount >= dailyTarget && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-3 py-1 font-bold rounded-bl-xl">KEJUTAN TERCAPAI! 🎉</div>
          )}
          <div className="flex items-center gap-2 text-primary text-sm font-medium font-bold">
            <span>Daily Goal (Kata Baru)</span>
          </div>
          <div className="text-3xl font-bold">{addedCount}/{dailyTarget}</div>
          <div className="w-full bg-primary/10 rounded-full h-2 mt-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${dailyPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-muted/20 border rounded-3xl p-12 text-center flex flex-col items-center gap-4 mb-12">
        <div className="bg-background p-4 rounded-full shadow-inner">
          <Play size={48} className="text-primary translate-x-1" />
        </div>
        <h2 className="text-2xl font-semibold">Start your study session</h2>
        <p className="max-w-md text-muted-foreground">
          Our SRS algorithm will show you exactly what you need to review to optimize your long-term memory.
        </p>
        <Link href="/review" className="w-full max-w-sm">
          <Button size="lg" className="mt-4 px-8 py-6 text-lg rounded-full w-full">
            Begin Session
          </Button>
        </Link>
      </div>

      {/* RECENT CARDS SECTION DELETED PER USER REQUEST */}
    </div>
  )
}
