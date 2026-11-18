import { domainAttr, formatMonth, issuerById } from '../../data/selectors'
import type { Certification } from '../../data/types'
import Icon from '../ui/Icon'

interface CertBadgeProps {
  cert: Certification
  variant?: 'featured' | 'compact'
}

export default function CertBadge({ cert, variant = 'compact' }: CertBadgeProps) {
  const issuer = issuerById(cert.issuerId)

  return (
    <article class={`cert cert--${variant}`} data-d={domainAttr(cert.domains)} data-domain={cert.domains[0]}>
      <p class="cert__issuer">
        {variant === 'featured' && issuer.bigTech ? <span class="cert__seal" aria-hidden="true"></span> : ''}
        <span>{issuer.name}</span>
      </p>
      <h4 class="cert__title">{cert.title}</h4>
      {cert.originalTitle && variant === 'featured' ? <p class="cert__original">{cert.originalTitle}</p> : ''}
      <p class="cert__meta">
        {cert.issued ? <span>{formatMonth(cert.issued)}</span> : <span>Completed</span>}
        {cert.credentialId ? <span class="cert__id">ID {cert.credentialId}</span> : ''}
      </p>
      {cert.url ? (
        <a class="cert__verify" href={cert.url} target="_blank" rel="noopener noreferrer">
          <span>Verify</span>
          <Icon name="external" />
        </a>
      ) : (
        ''
      )}
    </article>
  )
}
