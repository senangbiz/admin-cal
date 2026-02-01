import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'theme'
const themes = ['light', 'dark', 'system']

function getStored() {
  try {
    const t = localStorage.getItem(THEME_KEY)
    return themes.includes(t) ? t : 'system'
  } catch {
    return 'system'
  }
}

function getEffectiveTheme() {
  const stored = getStored()
  if (stored === 'dark') return 'dark'
  if (stored === 'light') return 'light'
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(effective) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (effective === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

const ThemeContext = createContext({
  theme: 'system',
  effectiveTheme: 'light',
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStored())
  const [effectiveTheme, setEffectiveTheme] = useState(() =>
    typeof document !== 'undefined' ? getEffectiveTheme() : 'light'
  )

  const setTheme = useCallback((value) => {
    const next = themes.includes(value) ? value : 'system'
    setThemeState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch (_) {}
    const effective = next === 'system'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : next
    setEffectiveTheme(effective)
    applyTheme(effective)
  }, [])

  useEffect(() => {
    const stored = getStored()
    setThemeState(stored)
    const effective = getEffectiveTheme()
    setEffectiveTheme(effective)
    applyTheme(effective)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handle = () => {
      if (getStored() !== 'system') return
      const eff = getEffectiveTheme()
      setEffectiveTheme(eff)
      applyTheme(eff)
    }
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export function ThemeToggle({ className = '' }) {
  const { effectiveTheme, setTheme } = useTheme()

  const cycle = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className={`rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${className}`}
      aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {effectiveTheme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
