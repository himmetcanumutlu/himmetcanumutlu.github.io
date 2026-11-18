import { domainById } from '../../data/domains'
import { repoStats } from '../../data/selectors'
import type { ExternalLink, Project } from '../../data/types'
import { projectTypeLabel } from '../../lib/labels'
import Icon from '../ui/Icon'
import Tag from '../ui/Tag'

interface CaseStudyBodyProps {
  project: Project
}

const linksFor = (project: Project): ExternalLink[] => {
  const links = [...project.links]
  const stats = repoStats(project.repo)
  if (stats && !links.some(link => link.href === stats.url)) {
    links.unshift({ label: 'Repository', href: stats.url, kind: 'github' })
  }
  return links
}

const linkIcon = (link: ExternalLink): 'github' | 'linkedin' | 'external' =>
  link.kind === 'github' ? 'github' : link.kind === 'post' ? 'linkedin' : 'external'

/** Full write-up for one project, rendered inside the case-study drawer. */
export default function CaseStudyBody({ project }: CaseStudyBodyProps) {
  const study = project.caseStudy
  const links = linksFor(project)

  return (
    <div class="case" data-domain={project.domains[0]}>
      <header class="case__header">
        <div class="case__badges">
          <span class="badge">{projectTypeLabel[project.type]}</span>
          {project.domains.map(id => (
            <Tag key={id} label={domainById(id).shortLabel} domain={id} size="sm" />
          ))}
        </div>
        <h2 id={`case-${project.slug}-title`} class="case__title">
          {project.title}
        </h2>
        <p class="case__tagline">{project.tagline}</p>
        <dl class="case__facts">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>{project.context ?? String(project.year)}</dd>
          </div>
        </dl>
      </header>

      {project.metrics.length > 0 ? (
        <dl class="case__metrics">
          {project.metrics.map(metric => (
            <div key={metric.label} class="case__metric">
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        ''
      )}

      <p class="case__summary">{project.summary}</p>

      {study ? (
        <div class="case__study">
          <section class="case__block">
            <h3 class="case__heading">Problem</h3>
            <p>{study.problem}</p>
          </section>
          <section class="case__block">
            <h3 class="case__heading">Approach</h3>
            <ol class="case__list">
              {study.approach.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <section class="case__block">
            <h3 class="case__heading">Result</h3>
            <ul class="case__list case__list--result">
              {study.result.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        ''
      )}

      <section class="case__block">
        <h3 class="case__heading">Stack</h3>
        <ul class="tag-list" role="list">
          {project.stack.map(item => (
            <li key={item}>
              <Tag label={item} variant="mono" size="sm" />
            </li>
          ))}
        </ul>
      </section>

      {links.length > 0 ? (
        <ul class="case__links" role="list">
          {links.map(link => (
            <li key={link.href}>
              <a class="btn btn--sm" href={link.href} target="_blank" rel="noopener noreferrer">
                <Icon name={linkIcon(link)} />
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
    </div>
  )
}
