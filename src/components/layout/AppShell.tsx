import { Component } from '@geajs/core'
import type { JSX } from '@geajs/core/jsx-runtime'
import filterStore from '../../stores/filter-store'
import paletteStore from '../../stores/palette-store'
import urlStore from '../../stores/url-store'
import CommandPalette from '../palette/CommandPalette'
import Toast from '../ui/Toast'
import CaseStudyDrawer from '../work/CaseStudyDrawer'
import Footer from './Footer'
import NavBar from './NavBar'

const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')

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

  onAfterRender(): void {
    if (this.bound) return
    this.bound = true
    document.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('click', this.handleClick)
  }

  dispose(): void {
    document.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('click', this.handleClick)
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
        <CommandPalette />
        <Toast />
      </div>
    )
  }
}
