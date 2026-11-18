import { Component } from '@geajs/core'
import { certTiers, featuredCertifications, wallCertifications } from '../../data/selectors'
import { plural } from '../../lib/labels'
import Icon from '../ui/Icon'
import CertBadge from './CertBadge'
import IssuerGroup from './IssuerGroup'

/**
 * Six featured credentials up front; the full wall sits behind one
 * disclosure, grouped by tier and issuer. Everything is in the DOM, so it is
 * readable without JavaScript and by search engines.
 */
export default class CertWall extends Component {
  expanded = false

  template() {
    return (
      <div class="cert-wall">
        <h3 class="education__heading">Featured certifications</h3>
        <ul class="cert-wall__featured" role="list">
          {featuredCertifications.map(cert => (
            <li key={cert.id}>
              <CertBadge cert={cert} variant="featured" />
            </li>
          ))}
        </ul>

        <button
          type="button"
          class={`btn cert-wall__toggle${this.expanded ? ' is-open' : ''}`}
          aria-expanded={this.expanded ? 'true' : 'false'}
          aria-controls="cert-wall-all"
          click={() => (this.expanded = !this.expanded)}
        >
          <span>{this.expanded ? 'Hide the full wall' : `View all ${wallCertifications.length} certifications`}</span>
          <Icon name="chevron-down" />
        </button>

        <div id="cert-wall-all" class="cert-wall__all" hidden={!this.expanded}>
          {certTiers.map(tier => (
            <section key={String(tier.tier)} class="tier" aria-label={tier.label}>
              <h4 class="tier__heading">
                <span>{tier.label}</span>
                <span class="tier__count">{plural(tier.count, 'credential')}</span>
              </h4>
              <div class="tier__groups">
                {tier.groups.map(group => (
                  <IssuerGroup key={group.issuer.id} group={group} defaultOpen={tier.tier === 1} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    )
  }
}
