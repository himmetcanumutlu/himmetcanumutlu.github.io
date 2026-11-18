import { isBrowser, prefersReducedMotion } from './env'

/**
 * Scrolls a section into view and moves keyboard focus to it so screen
 * readers and keyboard users land in the right place.
 */
export function scrollToSection(id: string): void {
  if (!isBrowser()) return
  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })

  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })

  if (window.location.hash !== `#${id}`) {
    const url = `${window.location.pathname}${window.location.search}#${id}`
    window.history.replaceState(window.history.state, '', url)
  }
}
