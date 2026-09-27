# HeaderTweaker

Monorepo for the HeaderTweaker browser extension and its marketing website.

- **[`apps/headertweaker`](apps/headertweaker/README.md)** — the Firefox/Chrome browser extension
- **`apps/website`** — the marketing website ([headertweaker.com](https://headertweaker.com)), built with Astro
- **`packages/tokens`** — shared SCSS design tokens used by both

## Getting started

```bash
pnpm install
pnpm build:all        # Build the extension for Firefox and Chrome
pnpm dev:website       # Run the website locally
```

See [`AGENTS.md`](AGENTS.md) for repo-wide conventions, and each app's own `AGENTS.md` for
app-specific ones.
