import { domainAttr } from '../../data/selectors'
import type { Talk } from '../../data/types'
import Icon from '../ui/Icon'

interface TalkCardProps {
  talk: Talk
}

export default function TalkCard({ talk }: TalkCardProps) {
  return (
    <article class="card talk" data-d={domainAttr(talk.domains)} data-domain={talk.domains[0]}>
      <p class="card__meta">
        {talk.series} · {talk.edition} · {talk.year}
      </p>
      <h4 class="card__title">{talk.title}</h4>
      <p class="talk__host">
        {talk.host} · {talk.format}
      </p>
      <p class="card__body">{talk.summary}</p>
      <ol class="talk__topics">
        {talk.topics.map(topic => (
          <li key={topic}>{topic}</li>
        ))}
      </ol>
      <div class="cluster">
        {talk.links.map(link => (
          <a key={link.href} class="btn btn--sm" href={link.href} target="_blank" rel="noopener noreferrer">
            <Icon name="github" />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </article>
  )
}
