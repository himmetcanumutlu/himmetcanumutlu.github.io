declare global {
  // Set by the prerender server entry. The SSR runtime provides a minimal
  // window/document shim, so their presence alone doesn't mean "real browser".
  var __PRERENDER__: boolean | undefined
}

/** True only in a real browser, never while prerendering. */
export const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined' && globalThis.__PRERENDER__ !== true

export const prefersReducedMotion = (): boolean =>
  isBrowser() && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
