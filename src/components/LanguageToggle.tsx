'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/40 scale-90 sm:scale-100">
      <button
        onClick={() => setLanguage('id')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
          language === 'id' 
            ? "bg-background shadow-sm text-foreground ring-1 ring-border/50" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ID
      </button>
      <button
        onClick={() => setLanguage('de')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
          language === 'de' 
            ? "bg-background shadow-sm text-foreground ring-1 ring-border/50" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        DE
      </button>
    </div>
  )
}
