# HeaderTweaker monorepo

pnpm workspaces + Turborepo. Four packages:

- **`apps/headertweaker`** — the browser extension (see its own `AGENTS.md` for conventions)
- **`apps/website`** — the marketing website (see its own `AGENTS.md` for conventions)
- **`packages/tokens`** — shared SCSS design tokens (`variables.scss`), consumed by both apps via
  `@use 'pkg:headertweaker-tokens' as vars;`
- **`packages/icons`** (`headertweaker-icons`) — shared Heroicons SVG assets, consumed by both apps
  via `headertweaker-icons/<size>/<style>/<name>.svg` (e.g. `headertweaker-icons/24/outline/check.svg`)

## Root scripts

Root `package.json` scripts fan out to whichever workspace package defines that script name, via
`turbo run <task>` (see `turbo.json`) — e.g. `pnpm build:all` only ever runs in `apps/headertweaker`,
`pnpm check-types` runs in both. `lint`/`format`/`format:fix`/`check` are plain root-level
Biome/Stylelint passes, not Turbo tasks.

## Conventions that apply everywhere

- Never hardcode colors or spacing — add a token to `packages/tokens/src/variables.scss` if one
  doesn't already exist.
- Every PR needs a changeset (`pnpm change`) if it touches `apps/headertweaker` — `packages/tokens`,
  `packages/icons`, and `apps/website` are marked `private` and are never versioned by changesets.
- Linting/formatting: **Biome** for JS/TS/JSON, **Stylelint** for SCSS — both run in CI.
- Never run `git commit` (or `git commit --amend`) yourself, and never create a branch yourself.
  `master` is protected and does not allow direct commits. Leave changes as uncommitted/staged
  working-tree edits on whatever branch is currently checked out, and let the user create the
  branch, commit, push, and open the PR themselves.
