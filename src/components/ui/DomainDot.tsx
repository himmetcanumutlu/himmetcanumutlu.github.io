import type { DomainId } from '../../data/types'

interface DomainDotProps {
  domain: DomainId
}

export default function DomainDot({ domain }: DomainDotProps) {
  return <span class="dot" data-domain={domain} aria-hidden="true"></span>
}
