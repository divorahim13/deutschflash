'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, dictionaries } from './dictionaries'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof dictionaries.id
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'id' || saved === 'de')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = dictionaries[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
