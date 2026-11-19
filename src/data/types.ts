// Shared content model. Every entity that can be filtered carries `domains`,
// which drives bento counts, filtering, cross-highlighting and accent colors.

export const DOMAIN_IDS = ['ai', 'cloud', 'community', 'systems', 'ventures', 'academic'] as const
export type DomainId = (typeof DOMAIN_IDS)[number]

export type Theme = 'dark' | 'light'

export type LinkKind =
  | 'github'
  | 'linkedin'
  | 'youtube'
  | 'email'
  | 'web'
  | 'pdf'
  | 'slides'
  | 'credential'
  | 'post'

export interface ExternalLink {
  label: string
  href: string
  kind: LinkKind
}

export interface ImageAsset {
  src: string
  alt: string
  width?: number
  height?: number
}

// ── Profile ──────────────────────────────────────────────────────────

export interface IdentityChip {
  label: string
  domain: DomainId
}

export interface NowItem {
  role: string
  org: string
  domain: DomainId
}

export interface Language {
  name: string
  level: string
}

export interface Profile {
  name: string
  displayName: string
  givenName: string
  familyName: string
  headline: string
  roleLine: string
  bio: string[]
  location: string
  email: string
  availability: string
  identityChips: IdentityChip[]
  now: NowItem[]
  headshot: ImageAsset
  cv: { href: string; label: string }
  links: {
    github: ExternalLink
    linkedin: ExternalLink
    youtube: ExternalLink
    email: ExternalLink
  }
  languages: Language[]
  beyondTech: string[]
}

export interface Metric {
  id: string
  /** Numeric value used for the count-up animation; null for text-only stats. */
  value: number | null
  display: string
  prefix?: string
  suffix?: string
  label: string
  detail?: string
  domain?: DomainId
}

// ── Navigation ───────────────────────────────────────────────────────

export type SectionId =
  | 'top'
  | 'domains'
  | 'work'
  | 'lab'
  | 'journey'
  | 'ventures'
  | 'systems'
  | 'education'
  | 'media'
  | 'contact'

export interface Section {
  id: SectionId
  label: string
  title: string
  kicker?: string
  inNav: boolean
}

// ── Domains ──────────────────────────────────────────────────────────

export type TileSize = 'lg' | 'md' | 'sm'

export interface Domain {
  id: DomainId
  label: string
  shortLabel: string
  claim: string
  proofs: string[]
  size: TileSize
}

// ── Projects ─────────────────────────────────────────────────────────

export type ProjectType = 'solo' | 'team' | 'coursework' | 'translation'
export type ContentLang = 'en' | 'tr'

export interface ProjectMetric {
  value: string
  label: string
}

export interface CaseStudy {
  problem: string
  approach: string[]
  result: string[]
}

export interface Project {
  slug: string
  title: string
  tagline: string
  summary: string
  type: ProjectType
  role: string
  context?: string
  domains: DomainId[]
  stack: string[]
  metrics: ProjectMetric[]
  lang: ContentLang
  year: number
  featured: boolean
  /** Featured ordering (1-based); lab items are ordered by `order` too. */
  order: number
  /** Only primary-author / core-builder work is shown. */
  include: boolean
  /** GitHub repository name under the owner account, used for live stats. */
  repo?: string
  links: ExternalLink[]
  caseStudy?: CaseStudy
}

// ── Journey: experience, organizations, talks, events ────────────────

export interface Experience {
  id: string
  role: string
  org: string
  period: string
  mode?: string
  domains: DomainId[]
  summary: string
  highlights: string[]
  links: ExternalLink[]
  order: number
}

export type OrgStatus = 'current' | 'handed-off' | 'alumni'

export interface Organization {
  id: string
  name: string
  shortName: string
  domains: DomainId[]
  /** Role progression stages, earliest → latest. No dates are displayed. */
  stages: string[]
  status: OrgStatus
  summary: string
  highlights: string[]
  /** Awards and results earned in this community; shown on the lane. */
  recognition?: string[]
  links: ExternalLink[]
  order: number
}

