// Build-time content checks. Structural problems fail the build; missing
// user-supplied assets (photos, CV, logos) only warn.

import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { commands } from '../src/data/commands'
import { certifications, certPrograms, issuers, SOURCE_ENTRY_COUNT } from '../src/data/certifications'
import { domains } from '../src/data/domains'
import { degrees, programs } from '../src/data/education'
import { events } from '../src/data/events'
import { experience } from '../src/data/experience'
import { media } from '../src/data/media'
import { organizations } from '../src/data/organizations'
import { profile, proofMetrics } from '../src/data/profile'
import { projects } from '../src/data/projects'
import { featuredCertifications, featuredProjects, includedProjects, repoStats } from '../src/data/selectors'
import { sections } from '../src/data/site'
import { systemsLab } from '../src/data/systems'
import { talks } from '../src/data/talks'
import { DOMAIN_IDS, type DomainId } from '../src/data/types'
import { ventures } from '../src/data/ventures'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors: string[] = []
const warnings: string[] = []

const fail = (message: string) => errors.push(message)
const warn = (message: string) => warnings.push(message)

const FEATURED_PROJECTS = 4
const FEATURED_CERTS = 6
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function unique(label: string, ids: string[]): void {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) fail(`${label}: duplicate id "${id}"`)
    seen.add(id)
  }
}

function checkDomains(label: string, list: readonly DomainId[]): void {
  if (list.length === 0) fail(`${label}: needs at least one domain`)
  for (const id of list) if (!DOMAIN_IDS.includes(id)) fail(`${label}: unknown domain "${id}"`)
}

function checkUrl(label: string, href: string): void {
  if (href.startsWith('/') || href.startsWith('mailto:')) return
  try {
    const url = new URL(href)
    if (url.protocol !== 'https:') fail(`${label}: link must use https (${href})`)
  } catch {
    fail(`${label}: invalid URL (${href})`)
  }
}

const assets = new Set<string>()
const asset = (path: string) => assets.add(path)

// ── Sections & domains ───────────────────────────────────────────────
unique('sections', sections.map(s => s.id))
unique('domains', domains.map(d => d.id))
for (const id of DOMAIN_IDS) if (!domains.some(d => d.id === id)) fail(`domains: missing definition for "${id}"`)

// ── Profile ──────────────────────────────────────────────────────────
if (!EMAIL.test(profile.email)) fail(`profile: invalid email "${profile.email}"`)
if (profile.links.email.href !== `mailto:${profile.email}`) fail('profile: email link does not match profile.email')
for (const link of Object.values(profile.links)) checkUrl(`profile.links.${link.kind}`, link.href)
for (const chip of profile.identityChips) checkDomains(`profile chip "${chip.label}"`, [chip.domain])
for (const item of profile.now) checkDomains(`profile now "${item.org}"`, [item.domain])
unique('proof metrics', proofMetrics.map(m => m.id))
for (const metric of proofMetrics) if (metric.domain) checkDomains(`metric "${metric.id}"`, [metric.domain])
asset(profile.headshot.src)
asset(profile.cv.href)

// ── Projects ─────────────────────────────────────────────────────────
unique('projects', projects.map(p => p.slug))
for (const project of projects) {
  const label = `project "${project.slug}"`
  checkDomains(label, project.domains)
  for (const link of project.links) checkUrl(label, link.href)
  if (project.featured && !project.include) fail(`${label}: featured projects must be included`)
  if (project.featured && !project.caseStudy) fail(`${label}: featured projects need a case study`)
  if (project.include && project.repo && !repoStats(project.repo))
    warn(`${label}: no GitHub stats for "${project.repo}" — run \`npm run fetch:github\``)
}
if (featuredProjects.length !== FEATURED_PROJECTS)
  fail(`projects: expected ${FEATURED_PROJECTS} featured, found ${featuredProjects.length}`)
unique('featured project order', featuredProjects.map(p => String(p.order)))

const includedSlugs = new Set(includedProjects.map(p => p.slug))
const requireProject = (label: string, slug: string) => {
  if (!includedSlugs.has(slug)) fail(`${label}: references unknown or hidden project "${slug}"`)
}

// ── Journey ──────────────────────────────────────────────────────────
unique('experience', experience.map(e => e.id))
for (const item of experience) {
  checkDomains(`experience "${item.id}"`, item.domains)
  for (const link of item.links) checkUrl(`experience "${item.id}"`, link.href)
}

unique('organizations', organizations.map(o => o.id))
for (const org of organizations) {
  const label = `organization "${org.id}"`
  checkDomains(label, org.domains)
  if (org.stages.length === 0) fail(`${label}: needs at least one role stage`)
  if (org.stages.some(stage => /\b(19|20)\d{2}\b/.test(stage))) fail(`${label}: stages must not contain dates`)
  for (const link of org.links) checkUrl(label, link.href)
}

unique('talks', talks.map(t => t.id))
for (const talk of talks) {
  checkDomains(`talk "${talk.id}"`, talk.domains)
  for (const link of talk.links) checkUrl(`talk "${talk.id}"`, link.href)
}

unique('events', events.map(e => e.id))
for (const event of events) {
  checkDomains(`event "${event.id}"`, event.domains)
  if (!MONTH.test(event.sortKey)) fail(`event "${event.id}": sortKey must be YYYY-MM`)
  asset(event.cover.src)
}

