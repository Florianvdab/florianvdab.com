# florianvdab.com

Personal portfolio site for Florian Vandenabeele. Static Astro site, served by nginx in Docker
on the home server `athena`, public via the host's Cloudflare Tunnel.
The full roadmap and phase status live in [`docs/PLAN.md`](docs/PLAN.md). Read it before starting work.

## Stack

- Astro 7 (static output), TypeScript strict, content collections with Zod schemas.
- Plain CSS: tokens + reset in `src/styles/global.css`, scoped `<style>` in components. No Tailwind.
- Fonts self-hosted via Fontsource (Inter Variable body, Fraunces Variable headings). No external requests.
- Node 24 (`.nvmrc`), managed with fnm on athena.

## Commands

```
npm ci                 install
npm run dev            dev server on :4321 (for agents: `npx astro dev --background`, then `astro dev stop|status|logs`)
npm run build          static build to dist/
npm run check          astro check (types + templates)
npm test               vitest run (src/**/*.test.ts)
npm run format         prettier --write (format:check in CI)
```

## Conventions

- **Content lives in `src/content/`** (experience JSON, project Markdown), schemas in `src/content.config.ts`;
  site constants and skill groups in `src/data/site.ts`. Don't hard-code resume content in components.
- Never invent copy (project descriptions, highlights, bios). Use what Florian supplied or ask.
- **Never publish how the home server is secured** (firewall, tunnel setup, SSH, backups, fail2ban,
  which services are public, the password manager). What it runs is fine; how it's protected is not.
- **No client JS unless justified.** `dist/` should contain no `.js`. No inline `<script>`/`<style>`/`style=""`:
  the CSP is `script-src 'self'; style-src 'self'` (hence `build.inlineStylesheets: 'never'`).
- Durations are computed at build time from `start`/`end`, never hard-coded.
- Components in `src/components/`; `Section.astro` wraps each page section (heading + `aria-labelledby`).
  Shared classes (`.container`, `.wide`, `.button`, `.chips`) live in `global.css`.
- Semantic HTML, visible focus (copper outline), respect `prefers-reduced-motion`. Mobile-first, must work at 360px.

## Palette and contrast (WCAG AA)

| Token        | Hex       | Use                                |
| ------------ | --------- | ---------------------------------- |
| `--cream`    | `#F7F1DE` | background                         |
| `--sage`     | `#B0BA99` | surfaces, chips, borders, timeline |
| `--copper`   | `#9D6638` | accent                             |
| `--espresso` | `#4E220F` | text, headings, links              |

Copper on cream (and cream on copper) is ~4.2:1: **only** for text ≥ 24px (or ≥ 19px bold),
bold ≥ 18px button labels, borders, icons, decoration. All normal text is espresso.

## Deployment (athena)

- Source checkout: `~/dev/florianvdab.com`. Running service: `~/stacks/website/compose.yaml`, which
  **builds from GitHub `main`** (no registry). Only pushed commits go live.
- Container listens on 8080; published as `127.0.0.1:8090`. Tunnel hostname `florianvdab.com` → `http://localhost:8090`.
- Deploy: `stacks update website` (a nightly cron does this too). Local image test: `compose.dev.yaml` on `127.0.0.1:8091`.
- Root isn't available to agents (sudo needs a password): write a script for Florian to run instead.
