import { createContext, useContext, useState, useEffect } from 'react'
import en from './en'
import tr from './tr'
import ru from './ru'
import it from './it'
import es from './es'
import pt from './pt'

const LANGS = { en, tr, ru, it, es, pt }
export const LANG_LIST = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
]

const LangCtx = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang')
    if (saved && LANGS[saved]) return saved
    // Auto-detect browser language
    const nav = navigator.language?.slice(0, 2)?.toLowerCase()
    if (nav && LANGS[nav]) return nav
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = LANGS[lang] || en
  return (
    <LangCtx.Provider value={{ t, lang, setLang }}>
      {children}
    </LangCtx.Provider>
  )
}

export function useLang() {
  return useContext(LangCtx)
}
