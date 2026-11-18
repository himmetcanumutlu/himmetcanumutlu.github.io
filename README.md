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
| `npm run build` | Validate content, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check the project |
| `npm run validate` | Check the content layer for broken references and missing assets |
| `npm run fetch:github` | Refresh repository stars/forks in `src/data/generated/github.json` |
| `npm run check` | Type check + content validation |

## Project structure

```
src/
  data/         Typed content: profile, domains, projects, journey, ventures,
                systems lab, education, certifications, media, palette commands
  stores/       Gea stores: domain filter, URL sync, theme, command palette, UI
  lib/          Small browser helpers (scroll, clipboard, fuzzy search, observers)
  App.tsx       Root component
  main.ts       Client entry
scripts/        Content validation and GitHub stats refresh
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

Drop these files into `public/assets/` (the validator lists anything still missing):

| Path | Purpose |
| --- | --- |
| `img/headshot.jpg` | Portrait (square, ≥ 640 px) |
| `img/apple-touch-icon.png` | 180 × 180 home-screen icon |
| `docs/cv.pdf` | Downloadable CV |
| `og/og-image.png` | 1200 × 630 social preview |
| `logos/*.svg` | Issuer logos (huawei, google, ibm, nvidia, pg) |
| `events/<event-id>/cover.jpg` | One cover photo per event in `src/data/events.ts` |

## URL state

- `?domain=ai|cloud|community|systems|ventures|academic` — pre-filters the project lab
- `?project=<slug>` — opens a case study directly

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which refreshes GitHub
stats, type-checks, builds and publishes `dist/` to GitHub Pages.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
