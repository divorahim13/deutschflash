'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, RotateCcw, Send, Sparkles, MessageCircle, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getReviewCards, rateCard, checkSentence } from './actions'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

export default function ReviewPage() {
  const { t } = useLanguage()
  const [cards, setCards] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [sessionFinished, setSessionFinished] = useState(false)
  
  // Sentence Mode State
  const [isSentenceMode, setIsSentenceMode] = useState(false)
  const [sentence, setSentence] = useState('')
  const [sentenceFeedback, setSentenceFeedback] = useState<any>(null)
  const [checkingSentence, setCheckingSentence] = useState(false)

  useEffect(() => {
    async function init() {
      const res = await getReviewCards()
      if (res.cards) {
        setCards(res.cards)
      }
      setLoading(false)
    }
    init()
  }, [])

  const currentCard = cards[currentIndex]

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnswered(true)
    setIsFlipped(true)
  }

  const handleRate = async (rating: number) => {
    if (!currentCard) return
    
    setLoading(true)
    await rateCard(currentCard.id, rating)
    
    if (rating >= 3) setStats(prev => ({ ...prev, correct: prev.correct + 1 }))
    setStats(prev => ({ ...prev, total: prev.total + 1 }))

    // Logic for next card or sentence mode
    const nextIndex = currentIndex + 1
    const shouldDoSentence = (nextIndex > 0 && nextIndex % 5 === 0) && nextIndex < cards.length

    if (shouldDoSentence) {
      setIsSentenceMode(true)
    } else if (nextIndex >= cards.length) {
      setSessionFinished(true)
    } else {
      setCurrentIndex(nextIndex)
      resetCardState()
    }
    setLoading(false)
  }

  const resetCardState = () => {
    setIsAnswered(false)
    setIsFlipped(false)
    setUserAnswer('')
    setIsSentenceMode(false)
    setSentence('')
    setSentenceFeedback(null)
  }

  const handleSentenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckingSentence(true)
    const feedback = await checkSentence(currentCard.kata_jerman, sentence)
    setSentenceFeedback(feedback)
    setCheckingSentence(false)
  }

  const proceedFromSentence = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= cards.length) {
      setSessionFinished(true)
    } else {
      setCurrentIndex(nextIndex)
      resetCardState()
    }
  }

  if (loading && cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RotateCcw className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse">{t.review.loading}</p>
      </div>
    )
  }

  // Handle case where no cards are due (and not loading)
  if (!loading && cards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg">
        <div className="bg-primary/10 p-8 rounded-full mb-8 relative">
          <Sparkles size={64} className="text-primary animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Fertig!
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">{t.review.empty.title}</h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          {t.review.empty.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full py-6 text-lg rounded-2xl">
              {t.review.empty.back}
            </Button>
          </Link>
          <Link href="/add" className="flex-1">
            <Button className="w-full py-6 text-lg rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <PlusCircle size={20} className="mr-2" />
              {t.review.empty.addNew}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (sessionFinished) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">{t.review.finished.title}</h1>
        <p className="text-muted-foreground mb-8">{t.review.finished.subtitle.replace('{count}', stats.total.toString())}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border p-4 rounded-2xl">
            <div className="text-2xl font-bold">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">{t.review.finished.accuracy}</div>
          </div>
          <div className="bg-card border p-4 rounded-2xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">{t.review.finished.vocab}</div>
          </div>
        </div>

        <Link href="/dashboard">
          <Button className="w-full py-6 text-lg rounded-2xl">{t.review.finished.back}</Button>
        </Link>
      </div>
    )
  }

  if (isSentenceMode && currentCard) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
         <div className="text-center mb-8">
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 mb-4">
              <Sparkles size={14} /> {t.review.sentenceMode.title}
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.review.sentenceMode.title}</h2>
            <p className="text-muted-foreground">{t.review.sentenceMode.subtitle} <span className="text-foreground font-bold underline">{currentCard.kata_jerman}</span></p>
         </div>

         <Card className="glass shadow-xl mb-8">
            <CardContent className="pt-6 space-y-4">
               <form onSubmit={handleSentenceSubmit} className="space-y-4">
                  <Input 
                    placeholder={t.review.sentenceMode.placeholder} 
                    className="py-6 text-lg"
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    disabled={checkingSentence || !!sentenceFeedback}
                  />
                  {!sentenceFeedback && (
                    <Button type="submit" className="w-full gap-2" disabled={checkingSentence || !sentence}>
                      {checkingSentence ? <RotateCcw className="animate-spin" /> : <Send size={18} />}
                      {t.review.sentenceMode.check}
                    </Button>
                  )}
               </form>

               {sentenceFeedback && (
                 <div className={cn(
                   "p-4 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2",
                   sentenceFeedback.correct ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"
                 )}>
                    <div className="flex items-center gap-2 font-bold">
                       {sentenceFeedback.correct ? t.review.sentenceMode.correct : t.review.sentenceMode.almost}
                    </div>
                    <p className="text-sm">{sentenceFeedback.feedback}</p>
                    {sentenceFeedback.correction && (
                      <div className="text-sm italic text-muted-foreground mt-2 border-t pt-2">
                         {t.review.sentenceMode.correction} "{sentenceFeedback.correction}"
                      </div>
                    )}
                 </div>
               )}
            </CardContent>
         </Card>

         <Button 
           variant="secondary" 
           className="w-full py-6" 
           onClick={proceedFromSentence}
           disabled={!sentenceFeedback}
         >
           {t.review.sentenceMode.next}
         </Button>
      </div>
    )
  }

  if (!currentCard) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 px-8">
          <Progress value={(currentIndex / cards.length) * 100} className="h-2" />
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1}/{cards.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
        <div className="perspective-1000 w-full aspect-[16/10] max-h-[400px]">
           <div className={cn(
             "relative w-full h-full transition-all duration-700 preserve-3d shadow-xl rounded-[2.5rem]",
             isFlipped ? "rotate-y-180" : ""
           )}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-card border-2 flex flex-col items-center justify-center p-12 rounded-[2.5rem] text-center">
                 <div className="absolute top-6 left-6 text-xs text-muted-foreground uppercase font-bold tracking-widest">Frage</div>
                 <div className="text-3xl md:text-4xl font-bold text-primary">{currentCard.front}</div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground flex flex-col items-center justify-center p-8 rounded-[2.5rem] text-center overflow-y-auto">
                  <div className="absolute top-6 left-6 text-xs text-primary-foreground/60 uppercase font-bold tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} /> {t.review.finished.vocab}
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    {currentCard.article && <span className="text-primary-foreground/70 mr-2 font-normal italic text-2xl">{currentCard.article}</span>}
                    {currentCard.kata_jerman}
                  </div>

                  {/* Infinitiv badge when input was Partizip II */}
                  {currentCard.infinitiv && (
                    <div className="text-xs font-medium mb-1 opacity-70 border border-white/20 px-2 py-0.5 rounded-full inline-block">
                      ∞ {currentCard.infinitiv}
                    </div>
                  )}

                  {currentCard.plural && (
                    <div className="text-sm font-medium mb-3 opacity-80">
                      pl: {currentCard.plural}
                    </div>
                  )}

                  <div className="text-lg md:text-xl opacity-90 max-w-md leading-relaxed mb-6">
                    {currentCard.arti_indo || currentCard.back}
                  </div>

                  {/* Grammar Grid */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-6 text-[11px]">
                    {currentCard.regular_or_irregular && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">{t.grammar.verbType}</div>
                        <div className="font-bold">{currentCard.regular_or_irregular === 'regular' ? t.grammar.regular : t.grammar.irregular}</div>
                      </div>
                    )}
                    {currentCard.trennbar_or_untrennbar && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">Separable</div>
                        <div className="font-bold">{currentCard.trennbar_or_untrennbar === 'trennbar' ? t.grammar.separable : t.grammar.inseparable}</div>
                      </div>
                    )}
                    {currentCard.transitive_or_intransitive && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">Transitive</div>
                        <div className="font-bold">{currentCard.transitive_or_intransitive === 'transitive' ? t.grammar.transitive : t.grammar.intransitive}</div>
                      </div>
                    )}
                    {currentCard.grammar_note && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm col-span-2 text-left">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">{t.grammar.grammarNote}</div>
                        <p className="italic leading-snug">{currentCard.grammar_note}</p>
                      </div>
                    )}
                  </div>

                  {currentCard.tags && (
                    <div className="flex flex-wrap gap-2 justify-center opacity-60">
                      {currentCard.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold">{tag}</span>
                      ))}
                    </div>
                  )}
              </div>
           </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          {!isAnswered ? (
            <form onSubmit={handleAnswerSubmit} className="flex gap-2">
              <Input 
                placeholder="Type the word..." 
                className="py-6 px-6 text-lg rounded-2xl bg-muted/30 border-none shadow-inner"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="icon" className="w-14 h-14 rounded-2xl bg-primary shadow-lg hover:translate-y-[-2px] transition-all">
                 <CheckCircle2 size={24} />
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4">
              <Button onClick={() => handleRate(1)} variant="outline" className="flex flex-col h-20 border-red-500/50 hover:bg-red-500/10 hover:text-red-500 rounded-2xl group">
                <span className="text-lg font-bold">{t.review.again}</span>
                <span className="text-[10px] uppercase opacity-60">Wait 1m</span>
              </Button>
              <Button onClick={() => handleRate(2)} variant="outline" className="flex flex-col h-20 border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-500 rounded-2xl group">
                <span className="text-lg font-bold">{t.review.hard}</span>
                <span className="text-[10px] uppercase opacity-60">Shorter</span>
              </Button>
              <Button onClick={() => handleRate(3)} variant="outline" className="flex flex-col h-20 border-primary/50 hover:bg-primary/10 hover:text-primary rounded-2xl group">
                <span className="text-lg font-bold">{t.review.good}</span>
                <span className="text-[10px] uppercase opacity-60">Standard</span>
              </Button>
              <Button onClick={() => handleRate(4)} variant="outline" className="flex flex-col h-20 border-green-500/50 hover:bg-green-500/10 hover:text-green-500 rounded-2xl group">
                <span className="text-lg font-bold">{t.review.easy}</span>
                <span className="text-[10px] uppercase opacity-60">Longer</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  )
}
