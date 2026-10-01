# Soliance ENR — workspace

Website of Soliance ENR (soliance.fr), a solar / heat pump / EV charger installer in Saint-Laurent-du-Var. Driven by the jp-way cycle (`jp-way.config.json`, product artifacts under `docs/`). Client reference material (brief, specification, mockups, photo bank) lives outside the repo in `/Users/ethanlaloum/Desktop/Freelance/Ruben Darmon/Soliance/`.

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

## Traps

- Never move this repository back under `~/Desktop` or `~/Documents`: both are synced by iCloud Drive with « Optimize Mac Storage », which evicts files (node_modules included) and makes `tsc`, `vitest`, `eslint` and the Vite servers block forever on a file read. iCloud also produced conflict copies such as `ProjectsPage 2.tsx`.

- `packageManager` pins pnpm 11. On this machine the global Corepack is too old to verify pnpm 11 signatures (`Cannot find matching keyid`) and `~/package.json` pins pnpm 9; run `npm install -g corepack@latest` once, then `corepack enable`.
- The pre-commit hook runs `pnpm exec lint-staged` (eslint `--fix` on staged `apps/site` TypeScript). It fails if `pnpm` itself fails, see the Corepack trap above.
- First vitest / esbuild start is slow on this machine (up to ~20 s before any output); it is not a hang.
- `vite preview` started from the CLI as a background process with a closed stdin (an agent's background task) accepts connections and never answers. From an agent, start it through the API instead: `node --input-type=module -e "import { preview } from 'vite'; (await preview({ preview: { port: 4173, host: 'localhost', strictPort: true } })).printUrls();"` from `apps/site`.
- Node `>=22.13.0`; `.nvmrc` pins 22.23.2 for local shells.
