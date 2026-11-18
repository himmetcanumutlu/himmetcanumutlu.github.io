import { Component } from '@geajs/core'
import { domains, isDomainId } from '../../data/domains'
import { domainProjectCounts } from '../../data/selectors'
import { getSection } from '../../data/site'
import type { DomainId } from '../../data/types'
import { plural } from '../../lib/labels'
import { scrollToSection } from '../../lib/scroll'
import filterStore from '../../stores/filter-store'
import SectionHeader from '../layout/SectionHeader'
import { isBrowser } from '../../lib/env'

const section = getSection('domains')

const tileDomain = (target: EventTarget | null): DomainId | null => {
  const tile = target instanceof Element ? target.closest<HTMLElement>('[data-tile]') : null
  const id = tile?.dataset.tile
  return isDomainId(id) ? id : null
}

/**
 * The domain matrix. Hovering or focusing a tile cross-highlights matching
 * work across the page; clicking filters the lab.
 */
export default class DomainBento extends Component {
  bound = false

  onPointerOver = (event: Event): void => filterStore.setHover(tileDomain(event.target))
  onPointerLeave = (): void => filterStore.clearHover()
  onFocusIn = (event: Event): void => filterStore.setHover(tileDomain(event.target))
  onFocusOut = (event: FocusEvent): void => {
    if (!this.el?.contains(event.relatedTarget as Node | null)) filterStore.clearHover()
  }

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    const root = this.el
    if (!root || this.bound) return
    this.bound = true
    root.addEventListener('pointerover', this.onPointerOver)
    root.addEventListener('pointerleave', this.onPointerLeave)
    root.addEventListener('focusin', this.onFocusIn)
    root.addEventListener('focusout', this.onFocusOut)
  }

  dispose(): void {
    const root = this.el
    if (root) {
      root.removeEventListener('pointerover', this.onPointerOver)
      root.removeEventListener('pointerleave', this.onPointerLeave)
      root.removeEventListener('focusin', this.onFocusIn)
      root.removeEventListener('focusout', this.onFocusOut)
    }
    filterStore.clearHover()
    super.dispose()
  }

  select(id: DomainId): void {
    const wasActive = filterStore.domain === id
    filterStore.toggleDomain(id)
    if (!wasActive) scrollToSection('lab')
  }

  template() {
    return (
      <section id="domains" class="section" aria-labelledby="domains-title">
        <div class="container">
          <SectionHeader
            id="domains"
            title={section.title}
            kicker={section.kicker}
            lede="Hover a domain to light up related work across the page. Click one to filter the lab."
          />
          <ul class="bento" role="list">
            {domains.map(domain => (
              <li
                key={domain.id}
                class={`tile${filterStore.domain === domain.id ? ' is-active' : ''}`}
                data-size={domain.size}
                data-domain={domain.id}
                data-tile={domain.id}
              >
                <button
                  type="button"
                  class="tile__button"
                  aria-pressed={filterStore.domain === domain.id ? 'true' : 'false'}
                  click={() => this.select(domain.id)}
                >
                  <span class="tile__head">
                    <span class="dot" aria-hidden="true"></span>
                    <span class="tile__label">{domain.label}</span>
                    <span class="tile__count">{plural(domainProjectCounts[domain.id], 'project')}</span>
                  </span>
                  <span class="tile__claim">{domain.claim}</span>
                  <span class="tile__proofs">
                    {domain.proofs.map(proof => (
                      <span key={proof} class="tile__proof">
                        {proof}
                      </span>
                    ))}
                  </span>
                  <span class="tile__cta">{filterStore.domain === domain.id ? 'Filtering the lab · click to clear' : 'Filter the lab →'}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }
}
