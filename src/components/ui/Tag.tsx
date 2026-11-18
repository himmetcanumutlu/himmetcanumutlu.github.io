import type { DomainId } from '../../data/types'

interface TagProps {
  label: string
  /** Colors the tag and adds a domain dot. */
  domain?: DomainId
  variant?: 'default' | 'mono' | 'outline'
  size?: 'md' | 'sm'
}

export default function Tag({ label, domain, variant = 'default', size = 'md' }: TagProps) {
  const classes = `tag${variant === 'default' ? '' : ` tag--${variant}`}${size === 'sm' ? ' tag--sm' : ''}`
  return (
    <span class={classes} data-domain={domain ?? ''}>
      {domain ? <span class="dot" aria-hidden="true"></span> : ''}
      <span>{label}</span>
    </span>
  )
}