export interface Talk {
  id: string
  title: string
  series: string
  edition: string
  host: string
  year: number
  format: string
  domains: DomainId[]
  summary: string
  topics: string[]
  links: ExternalLink[]
}

export interface EventItem {
  id: string
  name: string
  host: string
  when: string
  /** Sort key in YYYY-MM form. */
  sortKey: string
  venue?: string
  role: string
  domains: DomainId[]
  cover: ImageAsset
}

// ── Ventures ─────────────────────────────────────────────────────────

export type VentureStatus = 'live' | 'standby' | 'sunset'

export interface Venture {
  id: string
  name: string
  role: string
  status: VentureStatus
  statusLabel: string
  pitch: string
  proof: string[]
  /** Only live ventures link out. */
  url: string | null
  domains: DomainId[]
  order: number
}

// ── Systems lab ──────────────────────────────────────────────────────

export interface TopologyNode {
  id: string
  label: string
  detail: string
  kind: 'internet' | 'edge' | 'server' | 'network' | 'device'
}

export interface TopologyLink {
  from: string
  to: string
  label?: string
}

export interface LabCard {
  id: string
  title: string
  items: { label: string; value: string }[]
}

export type TerminalLine = { kind: 'cmd' | 'out' | 'muted' | 'accent'; text: string }

export interface TerminalCommand {
  name: string
  description: string
  output: TerminalLine[]
}

export interface SystemsLab {
  summary: string
  topology: { nodes: TopologyNode[]; links: TopologyLink[] }
  cards: LabCard[]
  relatedProjects: string[]
  terminal: {
    user: string
    host: string
    bootScript: TerminalLine[]
    commands: TerminalCommand[]
  }
}

// ── Education & credentials ──────────────────────────────────────────

export interface Degree {
  id: string
  institution: string
  program: string
  degree: string
  years: string
  mode?: string
  domains: DomainId[]
  highlights: string[]
  relatedProjects: string[]
}

export interface Program {
  id: string
  name: string
  provider: string
  year: number
  detail: string
  domains: DomainId[]
}

export type CertTier = 1 | 2 | 3

export interface Issuer {
  id: string
  name: string
  tier: CertTier
  bigTech: boolean
  logo?: string
}

/** Groups several course-level certificates under one parent card. */
export interface CertProgram {
  id: string
  title: string
  issuerId: string
  description: string
}

export type CertPlacement = 'wall' | 'ventures'

export interface Certification {
  id: string
  title: string
  /** Title as issued, when it differs (e.g. Turkish original). */
  originalTitle?: string
  issuerId: string
  /** Issue month in YYYY-MM form; null when the issuer gave no date. */
  issued: string | null
  credentialId?: string
  url?: string
  programId?: string
  /** 1–6 when featured on the wall. */
  featuredRank?: number
  domains: DomainId[]
  placement: CertPlacement
  /** Other entries on the source profile that were merged into this one. */
  mergedDuplicates?: number
}

// ── Media ────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  type: 'channel' | 'writing' | 'post'
  title: string
  outlet: string
  summary: string
  href: string
  when: string
  domains: DomainId[]
}

// ── Command palette ──────────────────────────────────────────────────

export type CommandAction =
  | { type: 'section'; id: SectionId }
  | { type: 'project'; slug: string }
  | { type: 'domain'; id: DomainId }
  | { type: 'theme' }
  | { type: 'copy-email' }
  | { type: 'open'; href: string }
  | { type: 'terminal' }

export interface Command {
  id: string
  group: 'Navigate' | 'Projects' | 'Filter' | 'Actions' | 'Links'
  label: string
  hint?: string
  keywords: string[]
  action: CommandAction
}

// ── Generated data ───────────────────────────────────────────────────

export interface RepoStats {
  stars: number
  forks: number
  pushedAt: string
  url: string
}

export interface GithubSnapshot {
  generatedAt: string
  owner: string
  repos: Record<string, RepoStats>
}
