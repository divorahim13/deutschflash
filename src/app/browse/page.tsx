'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, BookOpen, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { getAllCards } from './actions'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

export default function BrowsePage() {
  const { t } = useLanguage()
  const [cards, setCards] = useState<any[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const res = await getAllCards()
      if (res.error) {
        setErrorMessage(res.error)
      } else if (res.cards) {
        setCards(res.cards)
      }
      setLoading(false)
    }
    init()
  }, [])

  const currentCard = cards[currentIndex]

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RotateCcw className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse">Lade Karten...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg">
        <div className="bg-primary/10 p-8 rounded-full mb-8 relative">
          <BookOpen size={64} className="text-primary opacity-50" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">{t.browse?.title || 'Koleksi Kosakata'}</h1>
        
        {errorMessage ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium">
            Error: {errorMessage}
          </div>
        ) : null}

        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          {t.browse?.empty || 'Kamu belum mempunyai flashcard. Tambahkan kata baru untuk mulai membangun koleksi kamu.'}
        </p>
        
        <Link href="/dashboard" className="w-full">
          <Button variant="outline" className="w-full py-6 text-lg rounded-2xl">
            {t.browse?.backToDashboard || 'Kembali'}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 px-8">
          <Progress value={((currentIndex + 1) / cards.length) * 100} className="h-2" />
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1}/{cards.length}
        </div>
      </div>

      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold">{t.browse?.title || 'Koleksi Kosakata'}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4 w-full cursor-pointer" onClick={handleFlip}>
        <div className="perspective-1000 w-full aspect-[4/5] sm:aspect-[16/10] max-h-[500px]">
           <div className={cn(
             "relative w-full h-full transition-all duration-700 preserve-3d shadow-xl rounded-[2.5rem]",
             isFlipped ? "rotate-y-180" : ""
           )}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-card border-2 flex flex-col items-center justify-center p-12 rounded-[2.5rem] text-center hover:border-primary/50 transition-colors">
                 <div className="absolute top-6 left-6 text-xs text-muted-foreground uppercase font-bold tracking-widest">Frage</div>
                 <div className="text-3xl md:text-4xl font-bold text-primary">{currentCard?.front}</div>
                 <div className="absolute bottom-6 text-xs text-muted-foreground/50 italic flex items-center gap-1">
                   <RotateCcw size={12} /> {t.browse?.flip || 'Tap to flip'}
                 </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground flex flex-col items-center justify-start sm:justify-center p-6 sm:p-8 pt-14 sm:pt-8 rounded-[2.5rem] text-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="absolute top-5 sm:top-6 left-5 sm:left-6 text-xs text-primary-foreground/60 uppercase font-bold tracking-widest flex items-center gap-1">
                    <BookOpen size={12} /> Vokabel
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold mb-1 mt-2 sm:mt-4">
                    {currentCard?.article && <span className="text-primary-foreground/70 mr-2 font-normal italic text-2xl">{currentCard.article}</span>}
                    {currentCard?.kata_jerman}
                  </div>

                  {/* Infinitiv badge when input was Partizip II */}
                  {currentCard?.infinitiv && (
                    <div className="text-xs font-medium mb-1 opacity-70 border border-white/20 px-2 py-0.5 rounded-full inline-block">
                      ∞ {currentCard.infinitiv}
                    </div>
                  )}

                  {currentCard?.plural && (
                    <div className="text-sm font-medium mb-3 opacity-80">
                      pl: {currentCard.plural}
                    </div>
                  )}

                  <div className="text-lg md:text-xl opacity-90 max-w-md leading-relaxed mb-6">
                    {currentCard?.arti_indo || currentCard?.back}
                  </div>

                  {/* Grammar Grid */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-6 text-[11px]">
                    {currentCard?.regular_or_irregular && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">{t.grammar?.verbType || 'Tipe'}</div>
                        <div className="font-bold">{currentCard.regular_or_irregular === 'regular' ? (t.grammar?.regular || 'Regular') : (t.grammar?.irregular || 'Irregular')}</div>
                      </div>
                    )}
                    {currentCard?.trennbar_or_untrennbar && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">Separable</div>
                        <div className="font-bold">{currentCard.trennbar_or_untrennbar === 'trennbar' ? (t.grammar?.separable || 'Trennbar') : (t.grammar?.inseparable || 'Untrennbar')}</div>
                      </div>
                    )}
                    {currentCard?.transitive_or_intransitive && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">Transitive</div>
                        <div className="font-bold">{currentCard.transitive_or_intransitive === 'transitive' ? (t.grammar?.transitive || 'Transitive') : (t.grammar?.intransitive || 'Intransitive')}</div>
                      </div>
                    )}
                    {currentCard?.grammar_note && (
                      <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm col-span-2 text-left">
                        <div className="opacity-60 text-[9px] uppercase tracking-wider">{t.grammar?.grammarNote || 'Note'}</div>
                        <p className="italic leading-snug">{currentCard.grammar_note}</p>
                      </div>
                    )}
                  </div>

                  {currentCard?.tags && (
                    <div className="flex flex-wrap gap-2 justify-center opacity-60">
                      {currentCard.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold">{tag}</span>
                      ))}
                    </div>
                  )}
              </div>
           </div>
        </div>
      </div>

      <div className="w-full flex gap-4 mt-auto">
        <Button 
          variant="outline" 
          className="flex-1 py-8 rounded-2xl group" 
          onClick={(e) => { e.stopPropagation(); handlePrev() }}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-lg">{t.browse?.prev || 'Sebelumnya'}</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 py-8 rounded-2xl group" 
          onClick={(e) => { e.stopPropagation(); handleNext() }}
          disabled={currentIndex === cards.length - 1}
        >
          <span className="text-lg">{t.browse?.next || 'Selanjutnya'}</span>
          <ArrowRight className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
        </Button>
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
