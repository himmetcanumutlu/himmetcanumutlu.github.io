import { domainAttr } from '../../data/selectors'
import type { Project } from '../../data/types'
import Icon from '../ui/Icon'

interface CaseStudyCardProps {
  project: Project
}

/** A featured case study set as an editorial entry. The title opens the drawer (?project=slug). */
export default function CaseStudyCard({ project }: CaseStudyCardProps) {
  return (
    <article class="entry case-entry" data-d={domainAttr(project.domains)} data-domain={project.domains[0]}>
      <p class="entry__meta">{`${project.context ?? project.role} · ${project.year}`}</p>
      <h3 class="entry__title">
        <a class="stretched-link" href={`?project=${project.slug}`} data-project={project.slug}>
          {project.title}
        </a>
      </h3>
      <p class="entry__lede">{project.tagline}</p>
      <dl class="figures">
        {project.metrics.map(metric => (
          <div key={metric.label} class="figures__item">
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
      <p class="entry__stack">{project.stack.slice(0, 4).join(' / ')}</p>
      <span class="entry__cta" aria-hidden="true">
        <span>Read the case study</span>
        <Icon name="arrow-right" />
      </span>
    </article>
  )
}
