import { Store } from '@geajs/core'
import { THEME_COLORS, THEME_STORAGE_KEY } from '../data/site'
import type { Theme } from '../data/types'
import { isBrowser } from '../lib/env'

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light'

const readSaved = (): Theme | null => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

const save = (theme: Theme): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode, quota); the theme still applies.
  }
}

const systemQuery = (): MediaQueryList | null =>
  typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: light)') : null

/**
 * Light/dark theme. index.html applies the initial theme before first paint;
 * this store takes over after load and follows the OS until the user chooses.
 */
class ThemeStore extends Store {
  theme: Theme = 'dark'
  /** True once the user picked a theme explicitly. */
  explicit = false
  ready = false

  get isDark(): boolean {
    return this.theme === 'dark'
  }

  get toggleLabel(): string {
    return this.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  }

  /** Browser-only. Safe to call more than once. */
  init(): void {
    if (this.ready || !isBrowser()) return

    const saved = readSaved()
    const applied = document.documentElement.getAttribute('data-theme')
    const media = systemQuery()

    this.explicit = saved !== null
    this.theme = saved ?? (isTheme(applied) ? applied : media?.matches ? 'light' : 'dark')
    this.apply()

    media?.addEventListener('change', event => {
      if (this.explicit) return
      this.theme = event.matches ? 'light' : 'dark'
      this.apply()
    })

    this.ready = true
  }

  set(theme: Theme): void {
    this.theme = theme
    this.explicit = true
    if (isBrowser()) save(theme)
    this.apply()
  }

  toggle(): void {
    this.set(this.theme === 'dark' ? 'light' : 'dark')
  }

  private apply(): void {
    if (!isBrowser()) return
    const root = document.documentElement
    root.setAttribute('data-theme', this.theme)
    root.style.colorScheme = this.theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[this.theme])
  }
}

export default new ThemeStore()
