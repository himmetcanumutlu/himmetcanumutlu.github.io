// Turns the client build into a fully rendered static page:
//   dist/index.html  — prerendered home page (hydrated on the client)
//   dist/404.html    — same page, noindex, for unknown paths on GitHub Pages
//   dist/sitemap.xml — single-URL sitemap with today's lastmod

import { readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SITE_URL } from '../src/data/site'

type Handler = (request: Request, context?: { indexHtml?: string }) => Promise<Response>

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const ssrEntry = resolve(root, '.ssr/server.js')

// Content every prerendered page must contain; guards against silent render failures.
const REQUIRED_MARKERS = [
  'id="hero-title"',
  'id="domains"',
  'id="work"',
  'id="lab"',
  'id="journey"',
  'id="ventures"',
  'id="systems"',
  'id="education"',
  'id="media"',
  'id="contact"',
  'class="drawer"',
]

async function main(): Promise<void> {
  const indexHtml = await readFile(resolve(dist, 'index.html'), 'utf8')
  const { default: handler } = (await import(pathToFileURL(ssrEntry).href)) as { default: Handler }

  const response = await handler(new Request(SITE_URL), { indexHtml })
  if (!response.ok) throw new Error(`prerender returned HTTP ${response.status}`)
  const html = await response.text()

  const missing = REQUIRED_MARKERS.filter(marker => !html.includes(marker))
  if (missing.length > 0) throw new Error(`prerendered HTML is missing: ${missing.join(', ')}`)

  await writeFile(resolve(dist, 'index.html'), html, 'utf8')

  const notFound = html.replace(
    '<meta name="robots" content="index, follow" />',
    '<meta name="robots" content="noindex, follow" />',
  )
  await writeFile(resolve(dist, '404.html'), notFound, 'utf8')

  const today = new Date().toISOString().slice(0, 10)
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${SITE_URL}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '</urlset>',
    '',
  ].join('\n')
  await writeFile(resolve(dist, 'sitemap.xml'), sitemap, 'utf8')

  await rm(resolve(root, '.ssr'), { recursive: true, force: true })

  const kb = (Buffer.byteLength(html) / 1024).toFixed(1)
  console.log(`[prerender] wrote dist/index.html (${kb} kB), dist/404.html, dist/sitemap.xml`)
}

main().catch(error => {
  console.error(`[prerender] failed: ${(error as Error).message}`)
  process.exit(1)
})
