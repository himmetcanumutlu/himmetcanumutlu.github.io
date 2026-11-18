import { getProject } from '../../data/selectors'
import { getSection } from '../../data/site'
import { systemsLab } from '../../data/systems'
import type { Project } from '../../data/types'
import SectionHeader from '../layout/SectionHeader'
import Icon from '../ui/Icon'
import TerminalWhoami from './TerminalWhoami'

const section = getSection('systems')
const { nodes, links } = systemsLab.topology
const chain = nodes.map(node => ({ node, next: links.find(link => link.from === node.id) }))
const related = systemsLab.relatedProjects.map(slug => getProject(slug)).filter((p): p is Project => p !== undefined)

export default function SystemsLab() {
  return (
    <section id="systems" class="section" aria-labelledby="systems-title">
      <div class="container">
        <SectionHeader id="systems" title={section.title} kicker={section.kicker} lede={systemsLab.summary} />

        <div class="systems" data-d="systems" data-domain="systems">
          <div class="systems__infra">
            <ol class="topology" aria-label="Homelab network path">
              {chain.map(step => (
                <li key={step.node.id} class={`topology__step topology__step--${step.node.kind}`}>
                  <div class="topology__node">
                    <span class="topology__label">{step.node.label}</span>
                    <span class="topology__detail">{step.node.detail}</span>
                  </div>
                  {step.next ? (
                    <span class="topology__link">
                      <span class="topology__arrow" aria-hidden="true"></span>
                      {step.next.label ? <span class="topology__link-label">{step.next.label}</span> : ''}
                    </span>
                  ) : (
                    ''
                  )}
                </li>
              ))}
            </ol>

            <ul class="grid grid--dense lab-cards" role="list">
              {systemsLab.cards.map(card => (
                <li key={card.id} class="card lab-card">
                  <h3 class="lab-card__title">{card.title}</h3>
                  <dl class="lab-card__list">
                    {card.items.map(item => (
                      <div key={item.label} class="lab-card__row">
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>

          <div class="systems__shell">
            <TerminalWhoami />
            <div class="systems__related">
              <p class="systems__related-label">Related work</p>
              <ul class="tag-list" role="list">
                {related.map(project => (
                  <li key={project.slug}>
                    <a class="tag tag--outline related-link" href={`?project=${project.slug}`} data-project={project.slug}>
                      <span>{project.title}</span>
                      <Icon name="arrow-right" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
