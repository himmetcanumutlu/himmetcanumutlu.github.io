import { Store } from '@geajs/core'
import { domainProjectCounts, featuredProjects, labProjects, projectsForDomain } from '../data/selectors'
import type { DomainId, Project } from '../data/types'

const filterablePool: Project[] = [...featuredProjects, ...labProjects]

/**
 * Domain filter + hover focus. `domain` is the committed filter (synced to
 * `?domain=` by the URL store); `hoverDomain` is transient cross-highlighting.
 */
class FilterStore extends Store {
  domain: DomainId | null = null
  hoverDomain: DomainId | null = null

  /** What the page should highlight right now: hover wins over the filter. */
  get focusDomain(): DomainId | null {
    return this.hoverDomain ?? this.domain
  }

  /**
   * Unfiltered, the lab lists everything that isn't a featured case study.
   * Filtered, it lists every matching project (featured first) so no domain
   * ever comes back empty.
   */
  get visibleProjects(): Project[] {
    return this.domain ? projectsForDomain(this.domain, filterablePool) : labProjects
  }

  get visibleCount(): number {
    return this.visibleProjects.length
  }

  get totalCount(): number {
    return this.domain ? filterablePool.length : labProjects.length
  }

  get isFiltered(): boolean {
    return this.domain !== null
  }

  countFor(id: DomainId): number {
    return domainProjectCounts[id]
  }

  isActive(id: DomainId): boolean {
    return this.domain === id
  }

  setDomain(id: DomainId | null): void {
    if (this.domain !== id) this.domain = id
  }

  toggleDomain(id: DomainId): void {
    this.setDomain(this.domain === id ? null : id)
  }

  clear(): void {
    this.setDomain(null)
  }

  setHover(id: DomainId | null): void {
    if (this.hoverDomain !== id) this.hoverDomain = id
  }

  clearHover(): void {
    this.setHover(null)
  }
}

export default new FilterStore()
