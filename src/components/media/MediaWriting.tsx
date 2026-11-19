import { media } from '../../data/media'
import { domainAttr } from '../../data/selectors'
import { getSection } from '../../data/site'
import type { MediaItem } from '../../data/types'
import SectionHeader from '../layout/SectionHeader'
import Icon from '../ui/Icon'

const section = getSection('media')

const typeLabel: Record<MediaItem['type'], string> = {
  channel: 'Channel',
  writing: 'Writing',
  post: 'Post',
  video: 'Video',
}

const metaLine = (item: MediaItem): string =>
  `${typeLabel[item.type]} · ${item.outlet} · ${item.when}${item.lang === 'tr' ? ' · in Turkish' : ''}`

const iconFor = (item: MediaItem): 'youtube' | 'linkedin' | 'external' =>
  item.outlet === 'YouTube' ? 'youtube' : item.outlet === 'LinkedIn' ? 'linkedin' : 'external'

export default function MediaWriting() {
  return (
    <section id="media" class="section" aria-labelledby="media-title">
      <div class="container">
        <SectionHeader id="media" title={section.title} kicker={section.kicker} />
        <ul class="grid media" role="list">
          {media.map(item => (
            <li key={item.id}>
              <article class="card card--interactive media-card" data-d={domainAttr(item.domains)} data-domain={item.domains[0]}>
                <p class="media-card__meta">
                  <Icon name={iconFor(item)} />
                  <span>{metaLine(item)}</span>
                </p>
                <h3 class="card__title">
                  <a class="stretched-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p class="card__body">{item.summary}</p>
                {/* Rendered last so list bindings stay stable; CSS moves it to the top. */}
                {item.thumbnail ? (
                  <img
                    class="media-card__thumb"
                    src={item.thumbnail.src}
                    alt={item.thumbnail.alt}
                    width={item.thumbnail.width}
                    height={item.thumbnail.height}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  ''
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
