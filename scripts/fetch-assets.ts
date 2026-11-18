/**
 * One-time asset fetch: pulls the public images the site references into
 * public/assets/ and sizes them to what the markup declares.
 *
 *   npm run fetch-assets            fill in missing files only
 *   npm run fetch-assets -- --force regenerate everything
 *
 * Sources
 *  - headshot + touch icon: assets-src/headshot.{jpg,jpeg,png,webp} when present,
 *    otherwise the GitHub profile avatar
 *  - issuer logos: Simple Icons (CC0) and Wikimedia Commons (public-domain text logos)
 *  - Open Graph card: rendered locally from profile data + the headshot
 *  - event covers: any photo dropped at assets-src/events/<event-id>.{jpg,jpeg,png,webp}
 *    is cropped to 3:2; portrait shots are letterboxed over a blurred copy of
 *    themselves instead of losing most of the frame (assets-src/ is git-ignored)
 *
 * This is run by hand; nothing in CI calls it.
 */
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { domains } from '../src/data/domains'
import { events } from '../src/data/events'
import { profile } from '../src/data/profile'
import { SITE_URL } from '../src/data/site'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(root, 'public')
const sourceDir = resolve(root, 'assets-src')
const force = process.argv.includes('--force')
const GITHUB_USER = 'himmetcanumutlu'
const USER_AGENT = `${GITHUB_USER}.github.io asset fetch`

type Result = { path: string; status: 'written' | 'kept' | 'missing'; note?: string }
const results: Result[] = []

const out = (sitePath: string) => resolve(publicDir, `.${sitePath}`)

const shouldWrite = (sitePath: string): boolean => {
  if (!force && existsSync(out(sitePath))) {
    results.push({ path: sitePath, status: 'kept' })
    return false
  }
  return true
}

const save = async (sitePath: string, data: Buffer | string, note?: string) => {
  const file = out(sitePath)
  mkdirSync(dirname(file), { recursive: true })
  await writeFile(file, data)
  results.push({ path: sitePath, status: 'written', note })
}

const download = async (url: string): Promise<Buffer> => {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const sentenceCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

/** Finds assets-src/<dir>/<name>.<image extension>, if one was dropped in. */
const findSource = (dir: string, name: string): string | null => {
  const folder = resolve(sourceDir, dir)
  if (!existsSync(folder)) return null
  const match = readdirSync(folder).find(file => {
    const ext = extname(file).toLowerCase()
    return SOURCE_EXTENSIONS.has(ext) && file.slice(0, -ext.length) === name
  })
  return match ? resolve(folder, match) : null
}

// ── Headshot ─────────────────────────────────────────────────────────
const loadHeadshotSource = async (): Promise<Buffer> => {
  const local = findSource('.', 'headshot')
  if (local) return readFile(local)
  const response = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) throw new Error(`GitHub API ${response.status} for user ${GITHUB_USER}`)
  const { avatar_url: avatarUrl } = (await response.json()) as { avatar_url: string }
  const url = new URL(avatarUrl)
  url.searchParams.set('s', '1024')
  return download(url.toString())
}

/** Tighter square crop for small icons; portraits frame the head upper-centre. */
const faceCrop = async (image: Buffer, size: number) => {
  const { width = 0, height = 0 } = await sharp(image).metadata()
  const side = Math.round(Math.min(width, height) * 0.62)
  const left = Math.max(0, Math.min(width - side, Math.round(width * 0.49 - side / 2)))
  const top = Math.max(0, Math.min(height - side, Math.round(height * 0.05)))
  return sharp(image).extract({ left, top, width: side, height: side }).resize(size, size)
}

