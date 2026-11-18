import { Store } from '@geajs/core'
import { isDomainId } from '../data/domains'
import { getProject } from '../data/selectors'
import type { Project } from '../data/types'
import { isBrowser } from '../lib/env'
import filterStore from './filter-store'

type HistoryMode = 'push' | 'replace'

interface HistoryState {
  drawer?: boolean
}

const currentHistoryState = (): HistoryState => {
  const state = window.history.state as HistoryState | null
  return state && typeof state === 'object' ? state : {}
}

const currentUrl = (): string => `${window.location.pathname}${window.location.search}${window.location.hash}`

/**
 * The URL is the source of truth for shareable UI state:
 *   ?domain=<id>   active domain filter       (replaceState — no history spam)
 *   ?project=<slug> open case-study drawer    (pushState — Back closes it)
 */
class UrlStore extends Store {
  project: string | null = null
  ready = false

  get activeProject(): Project | undefined {
    return getProject(this.project)
  }

  get isDrawerOpen(): boolean {
    return this.project !== null
  }

  /** Browser-only. Safe to call more than once. */
  init(): void {
    if (this.ready || !isBrowser()) return
    this.readLocation()
    filterStore.observe('domain', () => this.write('replace'))
    window.addEventListener('popstate', () => this.readLocation())
    this.ready = true
  }

  readLocation(): void {
    if (!isBrowser()) return
    const params = new URLSearchParams(window.location.search)

    const domain = params.get('domain')
    filterStore.setDomain(isDomainId(domain) ? domain : null)

    const slug = params.get('project')
    this.project = slug && getProject(slug) ? slug : null
  }

  openProject(slug: string): void {
    if (!getProject(slug) || this.project === slug) return
    const mode: HistoryMode = this.project === null ? 'push' : 'replace'
    this.project = slug
    this.write(mode, { drawer: true })
  }

  closeProject(): void {
    if (this.project === null) return
    this.project = null
    if (isBrowser() && currentHistoryState().drawer) {
      // The drawer was opened with pushState: step back so Back/Forward stay coherent.
      window.history.back()
      return
    }
    this.write('replace')
  }

  /** Absolute, shareable link to a case study. */
  projectUrl(slug: string): string {
    if (!isBrowser()) return `/?project=${encodeURIComponent(slug)}`
    const params = new URLSearchParams()
    params.set('project', slug)
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  private write(mode: HistoryMode, state: HistoryState = {}): void {
    if (!isBrowser()) return
    const params = new URLSearchParams(window.location.search)

    if (filterStore.domain) params.set('domain', filterStore.domain)
    else params.delete('domain')

    if (this.project) params.set('project', this.project)
    else params.delete('project')

    const query = params.toString()
    const next = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    if (next === currentUrl() && mode === 'replace') return

    const merged = { ...currentHistoryState(), ...state }
    if (mode === 'push') window.history.pushState(merged, '', next)
    else window.history.replaceState(merged, '', next)
  }
}

export default new UrlStore()
