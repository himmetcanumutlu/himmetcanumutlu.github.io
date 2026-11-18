import { Component } from '@geajs/core'
import type { JSX } from '@geajs/core/jsx-runtime'
import { isBrowser } from '../../lib/env'
import filterStore from '../../stores/filter-store'
import paletteStore from '../../stores/palette-store'
import urlStore from '../../stores/url-store'
import Toast from '../ui/Toast'
import CaseStudyDrawer from '../work/CaseStudyDrawer'
import Footer from './Footer'
import NavBar from './NavBar'

const PALETTE_PREFETCH_MS = 2500

const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')

// The command palette is code-split: it isn't part of the prerendered page and
// is only needed once someone presses ⌘K, so it loads on demand (and is
// prefetched when the browser is idle).
const importPalette = () => import('../palette/CommandPalette')
let paletteInstance: Component | null = null
let paletteLoading: Promise<void> | null = null

/**
 * Page frame. `data-focus` on the root drives CSS cross-highlighting:
 * items whose `data-d` list lacks the focused domain recede.
 *
 * Also owns two document-level behaviours:
 *  - ⌘K / Ctrl+K (and "/") open the command palette
 *  - any `a[data-project]` link opens the case-study drawer in place
 */
export default class AppShell extends Component {
  bound = false
  stopPaletteWatch: (() => void) | null = null
  prefetchTimer = 0

  handleKeydown = (event: KeyboardEvent): void => {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      paletteStore.toggle()
      return
    }
    if (event.key === '/' && !paletteStore.open && !urlStore.isDrawerOpen && !isTypingTarget(event.target)) {
      event.preventDefault()
      paletteStore.openPalette()
    }
  }

  handleClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-project]') : null
    const slug = link?.dataset.project
    if (!slug) return
    event.preventDefault()
    urlStore.openProject(slug)
  }

  mountPalette(): Promise<void> {
    if (paletteInstance || paletteLoading) return paletteLoading ?? Promise.resolve()
    paletteLoading = importPalette()
      .then(({ default: CommandPalette }) => {
        const host = this.el
        if (!host) return
        const palette = new CommandPalette()
        palette.render(host)
        paletteInstance = palette
      })
      .catch(error => {
        console.error('Could not load the command palette', error)
      })
      .finally(() => {
        paletteLoading = null
      })
    return paletteLoading
  }

  onAfterRender(): void {
    // Lifecycle hooks also run during prerendering; browser-only from here.
    if (!isBrowser()) return
    if (this.bound) return
    this.bound = true
    document.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('click', this.handleClick)

    this.stopPaletteWatch = paletteStore.observe('open', () => {
      if (paletteStore.open) void this.mountPalette()
    })

    const prefetch = () => void importPalette()
    const whenIdle = typeof window.requestIdleCallback === 'function' ? () => window.requestIdleCallback(prefetch) : prefetch
    this.prefetchTimer = window.setTimeout(whenIdle, PALETTE_PREFETCH_MS)
  }

  dispose(): void {
    document.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('click', this.handleClick)
    window.clearTimeout(this.prefetchTimer)
    this.stopPaletteWatch?.()
    paletteInstance?.dispose()
    paletteInstance = null
    super.dispose()
  }

  template({ children }: { children?: JSX.Element }) {
    return (
      <div class="app" data-focus={filterStore.focusDomain ?? ''}>
        <a class="skip-link" href="#main">
          Skip to content
        </a>
        <NavBar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CaseStudyDrawer />
        <Toast />
      </div>
    )
  }
}
