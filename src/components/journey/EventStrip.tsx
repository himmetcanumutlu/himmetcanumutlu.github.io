import { Component } from '@geajs/core'
import { events } from '../../data/events'
import { domainAttr } from '../../data/selectors'
import { isBrowser } from '../../lib/env'

const sorted = [...events].sort((a, b) => b.sortKey.localeCompare(a.sortKey))

const markMissing = (img: HTMLImageElement): void => {
  img.closest('.event')?.classList.add('is-missing')
}

/**
 * Horizontal, scroll-snapping photo strip. A photo that fails to load falls
 * back to a tinted card with the event name, so the strip never shows broken
 * images while photos are still being added.
 */
export default class EventStrip extends Component {
  bound = false

  onImageError = (event: Event): void => {
    if (event.target instanceof HTMLImageElement) markMissing(event.target)
  }

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    const root = this.el
    if (!root || this.bound) return
    this.bound = true
    // `error` doesn't bubble; listen in the capture phase.
    root.addEventListener('error', this.onImageError, true)
    // Images can still be detached (and inert) at this point, which reports
    // complete with no pixels; only judge the ones already in the document.
    window.setTimeout(() => {
      root.querySelectorAll('img').forEach(img => {
        if (img.isConnected && img.complete && img.naturalWidth === 0) markMissing(img)
      })
    }, 0)
  }

  dispose(): void {
    this.el?.removeEventListener('error', this.onImageError, true)
    super.dispose()
  }

  template() {
    return (
      <ul class="strip" role="list" tabIndex={0} aria-label="Events and volunteering, scroll horizontally">
        {sorted.map(event => (
          <li key={event.id}>
            <figure class="event" data-d={domainAttr(event.domains)} data-domain={event.domains[0]}>
              <div class="event__media">
                <span class="event__fallback" aria-hidden="true">
                  {event.name}
                </span>
                <img
                  src={event.cover.src}
                  alt={event.cover.alt}
                  width={event.cover.width}
                  height={event.cover.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption class="event__caption">
                <span class="event__name">{event.name}</span>
                <span class="event__meta">
                  {`${event.role} · ${event.when}${event.venue ? ` · ${event.venue}` : ''}`}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    )
  }
}
