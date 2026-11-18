import { domainAttr, repoStats } from '../../data/selectors'
import type { Project } from '../../data/types'
import { projectTypeLabel } from '../../lib/labels'
import Icon from '../ui/Icon'
import Tag from '../ui/Tag'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const stats = repoStats(project.repo)
  const repoUrl = stats?.url ?? project.links.find(link => link.kind === 'github')?.href

  return (
    <article class="card card--interactive project-card" data-d={domainAttr(project.domains)} data-domain={project.domains[0]}>
      <div class="project-card__meta">
        <span class="badge">{projectTypeLabel[project.type]}</span>
        {project.lang === 'tr' ? <span class="badge">TR</span> : ''}
        {stats && stats.stars > 0 ? <span class="project-card__stars">★ {stats.stars}</span> : ''}
      </div>
      <h3 class="card__title">
        <a class="stretched-link" href={`?project=${project.slug}`} data-project={project.slug}>
          {project.title}
        </a>
      </h3>
      <p class="card__body">{project.tagline}</p>
      <ul class="tag-list" role="list" aria-label="Stack">
        {project.stack.slice(0, 3).map(item => (
          <li key={item}>
            <Tag label={item} variant="mono" size="sm" />
          </li>
        ))}
      </ul>
      {repoUrl ? (
        <a class="project-card__repo" href={repoUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="github" />
          <span>Source</span>
        </a>
      ) : (
        ''
      )}
    </article>
  )
}
