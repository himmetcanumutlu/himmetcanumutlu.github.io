/**
 * Content stores site-relative asset paths ("/assets/..."). The build can be
 * served from a subpath (BASE_PATH), so resolve them against Vite's base.
 * Outside Vite (content scripts run through tsx) there is no import.meta.env.
 */
const configured: string = import.meta.env?.BASE_URL ?? (typeof process !== 'undefined' ? process.env.BASE_PATH : undefined) ?? '/'
const base = configured.replace(/\/$/, '')

export const withBase = (path: string): string => (path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path)
