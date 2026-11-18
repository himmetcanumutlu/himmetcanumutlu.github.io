import { domains } from './domains'
import { profile } from './profile'
import { includedProjects } from './selectors'
import { sections } from './site'
import type { Command } from './types'

// The command palette index, derived from content so it never drifts.

const sectionCommands: Command[] = sections.map(section => ({
  id: `section:${section.id}`,
  group: 'Navigate',
  label: section.id === 'top' ? 'Go to top' : `Go to ${section.label}`,
  hint: section.kicker,
  keywords: [section.label, section.title, section.id],
  action: { type: 'section', id: section.id },
}))

const projectCommands: Command[] = includedProjects.map(project => ({
  id: `project:${project.slug}`,
  group: 'Projects',
  label: project.title,
  hint: project.tagline,
  keywords: [project.title, project.slug, ...project.stack, ...(project.context ? [project.context] : [])],
  action: { type: 'project', slug: project.slug },
}))

const domainCommands: Command[] = domains.map(domain => ({
  id: `domain:${domain.id}`,
  group: 'Filter',
  label: `Show ${domain.label} work`,
  hint: domain.claim,
  keywords: [domain.label, domain.shortLabel, domain.id, 'filter'],
  action: { type: 'domain', id: domain.id },
}))

const actionCommands: Command[] = [
  {
    id: 'action:theme',
    group: 'Actions',
    label: 'Toggle light / dark theme',
    keywords: ['theme', 'dark', 'light', 'mode', 'color'],
    action: { type: 'theme' },
  },
  {
    id: 'action:copy-email',
    group: 'Actions',
    label: 'Copy email address',
    hint: profile.email,
    keywords: ['email', 'mail', 'contact', 'copy'],
    action: { type: 'copy-email' },
  },
  {
    id: 'action:terminal',
    group: 'Actions',
    label: 'Run whoami in the terminal',
    keywords: ['whoami', 'terminal', 'shell', 'homelab', 'server'],
    action: { type: 'terminal' },
  },
  {
    id: 'action:cv',
    group: 'Actions',
    label: 'Open CV (PDF)',
    keywords: ['cv', 'resume', 'résumé', 'pdf'],
    action: { type: 'open', href: profile.cv.href },
  },
]

const linkCommands: Command[] = [profile.links.github, profile.links.linkedin, profile.links.youtube].map(link => ({
  id: `link:${link.kind}`,
  group: 'Links',
  label: `Open ${link.label}`,
  hint: link.href.replace(/^https?:\/\/(www\.)?/, ''),
  keywords: [link.label, link.kind],
  action: { type: 'open', href: link.href },
}))

export const commands: Command[] = [
  ...sectionCommands,
  ...projectCommands,
  ...domainCommands,
  ...actionCommands,
  ...linkCommands,
]
