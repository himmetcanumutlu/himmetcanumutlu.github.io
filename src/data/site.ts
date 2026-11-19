import type { Section, SectionId, Theme } from './types'

export const SITE_URL = 'https://himmetcanumutlu.github.io/'
export const GITHUB_OWNER = 'himmetcanumutlu'
export const THEME_STORAGE_KEY = 'theme-editorial'

/** Must match the <meta name="theme-color"> values set in index.html. */
export const THEME_COLORS: Record<Theme, string> = {
  dark: '#141413',
  light: '#fbf9f5',
}

export const sections: Section[] = [
  { id: 'top', label: 'Home', title: 'H. Can Umutlu', inNav: false },
  { id: 'domains', label: 'Domains', title: 'What I work on', kicker: 'Six domains, one thread', inNav: true },
  { id: 'work', label: 'Work', title: 'Featured work', kicker: 'Case studies', inNav: true },
  { id: 'lab', label: 'Lab', title: 'The lab', kicker: 'Everything else I have built', inNav: false },
  { id: 'journey', label: 'Journey', title: 'Experience & communities', kicker: 'Built from zero, handed on', inNav: true },
  { id: 'ventures', label: 'Ventures', title: 'Ventures', kicker: 'Zero-to-one products', inNav: true },
  { id: 'systems', label: 'Systems', title: 'Security & systems lab', kicker: 'Self-hosted, always on', inNav: true },
  { id: 'education', label: 'Education', title: 'Education & credentials', kicker: 'Degrees, programs, certifications', inNav: true },
  { id: 'media', label: 'Media', title: 'Media & writing', kicker: 'Where I share what I learn', inNav: false },
  { id: 'contact', label: 'Contact', title: 'Get in touch', inNav: true },
]

export const sectionById = (id: string): Section | undefined => sections.find(s => s.id === id)

export const getSection = (id: SectionId): Section => {
  const section = sectionById(id)
  if (!section) throw new Error(`Unknown section: ${id}`)
  return section
}
