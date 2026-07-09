# HeaderTweaker

A browser extension (Firefox + Chrome) that lets users modify outgoing HTTP headers. Built with React, TypeScript, Vite, and SCSS modules.

## Build & Dev

```bash
pnpm install               # Install dependencies

pnpm build:firefox         # Build for Firefox  → dist/firefox/
pnpm build:chrome          # Build for Chrome   → dist/chrome/
pnpm build:all             # Build both targets

pnpm dev:firefox           # Build + run in Firefox with file watching
pnpm dev:chrome            # Build + run in Chromium with file watching

pnpm check-types           # TypeScript type check (no emit)
pnpm lint                  # Biome lint
pnpm format                # Biome format + Stylelint (SCSS)
pnpm format-n-lint         # Both lint and format checks
pnpm format-n-lint:fix     # Auto-fix lint and format issues
```

## Architecture

- **`src/background.ts`** — Extension background script (service worker)
- **`src/headertweaker.tsx`** — Main UI entry point
- **`src/components/`** — Feature components, each co-located with its `.module.scss`
- **`src/helpers/`** — Pure utility functions
- **`src/contexts/`** — React context providers
- **`src/interfaces/`** — Shared TypeScript types (`Header`, `Status`)
- **`public/manifest.json`** — Firefox manifest (base); `manifests/chrome.json` for Chrome overrides
- The Vite `sync-manifest` plugin writes the current `package.json` version into the built manifests at bundle time

## Conventions

- Use **path aliases** for cross-directory imports (never relative `../../`):
  `@components/*`, `@helpers/*`, `@contexts/*`, `@interfaces/*`, `@constants/*`, `@styles/*`
- CSS: **SCSS modules** (`.module.scss`) co-located with each component
- Linting/formatting: **Biome** for JS/TS/JSON, **Stylelint** for SCSS — both run in CI
- No test suite currently; CI validates types, lint, format, and build

## Versioning & Release

- Every PR **must include a changeset** — CI will fail without one:

  ```bash
  pnpm change   # interactive prompt to create a changeset
  ```

- Merging to `master` automatically bumps the version, creates a git tag, and publishes a GitHub release with Firefox and Chrome `.zip` artifacts
