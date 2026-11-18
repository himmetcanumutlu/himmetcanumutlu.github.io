# himmetcanumutlu.github.io

Source for my personal site: **[himmetcanumutlu.github.io](https://himmetcanumutlu.github.io/)**.

AI & cloud builder, community founder, Information Systems & Technologies student at Sivas Cumhuriyet University.

## Stack

- [Gea](https://github.com/dashersw/gea) — compiler-first UI framework with proxy-based stores and no virtual DOM
- Vite + TypeScript
- Plain CSS with custom properties
- GitHub Actions → GitHub Pages

No UI kits and no runtime dependencies beyond `@geajs/core`.

## Getting started

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on <http://localhost:5173> |
| `npm run build` | Validate content, build the client, then prerender `dist/index.html`, `404.html` and `sitemap.xml` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check the project |
| `npm run validate` | Check the content layer for broken references and missing assets |
| `npm run fetch:github` | Refresh repository stars/forks in `src/data/generated/github.json` |
| `npm run fetch-assets` | One-time fetch of the headshot, touch icon, issuer logos and OG card into `public/assets/`; crops event photos from `assets-src/events/` (`-- --force` regenerates) |
| `npm run check` | Type check + content validation |

## Project structure

```
src/
  data/         Typed content: profile, domains, projects, journey, ventures,
                systems lab, education, certifications, media, palette commands
  stores/       Gea stores: domain filter, URL sync, theme, command palette, UI
  lib/          Small browser helpers (scroll, clipboard, fuzzy search, observers)
  components/   UI components, one per file
  styles/       Design tokens, themes, layout and component CSS (cascade layers)
  App.tsx       Root component
  main.ts       Client entry (hydrates the prerendered page)
  server.ts     Build-time prerender entry
scripts/        Content validation, GitHub stats refresh, prerendering
public/         Static files copied as-is (favicon, images, CV)
```

## Editing content

All copy lives in `src/data/`. Each file is typed by `src/data/types.ts`, and
`npm run validate` catches duplicate IDs, unknown domains, broken references
and missing assets before a build.

- **Projects** — `projects.ts`. Set `featured: true` for the four case studies; `include: false` hides an entry.
- **Communities** — `organizations.ts`. Swimlanes show role `stages` and status only, no dates.
- **Certifications** — `certifications.ts`. `featuredRank` 1–6 picks the featured badges; `programId` folds course-level certificates under one card.

## Assets

`npm run fetch-assets` fills in everything except the CV and event photos. For an event cover, drop any photo at `assets-src/events/<event-id>.jpg` and rerun it; it is cropped to 1200 × 800. The validator lists anything still missing:

| Path | Purpose |
| --- | --- |
| `img/headshot.jpg` | Portrait (square, ≥ 640 px) |
| `img/apple-touch-icon.png` | 180 × 180 home-screen icon |
| `docs/cv.pdf` | Downloadable CV |
| `og/og-image.png` | 1200 × 630 social preview |
| `logos/*.svg` | Issuer logos (huawei, google, ibm, nvidia, pg) |
| `events/<event-id>/cover.jpg` | One cover photo per event in `src/data/events.ts` |

## Rendering

The page is prerendered at build time with `@geajs/ssr`, so the full content is in
the HTML for search engines, link previews and visitors without JavaScript. On
load, `hydrate()` adopts that markup and the stores apply URL state and the saved
theme.

## URL state

- `?domain=ai|cloud|community|systems|ventures|academic` — pre-filters the project lab
- `?project=<slug>` — opens a case study directly

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which refreshes GitHub
stats, type-checks, builds and publishes `dist/` to GitHub Pages.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
