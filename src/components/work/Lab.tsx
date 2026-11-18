import { Component } from '@geajs/core'
import { domainById } from '../../data/domains'
import { getSection } from '../../data/site'
import type { DomainId } from '../../data/types'
import { plural } from '../../lib/labels'
import filterStore from '../../stores/filter-store'
import SectionHeader from '../layout/SectionHeader'
import FilterBar from './FilterBar'
import ProjectCard from './ProjectCard'

const section = getSection('lab')

const statusText = (domain: DomainId | null, count: number): string =>
  domain
    ? `${plural(count, 'project')} in ${domainById(domain).label}, case studies included`
    : `${plural(count, 'more project')} beyond the case studies`

export default class Lab extends Component {
  template() {
    return (
      <section id="lab" class="section section--tight" aria-labelledby="lab-title">
        <div class="container">
          <SectionHeader id="lab" title={section.title} kicker={section.kicker} />
          <FilterBar />
          <p class="lab__status" aria-live="polite">
            {statusText(filterStore.domain, filterStore.visibleCount)}
          </p>
          <ul class="grid lab__grid" role="list">
            {filterStore.visibleProjects.map(project => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }
}
