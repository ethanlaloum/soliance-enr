# Soliance ENR — workspace

Website of Soliance ENR (soliance-enr.fr), a solar / heat pump / EV charger installer in Saint-Laurent-du-Var. Driven by the jp-way cycle (`jp-way.config.json`, product artifacts under `docs/`). Client reference material (brief, specification, mockups, photo bank) lives outside the repo in `/Users/ethanlaloum/Desktop/Freelance/Ruben Darmon/Soliance/`.

## Layout

| Path | Package | What it is |
|---|---|---|
| `apps/site` | `soliance-site` | Vite + React 19 + Redux Toolkit / redux-observable site, statically prerendered for SEO |
| `apps/e2e` | — | Playwright real e2e suite, not installed yet |

## Commands

Always through a filter, never a watcher:

```bash
pnpm install
pnpm --filter soliance-site build
pnpm --filter soliance-site exec tsc -b
pnpm --filter soliance-site exec vitest run [path]
pnpm --filter soliance-site exec eslint <path>
```

Never run `vitest` without `run`, `pnpm --filter soliance-site dev` or `preview` from an agent unless backgrounded on purpose.

## Deploy

The site is served by the client's OVH web hosting (PERSO, `soliand.cluster100.hosting.ovh.net`), the whole stack staying at OVH (domain, DNS zone, hosting, Let's Encrypt certificates). The multisite entry « Soliance site » serves `soliance-enr.fr` and `www.soliance-enr.fr` from the folder `site`, which OVH's Git integration keeps in sync with the branch `ovh-deploy` (read-only deploy key, GitHub push webhook). That branch holds only built files: `pnpm deploy:ovh` builds the current commit and pushes `apps/site/dist/` as a new commit on `ovh-deploy`. Production follows `main`; the `VITE_*` values come from `apps/site/.env` at build time (not committed, see `.env.example`).

- `apps/site/public/.htaccess` replaces the old Caddyfile: `https://soliance-enr.fr` is the canonical host (`www` and `http` get a 301), `/route` is served from `route/index.html` without a trailing-slash redirect, `404.html` answers unknown paths, `/assets/*` is cached for a year.
- HTTPS is detected through `HTTPS`, `X-Forwarded-Proto` or port 443; `SERVER_PORT` alone is not reliable behind a proxy.
- OVH's own domain redirection (`213.186.33.5`) never serves HTTPS: the apex must point to the hosting IP (A and AAAA), `www` is a CNAME to the apex.
- OVH's Git integration only clones into an empty folder, and the root folder of a multisite entry cannot be changed afterwards: to move a domain, detach it and add it to a new site with « Configuration manuelle » for DNS, or OVH rewrites the zone.
- Detaching or adding a domain drops its Let's Encrypt certificate; OVH issues a new one per domain only once the domain points to the hosting, and a pending certificate holds back the others. Rolling it out to every front server takes about 20 minutes.
- The lead forms post to `apps/site/public/api/lead.php`, which mails through Resend. Its key and sender sit in `soliance-mail.php` in the hosting home (`/` over SFTP, next to `site/`), outside the git-synced folder: `pnpm deploy:mail-config` builds that file from `RESEND_API_KEY` / `RESEND_FROM` in the root `.env` (see `.env.example`) and uploads it with `scp` to `soliand@ftp.cluster100.hosting.ovh.net` (asks the OVH FTP password), then checks that the endpoint answers 400 to an empty request rather than 503 `NOT_CONFIGURED`. Run it once and again whenever the key changes; `deploy:ovh` never carries the key.
- Resend only sends from a verified domain: the sending domain is the subdomain `contact.soliance-enr.fr` (keeps the reputation of the main domain apart), so `RESEND_FROM` must be an address `@contact.soliance-enr.fr`; its DKIM / SPF records live in the OVH DNS zone.
- The redesign (`94f9f4a`) was reverted on `main` because the client wants the design of the mockups; it lives on the branch `refonte-design`.

## Traps

- Never move this repository back under `~/Desktop` or `~/Documents`: both are synced by iCloud Drive with « Optimize Mac Storage », which evicts files (node_modules included) and makes `tsc`, `vitest`, `eslint` and the Vite servers block forever on a file read. iCloud also produced conflict copies such as `ProjectsPage 2.tsx`.

- `packageManager` pins pnpm 11. On this machine the global Corepack is too old to verify pnpm 11 signatures (`Cannot find matching keyid`) and `~/package.json` pins pnpm 9; run `npm install -g corepack@latest` once, then `corepack enable`.
- The pre-commit hook runs `pnpm exec lint-staged` (eslint `--fix` on staged `apps/site` TypeScript). It fails if `pnpm` itself fails, see the Corepack trap above.
- First vitest / esbuild start is slow on this machine (up to ~20 s before any output); it is not a hang.
- `vite preview` started from the CLI as a background process with a closed stdin (an agent's background task) accepts connections and never answers. From an agent, start it through the API instead: `node --input-type=module -e "import { preview } from 'vite'; (await preview({ preview: { port: 4173, host: 'localhost', strictPort: true } })).printUrls();"` from `apps/site`.
- Node `>=22.13.0`; `.nvmrc` pins 22.23.2 for local shells.
