import { certifications, certPrograms, issuers, tierLabels } from './certifications'
import { DOMAIN_IDS } from './types'
import githubSnapshot from './generated/github.json'
import { organizations } from './organizations'
import { projects } from './projects'
import { ventures, ventureStatusOrder } from './ventures'
import type {
  CertProgram,
  CertTier,
  Certification,
  DomainId,
  GithubSnapshot,
  Issuer,
  Organization,
  Project,
  RepoStats,
  Venture,
} from './types'

// Pure, framework-free helpers over static content. Stores and components
// read from these; nothing here touches the DOM.

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

// ── Projects ─────────────────────────────────────────────────────────

export const includedProjects: Project[] = projects.filter(p => p.include)

export const featuredProjects: Project[] = includedProjects.filter(p => p.featured).sort(byOrder)

export const labProjects: Project[] = includedProjects.filter(p => !p.featured).sort(byOrder)

export const getProject = (slug: string | null | undefined): Project | undefined =>
  slug ? includedProjects.find(p => p.slug === slug) : undefined

export const projectsForDomain = (domain: DomainId | null, list: Project[] = labProjects): Project[] =>
  domain ? list.filter(p => p.domains.includes(domain)) : list

/** Per-domain count of every included project, for bento tiles. */
export const domainProjectCounts: Record<DomainId, number> = DOMAIN_IDS.reduce(
  (acc, id) => {
    acc[id] = includedProjects.filter(p => p.domains.includes(id)).length
    return acc
  },
  {} as Record<DomainId, number>,
)

/** Space-separated domain list for the `data-d` attribute used by CSS highlighting. */
export const domainAttr = (ids: readonly DomainId[]): string => ids.join(' ')

// ── GitHub stats ─────────────────────────────────────────────────────

const snapshot = githubSnapshot as GithubSnapshot

export const githubGeneratedAt = snapshot.generatedAt

export const repoStats = (repo: string | undefined): RepoStats | undefined => (repo ? snapshot.repos[repo] : undefined)

export const projectStars = (project: Project): number | undefined => repoStats(project.repo)?.stars

// ── Journey ──────────────────────────────────────────────────────────

export const sortedOrganizations: Organization[] = [...organizations].sort(byOrder)

export const currentOrganizations: Organization[] = sortedOrganizations.filter(o => o.status === 'current')

// ── Ventures ─────────────────────────────────────────────────────────

export const sortedVentures: Venture[] = [...ventures].sort(
  (a, b) => ventureStatusOrder[a.status] - ventureStatusOrder[b.status] || a.order - b.order,
)

// ── Certifications ───────────────────────────────────────────────────

const issuerMap = new Map(issuers.map(i => [i.id, i]))
const programMap = new Map(certPrograms.map(p => [p.id, p]))

export const issuerById = (id: string): Issuer => {
  const issuer = issuerMap.get(id)
  if (!issuer) throw new Error(`Unknown issuer: ${id}`)
  return issuer
}

export const programById = (id: string): CertProgram | undefined => programMap.get(id)

const newestFirst = (a: Certification, b: Certification) => (b.issued ?? '').localeCompare(a.issued ?? '')

export const wallCertifications: Certification[] = certifications.filter(c => c.placement === 'wall')

export const ventureCertifications: Certification[] = certifications
  .filter(c => c.placement === 'ventures')
  .sort(newestFirst)

export const featuredCertifications: Certification[] = certifications
  .filter(c => c.featuredRank !== undefined)
  .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))

/** Unique credentials, including those shown under Ventures. */
export const uniqueCertificationCount = certifications.length

/** Rounded-down headline, e.g. 42 → "40+". */
export const certificationHeadline = `${Math.floor(uniqueCertificationCount / 10) * 10}+`

/** A card on the wall: either a single credential or a folded program. */
export type CertCard =
  | { kind: 'single'; id: string; cert: Certification }
  | { kind: 'program'; id: string; program: CertProgram; certs: Certification[]; issued: string | null }

export interface IssuerGroup {
  issuer: Issuer
  cards: CertCard[]
  count: number
  latest: string | null
}

export interface TierGroup {
  tier: CertTier
  label: string
  groups: IssuerGroup[]
  count: number
}

const buildCards = (certs: Certification[]): CertCard[] => {
  const cards: CertCard[] = []
  const folded = new Map<string, Certification[]>()

  for (const cert of certs) {
    if (cert.programId) {
      const list = folded.get(cert.programId) ?? []
      list.push(cert)
      folded.set(cert.programId, list)
    } else {
      cards.push({ kind: 'single', id: cert.id, cert })
    }
  }

  for (const [programId, list] of folded) {
    const program = programById(programId)
    if (!program) continue
    const sorted = [...list].sort((a, b) => {
      const rank = (a.featuredRank ?? 99) - (b.featuredRank ?? 99)
      return rank !== 0 ? rank : newestFirst(a, b)
    })
    cards.push({ kind: 'program', id: program.id, program, certs: sorted, issued: sorted[0]?.issued ?? null })
  }

  const cardDate = (card: CertCard) => (card.kind === 'single' ? card.cert.issued : card.issued) ?? ''
  return cards.sort((a, b) => cardDate(b).localeCompare(cardDate(a)))
}

export const certTiers: TierGroup[] = ([1, 2, 3] as CertTier[]).map(tier => {
  const tierIssuers = issuers.filter(i => i.tier === tier)
  const groups: IssuerGroup[] = tierIssuers
    .map(issuer => {
      const certs = wallCertifications.filter(c => c.issuerId === issuer.id).sort(newestFirst)
      return {
        issuer,
        cards: buildCards(certs),
        count: certs.length,
        latest: certs[0]?.issued ?? null,
      }
    })
    .filter(group => group.count > 0)
    .sort((a, b) => b.count - a.count || (b.latest ?? '').localeCompare(a.latest ?? ''))

  return {
    tier,
    label: tierLabels[tier],
    groups,
    count: groups.reduce((sum, g) => sum + g.count, 0),
  }
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-07" → "Jul 2026"; null → "". */
export const formatMonth = (value: string | null): string => {
  if (!value) return ''
  const [year, month] = value.split('-')
  const index = Number(month) - 1
  return MONTHS[index] ? `${MONTHS[index]} ${year}` : year
}
