import { formatMonth, sortedVentures, ventureCertifications } from '../../data/selectors'
import { getSection } from '../../data/site'
import { prettyUrl, ventureBadgeClass } from '../../lib/labels'
import SectionHeader from '../layout/SectionHeader'
import Icon from '../ui/Icon'

const section = getSection('ventures')

export default function Ventures() {
  return (
    <section id="ventures" class="section" aria-labelledby="ventures-title">
      <div class="container">
        <SectionHeader
          id="ventures"
          title={section.title}
          kicker={section.kicker}
          lede="Products I started from nothing: one live, one held for later, one retired."
        />
        <ul class="grid ventures" role="list">
          {sortedVentures.map(venture => (
            <li key={venture.id}>
              <article
                class={`card venture venture--${venture.status}`}
                data-d={venture.domains.join(' ')}
                data-domain={venture.domains[0]}
              >
                <div class="venture__head">
                  <span class={ventureBadgeClass[venture.status]}>{venture.statusLabel}</span>
                  <span class="card__meta">{venture.role}</span>
                </div>
                <h3 class="card__title">{venture.name}</h3>
                <p class="card__body">{venture.pitch}</p>
                {venture.proof.length > 0 ? (
                  <ul class="venture__proof">
                    {venture.proof.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  ''
                )}
                {venture.url ? (
                  <a class="btn btn--sm venture__link" href={venture.url} target="_blank" rel="noopener noreferrer">
                    <span>{prettyUrl(venture.url)}</span>
                    <Icon name="external" />
                  </a>
                ) : (
                  <p class="venture__nolink">{venture.status === 'sunset' ? 'No longer online' : 'Not public yet'}</p>
                )}
              </article>
            </li>
          ))}
        </ul>

        <div class="issued">
          <h3 class="issued__title">Issued through SertifikApp</h3>
          <p class="issued__lede">Real certificates from local events, each with a public verification page.</p>
          <ul class="issued__list" role="list">
            {ventureCertifications.map(cert => (
              <li key={cert.id} class="issued__item">
                <span class="issued__name">{cert.title}</span>
                <span class="issued__meta">
                  {cert.credentialId} · {formatMonth(cert.issued)}
                </span>
                {cert.url ? (
                  <a class="issued__verify" href={cert.url} target="_blank" rel="noopener noreferrer">
                    <span>Verify</span>
                    <Icon name="external" />
                  </a>
                ) : (
                  ''
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
