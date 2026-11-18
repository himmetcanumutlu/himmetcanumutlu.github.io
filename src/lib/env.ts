export const isBrowser = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined'

export const prefersReducedMotion = (): boolean =>
  isBrowser() && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isMacLike = (): boolean =>
  isBrowser() && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)

/** Label for the palette shortcut, e.g. "⌘K" or "Ctrl K". */
export const paletteShortcutLabel = (): string => (isMacLike() ? '⌘K' : 'Ctrl K')
