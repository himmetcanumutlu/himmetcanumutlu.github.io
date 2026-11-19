import { getProject } from '../../data/selectors'
import { getSection } from '../../data/site'
import { systemsLab } from '../../data/systems'
import type { Project } from '../../data/types'
import SectionHeader from '../layout/SectionHeader'

const section = getSection('systems')
const { nodes, links } = systemsLab.topology
const chain = nodes.map(node => ({ node, via: links.find(link => link.from === node.id)?.label ?? '' }))
const related = systemsLab.relatedProjects.map(slug => getProject(slug)).filter((p): p is Project => p !== undefined)

/**
 * The homelab, written up as a spec sheet: the network path from the
 * internet to the LAN, then what runs where.
 */
export default function SystemsLab() {
  return (
    <section id="systems" class="section" aria-labelledby="systems-title">
      <div class="container">
        <SectionHeader id="systems" title={section.title} kicker={section.kicker} lede={systemsLab.summary} />

        <div class="systems" data-d="systems" data-domain="systems">
          <figure class="path">
            <figcaption class="path__caption">Network path, outside in</figcaption>
            <ol class="path__list" aria-label="Homelab network path">
              {chain.map(step => (
                <li key={step.node.id} class="path__step">
                  <span class="path__label">{step.node.label}</span>
                  <span class="path__detail">{step.node.detail}</span>
                  <span class="path__via">{step.via}</span>
                </li>
              ))}
            </ol>
          </figure>

          <div class="spec">
            {systemsLab.cards.map(card => (
              <section key={card.id} class="spec__group" aria-label={card.title}>
                <h3 class="spec__title">{card.title}</h3>
                <dl class="spec__list">
                  {card.items.map(item => (
                    <div key={item.label} class="spec__row">
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <p class="systems__related">
            <span class="systems__related-label">Related work</span>
            {related.map(project => (
              <a key={project.slug} class="related-link" href={`?project=${project.slug}`} data-project={project.slug}>
                {project.title}
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
