# HeaderTweaker website

Static marketing site for the HeaderTweaker browser extension, built with Astro. No client-side
framework — static HTML/CSS, with small inline `<script>` tags only where genuinely needed (e.g.
the mobile nav toggle).

## Build & Dev

```bash
pnpm --filter headertweaker-website dev     # Dev server
pnpm --filter headertweaker-website build   # Build → apps/website/dist/
pnpm --filter headertweaker-website preview # Preview the production build
```

## Conventions

- Design tokens come from `packages/tokens/src/variables.scss` via `@use 'pkg:headertweaker-tokens'
  as vars;` — injected globally by `astro.config.mjs`, so component `<style lang="scss">` blocks
  can reference `vars.$colors-*` / `vars.$spacing-core-*` directly without an explicit `@use`.
  Never hardcode colors or spacing — add a token to the shared package instead.
- `src/data/extension-meta.ts` exposes the extension's version/description as `vite.define`
  constants (read from `apps/extension/package.json` in `astro.config.mjs`, since a config file's
  `import.meta.url` stays reliable while app modules get bundled/relocated) — never hardcode the
  extension's version or description elsewhere.
- `src/data/features.ts` and `src/data/permissions.ts` are the single source of truth for the
  feature tour and the permissions table; `llms.txt` and the JSON-LD in `seo.astro` are generated
  from the same data so they can't drift.
- Screenshots live in `src/assets/screenshots/`, imported via Astro's `<Image>` component for
  automatic optimization — never reference them as raw `<img src>` paths.
- Keep `output: 'static'` in `astro.config.mjs` — no server rendering, no framework islands.
