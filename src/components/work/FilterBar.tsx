import { Component } from '@geajs/core'
import { domains } from '../../data/domains'
import { domainProjectCounts, includedProjects } from '../../data/selectors'
import filterStore from '../../stores/filter-store'

export default class FilterBar extends Component {
  template() {
    return (
      <div class="filter-bar" role="toolbar" aria-label="Filter projects by domain">
        <button
          type="button"
          class={`filter-chip${filterStore.domain === null ? ' is-active' : ''}`}
          aria-pressed={filterStore.domain === null ? 'true' : 'false'}
          click={() => filterStore.clear()}
        >
          <span>All</span>
          <span class="filter-chip__count">{includedProjects.length}</span>
        </button>
        {domains.map(domain => (
          <button
            key={domain.id}
            type="button"
            class={`filter-chip${filterStore.domain === domain.id ? ' is-active' : ''}`}
            data-domain={domain.id}
            aria-pressed={filterStore.domain === domain.id ? 'true' : 'false'}
            click={() => filterStore.toggleDomain(domain.id)}
          >
            <span class="dot" aria-hidden="true"></span>
            <span>{domain.shortLabel}</span>
            <span class="filter-chip__count">{domainProjectCounts[domain.id]}</span>
          </button>
        ))}
      </div>
    )
  }
}
