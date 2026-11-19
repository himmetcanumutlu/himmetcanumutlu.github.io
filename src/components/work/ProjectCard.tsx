import { domainAttr, repoStats } from '../../data/selectors'
import type { Project } from '../../data/types'
import { projectTypeLabel } from '../../lib/labels'

interface ProjectCardProps {
  project: Project
}

/** One lab project as a row of the index: kind, title and line, stack, source. */
export default function ProjectCard({ project }: ProjectCardProps) {
  const stats = repoStats(project.repo)
  const repoUrl = stats?.url ?? project.links.find(link => link.kind === 'github')?.href
  const meta = `${projectTypeLabel[project.type]}${project.lang === 'tr' ? ' · in Turkish' : ''} · ${project.year}`
  const stars = stats && stats.stars > 0 ? `★ ${stats.stars}` : ''

  return (
    <article class="row project-row" data-d={domainAttr(project.domains)} data-domain={project.domains[0]}>
      <p class="row__meta">{meta}</p>
      <div class="row__main">
        <h3 class="row__title">
          <a class="stretched-link" href={`?project=${project.slug}`} data-project={project.slug}>
            {project.title}
          </a>
        </h3>
        <p class="row__body">{project.tagline}</p>
        <p class="row__stack">{project.stack.slice(0, 3).join(' / ')}</p>
      </div>
      <p class="row__aside">
        <span class="row__stars">{stars}</span>
        {repoUrl ? (
          <a class="row__source" href={repoUrl} target="_blank" rel="noopener noreferrer">
            Source
          </a>
        ) : (
          ''
        )}
      </p>
    </article>
  )
}
