import type { NowItem } from '../../data/types'

interface NowLineProps {
  items: NowItem[]
}

export default function NowLine({ items }: NowLineProps) {
  return (
    <div class="now">
      <p class="now__label">Now</p>
      <ul class="now__list" role="list">
        {items.map(item => (
          <li key={item.org} class="now__item" data-domain={item.domain}>
            <span class="dot" aria-hidden="true"></span>
            <span class="now__role">{item.role}</span>
            <span class="now__org">{item.org}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
