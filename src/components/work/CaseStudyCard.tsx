import { domainAttr } from '../../data/selectors'
import type { Project } from '../../data/types'
import Icon from '../ui/Icon'
import Tag from '../ui/Tag'

interface CaseStudyCardProps {
  project: Project
}

/** Featured case-study card. The title link opens the drawer (?project=slug). */
export default function CaseStudyCard({ project }: CaseStudyCardProps) {
  return (
    <article class="card card--interactive case-card" data-d={domainAttr(project.domains)} data-domain={project.domains[0]}>
      <p class="case-card__context">{project.context ?? project.role}</p>
      <h3 class="card__title case-card__title">
        <a class="stretched-link" href={`?project=${project.slug}`} data-project={project.slug}>
          {project.title}
        </a>
      </h3>
      <p class="case-card__tagline">{project.tagline}</p>
      <dl class="case-card__metrics">
        {project.metrics.map(metric => (
          <div key={metric.label} class="case-card__metric">
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
      <ul class="tag-list" role="list" aria-label="Stack">
        {project.stack.slice(0, 4).map(item => (
          <li key={item}>
            <Tag label={item} variant="mono" size="sm" />
          </li>
        ))}
      </ul>
      <span class="case-card__cta" aria-hidden="true">
        Read case study
        <Icon name="arrow-right" />
      </span>
    </article>
  )
}
