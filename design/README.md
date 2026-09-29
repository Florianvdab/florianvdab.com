# Design sources

Sources for the generated images in `public/`. Edit these, then re-render.

| Source                                                 | Output                                              |
| ------------------------------------------------------ | --------------------------------------------------- |
| `og-image.html`                                        | `public/og-image.png` (1200×630 social preview)     |
| `apple-touch-icon.svg`                                 | `public/apple-touch-icon.png` (180×180, full-bleed) |
| `favicon.svg` (keep in sync with `public/favicon.svg`) | `public/favicon.ico` (32×32 PNG in an ICO wrapper)  |

Render with headless Chromium in Docker, from the repo root (after `npm ci`, so the fonts exist):

```sh
docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp -v "$PWD:/repo" -w /repo \
  --entrypoint sh zenika/alpine-chrome:with-node -c \
  'npm i -s --prefix /tmp/r puppeteer-core >/dev/null && cp design/render.mjs /tmp/r/ && node /tmp/r/render.mjs'
```
