import { isBrowser } from './env'

/**
 * Runs `callback` once when `el` first enters the viewport.
 * Returns a cleanup function for `dispose()`.
 */
export function onFirstVisible(el: Element, callback: () => void, options: IntersectionObserverInit = { threshold: 0.35 }): () => void {
  if (!isBrowser() || typeof IntersectionObserver === 'undefined') {
    callback()
    return () => {}
  }

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect()
      callback()
    }
  }, options)

  observer.observe(el)
  return () => observer.disconnect()
}

/**
 * Reports which of the given section elements is currently most in view.
 * Returns a cleanup function.
 */
export function watchActiveSection(elements: Element[], onChange: (id: string) => void): () => void {
  if (!isBrowser() || typeof IntersectionObserver === 'undefined' || elements.length === 0) return () => {}

  const ratios = new Map<string, number>()
  let current = ''

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
      let bestId = ''
      let bestRatio = 0
      for (const [id, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      }
      if (bestId && bestId !== current) {
        current = bestId
        onChange(bestId)
      }
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
  )

  for (const el of elements) observer.observe(el)
  return () => observer.disconnect()
}
