import { Component } from '@geajs/core'
import { formatMonth, issuerById } from '../../data/selectors'
import type { CertProgram, Certification } from '../../data/types'
import { plural } from '../../lib/labels'
import Icon from '../ui/Icon'
import CertBadge from './CertBadge'

/** A folded group of course-level certificates (e.g. a six-course program). */
export default class CertProgramCard extends Component {
  declare props: { program: CertProgram; certs: Certification[]; issued: string | null }

  expanded = false

  template({ program, certs, issued }: this['props']) {
    const panelId = `program-${program.id}`
    return (
      <article class="cert cert--program" data-d={certs[0]?.domains.join(' ') ?? ''} data-domain={certs[0]?.domains[0] ?? ''}>
        <p class="cert__issuer">
          <span>{issuerById(program.issuerId).name}</span>
        </p>
        <h4 class="cert__title">{program.title}</h4>
        <p class="cert__original">{program.description}</p>
        <p class="cert__meta">
          <span>{plural(certs.length, 'credential')}</span>
          {issued ? <span>{formatMonth(issued)}</span> : ''}
        </p>
        <button
          type="button"
          class={`disclosure${this.expanded ? ' is-open' : ''}`}
          aria-expanded={this.expanded ? 'true' : 'false'}
          aria-controls={panelId}
          click={() => (this.expanded = !this.expanded)}
        >
          <span>{this.expanded ? 'Hide courses' : 'Show courses'}</span>
          <Icon name="chevron-down" />
        </button>
        <ul id={panelId} class="cert__courses" role="list" hidden={!this.expanded}>
          {certs.map(cert => (
            <li key={cert.id}>
              <CertBadge cert={cert} />
            </li>
          ))}
        </ul>
      </article>
    )
  }
}
