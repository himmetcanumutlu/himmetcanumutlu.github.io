import { Component } from '@geajs/core'
import { profile } from '../../data/profile'
import { sections } from '../../data/site'
import { isBrowser } from '../../lib/env'
import { watchActiveSection } from '../../lib/visible'
import paletteStore from '../../stores/palette-store'
import ThemeToggle from '../ui/ThemeToggle'

// Every section after the hero, numbered in page order (matches the section
// counters in the headings).
const indexed = sections
  .filter(section => section.id !== 'top')
  .map((section, index) => ({ section, number: String(index + 1).padStart(2, '0') }))
const spiedIds = sections.map(section => section.id)

/**
 * The margin rail: name, a numbered index of the page with scroll-spy, and
 * the two quiet controls (search, theme). On narrow screens it collapses to
 * a slim top bar. Links are plain anchors, so it works without JS.
 */
export default class NavBar extends Component {
  active = ''
  stopSpy: (() => void) | null = null

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    if (this.stopSpy) return
    this.stopSpy = watchActiveSection(spiedIds, id => {
      this.active = id === 'top' ? '' : id
    })
  }

  dispose(): void {
    this.stopSpy?.()
    super.dispose()
  }

  template() {
    return (
      <header class="rail">
        <div class="rail__inner">
          <a class="rail__brand" href="#top">
            <span class="rail__name">{profile.displayName}</span>
            <span class="rail__role">AI, cloud and communities</span>
          </a>

          <nav class="rail__nav" aria-label="Sections">
            <ol class="rail__index" role="list">
              {indexed.map(entry => (
                <li key={entry.section.id}>
                  <a
                    href={`#${entry.section.id}`}
                    class={`rail__link${this.active === entry.section.id ? ' is-active' : ''}`}
                    aria-current={this.active === entry.section.id ? 'location' : 'false'}
                  >
                    <span class="rail__num" aria-hidden="true">
                      {entry.number}
                    </span>
                    <span class="rail__label">{entry.section.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div class="rail__actions">
            <button
              type="button"
              class="rail__search"
              aria-keyshortcuts="Control+K Meta+K"
              click={() => paletteStore.openPalette()}
            >
              <span class="rail__search-label">Search</span>
              <kbd class="kbd-mac">⌘K</kbd>
              <kbd class="kbd-other">Ctrl K</kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
    )
  }
}
