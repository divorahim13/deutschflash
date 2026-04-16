'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, RotateCcw, PlusCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { quickAddCard } from './actions'
import { cn } from '@/lib/utils'
import { useLanguage } from "@/lib/i18n/context"

export default function AddPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [korrektur, setKorrektur] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    setIsFlipped(false)
    setKorrektur(null)

    const formData = new FormData(e.currentTarget)
    const res = await quickAddCard(formData)

    if (res.error) {
      setError(res.error)
      if (res.existingCard) setResult({ card: res.existingCard, isExisting: true })
    } else {
      setResult({ card: res.card, isExisting: false })
      if (res.korrektur) setKorrektur(res.korrektur)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} />
          {t.add.backToDashboard}
        </Link>
      </div>

      <div className="space-y-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <PlusCircle className="text-primary" />
            {t.add.title}
          </h1>
          <p className="text-muted-foreground">{t.add.subtitle}</p>
        </div>

        <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles size={120} />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{t.add.germanWord}</CardTitle>
            <CardDescription>{t.add.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kata_jerman">{t.add.germanWord}</Label>
                <Input 
                  id="kata_jerman" 
                  name="kata_jerman" 
                  placeholder="z.B. der Tisch, laufen..." 
                  className="py-6 text-lg border-primary/20 bg-primary/5 focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="konteks">{t.add.context}</Label>
                <Input 
                  id="konteks" 
                  name="konteks" 
                  placeholder="Context or sentence (optional)..." 
                  className="py-6 border-border/40"
                />
              </div>
              <Button type="submit" className="w-full py-6 text-lg gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t.add.generating}
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    {t.add.generate}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && !result?.isExisting && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 flex-wrap gap-y-2">
                {result.isExisting ? (
                  <span className="text-amber-500 block p-1 px-2 bg-amber-500/10 rounded text-sm">{t.add.duplicate}</span>
                ) : (
                  <span className="text-green-500 block p-1 px-2 bg-green-500/10 rounded text-sm">Kartu Baru Dibuat!</span>
                )}
                {korrektur && (
                  <span className="text-blue-400 block p-1 px-2 bg-blue-400/10 rounded text-xs border border-blue-400/20">
                    ✏️ Auto-koreksi: <span className="line-through opacity-60">{korrektur}</span> → <strong>{result.card.kata_jerman}</strong>
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">Klik kartu untuk balik</p>
            </div>

            {/* FLIP CARD UI */}
            <div 
              className="perspective-1000 w-full aspect-[16/10] cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={cn(
                "relative w-full h-full transition-all duration-500 preserve-3d shadow-2xl rounded-3xl",
                isFlipped ? "rotate-y-180" : ""
              )}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-card border-2 flex flex-col items-center justify-center p-8 rounded-3xl text-center">
                  <div className="text-muted-foreground text-sm mb-4 uppercase tracking-widest font-semibold">Frage</div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">{result.card.front || result.card.kata_jerman}</div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary text-primary-foreground flex flex-col items-center justify-center p-6 rounded-3xl text-center overflow-y-auto">
                   <div className="text-primary-foreground/60 text-[10px] mb-2 uppercase tracking-widest font-semibold flex items-center gap-1">
                     <Sparkles size={10} /> {t.add.previewTitle}
                   </div>
                   
                   <div className="text-2xl font-bold mb-1">
                     {result.card.article && <span className="text-primary-foreground/70 mr-2 font-normal italic">{result.card.article}</span>}
                     {result.card.kata_jerman}
                   </div>

                   {/* Show infinitiv if input was Partizip II */}
                   {result.card.infinitiv && (
                     <div className="text-xs font-medium mb-1 opacity-70 border border-white/20 px-2 py-0.5 rounded-full">
                       ∞ {result.card.infinitiv}
                     </div>
                   )}
                   
                   {result.card.plural && (
                     <div className="text-sm font-medium mb-2 opacity-80">
                       pl: {result.card.plural}
                     </div>
                   )}

                   <div className="text-base md:text-lg font-medium mb-4 opacity-90 leading-tight">
                     {result.card.arti_indo}
                   </div>

                   {/* Grammar Grid */}
                   <div className="grid grid-cols-2 gap-2 w-full max-w-[280px] mb-4 text-[10px]">
                     {result.card.regular_or_irregular && (
                       <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                         <div className="opacity-60">{t.grammar.verbType}</div>
                         <div className="font-bold">{result.card.regular_or_irregular === 'regular' ? t.grammar.regular : t.grammar.irregular}</div>
                       </div>
                     )}
                     {result.card.trennbar_or_untrennbar && (
                       <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                         <div className="opacity-60">Separable</div>
                         <div className="font-bold">{result.card.trennbar_or_untrennbar === 'trennbar' ? t.grammar.separable : t.grammar.inseparable}</div>
                       </div>
                     )}
                     {result.card.transitive_or_intransitive && (
                       <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                         <div className="opacity-60">Transitive</div>
                         <div className="font-bold">{result.card.transitive_or_intransitive === 'transitive' ? t.grammar.transitive : t.grammar.intransitive}</div>
                       </div>
                     )}
                     {result.card.grammar_note && (
                       <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 col-span-2 text-left">
                          <div className="opacity-60">{t.grammar.grammarNote}</div>
                          <p className="italic text-[9px] leading-tight">{result.card.grammar_note}</p>
                       </div>
                     )}
                   </div>

                   <div className="flex flex-wrap gap-1.5 justify-center">
                    {result.card.tags?.map((tag: string) => (
                      <span key={tag} className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-tight">{tag}</span>
                    ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
               <Link href="/dashboard">
                  <Button variant="outline">{t.add.backToDashboard}</Button>
               </Link>
               <Button onClick={() => window.location.reload()} variant="secondary">Add Another</Button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
