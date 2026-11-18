import { orgStatusLabel } from '../../data/organizations'
import { domainAttr, sortedOrganizations } from '../../data/selectors'
import type { Organization } from '../../data/types'
import Icon from '../ui/Icon'

const statusClass: Record<Organization['status'], string> = {
  current: 'badge badge--live',
  'handed-off': 'badge badge--standby',
  alumni: 'badge badge--sunset',
}

/** One lane per organization; each lane shows role stages, not dates. */
export default function SwimlaneTimeline() {
  return (
    <ul class="swimlanes" role="list">
      {sortedOrganizations.map(org => (
        <li key={org.id} class="lane" data-d={domainAttr(org.domains)} data-domain={org.domains[0]}>
          <div class="lane__label">
            <h4 class="lane__name">{org.shortName}</h4>
            <p class="lane__full">{org.name}</p>
            <span class={statusClass[org.status]}>{orgStatusLabel[org.status]}</span>
          </div>
          <div class="lane__content">
            <ol class="lane__track" aria-label={`Roles at ${org.shortName}`}>
              {org.stages.map((stage, index) => (
                <li
                  key={stage}
                  class={`stage${index === org.stages.length - 1 ? ' stage--latest' : ''}`}
                  data-step={String(index + 1)}
                >
                  <span class="stage__marker" aria-hidden="true"></span>
                  <span class="stage__label">{stage}</span>
                </li>
              ))}
            </ol>
            <p class="lane__summary">{org.summary}</p>
            {org.links.length > 0 ? (
              <ul class="lane__links" role="list">
                {org.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <span>{link.label}</span>
                      <Icon name="external" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
