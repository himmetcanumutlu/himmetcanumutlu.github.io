import { experience } from '../../data/experience'
import { domainAttr } from '../../data/selectors'
import Icon from '../ui/Icon'

const sorted = [...experience].sort((a, b) => a.order - b.order)

export default function ExperienceList() {
  return (
    <ol class="experience" role="list">
      {sorted.map(item => (
        <li key={item.id} class="experience__item" data-d={domainAttr(item.domains)} data-domain={item.domains[0]}>
          <div class="experience__when">
            <span>{item.period}</span>
            {item.mode ? <span class="experience__mode">{item.mode}</span> : ''}
          </div>
          <div class="experience__body">
            <h4 class="experience__role">{item.role}</h4>
            <p class="experience__org">{item.org}</p>
            <p class="experience__summary">{item.summary}</p>
            <ul class="experience__highlights">
              {item.highlights.map(highlight => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            {item.links.length > 0 ? (
              <ul class="experience__links" role="list">
                {item.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <span>{link.label}</span>
                      <Icon name="external" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
