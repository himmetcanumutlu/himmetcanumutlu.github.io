import type { ProjectType, VentureStatus } from '../data/types'

export const projectTypeLabel: Record<ProjectType, string> = {
  solo: 'Solo',
  team: 'Team',
  coursework: 'Coursework',
  translation: 'Translation',
}

export const ventureBadgeClass: Record<VentureStatus, string> = {
  live: 'badge badge--live badge--pulse',
  standby: 'badge badge--standby',
  sunset: 'badge badge--sunset',
}

const pluralRules = new Intl.PluralRules('en-US')

/** "1 project", "3 projects". */
export const plural = (count: number, singular: string, pluralForm = `${singular}s`): string =>
  `${count} ${pluralRules.select(count) === 'one' ? singular : pluralForm}`

/** Strips protocol and trailing slash for display. */
export const prettyUrl = (href: string): string => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
