# florianvdab.com

Source of [florianvdab.com](https://florianvdab.com), the portfolio of Florian Van den Abeele,
full-stack developer in West Flanders, Belgium.

A static [Astro](https://astro.build) site with zero client-side JavaScript, served by nginx in a
Docker container from a home server through a Cloudflare Tunnel.

> Work in progress. See [`docs/PLAN.md`](docs/PLAN.md) for the roadmap.

## Local development

Requires Node 24 (see `.nvmrc`; `fnm use` or `nvm use` picks it up).

```sh
git clone git@github.com:Florianvdab/florianvdab.com.git
cd florianvdab.com
npm ci
npm run dev        # http://localhost:4321
```

| Command           | What it does                        |
| ----------------- | ----------------------------------- |
| `npm run build`   | Build the static site into `dist/`  |
| `npm run preview` | Serve the built site locally        |
| `npm run check`   | Type-check `.astro` and `.ts` files |
| `npm run format`  | Format everything with Prettier     |

## License

[MIT](LICENSE)