const writeHeadshots = async (avatar: Buffer) => {
  const { width = 0 } = await sharp(avatar).metadata()
  const { src: headshot, width: size = 640 } = profile.headshot
  if (shouldWrite(headshot)) {
    const image = await sharp(avatar)
      .resize(size, size, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 86, mozjpeg: true, progressive: true })
      .toBuffer()
    await save(headshot, image, width < size ? `upscaled from a ${width}px source` : `from a ${width}px source`)
  }

  const touchIcon = '/assets/img/apple-touch-icon.png'
  if (shouldWrite(touchIcon)) {
    const image = await (await faceCrop(avatar, 180)).flatten({ background: '#0b0d12' }).png({ compressionLevel: 9 }).toBuffer()
    await save(touchIcon, image)
  }
}

// ── Issuer logos ─────────────────────────────────────────────────────
const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@16.38.0/icons'
const logos: { file: string; url: string; fill?: string }[] = [
  { file: 'huawei', url: `${SIMPLE_ICONS}/huawei.svg`, fill: '#FF0000' },
  { file: 'google', url: `${SIMPLE_ICONS}/google.svg`, fill: '#4285F4' },
  { file: 'ibm', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { file: 'nvidia', url: `${SIMPLE_ICONS}/nvidia.svg`, fill: '#76B900' },
  { file: 'pg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Procter_%26_Gamble_logo.svg' },
]

const writeLogos = async () => {
  for (const logo of logos) {
    const sitePath = `/assets/logos/${logo.file}.svg`
    if (!shouldWrite(sitePath)) continue
    try {
      let svg = (await download(logo.url)).toString('utf8').trim()
      if (!svg.includes('<svg')) throw new Error('response is not an SVG')
      if (logo.fill) svg = svg.replace('<svg ', `<svg fill="${logo.fill}" `)
      await save(sitePath, `${svg}\n`)
    } catch (error) {
      results.push({ path: sitePath, status: 'missing', note: (error as Error).message })
    }
  }
}

// ── Open Graph card ──────────────────────────────────────────────────
const OG = { width: 1200, height: 630 }
const PHOTO = { size: 300, x: 850, y: 165 }
const domainColors: Record<string, string> = {
  ai: '#b69cff',
  cloud: '#4cc3ff',
  community: '#ffc457',
  systems: '#3ddc97',
  ventures: '#ff8a7a',
  academic: '#b5e655',
}

const ogSvg = (): string => {
  const [claim, detail = ''] = profile.headline.split(': ')
  const sans = "'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
  const mono = "'Cascadia Code', 'JetBrains Mono', Consolas, monospace"
  const host = new URL(SITE_URL).host

  let chipX = 80
  const chips = domains
    .map(domain => {
      const label = escapeXml(domain.shortLabel)
      const chipWidth = 44 + domain.shortLabel.length * 11.5
      const chip = `
        <g transform="translate(${chipX} 490)">
          <rect width="${chipWidth}" height="40" rx="20" fill="#181c25" stroke="#343a48" />
          <circle cx="20" cy="20" r="6" fill="${domainColors[domain.id]}" />
          <text x="34" y="26.5" font-family="${sans}" font-size="18" font-weight="600" fill="#e8eaf0">${label}</text>
        </g>`
      chipX += chipWidth + 10
      return chip
    })
    .join('')

  const stripe = domains
    .map((domain, index) => {
      const w = OG.width / domains.length
      return `<rect x="${index * w}" y="${OG.height - 8}" width="${w + 1}" height="8" fill="${domainColors[domain.id]}" />`
    })
    .join('')

  const cx = PHOTO.x + PHOTO.size / 2
  const cy = PHOTO.y + PHOTO.size / 2

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}" viewBox="0 0 ${OG.width} ${OG.height}">
  <defs>
    <radialGradient id="g1" cx="15%" cy="-10%" r="75%">
      <stop offset="0" stop-color="#8fa8ff" stop-opacity="0.22" />
      <stop offset="1" stop-color="#8fa8ff" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="g2" cx="95%" cy="0%" r="55%">
      <stop offset="0" stop-color="#b69cff" stop-opacity="0.16" />
      <stop offset="1" stop-color="#b69cff" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b69cff" />
      <stop offset="0.5" stop-color="#8fa8ff" />
      <stop offset="1" stop-color="#4cc3ff" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0b0d12" />
  <rect width="100%" height="100%" fill="url(#g1)" />
  <rect width="100%" height="100%" fill="url(#g2)" />

  <text x="80" y="138" font-family="${mono}" font-size="22" fill="#8fa8ff">${escapeXml(host)}</text>
  <text x="80" y="238" font-family="${sans}" font-size="84" font-weight="700" letter-spacing="-2" fill="#e8eaf0">${escapeXml(profile.displayName)}</text>
  <text x="80" y="310" font-family="${sans}" font-size="32" font-weight="600" fill="#e8eaf0">${escapeXml(claim)}</text>
  <text x="80" y="356" font-family="${sans}" font-size="25" fill="#a6acb9">${escapeXml(sentenceCase(detail.replace(/\.$/, '')))}</text>
  <text x="80" y="430" font-family="${sans}" font-size="20" fill="#868d9b">${escapeXml(profile.roleLine)}</text>
  ${chips}

  <circle cx="${cx}" cy="${cy}" r="${PHOTO.size / 2 + 10}" fill="none" stroke="url(#ring)" stroke-width="4" />
  ${stripe}
</svg>`
}

const writeOgImage = async (avatar: Buffer) => {
  const sitePath = '/assets/og/og-image.png'
  if (!shouldWrite(sitePath)) return
  const mask = Buffer.from(
    `<svg width="${PHOTO.size}" height="${PHOTO.size}"><circle cx="${PHOTO.size / 2}" cy="${PHOTO.size / 2}" r="${PHOTO.size / 2}" /></svg>`,
  )
  const photo = await sharp(avatar)
    .resize(PHOTO.size, PHOTO.size, { fit: 'cover', position: 'attention' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
  const image = await sharp(Buffer.from(ogSvg()))
    .composite([{ input: photo, left: PHOTO.x, top: PHOTO.y }])
    .png({ compressionLevel: 9 })
    .toBuffer()
  await save(sitePath, image)
}

// ── Event covers ─────────────────────────────────────────────────────
const coverImage = async (source: string, width: number, height: number) => {
  const input = await sharp(source).rotate().toBuffer()
  const { width: w = 0, height: h = 0 } = await sharp(input).metadata()
  if (w >= h) return sharp(input).resize(width, height, { fit: 'cover', position: 'attention' })

  const backdrop = await sharp(input).resize(width, height, { fit: 'cover' }).blur(40).modulate({ brightness: 0.55 }).toBuffer()
  const foreground = await sharp(input).resize({ height, fit: 'inside' }).toBuffer()
  const { width: fw = 0 } = await sharp(foreground).metadata()
  return sharp(backdrop).composite([{ input: foreground, left: Math.round((width - fw) / 2), top: 0 }])
}

const writeEventCovers = async () => {
  for (const event of events) {
    const { src, width = 1200, height = 800 } = event.cover
    if (!shouldWrite(src)) continue
    const source = findSource('events', event.id)
    if (!source) {
      results.push({ path: src, status: 'missing', note: `drop a photo at assets-src/events/${event.id}.jpg` })
      continue
    }
    const image = await (await coverImage(source, width, height))
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer()
    await save(src, image)
  }
}

// ── Run ──────────────────────────────────────────────────────────────
const avatar = await loadHeadshotSource()
await writeHeadshots(avatar)
await writeLogos()
await writeOgImage(avatar)
await writeEventCovers()

if (!existsSync(out(profile.cv.href))) {
  results.push({ path: profile.cv.href, status: 'missing', note: 'add your CV manually' })
}

const icon = { written: '✔', kept: '·', missing: '✖' } as const
for (const { path, status, note } of results) {
  console.log(`${icon[status]} ${status.padEnd(7)} public${path}${note ? `  (${note})` : ''}`)
}
