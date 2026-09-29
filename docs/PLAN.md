# florianvdab.com: Development Plan (revised for athena)

Working plan for Claude Code sessions. It revises the original hand-off plan
with what is actually true on the build/host machine (`athena`). Work phase by
phase; every phase ends with acceptance criteria that must pass before moving on.

Last revised: 2026-09-29.

---

## 0. What changed vs. the original plan (and why)

| Original plan                                                              | Revised                                                                                                                                                                                     | Reason                                                                                                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docker-compose.yml` bundles a `cloudflared` container with `TUNNEL_TOKEN` | **No cloudflared container.** Reuse the host's existing `cloudflared.service`; add `florianvdab.com` as another public hostname in the Cloudflare dashboard → `http://localhost:8090`       | athena already runs a token-based tunnel for vault/jellyfin/cal. A second tunnel = second token to guard, for nothing.                                |
| Container port published nowhere, reached over a compose network           | Publish **`127.0.0.1:8090:8080`**                                                                                                                                                           | Same pattern as vaultwarden/radicale: loopback only, cloudflared reaches it, no ufw change, not exposed on the LAN. 8080 is taken (twitch).           |
| Deploy compose lives in the repo root                                      | Repo keeps a **generic example** (`deploy/compose.example.yaml`); the live one is **`~/stacks/website/compose.yaml`**                                                                       | Matches athena's convention (one project per app under `~/stacks`, managed with the `stacks` helper). Dev checkout and running service stay separate. |
| Updating: `docker compose pull && up -d`, optionally Watchtower            | **`stacks update website`** (rebuilds from `main`), plus a nightly crontab entry that does it                                                                                               | The helper already runs `up -d --build` + prune. The nightly rebuild also keeps "Present" durations current, replacing the monthly CI cron.           |
| CI builds a multi-arch image and pushes it to **Docker Hub**               | **No registry.** athena builds the image itself from the public GitHub repo (`build: https://github.com/Florianvdab/florianvdab.com.git#main`). CI only runs checks + a test `docker build` | Florian's call (2026-09-29). Fewer accounts/secrets; deploy = rebuild from `main`.                                                                    |
| `.env.example` with `TUNNEL_TOKEN`                                         | Dropped                                                                                                                                                                                     | No tunnel token in this project.                                                                                                                      |
| Node "LTS", unspecified                                                    | **Node 24 (Krypton)** via **fnm** in user space, pinned in `.nvmrc` + `engines`                                                                                                             | No system Node on athena and sudo needs a password; fnm lives in `~/.local`, picks up `.nvmrc` on `cd`.                                               |
| Astro "latest"                                                             | **Astro 7**, TypeScript 6                                                                                                                                                                   | What `create astro` gave on 2026-09-29.                                                                                                               |
| Lighthouse/axe run "somewhere"                                             | Run from the laptop's Chrome against the forwarded dev/preview port (or against the live site)                                                                                              | athena has no Chromium.                                                                                                                               |
| Polly tech stack: "Florian to confirm"                                     | **Node.js, Express, vanilla HTML/CSS/JS, JSON-file storage, Docker**                                                                                                                        | Read from `~/stacks/polly`.                                                                                                                           |

Things the original plan got right and stay as-is: Astro static output, zero client JS, content
collections with Zod, plain CSS + tokens, self-hosted fonts, nginx-unprivileged runtime,
security headers, GitHub Actions for checks, the palette and contrast rules.

---

## 1. Goal

A fast, single-page portfolio site for **Florian Van den Abeele (Florianvdab)**, full-stack
developer in West Flanders, Belgium. It must:

- Present the resume (experience timeline, skills).
- Showcase a few favourite projects with links.
- Advertise availability for **freelance static website projects**.
- Show a bit of personality (reading, gaming, home-server tinkering).
- Run as a Docker container on **athena** (built there from the repo), served at
  **florianvdab.com** through athena's existing **Cloudflare Tunnel**.
- Live in a **public, well-documented GitHub repo**: `github.com/Florianvdab/florianvdab.com`.

Non-goals: CMS, backend, database, heavy analytics, contact-form server.

---

## 2. Folder setup on athena

```
~/dev/                       all source checkouts (git clone target)
└── florianvdab.com/         this repo (git, branch main)
~/stacks/website/            the running service: compose.yaml only, builds from GitHub main
~/.local/bin/fnm             Node version manager; Node installs in ~/.local/share/fnm
```

