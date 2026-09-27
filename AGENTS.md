# HeaderTweaker monorepo

pnpm workspaces + Turborepo. Three packages:

- **`apps/extension`** — the browser extension (see its own `AGENTS.md` for conventions)
- **`apps/website`** — the marketing website (see its own `AGENTS.md` for conventions)
- **`packages/tokens`** — shared SCSS design tokens (`variables.scss`), consumed by both apps via
  `@use 'pkg:headertweaker-tokens' as vars;`

## Root scripts

Root `package.json` scripts fan out to whichever workspace package defines that script name, via
`turbo run <task>` (see `turbo.json`) — e.g. `pnpm build:all` only ever runs in `apps/extension`,
`pnpm check-types` runs in both. `lint`/`format`/`format:fix`/`check` are plain root-level
Biome/Stylelint passes, not Turbo tasks.

## Conventions that apply everywhere

- Never hardcode colors or spacing — add a token to `packages/tokens/src/variables.scss` if one
  doesn't already exist.
- Every PR needs a changeset (`pnpm change`) if it touches `apps/extension` — `packages/tokens`
  and `apps/website` are marked `private` and are never versioned by changesets.
- Linting/formatting: **Biome** for JS/TS/JSON, **Stylelint** for SCSS — both run in CI.
