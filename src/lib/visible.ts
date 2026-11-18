import { isBrowser } from './env'

/**
 * Runs `callback` once when `el` first enters the viewport.
 * Returns a cleanup function for `dispose()`.
 */
export function onFirstVisible(el: Element, callback: () => void, options: IntersectionObserverInit = { threshold: 0.35 }): () => void {
  if (!isBrowser()) return () => {}
  if (typeof IntersectionObserver === 'undefined') {
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
 * Scroll-spy: reports the id of the last section whose top has crossed a
 * reading line 35% down the viewport (or the last section at page bottom).
 * Uses throttled scroll/resize listeners, so it keeps working in throttled
 * or background rendering contexts. Returns a cleanup function.
 */
export function watchActiveSection(ids: string[], onChange: (id: string) => void, throttleMs = 80): () => void {
  if (!isBrowser() || ids.length === 0) return () => {}

  let current = ''
  let last = 0
  let trailing = 0

  const measure = () => {
    last = Date.now()
    // Resolved on every pass so sections mounted later are picked up.
    const elements = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const line = window.innerHeight * 0.35
    let activeId = elements[0].id

    for (const el of elements) {
      if (el.getBoundingClientRect().top <= line) activeId = el.id
      else break
    }

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    if (atBottom) activeId = elements[elements.length - 1].id

    if (activeId !== current) {
      current = activeId
      onChange(activeId)
    }
  }

  const onScroll = () => {
    const elapsed = Date.now() - last
    window.clearTimeout(trailing)
    if (elapsed >= throttleMs) measure()
    else trailing = window.setTimeout(measure, throttleMs - elapsed)
  }

  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  return () => {
    window.clearTimeout(trailing)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}