- `~/dev` is for code, `~/stacks` for what runs. Never run the production container from `~/dev`.
- New machines: `git clone git@github.com:Florianvdab/<repo>.git ~/dev/florianvdab.com && cd $_ && fnm use && npm ci`.
- Remote: `git@github.com:Florianvdab/florianvdab.com.git` (public). SSH key and `gh` are both authorised.
- Deploy builds from GitHub `main`, not from `~/dev`: only pushed commits go live.
- Editing happens from the laptop via VS Code Remote-SSH (port 2222). Dev server
  (`npm run dev`, port 4321) is reached through VS Code's port forwarding, so **no ufw rule
  needed**. Don't bind the dev server to the LAN.

---

## 3. Tech stack

- **Astro 7** (static output), TypeScript strict, **content collections** (`src/content.config.ts`,
  `glob()` loader, Zod schemas) for `experience` and `projects`.
- Plain CSS with custom properties. One global stylesheet + scoped component styles. No Tailwind.
- Fonts self-hosted via Fontsource: `@fontsource-variable/inter` (body), `@fontsource-variable/fraunces` (headings).
- Icons: hand-copied Lucide/Simple Icons SVGs as Astro components (no icon dependency).
- Tooling: Prettier + `prettier-plugin-astro`, `astro check`, Vitest (via Astro's `getViteConfig`).
- Runtime image: `nginxinc/nginx-unprivileged:alpine` (non-root, port 8080).
- CI: GitHub Actions (checks + test build). No registry.

Why Astro (unchanged): zero JS by default, content in typed data files, builds to a plain
`dist/` for nginx, and doubles as a showcase for the freelance static-site offer.

---

## 4. Design system

### Palette

| Token        | Hex       | Role                                                 |
| ------------ | --------- | ---------------------------------------------------- |
| `--cream`    | `#F7F1DE` | Page background                                      |
| `--sage`     | `#B0BA99` | Surfaces, chips, dividers, timeline line             |
| `--copper`   | `#9D6638` | Accent: buttons, large heading accents, hover, icons |
| `--espresso` | `#4E220F` | Body text, headings, links                           |

**Contrast rules (WCAG AA):**

- Espresso on cream ≈ 13:1: all body text and inline links.
- Espresso on sage ≈ 6.6:1: fine for text on chips/cards.
- **Copper on cream ≈ 4.2:1, below AA for normal text.** Copper only for large text
  (≥ 24px, or ≥ 19px bold), bold ≥ 18px button labels, borders, icons, decoration.
- Cream on copper ≈ 4.2:1: same rule (bold, ≥ 18px).
- Verify each pairing with a contrast checker when implementing; don't trust these numbers blindly.

### Look & feel

Warm, calm "well-made notebook": generous whitespace, content max ~72ch, 8–12px radii,
1px sage borders instead of heavy shadows, thin copper underline under section headings.
Mobile-first; must look good at 360px.

### Dark mode (phase 6, optional)

Espresso background, cream text, sage muted text, copper accents. `prefers-color-scheme`
plus a toggle (the only JS on the site). Re-check contrast; copper on espresso is low.

---

## 5. Site structure (single page, anchor nav)

1. **Header/nav**: wordmark, links About · Experience · Projects · Freelance · Contact. Sticky;
   mobile menu via `<details>` (no JS).
2. **Hero**: "Hi, I'm Florian." + _Full-stack developer (Java/Spring, Vue/Nuxt, Flutter) building
   reliable software for government, payments and ERP._ CTAs: "See my work" → projects,
   "Hire me for a website" → freelance. GitHub + LinkedIn links.
3. **About**: short paragraph + hobbies (reading, gaming, home server). Tie-in: "this site is
   served from that home server via a Cloudflare Tunnel". Keep it generic: no hostnames,
   IPs or service lists on a public page.
4. **Experience**: vertical timeline from the `experience` collection.
5. **Skills**: grouped chips. Backend (Java, Spring Boot, Spring Security, JPA/Hibernate, REST,
   microservices), Frontend (Vue, Nuxt, React, TypeScript), Mobile (Flutter, Android),
   Data & Ops (PostgreSQL, Flyway, Docker, GitHub Actions, Linux/home server), Other (.NET/C#, OCPI).
6. **Projects**: cards from the `projects` collection; title, pitch, 3–5 highlights, tech chips,
   links or a "Private repo, demo on request" badge.
7. **Freelance**: "Need a website?" Fast, affordable static sites built in his free time
   (small businesses, portfolios, event/landing pages). Three points: fast & SEO-friendly,
   cheap to host, you own everything. CTA → mailto.
8. **Contact/footer**: email, GitHub, LinkedIn, © year, "Built with Astro · served from a home server".

Extra: `404.astro` (on-brand), optional `public/cv.pdf`.

---

## 6. Content (source of truth in `src/content/`)

### `src/content/experience/*.json`, one file per job, sorted by `start` desc

Files: `the-beehive.json`, `ccv-lab.json`, `robaws.json`, `bel-and-bo.json`, with the exact
fields and text from the original plan:

- **The Beehive**: Full Stack Developer, client BOSA (Belgian federal government),
  2025-06 → present, Belgium, full-time. Java/Spring + Nuxt/Vue on government apps;
  monolith → microservices. Skills: Java, Spring, Nuxt, Vue, Microservices.
- **CCV Lab**: Software Engineer, 2023-09 → 2025-05, Kortrijk · Hybrid. OCPI EV-charging
  backend; cloud payment API orchestrating terminals; SalesPoint Spring REST API + Android
  terminals. Skills: Java, Spring, Android, OCPI, REST.
- **Robaws**: Medior Full Stack Developer, 2021-08 → 2023-08, Zwevegem · Hybrid. Core ERP
  back- and front-end; led two mobile apps; third-party integrations. Skills: Java, Flutter,
  JavaScript, REST.
- **Bel&Bo**: Intern .NET C# Developer, 2021-02 → 2021-05, Deerlijk · On-site, internship.
  Skills: .NET, C#. (Highlights empty until Florian supplies one.)

Schema: `role`, `company`, `client?`, `start` (`YYYY-MM`), `end` (`YYYY-MM` | null),
`location`, `type` (enum: Full-time, Part-time, Freelance, Internship), `summary`,
`highlights[]`, `skills[]`.

Durations ("1 yr 4 mos") are **computed at build time** by `formatDuration(start, end)`,
counting both the start and end month (LinkedIn convention). "Present" only moves on rebuild,
hence the nightly rebuild on athena (phase 5).

### `src/content/projects/*.md` (frontmatter + short body)

Schema: `title`, `pitch`, `highlights[]`, `tech[]`, `repo?` (url), `demo?` (url),
`private: boolean`, `featured: boolean`, `order: number`, `image?` (via `image()` helper).
Refinement: `private: true` must not have a `repo`.

- **PET, Personal Expense Tracker** (featured, public, order 1)
  Repo https://github.com/Florianvdab/Personal-Expense-Tracker. Lightweight, self-hosted
  personal finance manager for a home server. Highlights: monthly closing carries balance
  forward; scheduled/recurring transactions; multi-account (checking, savings, credit card,
  cash); dashboard with spending & income charts; one `docker compose up`.
  Tech: Java 25, Spring Boot 4, Spring Security (JWT), PostgreSQL 16, Flyway, React 19, Vite,
  TypeScript, Tailwind, Recharts, Docker.
- **Polly, "Wat gaan we eten?"** (featured, **private**, order 2)
  A tiny self-hosted poll for group and team food orders. Highlights: menu in a JSON file;
  name/group + quantities per item; live tally; one-click reset; Dutch UI, English code.
  Tech: **Node.js, Express, vanilla HTML/CSS/JS, JSON-file storage, Docker**.
  Card shows "Private repo, demo on request" + mailto.
- **This website** (not featured, order 3): links to its own repo. Astro static build, Docker
  image, built and served from a home server via Cloudflare Tunnel.

---

## 7. Repository layout

```
.
├── .github/workflows/
│   └── ci.yml                 # PRs + pushes: check, test, build, docker build (no push)
├── deploy/
│   └── compose.example.yaml   # what ~/stacks/website/compose.yaml looks like
├── docker/
│   └── nginx.conf
├── docs/
│   └── PLAN.md                # this file
├── public/                    # favicons, og-image.png, robots.txt, (cv.pdf)
├── src/
│   ├── components/
│   ├── content/{experience,projects}/
│   ├── content.config.ts
│   ├── data/site.ts           # name, tagline, email, socials, skill groups
│   ├── layouts/Base.astro
│   ├── lib/duration.ts (+ duration.test.ts)
│   ├── pages/{index,404}.astro
│   └── styles/global.css
├── .dockerignore
├── .nvmrc                     # 24
├── .prettierrc / .prettierignore
├── Dockerfile
├── compose.dev.yaml           # local build, 127.0.0.1:8091 → test the real image
├── CLAUDE.md                  # conventions (AGENTS.md symlinks to it)
├── README.md
└── LICENSE                    # MIT
```

---

## 8. Phases

### Phase 1: Scaffold _(done 2026-09-29)_

- [x] fnm + Node 24 LTS in user space; `~/dev/florianvdab.com`; `git init -b main`.
- [x] `create astro` minimal template (TS strict); fonts, Prettier, `astro check` installed.
- [x] `.nvmrc` (24), `engines.node` `>=24`, npm scripts: `check`, `format`, `format:check` (`test` arrives with Vitest in phase 2).
- [x] `global.css`: tokens, modern reset, fluid type scale (`clamp()`), fonts imported once in the layout.
- [x] `Base.astro` layout + styled placeholder `index.astro`; replace the default favicons later (phase 4).
- [x] `CLAUDE.md`: stack, commands, content location, palette + contrast rules, "no client JS
      unless justified", athena specifics (fnm, ports, deploy path). `AGENTS.md` → symlink to it.
- [x] README stub, MIT LICENSE, first commit.

**Accept:** `npm run dev` shows a styled placeholder; `npm run build` and `npm run check` pass;
`git status` clean.

### Phase 2: Content model

- Collections + Zod schemas in `src/content.config.ts` (glob loader).
- All experience/project files from §6 and `src/data/site.ts`.
- `formatDuration(start, end, now?)` in `src/lib/duration.ts` with Vitest tests (same-month = "1 mo",
  exact years, years+months, null end uses `now`).

**Accept:** a deliberately broken content file fails `npm run build` with a clear error; tests pass.

### Phase 3: Sections & components

- Every section in §5 as components, rendered from content.
- Semantic HTML (`header`, `main`, `section aria-labelledby`, `article`, `footer`), skip link,
  visible copper focus rings.
- Timeline CSS-only (sage line, copper dots, "Present" badge). Cards: equal-height grid,
  1 col → 2 cols ≥ 768px. Mobile nav via `<details>`. `prefers-reduced-motion` respected.
- **CSP-ready output:** set `build.inlineStylesheets: 'never'` so no `<style>` lands inline and
  the CSP can stay `style-src 'self'`. Check `dist/` for inline `<script>`/`<style>`/`style=""`.

**Accept:** right at 360/768/1280px; no `.js` in `dist/`; Lighthouse mobile ≥ 95 in all four and
zero axe violations (run from the laptop's Chrome via the forwarded preview port).

### Phase 4: SEO & polish

- `<title>`, description, canonical `https://florianvdab.com/`, Open Graph + Twitter card,
  1200×630 `og-image.png` in the palette (generated once from an SVG, committed).
- JSON-LD `Person` (name, jobTitle, url, sameAs GitHub + LinkedIn). JSON-LD is a
  `<script type="application/ld+json">`: data, not executed, and CSP `script-src` doesn't apply to it.
- `@astrojs/sitemap` with `site: 'https://florianvdab.com'`, `robots.txt`, favicon set
  (SVG "F" monogram copper on cream + PNG/ICO fallbacks, apple-touch-icon).
- On-brand 404.

**Accept:** Lighthouse SEO 100; OG preview correct after deploy.

### Phase 5: Docker, CI/CD, deployment, docs

**Dockerfile** (multi-stage):

1. `node:24-alpine`: `npm ci` → `npm run build`.
2. `nginxinc/nginx-unprivileged:alpine`: copy `dist/` and `docker/nginx.conf`; `EXPOSE 8080`;
   `HEALTHCHECK CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1`; OCI labels
   (`source`, `description`, `licenses=MIT`, `revision` via build arg).

**nginx.conf:** `try_files $uri $uri/ $uri.html =404`; `error_page 404 /404.html`;
`/_astro/` → `public, max-age=31536000, immutable`; HTML → `no-cache`; gzip for text types;
`server_tokens off`; headers: CSP (`default-src 'self'; img-src 'self' data:; style-src 'self';
font-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`),
`X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`,
minimal `Permissions-Policy`, `X-Frame-Options DENY` (repeat headers in every `location` that
sets its own `add_header`, since nginx doesn't inherit them). Real IP: `set_real_ip_from 127.0.0.1`

- `real_ip_header CF-Connecting-IP` (cloudflared connects from localhost on athena).

**compose.dev.yaml** (repo): `build: .`, `ports: ["127.0.0.1:8091:8080"]`, `read_only: true`,
`tmpfs: [/tmp]`. For testing the real image on athena; stop it afterwards. (Host port 8080 is
taken by twitch on 0.0.0.0, 8090 by the live site.)

**Deployment on athena** (`~/stacks/website/compose.yaml`, copied from `deploy/compose.example.yaml`):

```yaml
# florianvdab.com: static site, public via the host's Cloudflare Tunnel (florianvdab.com → localhost:8090)
services:
  website:
    build: https://github.com/Florianvdab/florianvdab.com.git#main
    image: website:local
    container_name: website
    ports:
      - 127.0.0.1:8090:8080
    read_only: true
    tmpfs: [/tmp]
    security_opt: [no-new-privileges:true]
    cap_drop: [ALL]
    restart: unless-stopped
```

Then:

1. `stacks up website` (first build clones `main`); `curl -I 127.0.0.1:8090` shows the headers.
2. Cloudflare Zero Trust → Tunnels → athena's tunnel → Public hostnames: add `florianvdab.com`
   and `www.florianvdab.com` → `http://localhost:8090` (Florian does this; ingress is dashboard-managed).
   While there: delete the stale `dashboard.florianvdab.com` hostname (Glance is gone).
3. Redirect `www` → apex with a Cloudflare redirect rule (or leave both serving; canonical covers SEO).
4. Verify with `curl -s 127.0.0.1:20241/config` and from outside.
5. Add an HTTP monitor in Uptime Kuma for `http://127.0.0.1:8090` (and optionally the public URL).
6. Auto-deploy: florian's crontab, `0 4 * * * $HOME/.local/bin/stacks update website >> $HOME/stacks/website/update.log 2>&1`
   (after the 03:30 vaultwarden backup). Push to main → rebuilt and live by next morning (durations
   refreshed too), or run `stacks update website` by hand. A failed build leaves the old container running.
7. Update `~/CLAUDE.md` (apps table, tunnel hostnames).

**GitHub Actions:**

- `ci.yml` (PRs + pushes): `actions/setup-node` with `node-version-file: .nvmrc` and npm cache,
  `npm ci`, `npm run check`, `npm run format:check`, `npm test`, `npm run build`, `docker build` (no push).
- No publish workflow: athena builds from `main` itself.

**README.md:** screenshot + live link, badges (CI, Docker pulls, license); stack & why Astro;
local dev (fnm/nvm, `npm ci`, `npm run dev`); editing content with an "add a project" example;
`docker build -t florianvdab-site . && docker run -p 8080:8080 florianvdab-site` (or `docker compose -f compose.dev.yaml up --build`); deployment with an **existing** Cloudflare
Tunnel (add a public hostname → `http://localhost:<port>`) and a short alternative for people
without one (cloudflared container in the same compose); updating; structure; license.

**Accept:** `docker build` succeeds on athena; container runs as non-root, healthcheck `healthy`,
image < 30 MB; `curl -I` shows the security headers; CI green on `main`;
`stacks update website` rebuilds from GitHub; https://florianvdab.com serves the site.

### Phase 6: Nice-to-haves (ask first)

- Dark-mode toggle (external module, `localStorage` in try/catch, no inline script → CSP intact).
- Dutch/English (`/` EN, `/nl/` NL via Astro i18n): relevant for Flemish freelance clients.
- CV PDF download.
- Cloudflare Web Analytics (cookie-less; needs a CSP `script-src`/`connect-src` entry for
  `static.cloudflareinsights.com` / `cloudflareinsights.com`).
- Project screenshots via `astro:assets`.

---

## 9. Open inputs from Florian

- [x] GitHub: `Florianvdab/florianvdab.com` (public, created empty 2026-09-29); SSH + `gh` authorised.
- [x] Contact email: `Florian.vdab@outlook.com`.
- [x] LinkedIn: https://www.linkedin.com/in/florianvdab/
- [x] Registry: none (no Docker Hub); athena builds from the repo.
- [x] Polly's tech stack (read from `~/stacks/polly`).
- [ ] Display name spelling: plan says "Florian Van den Abeele", git config says "Florian Vandenabeele".
- [ ] Bel&Bo highlight, if any.
- [ ] Optional: profile photo, CV PDF, Dutch translations, Polly screenshot.

---

## 10. Definition of done

- https://florianvdab.com serves the site through athena's Cloudflare Tunnel.
- Lighthouse mobile ≥ 95 everywhere, zero axe violations.
- Edit a content file → push to `main` → live after `stacks update website` (or the nightly cron).
- A stranger can clone, run, and deploy from the README alone.
- `~/CLAUDE.md` on athena documents the new app, port 8090 and the tunnel hostname.
