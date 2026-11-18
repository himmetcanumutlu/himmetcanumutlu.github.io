import { Component } from '@geajs/core'
import { formatMonth, type IssuerGroup as IssuerGroupData } from '../../data/selectors'
import { plural } from '../../lib/labels'
import Icon from '../ui/Icon'
import CertBadge from './CertBadge'
import CertProgramCard from './CertProgramCard'

/** One issuer's credentials behind an accessible disclosure button. */
export default class IssuerGroup extends Component {
  declare props: { group: IssuerGroupData; defaultOpen: boolean }

  open = false

  created(props: this['props']): void {
    this.open = props.defaultOpen
  }

  template({ group }: this['props']) {
    const panelId = `issuer-${group.issuer.id}`
    return (
      <div class={`issuer${this.open ? ' is-open' : ''}`}>
        <h5 class="issuer__heading">
          <button
            type="button"
            class="issuer__toggle"
            aria-expanded={this.open ? 'true' : 'false'}
            aria-controls={panelId}
            click={() => (this.open = !this.open)}
          >
            <span class="issuer__name">{group.issuer.name}</span>
            <span class="issuer__count">{plural(group.count, 'credential')}</span>
            {group.latest ? <span class="issuer__latest">latest {formatMonth(group.latest)}</span> : ''}
            <Icon name="chevron-down" />
          </button>
        </h5>
        <ul id={panelId} class="issuer__cards" role="list" hidden={!this.open}>
          {group.cards.map(card => (
            <li key={card.id}>
              {card.kind === 'program' ? (
                <CertProgramCard program={card.program} certs={card.certs} issued={card.issued} />
              ) : (
                <CertBadge cert={card.cert} />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