// ── Ventures ─────────────────────────────────────────────────────────
unique('ventures', ventures.map(v => v.id))
for (const venture of ventures) {
  const label = `venture "${venture.id}"`
  checkDomains(label, venture.domains)
  if (venture.status === 'live') {
    if (!venture.url) fail(`${label}: live ventures need a URL`)
    else checkUrl(label, venture.url)
  } else if (venture.url) {
    fail(`${label}: only live ventures may link out`)
  }
}

// ── Systems lab ──────────────────────────────────────────────────────
const nodeIds = new Set(systemsLab.topology.nodes.map(n => n.id))
unique('topology nodes', [...systemsLab.topology.nodes.map(n => n.id)])
for (const link of systemsLab.topology.links) {
  if (!nodeIds.has(link.from) || !nodeIds.has(link.to)) fail(`topology: link ${link.from} → ${link.to} references a missing node`)
}
unique('lab cards', systemsLab.cards.map(c => c.id))
for (const slug of systemsLab.relatedProjects) requireProject('systems lab', slug)
unique('terminal commands', systemsLab.terminal.commands.map(c => c.name))
if (!systemsLab.terminal.commands.some(c => c.name === 'help')) fail('terminal: a `help` command is required')
if (!systemsLab.terminal.commands.some(c => c.name === 'whoami')) fail('terminal: a `whoami` command is required')

// ── Education & credentials ──────────────────────────────────────────
unique('degrees', degrees.map(d => d.id))
for (const degree of degrees) {
  checkDomains(`degree "${degree.id}"`, degree.domains)
  for (const slug of degree.relatedProjects) requireProject(`degree "${degree.id}"`, slug)
}
unique('programs', programs.map(p => p.id))
for (const program of programs) checkDomains(`program "${program.id}"`, program.domains)

unique('issuers', issuers.map(i => i.id))
unique('cert programs', certPrograms.map(p => p.id))
unique('certifications', certifications.map(c => c.id))
const issuerIds = new Set(issuers.map(i => i.id))
const programIssuer = new Map(certPrograms.map(p => [p.id, p.issuerId]))

for (const program of certPrograms) {
  if (!issuerIds.has(program.issuerId)) fail(`cert program "${program.id}": unknown issuer "${program.issuerId}"`)
}
for (const issuer of issuers) if (issuer.logo) asset(issuer.logo)

for (const cert of certifications) {
  const label = `certification "${cert.id}"`
  checkDomains(label, cert.domains)
  if (!issuerIds.has(cert.issuerId)) fail(`${label}: unknown issuer "${cert.issuerId}"`)
  if (cert.issued !== null && !MONTH.test(cert.issued)) fail(`${label}: issued must be YYYY-MM or null`)
  if (cert.url) checkUrl(label, cert.url)
  if (cert.programId) {
    const owner = programIssuer.get(cert.programId)
    if (!owner) fail(`${label}: unknown program "${cert.programId}"`)
    else if (owner !== cert.issuerId) fail(`${label}: program "${cert.programId}" belongs to another issuer`)
  }
  if (cert.featuredRank !== undefined && cert.placement !== 'wall') fail(`${label}: featured certifications must be on the wall`)
}

const sourceEntries = certifications.reduce((sum, c) => sum + 1 + (c.mergedDuplicates ?? 0), 0)
if (sourceEntries !== SOURCE_ENTRY_COUNT)
  fail(`certifications: audit mismatch — ${sourceEntries} source entries accounted for, expected ${SOURCE_ENTRY_COUNT}`)

const ranks = featuredCertifications.map(c => c.featuredRank)
if (ranks.length !== FEATURED_CERTS) fail(`certifications: expected ${FEATURED_CERTS} featured, found ${ranks.length}`)
ranks.forEach((rank, index) => {
  if (rank !== index + 1) fail(`certifications: featured ranks must run 1–${FEATURED_CERTS} without gaps`)
})

// ── Media & commands ─────────────────────────────────────────────────
unique('media', media.map(m => m.id))
for (const item of media) {
  checkDomains(`media "${item.id}"`, item.domains)
  checkUrl(`media "${item.id}"`, item.href)
}

unique('commands', commands.map(c => c.id))
const sectionIds = new Set(sections.map(s => s.id))
for (const command of commands) {
  const { action } = command
  if (action.type === 'section' && !sectionIds.has(action.id)) fail(`command "${command.id}": unknown section`)
  if (action.type === 'project') requireProject(`command "${command.id}"`, action.slug)
  if (action.type === 'open') checkUrl(`command "${command.id}"`, action.href)
}

// ── Static assets referenced outside the data layer ──────────────────
asset('/favicon.svg')
asset('/assets/og/og-image.png')
asset('/assets/img/apple-touch-icon.png')

for (const path of [...assets].sort()) {
  if (!existsSync(resolve(root, 'public', `.${path}`))) warn(`asset not found yet: public${path}`)
}

// ── Report ───────────────────────────────────────────────────────────
const summary =
  `${includedProjects.length} projects (${featuredProjects.length} featured) · ` +
  `${organizations.length} organizations · ${ventures.length} ventures · ` +
  `${certifications.length} certifications (${sourceEntries} source entries)`

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`)
  for (const message of warnings) console.warn(`  ⚠ ${message}`)
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`)
  for (const message of errors) console.error(`  ✖ ${message}`)
  process.exit(1)
}

console.log(`\n✔ content valid — ${summary}`)
